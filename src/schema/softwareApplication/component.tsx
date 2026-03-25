/**
 * <SoftwareApplicationSchema> — Renders Schema.org SoftwareApplication JSON-LD structured data.
 *
 * @example
 * ```tsx
 * import { SoftwareApplicationSchema } from 'sanity-plugin-seofields/next/softwareApplication'
 *
 * const data = await sanityFetch({ query: `*[_type == "app"][0]{ seo }` })
 *
 * <SoftwareApplicationSchema data={data.seo} />
 * ```
 */
import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {softwareApplicationFields} from './schema'
import type {SchemaOrgSoftwareApplicationData} from './types'

export interface SoftwareApplicationSchemaProps {
  /** The Schema.org SoftwareApplication data from your Sanity GROQ query. */
  data?: SchemaOrgSoftwareApplicationData | null
}

/**
 * Builds a Schema.org SoftwareApplication JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildSoftwareApplicationJsonLd(
  data?: SchemaOrgSoftwareApplicationData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'SoftwareApplication',
    data as Record<string, unknown> | null | undefined,
    softwareApplicationFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org SoftwareApplication data.
 * Renders nothing if required fields are missing.
 */
export function SoftwareApplicationSchema({
  data,
}: SoftwareApplicationSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildSoftwareApplicationJsonLd(data)} />
}

export default SoftwareApplicationSchema
