/**
 * <WebPageSchema> — Renders Schema.org WebPage JSON-LD structured data.
 *
 * @example
 * ```tsx
 * import { WebPageSchema } from 'sanity-plugin-seofields/next/webPage'
 *
 * const data = await sanityFetch({ query: `*[_type == "page"][0]{ seo }` })
 *
 * <WebPageSchema data={data.seo} />
 * ```
 */
import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {webPageFields} from './schema'
import type {SchemaOrgWebPageData} from './types'

export interface WebPageSchemaProps {
  /** The Schema.org WebPage data from your Sanity GROQ query. */
  data?: SchemaOrgWebPageData | null
}

/**
 * Builds a Schema.org WebPage JSON-LD object from Sanity data.
 * Returns `null` if required fields (name, url) are missing.
 */
export function buildWebPageJsonLd(
  data?: SchemaOrgWebPageData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'WebPage',
    data as Record<string, unknown> | null | undefined,
    webPageFields,
    ['name', 'url'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org WebPage data.
 * Renders nothing if required fields are missing.
 */
export function WebPageSchema({data}: WebPageSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildWebPageJsonLd(data)} />
}

export default WebPageSchema
