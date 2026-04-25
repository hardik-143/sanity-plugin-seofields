/**
 * <SeoMetaTags> — Framework-agnostic React SEO meta tag renderer.
 *
 * Renders all SEO meta tags as plain React elements.
 * Place it inside your framework's <Head> component:
 *
 * @example Next.js Pages Router
 * ```tsx
 * import Head from 'next/head'
 * import { SeoMetaTags } from 'sanity-plugin-seofields'
 *
 * export default function Page({ seo }) {
 *   return (
 *     <>
 *       <Head>
 *         <SeoMetaTags
 *           data={seo}
 *           baseUrl="https://example.com"
 *           path="/about"
 *           defaults={{ title: 'My Site', siteName: 'My Site' }}
 *           imageUrlResolver={(img) => urlFor(img).width(1200).url()}
 *         />
 *       </Head>
 *       <main>...</main>
 *     </>
 *   )
 * }
 * ```
 *
 * @example Nuxt 3 / generic SSR (inside <Head> slot)
 * ```tsx
 * <Head>
 *   <SeoMetaTags data={seo} baseUrl="https://example.com" path="/" />
 * </Head>
 * ```
 */
import {Fragment, type JSX} from 'react'

import type {SanityImage, SanityImageWithAlt, SeoFields} from '../types'
import {buildSeoMeta, type BuildSeoMetaOptions} from './seoMeta'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SeoMetaTagsProps {
  /**
   * The raw SEO object from Sanity.
   * Pass `null` / `undefined` to render only the defaults.
   */
  data?: Partial<SeoFields> | null

  /**
   * Base URL of your site, e.g. "https://example.com".
   * Used for canonical link, og:url fallback.
   */
  baseUrl?: string

  /**
   * Current page path, e.g. "/about".
   * Defaults to "".
   */
  path?: string

  /**
   * Default values used when SEO fields are missing.
   */
  defaults?: BuildSeoMetaOptions['defaults']

  /**
   * Resolve a Sanity image asset reference to a full URL string.
   *
   * @example
   * imageUrlResolver={(img) => urlFor(img).width(1200).url()}
   */
  imageUrlResolver?: (image: SanityImage | SanityImageWithAlt) => string | null | undefined
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Renders all SEO meta tags for a page as plain React elements.
 * Intended to be placed inside your framework's <Head> / <head> component.
 *
 * Renders:
 * - `<title>`
 * - `<meta name="description">`
 * - `<meta name="keywords">`
 * - `<meta name="robots">`
 * - OpenGraph meta tags (`og:*`)
 * - Twitter Card meta tags (`twitter:*`)
 * - Any custom `seo.metaAttributes` as `<meta name="..." content="...">`
 */
export function SeoMetaTags({
  data,
  baseUrl,
  path,
  defaults,
  imageUrlResolver,
}: SeoMetaTagsProps): JSX.Element {
  const meta = buildSeoMeta({seo: data, baseUrl, path, defaults, imageUrlResolver})

  const robotsContent = [
    meta.robots?.index === false ? 'noindex' : 'index',
    meta.robots?.follow === false ? 'nofollow' : 'follow',
  ].join(', ')

  return (
    <>
      {/* ── Title ── */}
      {meta.title && <title>{meta.title}</title>}

      {/* ── Basic meta ── */}
      {meta.description && <meta name="description" content={meta.description} />}
      {meta.keywords?.length ? <meta name="keywords" content={meta.keywords.join(', ')} /> : null}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* ── Open Graph ── */}
      {meta.openGraph?.type && <meta property="og:type" content={meta.openGraph.type} />}
      {meta.openGraph?.url && <meta property="og:url" content={meta.openGraph.url} />}
      {meta.openGraph?.title && <meta property="og:title" content={meta.openGraph.title} />}
      {meta.openGraph?.description && (
        <meta property="og:description" content={meta.openGraph.description} />
      )}
      {meta.openGraph?.siteName && (
        <meta property="og:site_name" content={meta.openGraph.siteName} />
      )}
      {meta.openGraph?.images?.map((img, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={`og-img-${i}`}>
          <meta property="og:image" content={img.url} />
          {img.width && <meta property="og:image:width" content={String(img.width)} />}
          {img.height && <meta property="og:image:height" content={String(img.height)} />}
          {img.alt && <meta property="og:image:alt" content={img.alt} />}
        </Fragment>
      ))}

      {/* ── Twitter Card ── */}
      {meta.twitter?.card && <meta name="twitter:card" content={meta.twitter.card} />}
      {meta.twitter?.site && <meta name="twitter:site" content={meta.twitter.site} />}
      {meta.twitter?.creator && <meta name="twitter:creator" content={meta.twitter.creator} />}
      {meta.twitter?.title && <meta name="twitter:title" content={meta.twitter.title} />}
      {meta.twitter?.description && (
        <meta name="twitter:description" content={meta.twitter.description} />
      )}
      {meta.twitter?.images?.map((url, i) => (
        <meta key={`tw-img-${i}`} name="twitter:image" content={url} />
      ))}

      {/* ── Custom meta attributes ── */}
      {meta.other &&
        Object.entries(meta.other).map(([name, content]) => (
          <meta key={`custom-${name}`} name={name} content={content} />
        ))}

      {/* ── Canonical URL ── */}
      {meta.alternates?.canonical && <link rel="canonical" href={meta.alternates.canonical} />}
    </>
  )
}

export default SeoMetaTags
