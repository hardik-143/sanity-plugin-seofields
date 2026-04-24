import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {restaurantFields} from './schema'
import type {SchemaOrgRestaurantData} from './types'

export interface RestaurantSchemaProps {
  data?: SchemaOrgRestaurantData | null
}

export function buildRestaurantJsonLd(
  data?: SchemaOrgRestaurantData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Restaurant',
    data as Record<string, unknown> | null | undefined,
    restaurantFields,
    ['name'],
  )
}

export function RestaurantSchema({data}: RestaurantSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildRestaurantJsonLd(data)} />
}

export default RestaurantSchema
