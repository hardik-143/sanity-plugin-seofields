import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgImageObjectConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const imageObjectFields: SchemaFieldDef[] = [
  {
    name: 'url',
    title: 'Image URL',
    type: 'url',
    description: 'The URL of the image.',
    required: {key: 'urlRequired', message: 'Image URL is required for Schema.org.'},
  },
  {
    name: 'width',
    title: 'Width',
    type: 'number',
    description: 'Image width in pixels.',
  },
  {
    name: 'height',
    title: 'Height',
    type: 'number',
    description: 'Image height in pixels.',
  },
  {
    name: 'caption',
    title: 'Caption',
    type: 'string',
    description: 'Caption or alt text for the image.',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgImageObject(
  config: SchemaOrgImageObjectConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgImageObject',
      title: 'Schema.org — ImageObject',
      icon: SchemaOrgIcons.imageObject,
      fields: imageObjectFields,
    },
    config as SchemaOrgConfig,
  )
}
