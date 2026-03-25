import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgPostalAddressConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const postalAddressFields: SchemaFieldDef[] = [
  {
    name: 'streetAddress',
    title: 'Street Address',
    type: 'string',
    description: 'The street address, e.g. "123 Main St".',
  },
  {
    name: 'addressLocality',
    title: 'City / Locality',
    type: 'string',
    description: 'The city or locality, e.g. "New York".',
  },
  {
    name: 'postalCode',
    title: 'Postal Code',
    type: 'string',
    description: 'The postal or ZIP code, e.g. "10001".',
  },
  {
    name: 'addressCountry',
    title: 'Country',
    type: 'string',
    description: 'The country code, e.g. "US".',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgPostalAddress(
  config: SchemaOrgPostalAddressConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgPostalAddress',
      title: 'Schema.org — PostalAddress',
      icon: SchemaOrgIcons.postalAddress,
      fields: postalAddressFields,
    },
    config as SchemaOrgConfig,
  )
}
