import type {SchemaTypeDefinition} from 'sanity'

import {nameField, polymorphicSponsor} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgEventConfig, SchemaOrgEventData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const eventFields: SchemaFieldDef[] = [
  nameField({
    title: 'Event Name',
    description: 'The name of the event.',
    required: {key: 'nameRequired', message: 'Event name is required for Schema.org.'},
  }),
  {
    name: 'startDate',
    title: 'Start Date',
    type: 'date',
    description: 'The start date of the event.',
  },
  polymorphicSponsor({
    description: 'The person or organization that sponsors the event.',
    title: 'Sponsor',
  }),
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
      title: 'Event',
      icon: SchemaOrgIcons.event,
      fields: eventFields,
      customPrepareSubtitle: (document: SchemaOrgEventData) => {
        const name = document.name ?? 'Untitled event'
        const date = document.startDate ? ` · ${document.startDate}` : ''
        return `${name}${date}`
      },
    },
    config as SchemaOrgConfig,
  )
}
