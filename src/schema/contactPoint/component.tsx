import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {contactPointFields} from './schema'
import type {SchemaOrgContactPointData} from './types'

export interface ContactPointSchemaProps {
  data?: SchemaOrgContactPointData | null
}

export function buildContactPointJsonLd(
  data?: SchemaOrgContactPointData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'ContactPoint',
    data as Record<string, unknown> | null | undefined,
    contactPointFields,
    ['contactType'],
  )
}

export function ContactPointSchema({data}: ContactPointSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildContactPointJsonLd(data)} />
}

export default ContactPointSchema
