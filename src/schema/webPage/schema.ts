import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgWebPageConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const webPageFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Page Name',
    type: 'string',
    description: 'The title of the page.',
    required: {key: 'nameRequired', message: 'Page name is required for Schema.org.'},
  },
  {
    name: 'url',
    title: 'Page URL',
    type: 'url',
    description: 'The full URL of the page.',
    required: {key: 'urlRequired', message: 'Page URL is required for Schema.org.'},
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A short description of the page.',
  },
  {
    name: 'inLanguage',
    title: 'Language',
    type: 'string',
    description: 'The language of the page content, e.g. "en".',
    initialValue: 'en',
    options: [
      {title: 'English', value: 'en'},
      {title: 'Spanish', value: 'es'},
      {title: 'French', value: 'fr'},
      {title: 'German', value: 'de'},
      {title: 'Portuguese', value: 'pt'},
      {title: 'Italian', value: 'it'},
      {title: 'Dutch', value: 'nl'},
      {title: 'Japanese', value: 'ja'},
      {title: 'Chinese', value: 'zh'},
      {title: 'Korean', value: 'ko'},
      {title: 'Hindi', value: 'hi'},
      {title: 'Arabic', value: 'ar'},
    ],
  },
  {
    name: 'isPartOf',
    title: 'Part Of (Website)',
    type: 'object',
    description: 'The website this page belongs to.',
    jsonLdType: 'WebSite',
    fields: [
      {
        name: 'url',
        title: 'Website URL',
        type: 'url',
        description: 'URL of the parent website.',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org WebPage — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgWebPage } from 'sanity-plugin-seofields/schema/webPage'
 *
 * // Default
 * schemaOrgWebPage()
 *
 * // Custom validation messages
 * schemaOrgWebPage({
 *   validation: { nameRequired: 'Please enter a page name.' },
 * })
 * ```
 */
export default function schemaOrgWebPage(
  config: SchemaOrgWebPageConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgWebPage',
      title: 'Schema.org — WebPage',
      icon: SchemaOrgIcons.webPage,
      fields: webPageFields,
    },
    config as SchemaOrgConfig,
  )
}
