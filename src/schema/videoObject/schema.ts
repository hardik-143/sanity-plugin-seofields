import type {SchemaTypeDefinition} from 'sanity'

import {nameField, polymorphicPublisher} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgVideoObjectConfig, SchemaOrgVideoObjectData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const videoObjectFields: SchemaFieldDef[] = [
  nameField({
    title: 'Video Name',
    description: 'The name of the video.',
    required: {key: 'nameRequired', message: 'Video name is required for Schema.org.'},
  }),
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
    required: {key: 'thumbnailUrlRequired', message: 'Thumbnail URL is required for Schema.org.'},
    urlValidation: {schemes: ['http', 'https']},
  },
  {
    name: 'uploadDate',
    title: 'Upload Date',
    type: 'date',
    description: 'The date the video was uploaded.',
    required: {key: 'uploadDateRequired', message: 'Upload date is required for Schema.org.'},
  },
  {
    name: 'contentUrl',
    title: 'Content URL',
    type: 'url',
    description: 'URL to the actual video file.',
    urlValidation: {schemes: ['http', 'https']},
  },
  {
    name: 'duration',
    title: 'Duration',
    type: 'string',
    description: 'Video duration in ISO 8601 format, e.g. "PT1H30M" for 1 hour 30 minutes.',
  },
  polymorphicPublisher({description: 'The organization or person that published the video.'}),
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgVideoObject(
  config: SchemaOrgVideoObjectConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgVideoObject',
      title: 'VideoObject',
      icon: SchemaOrgIcons.videoObject,
      fields: videoObjectFields,
      customPrepareSubtitle: (document: SchemaOrgVideoObjectData) => {
        const name = document.name || 'Untitled video'
        const duration = document.duration ? ` · ${document.duration}` : ''
        return `${name}${duration}`
      },
    },
    config as SchemaOrgConfig,
  )
}
