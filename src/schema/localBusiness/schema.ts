import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgLocalBusinessConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const localBusinessFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Business Name',
    type: 'string',
    description: 'The official name of the business.',
    required: {key: 'nameRequired', message: 'Business name is required for Schema.org.'},
  },
  {
    name: 'image',
    title: 'Image URL',
    type: 'url',
    description: 'URL to the business image.',
  },
  {
    name: 'telephone',
    title: 'Telephone',
    type: 'string',
    description: 'The telephone number of the business.',
  },
  {
    name: 'address',
    title: 'Address',
    type: 'object',
    description: 'The physical address of the business.',
    jsonLdType: 'PostalAddress',
    fields: [
      {
        name: 'streetAddress',
        title: 'Street Address',
        type: 'string',
      },
      {
        name: 'addressLocality',
        title: 'Locality',
        type: 'string',
        description: 'City or town.',
      },
      {
        name: 'addressCountry',
        title: 'Country',
        type: 'string',
        description: 'Country code, e.g. "US".',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgLocalBusiness(
  config: SchemaOrgLocalBusinessConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgLocalBusiness',
      title: 'Schema.org — LocalBusiness',
      icon: SchemaOrgIcons.localBusiness,
      fields: localBusinessFields,
    },
    config as SchemaOrgConfig,
  )
}
