/**
 * Build hreflang alternate-link entries from resolved document translations.
 *
 * Designed for `@sanity/document-internationalization`: a standard GROQ query resolves translations as
 *
 * ```groq
 * "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
 *   language, "slug": slug.current
 * }
 * ```
 *
 * Pass that array here to get entries matching the plugin's `hreflangEntry` shape (`{locale, url}`),
 * which are assignable to `seo.hreflangs` or to `buildSeoMeta({ hreflangs })`.
 */
import {joinUrl} from './url'

export interface HreflangTranslation {
  /** BCP 47 language/region tag, e.g. "en", "fr-FR". */
  language?: string | null
  /** Sanity slug — either the raw string or the `{ current }` object. */
  slug?: {current?: string | null} | string | null
  /** Pre-built path (e.g. "/fr/about"). Wins over `slug`. */
  path?: string | null
  /** Absolute URL. Wins over `baseUrl` + path. */
  url?: string | null
}

export interface BuildHreflangsOptions {
  /** Site origin, e.g. "https://example.com". Prepended to each translation's path. */
  baseUrl?: string
  /** Build the path for a translation. Defaults to `/${slug}`. Return null/undefined to skip. */
  resolvePath?: (t: HreflangTranslation) => string | null | undefined
  /** Language tag to also emit as an `x-default` entry (pointing at that language's URL). */
  xDefault?: string
  /** Include the current document itself in the set. */
  current?: HreflangTranslation
}

export interface HreflangLinkEntry {
  locale: string
  url: string
}

function normalizeSlug(slug: HreflangTranslation['slug']): string | undefined {
  if (typeof slug === 'string') return slug || undefined
  if (slug && typeof slug === 'object') return slug.current ?? undefined
  return undefined
}

function resolveUrl(
  t: HreflangTranslation,
  baseUrl: string | undefined,
  resolvePath: BuildHreflangsOptions['resolvePath'],
): string | undefined {
  if (t.url) return t.url

  let path: string | null | undefined
  if (resolvePath) {
    path = resolvePath(t)
  } else if (t.path) {
    path = t.path
  } else {
    const slug = normalizeSlug(t.slug)
    path = slug ? `/${slug.replace(/^\/+/, '')}` : undefined
  }

  if (path === null || path === undefined || path === '') return undefined
  return baseUrl ? joinUrl(baseUrl, path) : path
}

export function buildHreflangs(
  translations: HreflangTranslation[] | null | undefined,
  options: BuildHreflangsOptions = {},
): HreflangLinkEntry[] {
  const {baseUrl, resolvePath, xDefault, current} = options
  const all = current ? [current, ...(translations ?? [])] : [...(translations ?? [])]

  const entries: HreflangLinkEntry[] = []
  const seen = new Set<string>()

  for (const t of all) {
    const locale = t?.language?.trim()
    if (!locale || seen.has(locale)) continue
    const url = resolveUrl(t, baseUrl, resolvePath)
    if (!url) continue
    seen.add(locale)
    entries.push({locale, url})
  }

  if (xDefault) {
    const match = entries.find((e) => e.locale === xDefault)
    if (match && !seen.has('x-default')) {
      entries.push({locale: 'x-default', url: match.url})
    }
  }

  return entries
}
