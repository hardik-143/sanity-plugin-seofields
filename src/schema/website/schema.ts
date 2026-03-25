import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgWebsiteConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const websiteFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Website Name',
    type: 'string',
    description: 'The name of the website.',
    required: {key: 'nameRequired', message: 'Website name is required for Schema.org.'},
  },
  {
    name: 'url',
    title: 'Website URL',
    type: 'url',
    description: 'The full URL of the website, e.g. "https://www.example.com".',
    required: {key: 'urlRequired', message: 'Website URL is required for Schema.org.'},
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A short description of the website.',
  },
  {
    name: 'inLanguage',
    title: 'Language',
    type: 'string',
    description: 'The language of the website content, e.g. "en".',
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
    name: 'publisher',
    title: 'Publisher',
    type: 'object',
    description: 'The organization that publishes this website.',
    fields: [
      {
        name: 'name',
        title: 'Publisher Name',
        type: 'string',
        description: 'Name of the publishing organization.',
      },
      {
        name: 'url',
        title: 'Publisher URL',
        type: 'url',
        description: 'URL of the publishing organization.',
      },
      {
        name: 'logoUrl',
        title: 'Publisher Logo URL',
        type: 'url',
        description: 'URL to the publisher logo image.',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org WebSite — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgWebsite } from 'sanity-plugin-seofields/schema/website'
 *
 * // Default
 * schemaOrgWebsite()
 *
 * // Custom validation messages
 * schemaOrgWebsite({
 *   validation: { nameRequired: 'Please enter a website name.' },
 * })
 * ```
 */
export default function schemaOrgWebsite(
  config: SchemaOrgWebsiteConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgWebsite',
      title: 'Schema.org — Website',
      icon: SchemaOrgIcons.website,
      fields: websiteFields,
    },
    config as SchemaOrgConfig,
  )
}
