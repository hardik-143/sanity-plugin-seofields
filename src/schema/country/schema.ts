import type {SchemaTypeDefinition} from 'sanity'

import {nameField, polymorphicIdentifier, polymorphicImage} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgCountryConfig, SchemaOrgCountryData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const countryFields: SchemaFieldDef[] = [
  nameField({
    title: 'Country Name',
    description: 'The common English name of the country, e.g. "United States".',
    required: {key: 'nameRequired', message: 'Country name is required for Schema.org.'},
  }),
  {
    name: 'alternateName',
    title: 'Alternate Name',
    type: 'string',
    description: 'Alternate name (e.g. native name or abbreviation).',
  },
  polymorphicIdentifier({
    title: 'Country Code',
    description: 'ISO 3166-1 alpha-2 code, e.g. "US", "DE", "JP".',
  }),
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A short description.',
  },
  {
    name: 'url',
    title: 'URL',
    type: 'url',
    description: 'Canonical URL (e.g. Wikipedia page or official government site).',
  },
  // {
  //   name: 'image',
  //   title: 'Flag Image URL',
  //   type: 'url',
  //   description: 'URL to the country flag image.',
  // },
  polymorphicImage({
    title: 'Flag Image',
    description: 'An image representing the country, such as a flag.',
  }),
  {
    name: 'sameAs',
    title: 'Same As URL',
    type: 'url',
    description: 'URLs to authoritative pages (Wikidata, Wikipedia, GeoNames, etc.).',
    urlValidation: {schemes: ['http', 'https']},
  },
  {
    name: 'address',
    title: 'Address',
    type: 'object',
    description: 'Address — typically just the country code.',
    jsonLdType: 'PostalAddress',
    fields: [
      {
        name: 'addressCountry',
        title: 'Country Code',
        type: 'string',
        description: 'ISO country code, e.g. "US".',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgCountry(
  config: SchemaOrgCountryConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgCountry',
      title: 'Country',
      icon: SchemaOrgIcons.country,
      fields: countryFields,
      customPrepareSubtitle: (document: SchemaOrgCountryData) => {
        const name = document.name ?? 'Untitled country'
        return document.identifier ? `${name} · ${document.identifier}` : name
      },
    },
    config as SchemaOrgConfig,
  )
}
