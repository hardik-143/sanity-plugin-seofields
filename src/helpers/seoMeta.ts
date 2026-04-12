/**
 * Headless CMS integration helpers for sanity-plugin-seofields
 *
 * Provides framework-agnostic SEO metadata utilities for use with:
 * - Next.js App Router  → buildSeoMeta() inside generateMetadata()
 * - Next.js Pages Router → <SeoMetaTags> inside Next.js <Head>
 * - Nuxt / Remix / any SSR → <SeoMetaTags> inside your <head> slot
 */

import type {SanityImage, SanityImageWithAlt} from '../types'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Structured metadata returned by buildSeoMeta(). Compatible with Next.js Metadata (App Router). */
export interface SeoMetadata {
  title?: string | null
  description?: string | null
  keywords?: string[]
  robots?: {
    index?: boolean
    follow?: boolean
    googleBot?: {
      index?: boolean
      follow?: boolean
    }
  }
  openGraph?: {
    type?: string
    url?: string
    title?: string
    description?: string
    siteName?: string
    images?: Array<{url: string; width?: number; height?: number; alt?: string}>
  }
  twitter?: {
    card?: string
    site?: string
    creator?: string
    title?: string
    description?: string
    images?: string[]
  }
  alternates?: {
    canonical?: string
  }
  /** Any custom meta attributes from seo.metaAttributes */
  other?: Record<string, string>
}

/** Default values used when SEO fields are missing. */
export interface SeoMetaDefaults {
  title?: string
  description?: string
  siteName?: string
  twitterSite?: string
  twitterCreator?: string
  /** Fallback image URL when no OG / Twitter image is set. */
  ogImage?: string
}

/**
 * Permissive image shape accepted by buildSeoMeta — compatible with both the
 * plugin's SanityImage and Sanity's code-generated image type (where `asset`
 * and `alt` are optional).
 */
interface SeoImageInput {
  _type?: string
  asset?: {_ref: string; _type: string; _weak?: boolean; [key: string]: unknown}
  hotspot?: unknown
  crop?: unknown
  alt?: string
}

/**
 * Input-compatible variant of SeoFields. Structurally matches Sanity's
 * code-generated types (where `asset`, `alt`, `key`, and `type` are all
 * optional), so you can pass `data.seo` from a sanityFetch result directly
 * without any `as any` or manual casting.
 */
export interface SeoFieldsInput {
  _type?: string
  robots?: {noIndex?: boolean | null; noFollow?: boolean | null} | null
  title?: string | null
  description?: string | null
  metaImage?: SeoImageInput | null
  metaAttributes?: Array<{_key?: string; key?: string; value?: string; type?: string}> | null
  keywords?: string[] | null
  canonicalUrl?: string | null
  openGraph?: {
    _type?: string
    url?: string | null
    title?: string | null
    description?: string | null
    siteName?: string | null
    type?: string | null
    imageType?: string | null
    image?: SeoImageInput | null
    imageUrl?: string | null
  } | null
  twitter?: {
    _type?: string
    card?: string | null
    site?: string | null
    creator?: string | null
    title?: string | null
    description?: string | null
    imageType?: string | null
    image?: SeoImageInput | null
    imageUrl?: string | null
  } | null
}

/** Options accepted by buildSeoMeta(). */
export interface BuildSeoMetaOptions {
  /**
   * The raw SEO object from Sanity (_type excluded or included — both work).
   * Pass `null` or `undefined` to fall back entirely to `defaults`.
   *
   * Accepts both the strict plugin `SeoFields` type and Sanity's code-generated
   * type (which has all nested fields optional) without any `as any` cast.
   */
  seo?: SeoFieldsInput | null

  /**
   * The base URL of your site, e.g. "https://example.com".
   * Used for canonical URL and OpenGraph URL construction.
   */
  baseUrl?: string

  /**
   * The path for the current page, e.g. "/about".
   * Combined with baseUrl to produce the canonical + OG url.
   * Defaults to "".
   */
  path?: string

  /**
   * Default values used when the Sanity SEO fields are empty / missing.
   */
  defaults?: SeoMetaDefaults

