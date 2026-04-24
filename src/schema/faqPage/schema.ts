import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgFAQPageConfig, SchemaOrgFAQPageData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const faqPageFields: SchemaFieldDef[] = [
  {
    name: 'mainEntity',
    title: 'FAQ Items',
    type: 'array',
    jsonLdType: 'Question',
    fields: [
      {
        name: 'name',
        title: 'Question',
        type: 'string',
        required: {key: 'questionRequired', message: 'Question text is required.'},
      },
      {
        name: 'acceptedAnswer',
        title: 'Accepted Answer',
        type: 'object',
        jsonLdType: 'Answer',
        fields: [
          {
            name: 'text',
            title: 'Answer Text',
            type: 'text',
            rows: 3,
          },
        ],
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org FAQPage — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgFAQPage } from 'sanity-plugin-seofields/schema/faqPage'
 *
 * schemaOrgFAQPage()
 * ```
 */
export default function schemaOrgFAQPage(
  config: SchemaOrgFAQPageConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgFAQPage',
      title: 'FAQPage',
      icon: SchemaOrgIcons.faqPage,
      fields: faqPageFields,
      customPrepareSubtitle: (document: SchemaOrgFAQPageData) => {
        const items = document.mainEntity ?? []
        if (!items.length) return 'No FAQ items'
        return `${items.length} question${items.length === 1 ? '' : 's'}`
      },
    },
    config as SchemaOrgConfig,
  )
}
