import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgOrganizationConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const organizationFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Organization Name',
    type: 'string',
    description: 'The official name of the organization.',
    required: {key: 'nameRequired', message: 'Organization name is required for Schema.org.'},
  },
  {
    name: 'url',
    title: 'Organization URL',
    type: 'url',
    description: 'The full URL of the organization website.',
    required: {key: 'urlRequired', message: 'Organization URL is required for Schema.org.'},
  },
  {
    name: 'logoUrl',
    title: 'Logo URL',
    type: 'url',
    description:
      'Direct URL to the organization logo image. Used in search results and knowledge panels.',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A short description of the organization.',
  },
  {
    name: 'sameAs',
    title: 'Social / External Profiles',
    type: 'array',
    of: [{type: 'url'}],
    description:
      'URLs of social media profiles and other authoritative pages (Twitter, LinkedIn, GitHub, etc.).',
  },
  {
    name: 'contactPoint',
    title: 'Contact Point',
    type: 'object',
    description: 'Primary contact information for the organization.',
    fields: [
      {
        name: 'contactType',
        title: 'Contact Type',
        type: 'string',
        description: 'e.g. "customer support", "sales", "technical support".',
        initialValue: 'customer support',
        options: [
          {title: 'Customer Support', value: 'customer support'},
          {title: 'Sales', value: 'sales'},
          {title: 'Technical Support', value: 'technical support'},
          {title: 'Billing', value: 'billing'},
          {title: 'General Inquiry', value: 'general inquiry'},
        ],
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string',
        description: 'Contact email address.',
      },
      {
        name: 'availableLanguage',
        title: 'Available Languages',
        type: 'array',
        of: [{type: 'string'}],
        description: 'Languages supported by this contact point, e.g. "English", "Spanish".',
        initialValue: ['English'],
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org Organization — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgOrganization } from 'sanity-plugin-seofields/schema/organization'
 *
 * // Default
 * schemaOrgOrganization()
 *
 * // Custom validation messages
 * schemaOrgOrganization({
 *   validation: { nameRequired: 'Company name is required.' },
 * })
 * ```
 */
export default function schemaOrgOrganization(
  config: SchemaOrgOrganizationConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgOrganization',
      title: 'Schema.org — Organization',
      icon: SchemaOrgIcons.organization,
      fields: organizationFields,
    },
    config as SchemaOrgConfig,
  )
}
