import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgItemListConfig, SchemaOrgItemListData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const itemListFields: SchemaFieldDef[] = [
  nameField({
    title: 'List Name',
    description: 'The name of the list.',
    required: {key: 'nameRequired', message: 'List name is required for Schema.org.'},
  }),
  descriptionField({
    title: 'List Description',
    description: 'A description of the list.',
    required: {key: 'descriptionRequired', message: 'List description is required for Schema.org.'},
  }),
  {
    name: 'itemListOrder',
    title: 'Item List Order',
    type: 'string',
    description: 'How items in this list are ordered.',
    options: [
      {title: 'Ascending', value: 'https://schema.org/ItemListOrderAscending'},
      {title: 'Descending', value: 'https://schema.org/ItemListOrderDescending'},
      {title: 'Unordered', value: 'https://schema.org/ItemListUnordered'},
    ],
  },
  {
    name: 'numberOfItems',
    title: 'Number of Items',
    type: 'number',
    description: 'Total number of items in the list.',
  },
  {
    name: 'itemListElement',
    title: 'List Items',
    type: 'array',
    jsonLdType: 'ListItem',
    description: 'Items in the list. Position is auto-set if not provided.',
    fields: [
      {name: 'position', title: 'Position', type: 'number', description: 'Order in the list.'},
      {name: 'name', title: 'Item Name', type: 'string'},
      {
        name: 'url',
        title: 'Item URL',
        type: 'url',
        description: 'Link to the item.',
        urlValidation: {schemes: ['http', 'https']},
      },
      {name: 'image', title: 'Image URL', type: 'url', description: 'Image for this item.'},
      {name: 'description', title: 'Description', type: 'text', rows: 2},
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgItemList(
  config: SchemaOrgItemListConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgItemList',
      title: 'ItemList',
      icon: SchemaOrgIcons.itemList,
      fields: itemListFields,
      customPrepareSubtitle: (document: SchemaOrgItemListData) => {
        const name = document.name ?? 'Untitled list'
        const count = document.itemListElement?.length ?? document.numberOfItems
        const countStr = count === null ? '' : ` · ${count} items`
        return `${name}${countStr}`
      },
    },
    config as SchemaOrgConfig,
  )
}
