import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {reviewFields} from './schema'
import type {SchemaOrgReviewData} from './types'

export interface ReviewSchemaProps {
  /** The Schema.org Review data from your Sanity GROQ query. */
  data?: SchemaOrgReviewData | null
}

/**
 * Builds a Schema.org Review JSON-LD object from Sanity data.
 * Returns `null` if data is missing.
 */
export function buildReviewJsonLd(
  data?: SchemaOrgReviewData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Review',
    data as Record<string, unknown> | null | undefined,
    reviewFields,
    [],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org Review data.
 * Renders nothing if data is missing.
 */
export function ReviewSchema({data}: ReviewSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildReviewJsonLd(data)} />
}

export default ReviewSchema
