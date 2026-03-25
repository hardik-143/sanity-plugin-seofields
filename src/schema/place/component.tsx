import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {placeFields} from './schema'
import type {SchemaOrgPlaceData} from './types'

export interface PlaceSchemaProps {
  /** The Schema.org Place data from your Sanity GROQ query. */
  data?: SchemaOrgPlaceData | null
}

/**
 * Builds a Schema.org Place JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildPlaceJsonLd(data?: SchemaOrgPlaceData | null): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Place',
    data as Record<string, unknown> | null | undefined,
    placeFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org Place data.
 * Renders nothing if required fields are missing.
 */
export function PlaceSchema({data}: PlaceSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildPlaceJsonLd(data)} />
}

export default PlaceSchema
