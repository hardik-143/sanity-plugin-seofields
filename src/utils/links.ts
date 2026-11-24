/**
 * Link extraction for the broken-link checker.
 *
 * Walks a Sanity document and collects:
 * - Portable Text link annotations (`markDefs` entries with an `href`, or with a `reference`)
 * - References to other documents (`{_ref}` objects — image/file asset references are ignored)
 * - URL fields in `seoFields` (canonical URL, Open Graph URL / image URL, X image URL, hreflang URLs)
 * - Other string fields named `href` / `url` / `*Url` / `*Href` (e.g. button or CTA links)
 *
 * Pure and isomorphic — safe to use in the Studio, the CLI and server handlers.
 */

export type LinkKind =
  /** Absolute http(s) URL. */
  | 'external'
  /** Root- or path-relative URL (`/about`, `../pricing`). Checkable when a `baseUrl` is known. */
  | 'relative'
  /** Reference to another Sanity document. */
  | 'internal'
  /** In-page anchor (`#section`) — not checked. */
  | 'anchor'
  | 'mailto'
  | 'tel'
  /** Could not be parsed as a URL. */
  | 'invalid'
  /** Any other scheme (`javascript:`, `ftp:`, …) — reported but not checked. */
  | 'unsupported'

export type LinkSource = 'annotation' | 'reference' | 'seo' | 'field'

export interface ExtractedLink {
  kind: LinkKind
  source: LinkSource
  /** The URL as authored (everything except `internal`). */
  href?: string
  /** Absolute URL to request — set for `external`, and for `relative` when a `baseUrl` is given. */
  url?: string
  /** Published ID of the referenced document (`internal` only). */
  refId?: string
  /** `true` for weak references (`_weak: true`), which may legitimately dangle. */
  weak?: boolean
  /** Location in the document, e.g. `body[3].markDefs[0]` or `seo.canonicalUrl`. */
  path: string
  /** Annotated text for Portable Text links, or a field label for SEO URLs. */
  label?: string
}

export interface ExtractLinksOptions {
  /** Site base URL used to resolve relative links (e.g. `https://example.com`). */
  baseUrl?: string
  /** Include document references. Defaults to `true`. */
  includeReferences?: boolean
}

export interface ClassifiedHref {
  kind: LinkKind
  url?: string
}

const ASSET_REF = /^(image|file)-/

/** Strip `drafts.` / `versions.<release>.` prefixes to get the published document ID. */
export function getPublishedId(id: string): string {
  if (id.startsWith('drafts.')) return id.slice('drafts.'.length)
  const version = /^versions\.[^.]+\.(.+)$/.exec(id)
  return version ? version[1] : id
}

/** Classify a raw href and, where possible, resolve it to an absolute http(s) URL. */
export function classifyHref(rawHref: string, baseUrl?: string): ClassifiedHref {
  const href = rawHref.trim()
  if (!href) return {kind: 'invalid'}
  if (href.startsWith('#')) return {kind: 'anchor'}

  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(href)?.[1]?.toLowerCase()
  if (scheme === 'mailto') return {kind: 'mailto'}
  if (scheme === 'tel') return {kind: 'tel'}
  if (scheme === 'http' || scheme === 'https') {
    try {
      const url = new URL(href)
      if (!url.hostname) return {kind: 'invalid'}
      return {kind: 'external', url: url.href}
    } catch {
      return {kind: 'invalid'}
    }
  }
  if (scheme) return {kind: 'unsupported'}

  // Protocol-relative (`//cdn.example.com/x`) counts as external over https.
  if (href.startsWith('//')) {
    try {
      return {kind: 'external', url: new URL(`https:${href}`).href}
    } catch {
      return {kind: 'invalid'}
    }
  }

  if (!baseUrl) return {kind: 'relative'}
  try {
    const base = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
    return {kind: 'relative', url: new URL(href, base).href}
  } catch {
    return {kind: 'relative'}
  }
}

type Obj = Record<string, unknown>

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)

const SEO_URL_FIELDS: Array<{path: string[]; label: string}> = [
  {path: ['canonicalUrl'], label: 'Canonical URL'},
  {path: ['openGraph', 'url'], label: 'Open Graph URL'},
  {path: ['openGraph', 'imageUrl'], label: 'Open Graph image URL'},
  {path: ['twitter', 'imageUrl'], label: 'X image URL'},
]

const URL_KEY = /^(href|url|link)$|(Url|Href)$/

const SKIP_KEYS = new Set(['_id', '_rev', '_type', '_key', '_createdAt', '_updatedAt', 'asset'])

function joinPath(base: string, key: string | number): string {
  if (typeof key === 'number') return `${base}[${key}]`
  return base ? `${base}.${key}` : key
}

