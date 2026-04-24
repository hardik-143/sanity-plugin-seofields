import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField, polymorphicImage} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgLegalServiceConfig, SchemaOrgLegalServiceData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const legalServiceFields: SchemaFieldDef[] = [
  nameField({
    title: 'Firm Name',
    description: 'The official name of the legal service / firm.',
    required: {key: 'nameRequired', message: 'Firm name is required for Schema.org.'},
  }),
  descriptionField({
    title: 'Description',
    description: 'A brief description of the legal service or firm.',
    required: {key: 'descriptionRequired', message: 'Description is required for Schema.org.'},
  }),
  polymorphicImage({
    title: 'Image',
    description: 'An image representing the legal service, such as a logo or office photo.',
  }),
  {
    name: 'telephone',
    title: 'Telephone',
    type: 'string',
    description: 'Primary contact telephone.',
  },
  {
    name: 'url',
    title: 'Website URL',
    type: 'url',
    description: 'The firm website URL.',
  },
  polymorphicImage({
    title: 'Logo',
    description: 'An image that represents the firm, such as a logo.',
  }),
  {
    name: 'priceRange',
    title: 'Price Range',
    type: 'string',
    description: 'Price range, e.g. "$$" or "$100-$500".',
  },
  {
    name: 'address',
    title: 'Address',
    type: 'object',
    description: 'Physical address of the firm.',
    jsonLdType: 'PostalAddress',
    fields: [
      {name: 'streetAddress', title: 'Street Address', type: 'string'},
      {name: 'addressLocality', title: 'Locality', type: 'string'},
      {name: 'addressRegion', title: 'Region / State', type: 'string'},
      {name: 'postalCode', title: 'Postal Code', type: 'string'},
      {
        name: 'addressCountry',
        title: 'Country',
        type: 'string',
        description: 'Country code, e.g. "US".',
      },
    ],
  },
  {
    name: 'geo',
    title: 'Geo Coordinates',
    type: 'object',
    description: 'Geographic coordinates.',
    jsonLdType: 'GeoCoordinates',
    fields: [
      {name: 'latitude', title: 'Latitude', type: 'string'},
      {name: 'longitude', title: 'Longitude', type: 'string'},
    ],
  },
  {
    name: 'hasMap',
    title: 'Map URL',
    type: 'url',
    description: 'URL to a map of the location.',
  },
  {
    name: 'knowsAbout',
    title: 'Areas of Expertise',
    type: 'array',
    of: [{type: 'string'}],
    description: 'Topics the firm specialises in (e.g. "Family Law", "IP Litigation").',
  },
  {
    name: 'knowsLanguage',
    title: 'Languages',
    type: 'array',
    of: [{type: 'string'}],
    description: 'Languages the firm operates in.',
  },
  {
    name: 'areaServed',
    title: 'Areas Served',
    type: 'array',
    of: [{type: 'string'}],
    description: 'Geographic areas where the firm offers services.',
  },
  {
    name: 'openingHoursSpecification',
    title: 'Opening Hours',
    type: 'array',
    description: 'Opening hours for each day.',
    jsonLdType: 'OpeningHoursSpecification',
    fields: [
      {
        name: 'dayOfWeek',
        title: 'Day of Week',
        type: 'string',
        options: [
          {title: 'Monday', value: 'Monday'},
          {title: 'Tuesday', value: 'Tuesday'},
          {title: 'Wednesday', value: 'Wednesday'},
          {title: 'Thursday', value: 'Thursday'},
          {title: 'Friday', value: 'Friday'},
          {title: 'Saturday', value: 'Saturday'},
          {title: 'Sunday', value: 'Sunday'},
        ],
      },
      {name: 'opens', title: 'Opens', type: 'string', description: 'e.g. "09:00".'},
      {name: 'closes', title: 'Closes', type: 'string', description: 'e.g. "17:00".'},
    ],
  },
  {
    name: 'sameAs',
    title: 'Same As URL',
    type: 'url',
    description: 'URLs to social media profiles, directory listings, etc.',
    urlValidation: {schemes: ['http', 'https']},
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgLegalService(
  config: SchemaOrgLegalServiceConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgLegalService',
      title: 'LegalService',
      icon: SchemaOrgIcons.legalService,
      fields: legalServiceFields,
      customPrepareSubtitle: (document: SchemaOrgLegalServiceData) => {
        const name = document.name ?? 'Untitled firm'
        const city = document.address?.addressLocality
        return city ? `${name} · ${city}` : name
      },
    },
    config as SchemaOrgConfig,
  )
}
