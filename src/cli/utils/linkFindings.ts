/**
 * Pure helpers for `seofields links` (kept free of terminal dependencies so they can be unit-tested).
 */
import type {ReferenceStatus, UrlCheckResult} from '../../utils/linkCheck.js'
import type {ExtractedLink} from '../../utils/links.js'

export interface LinkDoc {
  _id: string
  _type: string
  title?: string
  [key: string]: unknown
}

export type FindingStatus = 'broken' | 'warning' | 'error'

export interface LinkFinding {
  documentId: string
  documentType: string
  title?: string
  status: FindingStatus
  kind: ExtractedLink['kind']
  target: string
  path: string
  label?: string
  httpStatus?: number
  message: string
}

/** Turn extracted links + check results into problem findings (OK links are omitted). */
export function collectFindings(
  doc: LinkDoc,
  links: ExtractedLink[],
  refs: Map<string, ReferenceStatus>,
  urls: Map<string, UrlCheckResult>,
): LinkFinding[] {
  const findings: LinkFinding[] = []
  const base = {documentId: doc._id, documentType: doc._type, title: doc.title}
  for (const link of links) {
    const common = {
      ...base,
      kind: link.kind,
      path: link.path,
      ...(link.label ? {label: link.label} : {}),
    }
    if (link.kind === 'invalid') {
      findings.push({
        ...common,
        status: 'broken',
        target: link.href ?? '',
        message: 'Malformed URL',
      })
      continue
    }
    if (link.kind === 'internal' && link.refId) {
      const status = refs.get(link.refId)
      if (status === 'missing') {
        findings.push({
          ...common,
          status: link.weak ? 'warning' : 'broken',
          target: link.refId,
          message: 'Referenced document does not exist',
        })
      } else if (status === 'unpublished') {
        findings.push({
          ...common,
          status: 'warning',
          target: link.refId,
          message: 'Referenced document is not published',
        })
      }
      continue
    }
    if (link.url) {
      const r = urls.get(link.url)
      if (!r || r.status === 'ok' || r.status === 'skipped') continue
      findings.push({
        ...common,
        status: r.status,
        target: link.url,
        ...(r.httpStatus ? {httpStatus: r.httpStatus} : {}),
        message: r.message ?? (r.httpStatus ? `HTTP ${r.httpStatus}` : 'Request failed'),
      })
    }
  }
  return findings
}

/** Build the GROQ query for documents to scan. Values are passed as params, never interpolated. */
export function buildLinksQuery(ids: string[], types: string[], limit: number): string {
  let filter = 'defined(seo)'
  if (ids.length) filter = '_id in $ids'
  else if (types.length) filter = '_type in $types'
  const slice = limit > 0 ? ` [0...${Math.floor(limit)}]` : ''
  return `*[${filter} && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(_updatedAt desc)${slice}`
}
