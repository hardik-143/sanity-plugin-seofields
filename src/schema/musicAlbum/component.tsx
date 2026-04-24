import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {musicAlbumFields} from './schema'
import type {SchemaOrgMusicAlbumData} from './types'

export interface MusicAlbumSchemaProps {
  data?: SchemaOrgMusicAlbumData | null
}

export function buildMusicAlbumJsonLd(
  data?: SchemaOrgMusicAlbumData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'MusicAlbum',
    data as Record<string, unknown> | null | undefined,
    musicAlbumFields,
    ['name'],
  )
}

export function MusicAlbumSchema({data}: MusicAlbumSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildMusicAlbumJsonLd(data)} />
}

export default MusicAlbumSchema
