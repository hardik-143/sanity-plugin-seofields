/**
 * Generate an `llms.txt` file (https://llmstxt.org) from your content.
 *
 * `llms.txt` is a Markdown file that gives LLMs a concise, link-first map of a site: an H1 title, a
 * blockquote summary, optional prose, then `##` sections each holding a bullet list of
 * `- [title](url): description` links.
 *
 * Use `buildLlmsTxt()` with hand-written sections, or `docsToLlmsSection()` to map an array of Sanity
 * documents into one section.
 */
import {joinUrl} from './url'

export interface LlmsLink {
  title: string
  url: string
  description?: string
}

export interface LlmsSection {
  title: string
  links: LlmsLink[]
}

export interface BuildLlmsTxtOptions {
  /** H1 title, e.g. the site name. */
  title: string
  /** One-line blockquote summary rendered directly under the title. */
  summary?: string
  /** Free-form Markdown prose rendered after the summary. */
  details?: string
  /** Link sections rendered as `## {title}` + a bullet list. Empty sections are omitted. */
  sections?: LlmsSection[]
  /** Optional version, rendered in a leading `> Version: … | Updated: …` line. */
  version?: string
  /** Optional "updated" label, rendered alongside `version`. */
  updated?: string
  /** Prepended to any relative link URL. */
  baseUrl?: string
}

function resolveLinkUrl(url: string, baseUrl?: string): string {
  if (!baseUrl) return url
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(url) || url.startsWith('//')) return url // already absolute
  return joinUrl(baseUrl, url)
}

function renderSection(section: LlmsSection, baseUrl?: string): string | null {
  const links = section.links.filter((l) => l && l.title && l.url)
  if (links.length === 0) return null

  const lines = links.map((l) => {
    const url = resolveLinkUrl(l.url, baseUrl)
    const desc = l.description ? `: ${l.description}` : ''
    return `- [${l.title}](${url})${desc}`
  })
  return `## ${section.title}\n\n${lines.join('\n')}`
}

export function buildLlmsTxt(options: BuildLlmsTxtOptions): string {
  const {title, summary, details, sections = [], version, updated, baseUrl} = options

  const blocks: string[] = []

  if (version || updated) {
    const parts = [version ? `Version: ${version}` : '', updated ? `Updated: ${updated}` : '']
      .filter(Boolean)
      .join(' | ')
    blocks.push(`> ${parts}`)
  }

  blocks.push(`# ${title}`)
  if (summary) blocks.push(`> ${summary}`)
  if (details) blocks.push(details.trim())

  for (const section of sections) {
    const rendered = renderSection(section, baseUrl)
    if (rendered) blocks.push(rendered)
  }

  return `${blocks.join('\n\n')}\n`
}

// ─── Sanity documents → section ───────────────────────────────────────────────

export interface LlmsDoc {
  title?: string | null
  slug?: {current?: string | null} | string | null
  description?: string | null
  [key: string]: unknown
}

export interface DocsToLlmsSectionOptions {
  /** Section heading. */
  title: string
  /** Prepended to each document's path. */
  baseUrl?: string
  /** Build the path for a document. Defaults to `/${slug}`. */
  resolvePath?: (doc: LlmsDoc) => string | null | undefined
  /** Override the link title. Defaults to `doc.title`. */
  resolveTitle?: (doc: LlmsDoc) => string | null | undefined
  /** Override the link description. Defaults to `doc.description`. */
  resolveDescription?: (doc: LlmsDoc) => string | null | undefined
}

function slugToPath(slug: LlmsDoc['slug']): string | undefined {
  const value = typeof slug === 'string' ? slug : (slug?.current ?? undefined)
  return value ? `/${value.replace(/^\/+/, '')}` : undefined
}

export function docsToLlmsSection(
  docs: LlmsDoc[] | null | undefined,
  options: DocsToLlmsSectionOptions,
): LlmsSection {
  const {title, baseUrl, resolvePath, resolveTitle, resolveDescription} = options

  const links: LlmsLink[] = []
  for (const doc of docs ?? []) {
    if (!doc) continue
    const linkTitle = (resolveTitle ? resolveTitle(doc) : doc.title) ?? undefined
    const path = (resolvePath ? resolvePath(doc) : slugToPath(doc.slug)) ?? undefined
    if (!linkTitle || !path) continue

    const url = baseUrl ? joinUrl(baseUrl, path) : path
    const description =
      (resolveDescription ? resolveDescription(doc) : doc.description) ?? undefined
    links.push({title: linkTitle, url, ...(description ? {description} : {})})
  }

  return {title, links}
}
