import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {offerFields} from './schema'
import type {SchemaOrgOfferData} from './types'

export interface OfferSchemaProps {
  data?: SchemaOrgOfferData | null
}

export function buildOfferJsonLd(data?: SchemaOrgOfferData | null): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Offer',
    data as Record<string, unknown> | null | undefined,
    offerFields,
    ['price'],
  )
}

export function OfferSchema({data}: OfferSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildOfferJsonLd(data)} />
}

export default OfferSchema
