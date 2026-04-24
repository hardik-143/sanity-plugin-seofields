import type {SchemaTypeDefinition} from 'sanity'

import {nameField} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgPersonConfig, SchemaOrgPersonData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const personFields: SchemaFieldDef[] = [
  nameField({
    title: 'Full Name',
    description: 'The full name of the person.',
    required: {key: 'nameRequired', message: 'Person name is required for Schema.org.'},
  }),
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
    title: 'Same As URL',
    type: 'url',
    description:
      'URLs of social media profiles and other authoritative pages (LinkedIn, GitHub, etc.).',
    urlValidation: {schemes: ['http', 'https']},
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
  {
    name: 'email',
    title: 'Email',
    type: 'string',
    description: 'Email address of the person.',
  },
  // fax Number
  {
    name: 'faxNumber',
    title: 'Fax Number',
    type: 'string',
    description: 'Fax number of the person.',
  },
  {
    name: 'telephone',
    title: 'Telephone',
    type: 'string',
    description: 'Phone number of the person.',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A short bio or description of the person.',
  },
  {
    name: 'gender',
    title: 'Gender',
    type: 'string',
    description: 'Gender of the person.',
  },
  {
    name: 'birthDate',
    title: 'Birth Date',
    type: 'date',
    description: 'Date of birth.',
  },
  {
    name: 'address',
    title: 'Address',
    type: 'object',
    description: 'The postal address of the person.',
    jsonLdType: 'PostalAddress',
    fields: [
      {
        name: 'streetAddress',
        title: 'Street Address',
        type: 'string',
      },
      {
        name: 'addressLocality',
        title: 'City',
        type: 'string',
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
      title: 'Person',
      icon: SchemaOrgIcons.person,
      fields: personFields,
      customPrepareSubtitle: (document: SchemaOrgPersonData) => {
        const name = document.name ?? 'Untitled person'
        return document.jobTitle ? `${name} · ${document.jobTitle}` : name
      },
    },
    config as SchemaOrgConfig,
  )
}
