/**
 * <PersonSchema> — Renders Schema.org Person JSON-LD structured data.
 *
 * @example
 * ```tsx
 * import { PersonSchema } from 'sanity-plugin-seofields/next/person'
 *
 * const data = await sanityFetch({ query: `*[_type == "teamMember"][0]{ person }` })
 *
 * <PersonSchema data={data.person} />
 * ```
 */
import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {personFields} from './schema'
import type {SchemaOrgPersonData} from './types'

export interface PersonSchemaProps {
  /** The Schema.org Person data from your Sanity GROQ query. */
  data?: SchemaOrgPersonData | null
}

/**
 * Builds a Schema.org Person JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildPersonJsonLd(
  data?: SchemaOrgPersonData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Person',
    data as Record<string, unknown> | null | undefined,
    personFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org Person data.
 * Renders nothing if required fields are missing.
 */
export function PersonSchema({data}: PersonSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildPersonJsonLd(data)} />
}

export default PersonSchema
