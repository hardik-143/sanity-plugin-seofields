import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {serviceFields} from './schema'
import type {SchemaOrgServiceData} from './types'

export interface ServiceSchemaProps {
  data?: SchemaOrgServiceData | null
}

export function buildServiceJsonLd(
  data?: SchemaOrgServiceData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Service',
    data as Record<string, unknown> | null | undefined,
    serviceFields,
    ['name'],
  )
}

export function ServiceSchema({data}: ServiceSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildServiceJsonLd(data)} />
}

export default ServiceSchema
