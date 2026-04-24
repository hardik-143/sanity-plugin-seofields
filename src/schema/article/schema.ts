import type {SchemaTypeDefinition} from 'sanity'

import {
  datePublishedField,
  descriptionField,
  headlineField,
  polymorphicAuthor,
  polymorphicImage,
  polymorphicPublisher,
} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgArticleConfig, SchemaOrgArticleData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const articleFields: SchemaFieldDef[] = [
  headlineField({
    title: 'Headline',
    description: 'The headline of the article.',
    required: {key: 'headlineRequired', message: 'Headline is required for Schema.org Article.'},
  }),
  descriptionField({
    title: 'Description',
    description: 'A description of the article.',
    required: {
      key: 'descriptionRequired',
      message: 'Description is required for Schema.org Article.',
    },
  }),
  polymorphicImage(),
  polymorphicAuthor(),
  polymorphicPublisher(),
  datePublishedField(),
  {
    name: 'articleSection',
    title: 'Article Section',
    type: 'string',
    description:
      'The section of the publication this article belongs to (e.g. "Sports", "Business").',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org Article — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgArticle } from 'sanity-plugin-seofields/schema/article'
 *
 * schemaOrgArticle()
 * ```
 */
export default function schemaOrgArticle(
  config: SchemaOrgArticleConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgArticle',
      title: 'Article',
      icon: SchemaOrgIcons.article,
      fields: articleFields,
      customPrepareSubtitle: (document: SchemaOrgArticleData) => {
        const headline = document.headline || 'Untitled article'
        const section = document.articleSection ? ` · ${document.articleSection}` : ''
        return `${headline}${section}`
      },
    },
    config as SchemaOrgConfig,
  )
}
