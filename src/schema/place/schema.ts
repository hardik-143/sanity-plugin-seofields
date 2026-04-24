import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgPlaceConfig, SchemaOrgPlaceData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const placeFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Place Name',
    type: 'string',
    description: 'The name of the place.',
    required: {key: 'nameRequired', message: 'Place name is required for Schema.org.'},
  },
  {
    name: 'address',
    title: 'Address',
    type: 'object',
    description: 'The physical address of the place.',
    jsonLdType: 'PostalAddress',
    fields: [
      {
        name: 'addressLocality',
        title: 'Locality',
        type: 'string',
        description: 'City or town.',
      },
      {
        name: 'addressCountry',
        title: 'Country',
        type: 'string',
        description: 'Country code, e.g. "US".',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgPlace(config: SchemaOrgPlaceConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgPlace',
      title: 'Place',
      icon: SchemaOrgIcons.place,
      fields: placeFields,
      customPrepareSubtitle: (document: SchemaOrgPlaceData) => {
        const name = document.name ?? 'Untitled place'
        const city = document.address?.addressLocality
        return city ? `${name} · ${city}` : name
      },
    },
    config as SchemaOrgConfig,
  )
}
