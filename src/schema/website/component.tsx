/**
 * <WebsiteSchema> — Renders Schema.org WebSite JSON-LD structured data.
 *
 * @example
 * ```tsx
 * import { WebsiteSchema } from 'sanity-plugin-seofields/next/website'
 *
 * const data = await sanityFetch({ query: `*[_type == "settings"][0]{ website }` })
 *
 * <WebsiteSchema data={data.website} />
 * ```
 */
import {JSX} from 'react'

import {escapeJsonForScript} from '../utils'
import type {SchemaOrgWebsiteData} from './types'

export interface WebsiteSchemaProps {
  /** The Schema.org Website data from your Sanity GROQ query. */
  data?: SchemaOrgWebsiteData | null
}

/**
 * Builds a Schema.org WebSite JSON-LD object from Sanity data.
 * Returns `null` if required fields (name, url) are missing.
 */
export function buildWebsiteJsonLd(
  data?: SchemaOrgWebsiteData | null,
): Record<string, unknown> | null {
  if (!data?.name || !data?.url) return null

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
  }

  if (data.description) jsonLd.description = data.description
  if (data.inLanguage) jsonLd.inLanguage = data.inLanguage

  if (data.publisher?.name) {
    const publisher: Record<string, unknown> = {
      '@type': 'Organization',
      name: data.publisher.name,
    }
    if (data.publisher.url) publisher.url = data.publisher.url
    if (data.publisher.logoUrl) {
      publisher.logo = {
        '@type': 'ImageObject',
        url: data.publisher.logoUrl,
      }
    }
    jsonLd.publisher = publisher
  }

  return jsonLd
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org WebSite data.
 * Renders nothing if required fields are missing.
 */
export function WebsiteSchema({data}: WebsiteSchemaProps): JSX.Element | null {
  const jsonLd = buildWebsiteJsonLd(data)
  if (!jsonLd) return null

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: escapeJsonForScript(JSON.stringify(jsonLd))}}
    />
  )
}

export default WebsiteSchema
