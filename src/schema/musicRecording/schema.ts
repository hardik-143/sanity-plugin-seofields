import type {SchemaTypeDefinition} from 'sanity'

import {
  datePublishedField,
  descriptionField,
  nameField,
  polymorphicAuthor,
  polymorphicImage,
} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgMusicRecordingConfig, SchemaOrgMusicRecordingData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const musicRecordingFields: SchemaFieldDef[] = [
  nameField({
    title: 'Track Name',
    description: 'The name of the music recording.',
    required: {key: 'nameRequired', message: 'Track name is required.'},
  }),
  descriptionField({
    title: 'Track Description',
    description: 'A description of the music recording.',
  }),
  polymorphicImage({description: 'Cover art or image for the recording.'}),
  polymorphicAuthor({
    name: 'byArtist',
    title: 'By Artist',
    description: 'The artist who performed this track.',
  }),
  {
    name: 'duration',
    title: 'Duration',
    type: 'string',
    description: 'ISO 8601 duration, e.g. "PT3M45S" for 3m 45s.',
  },
  {
    name: 'inAlbum',
    title: 'In Album',
    type: 'string',
    description: 'The album this recording appears in.',
  },
  datePublishedField({description: 'Release date of this recording.'}),
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgMusicRecording(
  config: SchemaOrgMusicRecordingConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgMusicRecording',
      title: 'MusicRecording',
      icon: SchemaOrgIcons.musicRecording,
      fields: musicRecordingFields,
      customPrepareSubtitle: (document: SchemaOrgMusicRecordingData) => {
        const name = document.name || 'Untitled'
        const album = document.inAlbum ? ` · ${document.inAlbum}` : ''
        return `${name}${album}`
      },
    },
    config as SchemaOrgConfig,
  )
}
