import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {brandFields} from './schema'
import type {SchemaOrgBrandData} from './types'

export interface BrandSchemaProps {
  data?: SchemaOrgBrandData | null
}

export function buildBrandJsonLd(data?: SchemaOrgBrandData | null): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Brand',
    data as Record<string, unknown> | null | undefined,
    brandFields,
    ['name'],
  )
}

export function BrandSchema({data}: BrandSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildBrandJsonLd(data)} />
}

export default BrandSchema
