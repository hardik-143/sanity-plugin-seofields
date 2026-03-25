import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgBrandConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const brandFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Brand Name',
    type: 'string',
    description: 'The name of the brand.',
    required: {key: 'nameRequired', message: 'Brand name is required for Schema.org.'},
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgBrand(config: SchemaOrgBrandConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgBrand',
      title: 'Schema.org — Brand',
      icon: SchemaOrgIcons.brand,
      fields: brandFields,
    },
    config as SchemaOrgConfig,
  )
}
