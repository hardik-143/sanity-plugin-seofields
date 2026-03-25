import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgAggregateRatingConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const aggregateRatingFields: SchemaFieldDef[] = [
  {
    name: 'ratingValue',
    title: 'Rating Value',
    type: 'string',
    description: 'The average rating value, e.g. "4.5".',
    required: {
      key: 'ratingValueRequired',
      message: 'Rating value is required for Schema.org.',
    },
  },
  {
    name: 'reviewCount',
    title: 'Review Count',
    type: 'string',
    description: 'The total number of reviews, e.g. "120".',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgAggregateRating(
  config: SchemaOrgAggregateRatingConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgAggregateRating',
      title: 'Schema.org — AggregateRating',
      icon: SchemaOrgIcons.aggregateRating,
      fields: aggregateRatingFields,
    },
    config as SchemaOrgConfig,
  )
}
