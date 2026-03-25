import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgEventConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const eventFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Event Name',
    type: 'string',
    description: 'The name of the event.',
    required: {key: 'nameRequired', message: 'Event name is required for Schema.org.'},
  },
  {
    name: 'startDate',
    title: 'Start Date',
    type: 'date',
    description: 'The start date of the event.',
  },
  {
    name: 'location',
    title: 'Location',
    type: 'object',
    description: 'The location where the event takes place.',
    jsonLdType: 'Place',
    fields: [
      {
        name: 'name',
        title: 'Venue Name',
        type: 'string',
        description: 'Name of the venue or location.',
      },
      {
        name: 'address',
        title: 'Address',
        type: 'string',
        description: 'Full address as a single string.',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgEvent(config: SchemaOrgEventConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgEvent',
      title: 'Schema.org — Event',
      icon: SchemaOrgIcons.event,
      fields: eventFields,
    },
    config as SchemaOrgConfig,
  )
}