function isSeoObject(key: string, value: Obj, depth: number): boolean {
  return value._type === 'seoFields' || (depth === 1 && key === 'seo')
}

class LinkCollector {
  readonly links: ExtractedLink[] = []

  private readonly options: ExtractLinksOptions

  constructor(options: ExtractLinksOptions) {
    this.options = options
  }

  addHref(href: string, source: LinkSource, path: string, label?: string): void {
    const {kind, url} = classifyHref(href, this.options.baseUrl)
    this.links.push({
      kind,
      source,
      href: href.trim(),
      ...(url ? {url} : {}),
      path,
      ...(label ? {label} : {}),
    })
  }

  addReference(ref: Obj, path: string, source: LinkSource, label?: string): void {
    if (this.options.includeReferences === false) return
    const id = ref._ref
    if (typeof id !== 'string' || !id || ASSET_REF.test(id)) return
    // Cross-dataset / global references can't be checked against this dataset.
    if (ref._dataset || ref._projectId) return
    this.links.push({
      kind: 'internal',
      source,
      refId: getPublishedId(id),
      ...(ref._weak === true ? {weak: true} : {}),
      path,
      ...(label ? {label} : {}),
    })
  }

  block(block: Obj, path: string, depth: number): void {
    const children = Array.isArray(block.children) ? (block.children as Obj[]) : []
    const markDefs = Array.isArray(block.markDefs) ? (block.markDefs as Obj[]) : []
    markDefs.forEach((def, i) => {
      if (!isObj(def)) return
      const defPath = `${path}.markDefs[${i}]`
      const label =
        children
          .filter((c) => Array.isArray(c.marks) && (c.marks as unknown[]).includes(def._key))
          .map((c) => (typeof c.text === 'string' ? c.text : ''))
          .join('')
          .trim() || undefined
      if (typeof def.href === 'string') this.addHref(def.href, 'annotation', defPath, label)
      else if (isObj(def.reference)) this.addReference(def.reference, defPath, 'annotation', label)
      else if (typeof def._ref === 'string') this.addReference(def, defPath, 'annotation', label)
    })
    // Inline objects inside children may carry references.
    children.forEach((child, i) => this.walk(child, joinPath(`${path}.children`, i), depth + 1))
  }

  seo(seo: Obj, path: string): void {
    for (const field of SEO_URL_FIELDS) {
      let value: unknown = seo
      for (const key of field.path) value = isObj(value) ? value[key] : undefined
      if (typeof value === 'string' && value.trim()) {
        this.addHref(value, 'seo', joinPath(path, field.path.join('.')), field.label)
      }
    }
    const hreflangs = Array.isArray(seo.hreflangs) ? (seo.hreflangs as unknown[]) : []
    hreflangs.forEach((entry, i) => {
      if (isObj(entry) && typeof entry.url === 'string' && entry.url.trim()) {
        const locale = typeof entry.locale === 'string' ? entry.locale : '?'
        this.addHref(entry.url, 'seo', `${path}.hreflangs[${i}].url`, `Hreflang (${locale})`)
      }
    })
  }

  walk(value: unknown, path: string, depth: number, key = '', inSeo = false): void {
    if (depth > 20 || value === null || value === undefined) return

    if (Array.isArray(value)) {
      value.forEach((item, i) => this.walk(item, joinPath(path, i), depth + 1, '', inSeo))
      return
    }

    if (typeof value === 'string') {
      if (!inSeo && URL_KEY.test(key) && value.trim()) {
        const {kind} = classifyHref(value)
        // Only treat it as a link when it actually looks like one.
        if (kind === 'external' || value.trim().startsWith('/')) this.addHref(value, 'field', path)
      }
      return
    }

    if (!isObj(value)) return

    if (value._type === 'block' && Array.isArray(value.children)) {
      this.block(value, path, depth)
      return
    }

    if (typeof value._ref === 'string') {
      if (key !== 'asset') this.addReference(value, path, 'reference')
      return
    }

    const seoHere = !inSeo && isSeoObject(key, value, depth)
    if (seoHere) this.seo(value, path)

    for (const [childKey, child] of Object.entries(value)) {
      if (SKIP_KEYS.has(childKey)) continue
      this.walk(child, joinPath(path, childKey), depth + 1, childKey, inSeo || seoHere)
    }
  }
}

/** Collect every link and document reference in a document. */
export function extractDocumentLinks(
  doc: Record<string, unknown> | null | undefined,
  options: ExtractLinksOptions = {},
): ExtractedLink[] {
  if (!doc) return []
  const collector = new LinkCollector(options)
  collector.walk(doc, '', 0)
  return collector.links
}
