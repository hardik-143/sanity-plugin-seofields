import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgPersonConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const personFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Full Name',
    type: 'string',
    description: 'The full name of the person.',
    required: {key: 'nameRequired', message: 'Person name is required for Schema.org.'},
  },
  {
    name: 'jobTitle',
    title: 'Job Title',
    type: 'string',
    description: 'The job title or role of the person.',
  },
  {
    name: 'url',
    title: 'Profile URL',
    type: 'url',
    description: "URL of the person's profile or personal website.",
  },
  {
    name: 'imageUrl',
    title: 'Image URL',
    type: 'url',
    description: 'URL to a photo/image of this person.',
    jsonLdKey: 'image',
  },
  {
    name: 'sameAs',
    title: 'Social / External Profiles',
    type: 'array',
    of: [{type: 'url'}],
    description:
      'URLs of social media profiles and other authoritative pages (LinkedIn, GitHub, etc.).',
  },
  {
    name: 'worksFor',
    title: 'Works For',
    type: 'object',
    description: 'The organization this person works for.',
    jsonLdType: 'Organization',
    fields: [
      {
        name: 'name',
        title: 'Organization Name',
        type: 'string',
        description: 'Name of the organization.',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org Person — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgPerson } from 'sanity-plugin-seofields/schema/person'
 *
 * // Default
 * schemaOrgPerson()
 *
 * // Custom validation messages
 * schemaOrgPerson({
 *   validation: { nameRequired: 'Please enter the person\'s name.' },
 * })
 * ```
 */
export default function schemaOrgPerson(config: SchemaOrgPersonConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgPerson',
      title: 'Schema.org — Person',
      icon: SchemaOrgIcons.person,
      fields: personFields,
    },
    config as SchemaOrgConfig,
  )
}
