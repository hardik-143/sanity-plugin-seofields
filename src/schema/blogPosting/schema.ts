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
import type {SchemaOrgBlogPostingConfig, SchemaOrgBlogPostingData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const blogPostingFields: SchemaFieldDef[] = [
  headlineField({
    required: {
      key: 'headlineRequired',
      message: 'Headline is required for Schema.org BlogPosting.',
    },
  }),
  descriptionField({
    description: 'A description of the blog post.',
    required: {
      key: 'descriptionRequired',
      message: 'Description is required for Schema.org BlogPosting.',
    },
  }),
  polymorphicImage(),
  polymorphicAuthor(),
  polymorphicPublisher(),
  datePublishedField(),
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
 */
export default function schemaOrgBlogPosting(
  config: SchemaOrgBlogPostingConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgBlogPosting',
      title: 'BlogPosting',
      icon: SchemaOrgIcons.blogPosting,
      fields: blogPostingFields,
      customPrepareSubtitle: (document: SchemaOrgBlogPostingData) =>
        document.headline || 'Untitled blog post',
    },
    config as SchemaOrgConfig,
  )
}
