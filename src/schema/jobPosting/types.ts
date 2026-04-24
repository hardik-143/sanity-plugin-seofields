import type {SchemaOrgThingData} from '../_types'

/** Schema.org JobPosting — data shape from GROQ query */
export interface SchemaOrgJobPostingData extends SchemaOrgThingData {
  _type?: 'schemaOrgJobPosting'
  title?: string
  description?: string
  datePosted?: string
  validThrough?: string
  employmentType?: string
  hiringOrganization?: Record<string, unknown>
  jobLocation?: Record<string, unknown>
  baseSalary?: Record<string, unknown>
  applicantLocationRequirements?: string
  jobLocationType?: string
  directApply?: boolean
  experienceRequirements?: string
  educationRequirements?: string
  skills?: string
  industry?: string
  qualifications?: string
  responsibilities?: string
  workHours?: string
}

/** Configuration for `schemaOrgJobPosting()` */
export interface SchemaOrgJobPostingConfig {
  validation?: Record<string, string>
}
