import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {imageObjectFields} from './schema'
import type {SchemaOrgImageObjectData} from './types'

export interface ImageObjectSchemaProps {
  data?: SchemaOrgImageObjectData | null
}

export function buildImageObjectJsonLd(
  data?: SchemaOrgImageObjectData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'ImageObject',
    data as Record<string, unknown> | null | undefined,
    imageObjectFields,
    ['url'],
  )
}

export function ImageObjectSchema({data}: ImageObjectSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildImageObjectJsonLd(data)} />
}

export default ImageObjectSchema
