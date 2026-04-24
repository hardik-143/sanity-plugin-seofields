import type {SchemaTypeDefinition} from 'sanity'

import {nameField} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgProfilePageConfig, SchemaOrgProfilePageData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const profilePageFields: SchemaFieldDef[] = [
  nameField({
    title: 'Page Title',
    description: 'Title of the profile page.',
    required: {key: 'nameRequired', message: 'Page title is required for Schema.org.'},
  }),
  {
    name: 'dateCreated',
    title: 'Date Created',
    type: 'datetime',
    description: 'When this profile page was created.',
  },
  {
    name: 'dateModified',
    title: 'Date Modified',
    type: 'datetime',
    description: 'When this profile page was last modified.',
  },
  {
    name: 'mainEntity',
    title: 'Profile (Person)',
    type: 'object',
    jsonLdType: 'Person',
    description: 'The person who is the subject of this profile page.',
    fields: [
      {
        name: 'name',
        title: 'Full Name',
        type: 'string',
        required: {key: 'personNameRequired', message: 'Person name is required.'},
      },
      {name: 'url', title: 'Website URL', type: 'url'},
      {name: 'image', title: 'Profile Image URL', type: 'url'},
      {name: 'description', title: 'Bio', type: 'text', rows: 3},
      {name: 'jobTitle', title: 'Job Title', type: 'string'},
      {
        name: 'sameAs',
        title: 'Same As URL',
        type: 'url',
        description: 'Social media URL (LinkedIn, Twitter, etc.).',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgProfilePage(
  config: SchemaOrgProfilePageConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgProfilePage',
      title: 'ProfilePage',
      icon: SchemaOrgIcons.profilePage,
      fields: profilePageFields,
      customPrepareSubtitle: (document: SchemaOrgProfilePageData) => {
        const personName = document.mainEntity?.name
        return personName ? `Profile: ${personName}` : 'No profile set'
      },
    },
    config as SchemaOrgConfig,
  )
}
