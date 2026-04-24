import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgContactPointConfig, SchemaOrgContactPointData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const contactPointFields: SchemaFieldDef[] = [
  {
    name: 'contactType',
    title: 'Contact Type',
    type: 'string',
    description: 'The type of contact, e.g. "customer support", "sales".',
    required: {key: 'contactTypeRequired', message: 'Contact type is required for Schema.org.'},
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
    name: 'faxNumber',
    title: 'Fax Number',
    type: 'string',
    description: 'Contact fax number.',
  },
  {
    name: 'telephone',
    title: 'Telephone',
    type: 'string',
    description: 'Contact telephone number.',
  },
  {
    name: 'availableLanguage',
    title: 'Available Languages',
    type: 'array',
    of: [{type: 'string'}],
    description: 'Languages supported by this contact point, e.g. "English", "Spanish".',
    initialValue: ['English'],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgContactPoint(
  config: SchemaOrgContactPointConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgContactPoint',
      title: 'ContactPoint',
      icon: SchemaOrgIcons.contactPoint,
      fields: contactPointFields,
      customPrepareSubtitle: (document: SchemaOrgContactPointData) => {
        const type = document.contactType ?? 'contact'
        const handle = document.email ?? document.telephone
        return handle ? `${type} · ${handle}` : type
      },
    },
    config as SchemaOrgConfig,
  )
}
