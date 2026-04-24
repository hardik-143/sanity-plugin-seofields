import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgImageObjectConfig, SchemaOrgImageObjectData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const imageObjectFields: SchemaFieldDef[] = [
  {
    name: 'url',
    title: 'Image URL',
    type: 'url',
    description: 'The URL of the image.',
    required: {key: 'urlRequired', message: 'Image URL is required for Schema.org ImageObject.'},
    urlValidation: {schemes: ['http', 'https']},
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
    description: 'A caption for the image.',
  },
  nameField({
    title: 'Image Name',
    description: 'A descriptive name for the image.',
  }),
  descriptionField({
    title: 'Image Description',
    description: 'A description of the image.',
  }),
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgImageObject(
  config: SchemaOrgImageObjectConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgImageObject',
      title: 'ImageObject',
      icon: SchemaOrgIcons.imageObject,
      fields: imageObjectFields,
      customPrepareSubtitle: (document: SchemaOrgImageObjectData) => {
        const name = document.name || document.url || 'No URL'
        const dims =
          document.width && document.height ? ` · ${document.width}×${document.height}` : ''
        return `${name}${dims}`
      },
    },
    config as SchemaOrgConfig,
  )
}
