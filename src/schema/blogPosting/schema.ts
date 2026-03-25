import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgBlogPostingConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const blogPostingFields: SchemaFieldDef[] = [
  {
    name: 'headline',
    title: 'Headline',
    type: 'string',
    required: {
      key: 'headlineRequired',
      message: 'Headline is required for Schema.org BlogPosting.',
    },
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
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
    name: 'datePublished',
    title: 'Date Published',
    type: 'date',
  },
  {
    name: 'mainEntityOfPage',
    title: 'Main Entity of Page',
    type: 'object',
    jsonLdType: 'WebPage',
    fields: [
      {
        name: 'id',
        title: 'Page URL',
        type: 'url',
        jsonLdKey: '@id',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org BlogPosting — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgBlogPosting } from 'sanity-plugin-seofields/schema/blogPosting'
 *
 * schemaOrgBlogPosting()
 * ```
 */
export default function schemaOrgBlogPosting(
  config: SchemaOrgBlogPostingConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgBlogPosting',
      title: 'Schema.org — BlogPosting',
      icon: SchemaOrgIcons.blogPosting,
      fields: blogPostingFields,
    },
    config as SchemaOrgConfig,
  )
}