  /**
   * Resolve a Sanity image asset to a plain URL string.
   *
   * @example (using @sanity/image-url)
   * imageUrlResolver: (img) => urlFor(img).width(1200).url()
   */
  imageUrlResolver?: (image: SanityImage | SanityImageWithAlt) => string | null | undefined
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

const VALID_OG_TYPES = [
  'website',
  'article',
  'profile',
  'book',
  'music',
  'video',
  'product',
] as const
type OGType = (typeof VALID_OG_TYPES)[number]

/**
 * Coerce an arbitrary string to a valid OpenGraph type.
 * Falls back to "website" when the value is invalid.
 */
export function sanitizeOGType(value?: string): OGType {
  if (value && (VALID_OG_TYPES as readonly string[]).includes(value)) {
    return value as OGType
  }
  return 'website'
}

const VALID_TWITTER_CARDS = ['summary', 'summary_large_image', 'app', 'player'] as const
type TwitterCard = (typeof VALID_TWITTER_CARDS)[number]

/**
 * Coerce an arbitrary string to a valid Twitter card type.
 * Falls back to "summary_large_image" when the value is invalid.
 */
export function sanitizeTwitterCard(value?: string): TwitterCard {
  if (value && (VALID_TWITTER_CARDS as readonly string[]).includes(value)) {
    return value as TwitterCard
  }
  return 'summary_large_image'
}

/**
 * Resolve OG image URL from SEO fields or defaults.
 */
function resolveOgImage(
  seo: SeoFieldsInput | null | undefined,
  defaults: SeoMetaDefaults,
  imageUrlResolver?: (image: SanityImage | SanityImageWithAlt) => string | null | undefined,
): string {
  if (seo?.openGraph?.imageType === 'url' && seo.openGraph.imageUrl) {
    return seo.openGraph.imageUrl
  }
  if (seo?.openGraph?.image && imageUrlResolver) {
    return imageUrlResolver(seo.openGraph.image as SanityImage) || defaults.ogImage || ''
  }
  return defaults.ogImage || ''
}

/**
 * Resolve Twitter image URL from SEO fields, falling back to OG image.
 */
function resolveTwitterImage(
  seo: SeoFieldsInput | null | undefined,
  ogImageURL: string,
  imageUrlResolver?: (image: SanityImage | SanityImageWithAlt) => string | null | undefined,
): string {
  if (seo?.twitter?.imageType === 'url' && seo.twitter.imageUrl) {
    return seo.twitter.imageUrl
  }
  if (seo?.twitter?.image && imageUrlResolver) {
    return imageUrlResolver(seo.twitter.image as SanityImage) || ogImageURL
  }
  return ogImageURL
}

/**
 * Build custom meta attributes map from SEO fields.
 */
function buildCustomMetaMap(seo: SeoFieldsInput | null | undefined): Record<string, string> {
  const other: Record<string, string> = {}
  if (Array.isArray(seo?.metaAttributes)) {
    for (const attr of seo!.metaAttributes!) {
      if (attr.key && attr.value) {
        other[attr.key] = attr.value
      }
    }
  }
  return other
}

// ─── Core builder ─────────────────────────────────────────────────────────────

/**
 * Convert a Sanity SEO object into a structured metadata object.
 *
 * The return value is structurally compatible with Next.js App Router's
 * `Metadata` type, so you can return it directly from `generateMetadata()`.
 *
 * @example Next.js App Router
 * ```ts
 * import { buildSeoMeta } from 'sanity-plugin-seofields'
 * import { urlFor } from '@/sanity/lib/image'
 *
 * export async function generateMetadata(): Promise<Metadata> {
 *   const { seo } = await sanityFetch({ query: PAGE_SEO_QUERY })
 *   return buildSeoMeta({
 *     seo,
 *     baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
 *     path: '/about',
 *     defaults: { title: 'My Site', siteName: 'My Site' },
 *     imageUrlResolver: (img) => urlFor(img).width(1200).url(),
 *   })
 * }
 * ```
 */
export function buildSeoMeta(options: BuildSeoMetaOptions): SeoMetadata {
  const {seo, baseUrl = '', path = '', defaults = {}, imageUrlResolver} = options

  const normalizedBase = baseUrl.replace(/\/+$/, '') // remove trailing /
  const normalizedPath = path.replace(/^\/+/, '') // remove leading /

  const fullUrl = [normalizedBase, normalizedPath].filter(Boolean).join('/')

  const ogImageURL = resolveOgImage(seo, defaults, imageUrlResolver)
  const twitterImageURL = resolveTwitterImage(seo, ogImageURL, imageUrlResolver)
  const other = buildCustomMetaMap(seo)

  const ogUrl = seo?.openGraph?.url || fullUrl

  return {
    title: seo?.title ?? defaults.title ?? null,
    description: seo?.description ?? defaults.description ?? null,
    keywords: seo?.keywords?.length ? (seo.keywords as string[]) : undefined,
    robots: {
      index: !seo?.robots?.noIndex,
      follow: !seo?.robots?.noFollow,
      googleBot: {
        index: !seo?.robots?.noIndex,
        follow: !seo?.robots?.noFollow,
      },
    },
    openGraph: {
      type: sanitizeOGType(seo?.openGraph?.type ?? undefined),
      url: ogUrl || undefined,
      title: seo?.openGraph?.title ?? defaults.title,
      description: seo?.openGraph?.description ?? defaults.description,
      siteName: seo?.openGraph?.siteName ?? defaults.siteName,
      images: ogImageURL ? [{url: ogImageURL}] : [],
    },
    twitter: {
      card: sanitizeTwitterCard(seo?.twitter?.card ?? undefined),
      site: seo?.twitter?.site ?? defaults.twitterSite,
      creator: seo?.twitter?.creator ?? defaults.twitterCreator,
      title: seo?.twitter?.title ?? defaults.title,
      description: seo?.twitter?.description ?? defaults.description,
      images: twitterImageURL ? [twitterImageURL] : [],
    },
    alternates: {
      canonical: fullUrl || undefined,
    },
    ...(Object.keys(other).length > 0 ? {other} : {}),
  }
}
