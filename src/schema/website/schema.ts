import type {SchemaTypeDefinition} from 'sanity'

import {
  descriptionField,
  inLanguageField,
  issnField,
  nameField,
  polymorphicPublisher,
  potentialActionSearch,
  urlField,
  // withCreativeWorkCommons,
} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgWebsiteConfig, SchemaOrgWebsiteData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const websiteFields: SchemaFieldDef[] = [
  nameField({
    title: 'Website Name',
    description: 'The name of the website.',
    required: {key: 'nameRequired', message: 'Website name is required for Schema.org.'},
  }),
  urlField({
    title: 'Website URL',
    description: 'The full URL of the website, e.g. "https://www.example.com".',
    required: {key: 'urlRequired', message: 'Website URL is required for Schema.org.'},
  }),
  descriptionField({
    description: 'A short description of the website.',
  }),
  inLanguageField({description: 'The language of the website content, e.g. "en".'}),
  polymorphicPublisher({description: 'The organization or person that publishes this website.'}),
  potentialActionSearch({
    description: 'Enables the sitelinks search box in Google. Configure the search URL template.',
  }),
  issnField({
    description: 'The ISSN (International Standard Serial Number) of the website, if applicable.',
  }),
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
      title: 'Website',
      icon: SchemaOrgIcons.website,
      fields: websiteFields,
      customPrepareSubtitle: (document: SchemaOrgWebsiteData) => {
        const name = document.name ? `${document.name}` : 'Untitled website'
        const url = document.url ? ` · ${document.url}` : ''
        return `${name}${url}`
      },
    },
    config as SchemaOrgConfig,
  )
}
