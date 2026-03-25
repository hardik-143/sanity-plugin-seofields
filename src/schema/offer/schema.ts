import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgOfferConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const offerFields: SchemaFieldDef[] = [
  {
    name: 'price',
    title: 'Price',
    type: 'string',
    description: 'The price of the offer, e.g. "199.99".',
    required: {key: 'priceRequired', message: 'Price is required for Schema.org.'},
  },
  {
    name: 'priceCurrency',
    title: 'Currency',
    type: 'string',
    description: 'The currency of the price, e.g. "USD".',
    initialValue: 'USD',
    options: [
      {title: 'USD', value: 'USD'},
      {title: 'EUR', value: 'EUR'},
      {title: 'GBP', value: 'GBP'},
      {title: 'INR', value: 'INR'},
      {title: 'JPY', value: 'JPY'},
      {title: 'CAD', value: 'CAD'},
      {title: 'AUD', value: 'AUD'},
    ],
  },
  {
    name: 'availability',
    title: 'Availability',
    type: 'url',
    description: 'Schema.org availability URL, e.g. "https://schema.org/InStock".',
  },
  {
    name: 'url',
    title: 'Offer URL',
    type: 'url',
    description: 'URL of the offer page.',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgOffer(config: SchemaOrgOfferConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgOffer',
      title: 'Schema.org — Offer',
      icon: SchemaOrgIcons.offer,
      fields: offerFields,
    },
    config as SchemaOrgConfig,
  )
}
