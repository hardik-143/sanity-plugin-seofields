import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgBreadcrumbListConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const breadcrumbListFields: SchemaFieldDef[] = [
  {
    name: 'itemListElement',
    title: 'Breadcrumb Items',
    type: 'array',
    jsonLdType: 'ListItem',
    fields: [
      {
        name: 'position',
        title: 'Position',
        type: 'number',
        required: {key: 'positionRequired', message: 'Position is required.'},
      },
      {
        name: 'name',
        title: 'Label',
        type: 'string',
        required: {key: 'nameRequired', message: 'Label is required.'},
      },
      {
        name: 'item',
        title: 'URL',
        type: 'url',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org BreadcrumbList — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgBreadcrumbList } from 'sanity-plugin-seofields/schema/breadcrumbList'
 *
 * schemaOrgBreadcrumbList()
 * ```
 */
export default function schemaOrgBreadcrumbList(
  config: SchemaOrgBreadcrumbListConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgBreadcrumbList',
      title: 'Schema.org — BreadcrumbList',
      icon: SchemaOrgIcons.breadcrumbList,
      fields: breadcrumbListFields,
    },
    config as SchemaOrgConfig,
  )
}
