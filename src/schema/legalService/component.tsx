import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {legalServiceFields} from './schema'
import type {SchemaOrgLegalServiceData} from './types'

export interface LegalServiceSchemaProps {
  /** The Schema.org LegalService data from your Sanity GROQ query. */
  data?: SchemaOrgLegalServiceData | null
}

/**
 * Builds a Schema.org LegalService JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildLegalServiceJsonLd(
  data?: SchemaOrgLegalServiceData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'LegalService',
    data as Record<string, unknown> | null | undefined,
    legalServiceFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org LegalService data.
 * Renders nothing if required fields are missing.
 */
export function LegalServiceSchema({data}: LegalServiceSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildLegalServiceJsonLd(data)} />
}

export default LegalServiceSchema
