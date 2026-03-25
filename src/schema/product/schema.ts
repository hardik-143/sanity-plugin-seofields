import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgProductConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const productFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Product Name',
    type: 'string',
    description: 'The name of the product.',
    required: {key: 'nameRequired', message: 'Product name is required for Schema.org.'},
  },
  {
    name: 'imageUrl',
    title: 'Image URL',
    type: 'url',
    description: 'URL to the product image.',
    jsonLdKey: 'image',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A short description of the product.',
  },
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
      title: 'Schema.org — Product',
      icon: SchemaOrgIcons.product,
      fields: productFields,
    },
    config as SchemaOrgConfig,
  )
}
