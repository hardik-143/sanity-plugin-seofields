import type {SchemaTypeDefinition} from 'sanity'

import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgCourseConfig} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const courseFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Course Name',
    type: 'string',
    description: 'The name of the course.',
    required: {key: 'nameRequired', message: 'Course name is required for Schema.org.'},
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A short description of the course.',
  },
  {
    name: 'provider',
    title: 'Provider',
    type: 'object',
    description: 'The organization that provides this course.',
    jsonLdType: 'Organization',
    fields: [
      {
        name: 'name',
        title: 'Provider Name',
        type: 'string',
        description: 'Name of the providing organization.',
      },
      {
        name: 'sameAs',
        title: 'Provider URL',
        type: 'url',
        description: 'URL of the providing organization.',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org Course — Sanity object type.
 *
 * @example
 * ```ts
 * import { schemaOrgCourse } from 'sanity-plugin-seofields/schema/course'
 *
 * // Default
 * schemaOrgCourse()
 *
 * // Custom validation messages
 * schemaOrgCourse({
 *   validation: { nameRequired: 'Please enter the course name.' },
 * })
 * ```
 */
export default function schemaOrgCourse(config: SchemaOrgCourseConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgCourse',
      title: 'Schema.org — Course',
      icon: SchemaOrgIcons.course,
      fields: courseFields,
    },
    config as SchemaOrgConfig,
  )
}
