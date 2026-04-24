import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {itemListFields} from './schema'
import type {SchemaOrgItemListData} from './types'

export interface ItemListSchemaProps {
  data?: SchemaOrgItemListData | null
}

export function buildItemListJsonLd(
  data?: SchemaOrgItemListData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'ItemList',
    data as Record<string, unknown> | null | undefined,
    itemListFields,
    [],
  )
}

export function ItemListSchema({data}: ItemListSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildItemListJsonLd(data)} />
}

export default ItemListSchema
