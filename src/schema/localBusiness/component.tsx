import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {localBusinessFields} from './schema'
import type {SchemaOrgLocalBusinessData} from './types'

export interface LocalBusinessSchemaProps {
  /** The Schema.org LocalBusiness data from your Sanity GROQ query. */
  data?: SchemaOrgLocalBusinessData | null
}

/**
 * Builds a Schema.org LocalBusiness JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildLocalBusinessJsonLd(
  data?: SchemaOrgLocalBusinessData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'LocalBusiness',
    data as Record<string, unknown> | null | undefined,
    localBusinessFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org LocalBusiness data.
 * Renders nothing if required fields are missing.
 */
export function LocalBusinessSchema({data}: LocalBusinessSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildLocalBusinessJsonLd(data)} />
}

export default LocalBusinessSchema
