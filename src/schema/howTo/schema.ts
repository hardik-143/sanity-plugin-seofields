import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgHowToConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const howToFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Name',
    type: 'string',
    required: {key: 'nameRequired', message: 'Name is required for Schema.org HowTo.'},
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
  },
  {
    name: 'step',
    title: 'Steps',
    type: 'array',
    jsonLdType: 'HowToStep',
    fields: [
      {
        name: 'name',
        title: 'Step Name',
        type: 'string',
        required: {key: 'stepNameRequired', message: 'Step name is required.'},
      },
      {
        name: 'text',
        title: 'Step Description',
        type: 'text',
        rows: 2,
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org HowTo — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgHowTo } from 'sanity-plugin-seofields/schema/howTo'
 *
 * schemaOrgHowTo()
 * ```
 */
export default function schemaOrgHowTo(config: SchemaOrgHowToConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgHowTo',
      title: 'Schema.org — HowTo',
      icon: SchemaOrgIcons.howTo,
      fields: howToFields,
    },
    config as SchemaOrgConfig,
  )
}
