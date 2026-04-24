import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {musicRecordingFields} from './schema'
import type {SchemaOrgMusicRecordingData} from './types'

export interface MusicRecordingSchemaProps {
  data?: SchemaOrgMusicRecordingData | null
}

export function buildMusicRecordingJsonLd(
  data?: SchemaOrgMusicRecordingData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'MusicRecording',
    data as Record<string, unknown> | null | undefined,
    musicRecordingFields,
    ['name'],
  )
}

export function MusicRecordingSchema({data}: MusicRecordingSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildMusicRecordingJsonLd(data)} />
}

export default MusicRecordingSchema
