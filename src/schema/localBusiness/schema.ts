import type {SchemaTypeDefinition} from 'sanity'

import {nameField, polymorphicImage} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgLocalBusinessConfig, SchemaOrgLocalBusinessData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const localBusinessFields: SchemaFieldDef[] = [
  nameField({
    title: 'Business Name',
    description: 'The official name of the business.',
    required: {key: 'nameRequired', message: 'Business name is required for Schema.org.'},
  }),
  polymorphicImage({
    description: 'An image of the business, such as a storefront or logo.',
    title: 'Business Image',
  }),
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
  {
    name: 'url',
    title: 'Website URL',
    type: 'url',
    description: 'The website URL of the business.',
  },
  polymorphicImage({
    title: 'Logo',
    description: 'An image that represents the business, such as a logo.',
  }),
  {
    name: 'priceRange',
    title: 'Price Range',
    type: 'string',
    description: 'The price range of the business, e.g. "$$" or "$10-$50".',
  },
  {
    name: 'geo',
    title: 'Geo Coordinates',
    type: 'object',
    description: 'Geographic coordinates of the business.',
    jsonLdType: 'GeoCoordinates',
    fields: [
      {
        name: 'latitude',
        title: 'Latitude',
        type: 'string',
        description: 'e.g. "40.7128".',
      },
      {
        name: 'longitude',
        title: 'Longitude',
        type: 'string',
        description: 'e.g. "-74.0060".',
      },
    ],
  },
  {
    name: 'hasMap',
    title: 'Map URL',
    type: 'url',
    description: 'URL to a map of the business location (e.g. Google Maps link).',
  },
  {
    name: 'openingHoursSpecification',
    title: 'Opening Hours',
    type: 'array',
    description: 'Business opening hours for each day.',
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
      {
        name: 'opens',
        title: 'Opens',
        type: 'string',
        description: 'Opening time, e.g. "09:00".',
      },
      {
        name: 'closes',
        title: 'Closes',
        type: 'string',
        description: 'Closing time, e.g. "17:00".',
      },
    ],
  },
  {
    name: 'sameAs',
    title: 'Same As URL',
    type: 'url',
    description: 'URLs of social media profiles (Facebook, Instagram, Yelp, etc.).',
    urlValidation: {schemes: ['http', 'https']},
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgLocalBusiness(
  config: SchemaOrgLocalBusinessConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgLocalBusiness',
      title: 'LocalBusiness',
      icon: SchemaOrgIcons.localBusiness,
      fields: localBusinessFields,
      customPrepareSubtitle: (document: SchemaOrgLocalBusinessData) => {
        const name = document.name ?? 'Untitled business'
        const city = document.address?.addressLocality
        return city ? `${name} · ${city}` : name
      },
    },
    config as SchemaOrgConfig,
  )
}
