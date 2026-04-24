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
import type {SchemaOrgMusicAlbumConfig, SchemaOrgMusicAlbumData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const musicAlbumFields: SchemaFieldDef[] = [
  nameField({
    title: 'Album Name',
    description: 'The name of the album.',
    required: {key: 'nameRequired', message: 'Album name is required.'},
  }),
  descriptionField({
    title: 'Album Description',
    description: 'A description of the album.',
    required: {
      key: 'descriptionRequired',
      message: 'Album description is required.',
    },
  }),
  polymorphicImage({description: 'Album cover art.'}),
  polymorphicAuthor({
    name: 'byArtist',
    title: 'By Artist',
    description: 'The artist who created this album.',
  }),
  {
    name: 'numTracks',
    title: 'Number of Tracks',
    type: 'number',
    description: 'Total number of tracks.',
  },
  {
    name: 'albumProductionType',
    title: 'Album Production Type',
    type: 'string',
    description: 'How the album was produced.',
    options: [
      {title: 'Studio Album', value: 'https://schema.org/StudioAlbum'},
      {title: 'Live Album', value: 'https://schema.org/LiveAlbum'},
      {title: 'Compilation Album', value: 'https://schema.org/CompilationAlbum'},
      {title: 'DJ Mix Album', value: 'https://schema.org/DJMixAlbum'},
      {title: 'Demo Album', value: 'https://schema.org/DemoAlbum'},
      {title: 'Mixtape Album', value: 'https://schema.org/MixtapeAlbum'},
      {title: 'Remix Album', value: 'https://schema.org/RemixAlbum'},
      {title: 'Soundtrack Album', value: 'https://schema.org/SoundtrackAlbum'},
      {title: 'Spoken Word Album', value: 'https://schema.org/SpokenWordAlbum'},
    ],
  },
  datePublishedField({description: 'Release date of the album.'}),
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgMusicAlbum(
  config: SchemaOrgMusicAlbumConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgMusicAlbum',
      title: 'MusicAlbum',
      icon: SchemaOrgIcons.musicAlbum,
      fields: musicAlbumFields,
      customPrepareSubtitle: (document: SchemaOrgMusicAlbumData) => {
        const name = document.name || 'Untitled'
        const tracks = document.numTracks ? ` · ${document.numTracks} tracks` : ''
        return `${name}${tracks}`
      },
    },
    config as SchemaOrgConfig,
  )
}
