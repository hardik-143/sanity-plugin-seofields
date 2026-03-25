import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {aggregateRatingFields} from './schema'
import type {SchemaOrgAggregateRatingData} from './types'

export interface AggregateRatingSchemaProps {
  data?: SchemaOrgAggregateRatingData | null
}

export function buildAggregateRatingJsonLd(
  data?: SchemaOrgAggregateRatingData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'AggregateRating',
    data as Record<string, unknown> | null | undefined,
    aggregateRatingFields,
    ['ratingValue'],
  )
}

export function AggregateRatingSchema({data}: AggregateRatingSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildAggregateRatingJsonLd(data)} />
}

export default AggregateRatingSchema
