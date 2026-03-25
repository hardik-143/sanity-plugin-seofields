import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgArticleConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const articleFields: SchemaFieldDef[] = [
  {
    name: 'headline',
    title: 'Headline',
    type: 'string',
    required: {key: 'headlineRequired', message: 'Headline is required for Schema.org Article.'},
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
  },
  {
    name: 'image',
    title: 'Image',
    type: 'url',
    description: 'URL of the article image.',
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
      },
    ],
  },
  {
    name: 'publisher',
    title: 'Publisher',
    type: 'object',
    jsonLdType: 'Organization',
    fields: [
      {
        name: 'name',
        title: 'Publisher Name',
        type: 'string',
      },
      {
        name: 'logo',
        title: 'Publisher Logo',
        type: 'object',
        jsonLdType: 'ImageObject',
        fields: [
          {
            name: 'url',
            title: 'Logo URL',
            type: 'url',
          },
        ],
      },
    ],
  },
  {
    name: 'datePublished',
    title: 'Date Published',
    type: 'date',
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
      title: 'Schema.org — Article',
      icon: SchemaOrgIcons.article,
      fields: articleFields,
    },
    config as SchemaOrgConfig,
  )
}
