import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField, polymorphicImage} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgRestaurantConfig, SchemaOrgRestaurantData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const restaurantFields: SchemaFieldDef[] = [
  nameField({
    title: 'Restaurant Name',
    description: 'The name of the restaurant.',
    required: {key: 'nameRequired', message: 'Restaurant name is required.'},
  }),
  descriptionField({
    title: 'Description',
    description: 'A description of the restaurant.',
  }),
  polymorphicImage({description: 'Photo of the restaurant.'}),
  {
    name: 'servesCuisine',
    title: 'Serves Cuisine',
    type: 'string',
    description: 'The cuisine of the restaurant, e.g. "Italian", "Japanese".',
  },
  {
    name: 'priceRange',
    title: 'Price Range',
    type: 'string',
    description: 'e.g. "$", "$$", "$$$", "$$$$".',
  },
  {name: 'telephone', title: 'Telephone', type: 'string'},
  {
    name: 'address',
    title: 'Address',
    type: 'object',
    jsonLdType: 'PostalAddress',
    fields: [
      {name: 'streetAddress', title: 'Street Address', type: 'string'},
      {name: 'addressLocality', title: 'City', type: 'string'},
      {name: 'addressRegion', title: 'State/Region', type: 'string'},
      {name: 'postalCode', title: 'Postal Code', type: 'string'},
      {name: 'addressCountry', title: 'Country', type: 'string'},
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgRestaurant(
  config: SchemaOrgRestaurantConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgRestaurant',
      title: 'Restaurant',
      icon: SchemaOrgIcons.restaurant,
      fields: restaurantFields,
      customPrepareSubtitle: (document: SchemaOrgRestaurantData) => {
        const name = document.name || 'Untitled'
        const cuisine = document.servesCuisine ? ` · ${document.servesCuisine}` : ''
        const price = document.priceRange ? ` ${document.priceRange}` : ''
        return `${name}${cuisine}${price}`
      },
    },
    config as SchemaOrgConfig,
  )
}
