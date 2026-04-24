import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgWebApplicationConfig, SchemaOrgWebApplicationData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const webApplicationFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Application Name',
    type: 'string',
    description: 'The name of the web application.',
    required: {
      key: 'nameRequired',
      message: 'Application name is required for Schema.org.',
    },
  },
  {
    name: 'url',
    title: 'Application URL',
    type: 'url',
    description: 'URL of the web application.',
    required: {key: 'urlRequired', message: 'Application URL is required for Schema.org.'},
  },
  {
    name: 'applicationCategory',
    title: 'Application Category',
    type: 'string',
    description: 'The category of the application.',
    options: [
      {title: 'Developer Application', value: 'DeveloperApplication'},
      {title: 'Business Application', value: 'BusinessApplication'},
      {title: 'Game Application', value: 'GameApplication'},
      {title: 'Educational Application', value: 'EducationalApplication'},
      {title: 'Utilities Application', value: 'UtilitiesApplication'},
      {title: 'Social Networking Application', value: 'SocialNetworkingApplication'},
    ],
  },
  {
    name: 'operatingSystem',
    title: 'Operating System',
    type: 'string',
    description: 'The supported operating systems.',
    initialValue: 'All',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org WebApplication — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgWebApplication } from 'sanity-plugin-seofields/schema/webApplication'
 *
 * // Default
 * schemaOrgWebApplication()
 *
 * // Custom validation messages
 * schemaOrgWebApplication({
 *   validation: { nameRequired: 'Please enter the application name.' },
 * })
 * ```
 */
export default function schemaOrgWebApplication(
  config: SchemaOrgWebApplicationConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgWebApplication',
      title: 'WebApplication',
      icon: SchemaOrgIcons.webApplication,
      fields: webApplicationFields,
      customPrepareSubtitle: (document: SchemaOrgWebApplicationData) => {
        const name = document.name ?? 'Untitled web app'
        return document.url ? `${name} · ${document.url}` : name
      },
    },
    config as SchemaOrgConfig,
  )
}
