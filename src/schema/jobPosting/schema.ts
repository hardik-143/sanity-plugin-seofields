import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, polymorphicPublisher} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgJobPostingConfig, SchemaOrgJobPostingData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const jobPostingFields: SchemaFieldDef[] = [
  {
    name: 'title',
    title: 'Job Title',
    type: 'string',
    description: 'The title of the job, e.g. "Senior Software Engineer".',
    required: {key: 'titleRequired', message: 'Job title is required.'},
  },
  descriptionField({
    title: 'Job Description',
    description: 'Full description of the job — responsibilities, qualifications, etc.',
    required: {key: 'descriptionRequired', message: 'Job description is required.'},
  }),
  {
    name: 'datePosted',
    title: 'Date Posted',
    type: 'date',
    description: 'The date the job was posted (ISO 8601).',
    required: {key: 'datePostedRequired', message: 'Date posted is required.'},
  },
  {
    name: 'validThrough',
    title: 'Valid Through',
    type: 'datetime',
    description: 'The date after which the posting is no longer valid.',
  },
  {
    name: 'employmentType',
    title: 'Employment Type',
    type: 'string',
    description: 'Type of employment.',
    options: [
      {title: 'Full-time', value: 'FULL_TIME'},
      {title: 'Part-time', value: 'PART_TIME'},
      {title: 'Contract', value: 'CONTRACTOR'},
      {title: 'Temporary', value: 'TEMPORARY'},
      {title: 'Intern', value: 'INTERN'},
      {title: 'Volunteer', value: 'VOLUNTEER'},
      {title: 'Per Diem', value: 'PER_DIEM'},
      {title: 'Other', value: 'OTHER'},
    ],
  },
  polymorphicPublisher({
    name: 'hiringOrganization',
    title: 'Hiring Organization',
    description: 'The organization offering the job.',
  }),
  {
    name: 'jobLocation',
    title: 'Job Location',
    type: 'object',
    jsonLdType: 'Place',
    description: 'The physical location of the job.',
    fields: [
      {
        name: 'address',
        title: 'Address',
        type: 'object',
        jsonLdType: 'PostalAddress',
        fields: [
          {name: 'streetAddress', title: 'Street Address', type: 'string'},
          {name: 'addressLocality', title: 'City', type: 'string'},
          {name: 'addressRegion', title: 'State/Region', type: 'string'},
          {name: 'postalCode', title: 'Postal Code', type: 'string'},
          {name: 'addressCountry', title: 'Country', type: 'string'},
        ],
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgJobPosting(
  config: SchemaOrgJobPostingConfig = {},
): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgJobPosting',
      title: 'JobPosting',
      icon: SchemaOrgIcons.jobPosting,
      fields: jobPostingFields,
      customPrepareSubtitle: (document: SchemaOrgJobPostingData) => {
        const title = document.title || 'Untitled'
        const type = document.employmentType ? ` · ${document.employmentType}` : ''
        return `${title}${type}`
      },
    },
    config as SchemaOrgConfig,
  )
}
