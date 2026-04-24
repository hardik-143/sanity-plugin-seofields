import type {SchemaTypeDefinition} from 'sanity'

import {
  datePublishedField,
  headlineField,
  polymorphicAuthor,
  polymorphicImage,
  polymorphicPublisher,
} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgSocialMediaPostingConfig, SchemaOrgSocialMediaPostingData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const socialMediaPostingFields: SchemaFieldDef[] = [
  headlineField({
    required: {key: 'headlineRequired', message: 'Post headline is required for Schema.org.'},
    description: 'The headline of the post.',
  }),
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A short description of the post.',
  },
  polymorphicImage({description: 'Image for the post.'}),
  polymorphicAuthor({description: 'The author of the post.'}),
  polymorphicPublisher({description: 'The publisher of the post.'}),
  datePublishedField({
    dateType: 'datetime',
    description: 'The date the post was published.',
  }),
  {
    name: 'dateModified',
    title: 'Date Modified',
    type: 'datetime',
    description: 'The date the post was last modified.',
  },
  {
    name: 'sharedContent',
    title: 'Shared Content',
    type: 'array',
    description: 'Content shared in the post.',
    jsonLdType: 'WebPage',
    fields: [
      {
        name: 'url',
        title: 'Page URL',
        type: 'url',
        description: 'URL of the shared page.',
      },
      {
        name: 'headline',
        title: 'Page Headline',
        type: 'string',
        description: 'Headline of the shared page.',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgSocialMediaPosting(
  config: SchemaOrgSocialMediaPostingConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgSocialMediaPosting',
      title: 'SocialMediaPosting',
      icon: SchemaOrgIcons.socialMediaPosting,
      fields: socialMediaPostingFields,
      customPrepareSubtitle: (document: SchemaOrgSocialMediaPostingData) =>
        document.headline || 'Untitled post',
    },
    config as SchemaOrgConfig,
  )
}
