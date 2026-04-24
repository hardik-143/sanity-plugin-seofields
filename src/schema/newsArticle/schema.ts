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
import type {SchemaOrgNewsArticleConfig, SchemaOrgNewsArticleData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const newsArticleFields: SchemaFieldDef[] = [
  headlineField({
    required: {key: 'headlineRequired', message: 'Headline is required.'},
    description: 'The headline of the news article (max 110 characters recommended).',
  }),
  descriptionField({
    description: 'A short summary of the news article (max 200 characters recommended).',
  }),
  polymorphicImage({description: 'Lead image for the article.'}),
  polymorphicAuthor({description: 'The author of the article.'}),
  polymorphicPublisher({description: 'The publisher of the article.'}),
  datePublishedField({
    dateType: 'datetime',
    description: 'When the article was first published.',
    required: {key: 'datePublishedRequired', message: 'Publication date is required.'},
  }),
  {
    name: 'dateModified',
    title: 'Date Modified',
    type: 'datetime',
    description: 'When the article was last modified.',
  },
  {
    name: 'articleSection',
    title: 'Article Section',
    type: 'string',
    description: 'The section of the publication, e.g. "Politics", "Sports".',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgNewsArticle(
  config: SchemaOrgNewsArticleConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgNewsArticle',
      title: 'NewsArticle',
      icon: SchemaOrgIcons.newsArticle,
      fields: newsArticleFields,
      customPrepareSubtitle: (document: SchemaOrgNewsArticleData) => {
        const headline = document.headline || 'Untitled'
        const section = document.articleSection ? ` · ${document.articleSection}` : ''
        return `${headline}${section}`
      },
    },
    config as SchemaOrgConfig,
  )
}
