import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {countryFields} from './schema'
import type {SchemaOrgCountryData} from './types'

export interface CountrySchemaProps {
  /** The Schema.org Country data from your Sanity GROQ query. */
  data?: SchemaOrgCountryData | null
}

/**
 * Builds a Schema.org Country JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildCountryJsonLd(
  data?: SchemaOrgCountryData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Country',
    data as Record<string, unknown> | null | undefined,
    countryFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org Country data.
 * Renders nothing if required fields are missing.
 */
export function CountrySchema({data}: CountrySchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildCountryJsonLd(data)} />
}

export default CountrySchema
