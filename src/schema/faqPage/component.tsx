import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {faqPageFields} from './schema'
import type {SchemaOrgFAQPageData} from './types'

export interface FAQPageSchemaProps {
  /** The Schema.org FAQPage data from your Sanity GROQ query. */
  data?: SchemaOrgFAQPageData | null
}

/**
 * Builds a Schema.org FAQPage JSON-LD object from Sanity data.
 * Returns `null` if data is missing.
 */
export function buildFAQPageJsonLd(
  data?: SchemaOrgFAQPageData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'FAQPage',
    data as Record<string, unknown> | null | undefined,
    faqPageFields,
    [],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org FAQPage data.
 * Renders nothing if data is missing.
 */
export function FAQPageSchema({data}: FAQPageSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildFAQPageJsonLd(data)} />
}

export default FAQPageSchema
