import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {eventFields} from './schema'
import type {SchemaOrgEventData} from './types'

export interface EventSchemaProps {
  /** The Schema.org Event data from your Sanity GROQ query. */
  data?: SchemaOrgEventData | null
}

/**
 * Builds a Schema.org Event JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildEventJsonLd(data?: SchemaOrgEventData | null): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Event',
    data as Record<string, unknown> | null | undefined,
    eventFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org Event data.
 * Renders nothing if required fields are missing.
 */
export function EventSchema({data}: EventSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildEventJsonLd(data)} />
}

export default EventSchema
