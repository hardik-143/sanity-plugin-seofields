import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField, polymorphicOwner} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgCourseConfig, SchemaOrgCourseData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const courseFields: SchemaFieldDef[] = [
  nameField({
    title: 'Course Name',
    description: 'The name of the course.',
    required: {key: 'nameRequired', message: 'Course name is required for Schema.org.'},
  }),
  {
    name: 'courseCode',
    title: 'Course Code',
    type: 'string',
    description: 'An alphanumeric code that uniquely identifies the course.',
  },
  descriptionField({
    description: 'A description of the course.',
    required: {
      key: 'descriptionRequired',
      message: 'Course description is required for Schema.org.',
    },
  }),
  polymorphicOwner({
    description: 'The person or organization that offers the course.',
    title: 'Owner',
  }),
  {
    name: 'provider',
    title: 'Provider',
    type: 'object',
    jsonLdType: 'Organization',
    description: 'The organization that offers the course.',
    fields: [
      {
        name: 'name',
        title: 'Organization Name',
        type: 'string',
        required: {key: 'providerNameRequired', message: 'Provider name is required.'},
      },
      {
        name: 'sameAs',
        title: 'Organization URL',
        type: 'url',
        description: 'URL of the organization.',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgCourse(config: SchemaOrgCourseConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgCourse',
      title: 'Course',
      icon: SchemaOrgIcons.course,
      fields: courseFields,
      customPrepareSubtitle: (document: SchemaOrgCourseData) => document.name || 'Untitled course',
    },
    config as SchemaOrgConfig,
  )
}
