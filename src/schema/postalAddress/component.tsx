import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {postalAddressFields} from './schema'
import type {SchemaOrgPostalAddressData} from './types'

export interface PostalAddressSchemaProps {
  data?: SchemaOrgPostalAddressData | null
}

export function buildPostalAddressJsonLd(
  data?: SchemaOrgPostalAddressData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'PostalAddress',
    data as Record<string, unknown> | null | undefined,
    postalAddressFields,
    [],
  )
}

export function PostalAddressSchema({data}: PostalAddressSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildPostalAddressJsonLd(data)} />
}

export default PostalAddressSchema
