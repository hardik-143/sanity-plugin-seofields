import type {SchemaTypeDefinition} from 'sanity'

import {polymorphicAuthor, polymorphicPublisher} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgReviewConfig, SchemaOrgReviewData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const reviewFields: SchemaFieldDef[] = [
  {
    name: 'reviewRating',
    title: 'Review Rating',
    type: 'object',
    jsonLdType: 'Rating',
    fields: [
      {
        name: 'ratingValue',
        title: 'Rating Value',
        type: 'string',
        required: {
          key: 'ratingValueRequired',
          message: 'Rating value is required for Schema.org Review.',
        },
      },
    ],
  },
  polymorphicAuthor({description: 'The author of the review (Person or Organization).'}),
  {
    name: 'reviewBody',
    title: 'Review Body',
    type: 'text',
    rows: 3,
  },
  {
    name: 'itemReviewed',
    title: 'Item Reviewed',
    type: 'object',
    description: 'The item that is being reviewed.',
    jsonLdType: 'Thing',
    fields: [
      {
        name: 'name',
        title: 'Item Name',
        type: 'string',
        description: 'Name of the reviewed item.',
      },
      {
        name: 'url',
        title: 'Item URL',
        type: 'url',
        description: 'URL of the reviewed item.',
      },
    ],
  },
  polymorphicPublisher({description: 'The publisher of the review.'}),
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org Review — Sanity object type.
 */
export default function schemaOrgReview(config: SchemaOrgReviewConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgReview',
      title: 'Review',
      icon: SchemaOrgIcons.review,
      fields: reviewFields,
      customPrepareSubtitle: (document: SchemaOrgReviewData) => {
        const item = document.itemReviewed?.name || 'Untitled item'
        const rating = document.reviewRating?.ratingValue
          ? ` · ${document.reviewRating.ratingValue}★`
          : ''
        return `${item}${rating}`
      },
    },
    config as SchemaOrgConfig,
  )
}
