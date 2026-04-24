import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField, polymorphicImage} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgProductConfig, SchemaOrgProductData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const productFields: SchemaFieldDef[] = [
  nameField({
    title: 'Product Name',
    description: 'The name of the product.',
    required: {key: 'nameRequired', message: 'Product name is required for Schema.org.'},
  }),
  polymorphicImage({
    name: 'image',
    title: 'Image',
    description: 'Product image — choose URL or full ImageObject.',
  }),
  descriptionField({
    title: 'Description',
    description: 'A description of the product.',
  }),
  {
    name: 'brand',
    title: 'Brand',
    type: 'object',
    description: 'The brand of the product.',
    jsonLdType: 'Brand',
    fields: [
      {
        name: 'name',
        title: 'Brand Name',
        type: 'string',
        description: 'Name of the brand.',
      },
    ],
  },
  {
    name: 'sku',
    title: 'SKU',
    type: 'string',
    description: 'Stock Keeping Unit — a unique identifier for the product.',
  },
  {
    name: 'gtin',
    title: 'GTIN',
    type: 'string',
    description: 'Global Trade Item Number (covers GTIN-8, GTIN-13, GTIN-14).',
  },
  {
    name: 'mpn',
    title: 'MPN',
    type: 'string',
    description: 'Manufacturer Part Number.',
  },
  {
    name: 'offers',
    title: 'Offers',
    type: 'object',
    description: 'Pricing and availability information.',
    jsonLdType: 'Offer',
    fields: [
      {
        name: 'price',
        title: 'Price',
        type: 'string',
        description: 'The price of the product, e.g. "29.99".',
      },
      {
        name: 'priceCurrency',
        title: 'Currency',
        type: 'string',
        description: 'ISO 4217 currency code, e.g. "USD".',
        initialValue: 'USD',
      },
      {
        name: 'availability',
        title: 'Availability',
        type: 'string',
        description: 'Product availability status.',
        options: [
          {title: 'In Stock', value: 'https://schema.org/InStock'},
          {title: 'Out of Stock', value: 'https://schema.org/OutOfStock'},
          {title: 'Pre-Order', value: 'https://schema.org/PreOrder'},
          {title: 'Back Order', value: 'https://schema.org/BackOrder'},
          {title: 'Discontinued', value: 'https://schema.org/Discontinued'},
        ],
      },
      {
        name: 'url',
        title: 'Offer URL',
        type: 'url',
        description: 'URL of the product offer page.',
      },
      {
        name: 'itemCondition',
        title: 'Item Condition',
        type: 'string',
        description: 'The condition of the product.',
        options: [
          {title: 'New', value: 'https://schema.org/NewCondition'},
          {title: 'Used', value: 'https://schema.org/UsedCondition'},
          {title: 'Refurbished', value: 'https://schema.org/RefurbishedCondition'},
        ],
      },
    ],
  },
  {
    name: 'aggregateRating',
    title: 'Aggregate Rating',
    type: 'object',
    description: 'Overall rating based on a collection of reviews.',
    jsonLdType: 'AggregateRating',
    fields: [
      {
        name: 'ratingValue',
        title: 'Rating Value',
        type: 'string',
        description: 'The average rating, e.g. "4.5".',
      },
      {
        name: 'reviewCount',
        title: 'Review Count',
        type: 'string',
        description: 'Total number of reviews.',
      },
      {
        name: 'bestRating',
        title: 'Best Rating',
        type: 'string',
        description: 'The highest possible rating, e.g. "5".',
        initialValue: '5',
      },
    ],
  },
  {
    name: 'review',
    title: 'Reviews',
    type: 'array',
    description: 'Product reviews.',
    jsonLdType: 'Review',
    fields: [
      {
        name: 'author',
        title: 'Reviewer Name',
        type: 'string',
        jsonLdKey: 'author',
      },
      {
        name: 'reviewRating',
        title: 'Rating',
        type: 'string',
        description: 'Rating value, e.g. "5".',
      },
      {
        name: 'reviewBody',
        title: 'Review Text',
        type: 'text',
        rows: 2,
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org Product — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgProduct } from 'sanity-plugin-seofields/schema/product'
 *
 * // Default
 * schemaOrgProduct()
 *
 * // Custom validation messages
 * schemaOrgProduct({
 *   validation: { nameRequired: 'Please enter the product name.' },
 * })
 * ```
 */
export default function schemaOrgProduct(
  config: SchemaOrgProductConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgProduct',
      title: 'Product',
      icon: SchemaOrgIcons.product,
      fields: productFields,
      customPrepareSubtitle: (document: SchemaOrgProductData) => {
        const name = document.name || 'Untitled product'
        const brand = document.brand?.name ? ` · ${document.brand.name}` : ''
        const price =
          document.offers?.price && document.offers?.priceCurrency
            ? ` · ${document.offers.priceCurrency} ${document.offers.price}`
            : ''
        return `${name}${brand}${price}`
      },
    },
    config as SchemaOrgConfig,
  )
}
