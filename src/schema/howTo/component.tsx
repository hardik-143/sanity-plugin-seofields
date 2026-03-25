import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {howToFields} from './schema'
import type {SchemaOrgHowToData} from './types'

export interface HowToSchemaProps {
  /** The Schema.org HowTo data from your Sanity GROQ query. */
  data?: SchemaOrgHowToData | null
}

/**
 * Builds a Schema.org HowTo JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildHowToJsonLd(data?: SchemaOrgHowToData | null): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'HowTo',
    data as Record<string, unknown> | null | undefined,
    howToFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org HowTo data.
 * Renders nothing if required fields are missing.
 */
export function HowToSchema({data}: HowToSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildHowToJsonLd(data)} />
}

export default HowToSchema
