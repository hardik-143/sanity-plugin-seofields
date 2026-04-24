import type {SchemaTypeDefinition} from 'sanity'

import {nameField, polymorphicImage} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgBrandConfig, SchemaOrgBrandData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const brandFields: SchemaFieldDef[] = [
  nameField({
    title: 'Brand Name',
    description: 'The name of the brand.',
    required: {key: 'nameRequired', message: 'Brand name is required for Schema.org.'},
  }),
  {
    name: 'slogan',
    title: 'Slogan',
    type: 'string',
    description: 'A slogan or tagline for the brand.',
  },
  polymorphicImage({
    description: 'An image that represents the brand, such as a logo.',
    title: 'Logo',
  }),
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgBrand(config: SchemaOrgBrandConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgBrand',
      title: 'Brand',
      icon: SchemaOrgIcons.brand,
      fields: brandFields,
      customPrepareSubtitle: (document: SchemaOrgBrandData) =>
        document.name ? `Brand · ${document.name}` : 'Untitled brand',
    },
    config as SchemaOrgConfig,
  )
}
