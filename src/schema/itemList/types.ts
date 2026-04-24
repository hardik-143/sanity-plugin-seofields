import type {SchemaOrgThingData} from '../_types'

/** Schema.org ItemList — data shape from GROQ query */
export interface SchemaOrgItemListData extends SchemaOrgThingData {
  _type?: 'schemaOrgItemList'
  itemListOrder?: string
  numberOfItems?: number
  itemListElement?: Array<{
    name?: string
    url?: string
    position?: number
    image?: string
    description?: string
  }>
}

/** Configuration for `schemaOrgItemList()` */
export interface SchemaOrgItemListConfig {
  validation?: Record<string, string>
}
