import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {videoObjectFields} from './schema'
import type {SchemaOrgVideoObjectData} from './types'

export interface VideoObjectSchemaProps {
  data?: SchemaOrgVideoObjectData | null
}

export function buildVideoObjectJsonLd(
  data?: SchemaOrgVideoObjectData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'VideoObject',
    data as Record<string, unknown> | null | undefined,
    videoObjectFields,
    ['name'],
  )
}

export function VideoObjectSchema({data}: VideoObjectSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildVideoObjectJsonLd(data)} />
}

export default VideoObjectSchema
