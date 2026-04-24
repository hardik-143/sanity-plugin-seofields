import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgServiceConfig, SchemaOrgServiceData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const serviceFields: SchemaFieldDef[] = [
  nameField({
    title: 'Service Name',
    description: 'The name of the service.',
    required: {key: 'nameRequired', message: 'Service name is required for Schema.org.'},
  }),
  {
    name: 'serviceType',
    title: 'Service Type',
    type: 'string',
    description: 'The type of service.',
  },
  descriptionField({
    title: 'Description',
    description: 'A description of the service.',
  }),
  {
    name: 'url',
    title: 'Service URL',
    type: 'url',
    description: 'URL of the service page.',
  },
  {
    name: 'provider',
    title: 'Provider',
    type: 'object',
    description: 'The organization that provides the service.',
    jsonLdType: 'Organization',
    fields: [
      {
        name: 'name',
        title: 'Provider Name',
        type: 'string',
        description: 'Name of the provider organization.',
      },
      {
        name: 'url',
        title: 'Provider URL',
        type: 'url',
        description: 'URL of the provider organization.',
      },
    ],
  },
  {
    name: 'areaServed',
    title: 'Area Served',
    type: 'string',
    description: 'The geographic area where the service is available.',
  },
  {
    name: 'hasOfferCatalog',
    title: 'Offer Catalog',
    type: 'object',
    description: 'The catalog of offers for the service.',
    jsonLdType: 'OfferCatalog',
    fields: [
      {
        name: 'name',
        title: 'Catalog Name',
        type: 'string',
        description: 'Name of the offer catalog.',
      },
      {
        name: 'itemListElement',
        title: 'Offers',
        type: 'array',
        description: 'List of offers in the catalog.',
        jsonLdType: 'Offer',
        fields: [
          {
            name: 'name',
            title: 'Offer Name',
            type: 'string',
            description: 'Name of the offer.',
          },
        ],
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org Service — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgService } from 'sanity-plugin-seofields/schema/service'
 *
 * // Default
 * schemaOrgService()
 *
 * // Custom validation messages
 * schemaOrgService({
 *   validation: { nameRequired: 'Please enter the service name.' },
 * })
 * ```
 */
export default function schemaOrgService(
  config: SchemaOrgServiceConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgService',
      title: 'Service',
      icon: SchemaOrgIcons.service,
      fields: serviceFields,
      customPrepareSubtitle: (document: SchemaOrgServiceData) => {
        const name = document.name ?? 'Untitled service'
        return document.serviceType ? `${name} · ${document.serviceType}` : name
      },
    },
    config as SchemaOrgConfig,
  )
}
