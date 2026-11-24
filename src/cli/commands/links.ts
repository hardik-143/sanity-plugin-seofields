/**
 * `seofields links` — find broken links and dangling references across documents.
 *
 * - Internal references are checked against the dataset (missing / draft-only documents).
 * - External (and, with --base-url, relative) URLs are checked server-side from this machine:
 *   HEAD with GET fallback, manual redirects, per-request timeout and a concurrency limit.
 */
/* eslint-disable no-console */
import ora from 'ora'
import pc from 'picocolors'

import {assertPublicUrl} from '../../server/ssrf.js'
import {
  checkReferences,
  checkUrls,
  type ReferenceStatus,
  type UrlCheckResult,
} from '../../utils/linkCheck.js'
import {extractDocumentLinks} from '../../utils/links.js'
import {
  buildLinksQuery,
  collectFindings,
  type LinkDoc,
  type LinkFinding,
} from '../utils/linkFindings.js'
import {loadCliConfig} from '../utils/loadCliConfig.js'
import {log} from '../utils/logger.js'
import {createSanityClient} from '../utils/sanityClient.js'

export interface LinksOptions {
  projectId?: string
  dataset?: string
  token?: string
  types?: string
  id?: string
  baseUrl?: string
  external?: boolean
  references?: boolean
  timeout?: string
  concurrency?: string
  limit?: string
  allowPrivate?: boolean
  format?: string
  failOnBroken?: boolean
}

