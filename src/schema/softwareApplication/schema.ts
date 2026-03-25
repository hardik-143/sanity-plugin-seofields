import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgSoftwareApplicationConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const softwareApplicationFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Application Name',
    type: 'string',
    description: 'The name of the software application.',
    required: {
      key: 'nameRequired',
      message: 'Application name is required for Schema.org.',
    },
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
    description: 'The supported operating systems, e.g. "Windows, macOS".',
  },
  {
    name: 'url',
    title: 'Application URL',
    type: 'url',
    description: 'URL of the software application.',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org SoftwareApplication — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgSoftwareApplication } from 'sanity-plugin-seofields/schema/softwareApplication'
 *
 * // Default
 * schemaOrgSoftwareApplication()
 *
 * // Custom validation messages
 * schemaOrgSoftwareApplication({
 *   validation: { nameRequired: 'Please enter the application name.' },
 * })
 * ```
 */
export default function schemaOrgSoftwareApplication(
  config: SchemaOrgSoftwareApplicationConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgSoftwareApplication',
      title: 'Schema.org — SoftwareApplication',
      icon: SchemaOrgIcons.softwareApplication,
      fields: softwareApplicationFields,
    },
    config as SchemaOrgConfig,
  )
}
