/**
 * <WebApplicationSchema> — Renders Schema.org WebApplication JSON-LD structured data.
 *
 * @example
 * ```tsx
 * import { WebApplicationSchema } from 'sanity-plugin-seofields/next/webApplication'
 *
 * const data = await sanityFetch({ query: `*[_type == "app"][0]{ seo }` })
 *
 * <WebApplicationSchema data={data.seo} />
 * ```
 */
import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {webApplicationFields} from './schema'
import type {SchemaOrgWebApplicationData} from './types'

export interface WebApplicationSchemaProps {
  /** The Schema.org WebApplication data from your Sanity GROQ query. */
  data?: SchemaOrgWebApplicationData | null
}

/**
 * Builds a Schema.org WebApplication JSON-LD object from Sanity data.
 * Returns `null` if required fields (name, url) are missing.
 */
export function buildWebApplicationJsonLd(
  data?: SchemaOrgWebApplicationData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'WebApplication',
    data as Record<string, unknown> | null | undefined,
    webApplicationFields,
    ['name', 'url'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org WebApplication data.
 * Renders nothing if required fields are missing.
 */
export function WebApplicationSchema({data}: WebApplicationSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildWebApplicationJsonLd(data)} />
}

export default WebApplicationSchema
