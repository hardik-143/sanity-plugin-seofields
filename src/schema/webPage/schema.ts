import type {SchemaTypeDefinition} from 'sanity'

import {
  descriptionField,
  inLanguageField,
  licenseUrlField,
  nameField,
  polymorphicPublisher,
  urlField,
} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgWebPageConfig, SchemaOrgWebPageData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const webPageFields: SchemaFieldDef[] = [
  nameField({
    title: 'Page Name',
    description: 'The title of the page.',
    required: {key: 'nameRequired', message: 'Page name is required for Schema.org.'},
  }),
  urlField({
    title: 'Page URL',
    description: 'The full URL of the page.',
    required: {key: 'urlRequired', message: 'Page URL is required for Schema.org.'},
  }),
  descriptionField({
    description: 'A short description of the page.',
  }),
  inLanguageField({description: 'The language of the page content, e.g. "en".'}),
  polymorphicPublisher({description: 'The organization or person that published this page.'}),
  licenseUrlField({
    description: 'The URL of the license for this page, if applicable.',
  }),
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
      title: 'WebPage',
      icon: SchemaOrgIcons.webPage,
      fields: webPageFields,
      customPrepareSubtitle: (document: SchemaOrgWebPageData) => {
        const name = document.name || 'Untitled page'
        const type = document.pageType ? ` · ${document.pageType}` : ''
        return `${name}${type}`
      },
    },
    config as SchemaOrgConfig,
  )
}
