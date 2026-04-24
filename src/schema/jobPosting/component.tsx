import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {jobPostingFields} from './schema'
import type {SchemaOrgJobPostingData} from './types'

export interface JobPostingSchemaProps {
  data?: SchemaOrgJobPostingData | null
}

export function buildJobPostingJsonLd(
  data?: SchemaOrgJobPostingData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'JobPosting',
    data as Record<string, unknown> | null | undefined,
    jobPostingFields,
    ['title', 'description', 'datePosted'],
  )
}

export function JobPostingSchema({data}: JobPostingSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildJobPostingJsonLd(data)} />
}

export default JobPostingSchema
