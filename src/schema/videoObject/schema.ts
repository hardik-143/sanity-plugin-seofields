import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgVideoObjectConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const videoObjectFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Video Name',
    type: 'string',
    description: 'The name of the video.',
    required: {key: 'nameRequired', message: 'Video name is required for Schema.org.'},
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A description of the video.',
  },
  {
    name: 'thumbnailUrl',
    title: 'Thumbnail URL',
    type: 'url',
    description: 'URL of the video thumbnail image.',
  },
  {
    name: 'uploadDate',
    title: 'Upload Date',
    type: 'date',
    description: 'The date the video was uploaded.',
  },
  {
    name: 'contentUrl',
    title: 'Content URL',
    type: 'url',
    description: 'URL to the actual video file.',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgVideoObject(
  config: SchemaOrgVideoObjectConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgVideoObject',
      title: 'Schema.org — VideoObject',
      icon: SchemaOrgIcons.videoObject,
      fields: videoObjectFields,
    },
    config as SchemaOrgConfig,
  )
}
