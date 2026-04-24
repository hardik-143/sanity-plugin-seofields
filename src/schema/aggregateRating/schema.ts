import type {SchemaTypeDefinition} from 'sanity'

import {polymorphicAuthor} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgAggregateRatingConfig, SchemaOrgAggregateRatingData} from './types'

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
    name: 'bestRating',
    title: 'Best Rating',
    type: 'string',
    description: 'The highest value allowed in this rating system, e.g. "5".',
    initialValue: '5',
  },
  {
    name: 'worstRating',
    title: 'Worst Rating',
    type: 'string',
    description: 'The lowest value allowed in this rating system, e.g. "1".',
    initialValue: '1',
  },
  {
    name: 'ratingCount',
    title: 'Rating Count',
    type: 'string',
    description: 'The total number of ratings.',
  },
  {
    name: 'reviewCount',
    title: 'Review Count',
    type: 'string',
    description: 'The total number of reviews, e.g. "120".',
  },
  {
    name: 'ratingExplanation',
    title: 'Rating Explanation',
    type: 'text',
    rows: 3,
    description: 'A short explanation (e.g. "Based on 120 verified purchases").',
  },
  polymorphicAuthor({
    description: 'The author of the rating — choose Person or Organization.',
  }),
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgAggregateRating(
  config: SchemaOrgAggregateRatingConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgAggregateRating',
      title: 'AggregateRating',
      icon: SchemaOrgIcons.aggregateRating,
      fields: aggregateRatingFields,
      customPrepareSubtitle: (document: SchemaOrgAggregateRatingData) => {
        const ratingValue = document.ratingValue
          ? `Rating: ${document.ratingValue}${document.bestRating ? `/${document.bestRating}` : ''}`
          : 'No rating value'
        let count = ''
        if (document.reviewCount) {
          count = `Reviews: ${document.reviewCount}`
        } else if (document.ratingCount) {
          count = `Ratings: ${document.ratingCount}`
        }
        return count ? `${ratingValue} | ${count}` : ratingValue
      },
    },
    config as SchemaOrgConfig,
  )
}
