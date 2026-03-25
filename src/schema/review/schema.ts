import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgReviewConfig} from './types'

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
  {
    name: 'author',
    title: 'Author',
    type: 'object',
    jsonLdType: 'Person',
    fields: [
      {
        name: 'name',
        title: 'Author Name',
        type: 'string',
        required: {
          key: 'authorNameRequired',
          message: 'Author name is required for Schema.org Review.',
        },
      },
    ],
  },
  {
    name: 'reviewBody',
    title: 'Review Body',
    type: 'text',
    rows: 3,
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org Review — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgReview } from 'sanity-plugin-seofields/schema/review'
 *
 * schemaOrgReview()
 * ```
 */
export default function schemaOrgReview(config: SchemaOrgReviewConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgReview',
      title: 'Schema.org — Review',
      icon: SchemaOrgIcons.review,
      fields: reviewFields,
    },
    config as SchemaOrgConfig,
  )
}