const toInt = (value: string | undefined, fallback: number): number => {
  const n = value === undefined ? NaN : Number.parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

const csv = (value?: string): string[] =>
  (value ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)

async function checkAllUrls(
  urls: string[],
  options: LinksOptions,
  onProgress: (sent: number) => void,
): Promise<Map<string, UrlCheckResult>> {
  let sent = 0
  const results = await checkUrls(urls, {
    timeoutMs: toInt(options.timeout, 8000),
    concurrency: toInt(options.concurrency, 5),
    validateUrl: options.allowPrivate ? undefined : (url) => assertPublicUrl(url),
    fetchImpl: async (input, init) => {
      try {
        return await fetch(input, init)
      } finally {
        onProgress(++sent)
      }
    },
  })
  return new Map(results.map((r) => [r.url, r]))
}

interface LinksSummary {
  documents: number
  links: number
  references: number
  urls: number
  externalChecked: boolean
  broken: number
  warnings: number
  skipped: number
  relativeUnresolved: number
  findings: LinkFinding[]
}

function printTextSummary(summary: LinksSummary, hasToken: boolean, checkRefs: boolean): void {
  printFindings(summary.findings)
  log.info('')
  const skipped = summary.skipped
    ? ` · ${pc.dim(`${summary.skipped} skipped (private/blocked)`)}`
    : ''
  log.info(
    `  ${pc.red(`${summary.broken} broken`)} · ${pc.yellow(`${summary.warnings} warning(s)`)}${skipped}`,
  )
  if (!summary.externalChecked) log.dim('  External URLs were not checked (--no-external).')
  if (summary.relativeUnresolved) {
    log.dim(
      `  ${summary.relativeUnresolved} relative link(s) not checked — pass --base-url to check them.`,
    )
  }
  if (!hasToken && checkRefs) {
    log.dim(
      '  Tip: without a token, drafts are invisible and draft-only references show as missing.',
    )
  }
  log.info('')
}

export async function linksCommand(options: LinksOptions): Promise<void> {
  const json = options.format === 'json'
  if (!json) log.heading('seofields links')

  const cliConfig = await loadCliConfig()
  const types = csv(options.types).length ? csv(options.types) : (cliConfig.types ?? [])
  const ids = csv(options.id)
  const checkExternal = options.external !== false
  const checkRefs = options.references !== false

  const spinner = ora({text: 'Connecting to Sanity...', isSilent: json}).start()
  const fail: (message: string) => never = (message) => {
    spinner.fail(message)
    if (json) console.error(message)
    process.exit(1)
  }

  let client
  let resolved
  try {
    ;({client, resolved} = await createSanityClient({
      projectId: options.projectId,
      dataset: options.dataset,
      token: options.token,
    }))
  } catch (err) {
    fail((err as Error).message)
  }

  spinner.text = 'Fetching documents...'
  let docs: LinkDoc[]
  try {
    const query = buildLinksQuery(ids, types, options.limit ? toInt(options.limit, 0) : 0)
    docs = await client.fetch<LinkDoc[]>(query, {ids, types})
  } catch (err) {
    fail(`Failed to fetch: ${(err as Error).message}`)
  }

  const perDoc = docs.map((doc) => ({
    doc,
    links: extractDocumentLinks(doc, {baseUrl: options.baseUrl, includeReferences: checkRefs}),
  }))
  const allLinks = perDoc.flatMap((d) => d.links)
  const refIds = Array.from(new Set(allLinks.flatMap((l) => (l.refId ? [l.refId] : []))))
  const urls = Array.from(new Set(allLinks.flatMap((l) => (l.url ? [l.url] : []))))

  let refs = new Map<string, ReferenceStatus>()
  if (checkRefs && refIds.length) {
    spinner.text = `Checking ${refIds.length} referenced document(s)...`
    try {
      refs = await checkReferences(refIds, (q, params) =>
        client.fetch<string[]>(q, params, {perspective: 'raw'}),
      )
    } catch (err) {
      fail(`Failed to check references: ${(err as Error).message}`)
    }
  }

  let urlResults = new Map<string, UrlCheckResult>()
  if (checkExternal && urls.length) {
    spinner.text = `Checking ${urls.length} URL(s)...`
    urlResults = await checkAllUrls(urls, options, (sent) => {
      spinner.text = `Checking ${urls.length} URL(s)... (${sent} requests sent)`
    })
  }

  const findings = perDoc.flatMap(({doc, links}) => collectFindings(doc, links, refs, urlResults))
  const summary: LinksSummary = {
    documents: docs.length,
    links: allLinks.length,
    references: refIds.length,
    urls: urls.length,
    externalChecked: checkExternal,
    broken: findings.filter((f) => f.status === 'broken' || f.status === 'error').length,
    warnings: findings.filter((f) => f.status === 'warning').length,
    skipped: Array.from(urlResults.values()).filter((r) => r.status === 'skipped').length,
    relativeUnresolved: allLinks.filter((l) => l.kind === 'relative' && !l.url).length,
    findings,
  }

  spinner.succeed(
    `Scanned ${docs.length} document(s): ${allLinks.length} link(s), ${refIds.length} referenced document(s), ${urls.length} URL(s)`,
  )

  if (json) console.log(JSON.stringify(summary, null, 2))
  else printTextSummary(summary, Boolean(resolved.token), checkRefs)

  if (options.failOnBroken && summary.broken > 0) process.exit(1)
}

function printFindings(findings: LinkFinding[]): void {
  if (findings.length === 0) {
    log.success('No broken links or dangling references found.')
    return
  }
  const byDoc = new Map<string, LinkFinding[]>()
  for (const f of findings) {
    const list = byDoc.get(f.documentId) ?? []
    list.push(f)
    byDoc.set(f.documentId, list)
  }
  for (const [id, list] of byDoc) {
    const {title, documentType} = list[0]
    log.heading(`${title || id}  ${pc.dim(`(${documentType} · ${id})`)}`)
    for (const f of list) {
      const icon = f.status === 'warning' ? pc.yellow('⚠') : pc.red('✖')
      const code = f.httpStatus ? `${f.httpStatus} ` : ''
      console.log(`  ${icon} ${code}${f.target}`)
      console.log(`    ${pc.dim(`${f.message} · ${f.path}${f.label ? ` · “${f.label}”` : ''}`)}`)
    }
  }
}
