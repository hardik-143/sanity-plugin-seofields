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
import type {SchemaOrgOpinionNewsArticleConfig, SchemaOrgOpinionNewsArticleData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const opinionNewsArticleFields: SchemaFieldDef[] = [
  headlineField({
    required: {key: 'headlineRequired', message: 'Headline is required.'},
    description: 'The headline of the opinion piece (max 110 characters recommended).',
  }),
  descriptionField({
    description: 'A short summary of the opinion piece (max 200 characters recommended).',
  }),
  polymorphicImage({description: 'Lead image for the article.'}),
  polymorphicAuthor({
    description:
      'The author of the opinion piece. Use the Person variant with Job Title and Same As ' +
      'profile links to strengthen E-E-A-T signals.',
  }),
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
    description: 'The section of the publication, e.g. "Opinion", "Editorial".',
  },
  {
    name: 'articleBody',
    title: 'Article Body',
    type: 'text',
    rows: 6,
    description: 'The actual body text of the opinion piece.',
  },
  {
    name: 'dateline',
    title: 'Dateline',
    type: 'string',
    description: 'The location from which the piece was filed, e.g. "Washington, D.C.".',
  },
  {
    name: 'printColumn',
    title: 'Print Column',
    type: 'string',
    description: 'The number of the column in which the article appears in the print edition.',
  },
  {
    name: 'printEdition',
    title: 'Print Edition',
    type: 'string',
    description: 'The edition of the print product in which the article appears.',
  },
  {
    name: 'printPage',
    title: 'Print Page',
    type: 'string',
    description:
      'The exact name of the page on which the article is found in print, e.g. "A5", "B18".',
  },
  {
    name: 'printSection',
    title: 'Print Section',
    type: 'string',
    description: 'The print section in which the article appeared.',
  },
  {
    name: 'backstory',
    title: 'Backstory',
    type: 'text',
    rows: 3,
    description: 'Sources, context, and provenance behind this opinion piece.',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgOpinionNewsArticle(
  config: SchemaOrgOpinionNewsArticleConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgOpinionNewsArticle',
      title: 'OpinionNewsArticle',
      icon: SchemaOrgIcons.opinionNewsArticle,
      fields: opinionNewsArticleFields,
      customPrepareSubtitle: (document: SchemaOrgOpinionNewsArticleData) => {
        const headline = document.headline || 'Untitled'
        const section = document.articleSection ? ` · ${document.articleSection}` : ''
        return `${headline}${section}`
      },
    },
    config as SchemaOrgConfig,
  )
}
