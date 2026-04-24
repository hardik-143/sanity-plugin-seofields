import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {bookFields} from './schema'
import type {SchemaOrgBookData} from './types'

export interface BookSchemaProps {
  data?: SchemaOrgBookData | null
}

export function buildBookJsonLd(data?: SchemaOrgBookData | null): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Book',
    data as Record<string, unknown> | null | undefined,
    bookFields,
    ['name'],
  )
}

export function BookSchema({data}: BookSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildBookJsonLd(data)} />
}

export default BookSchema
