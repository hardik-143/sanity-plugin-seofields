// ─── Course Schema Types ──────────────────────────────────────────────────────

import type {SchemaOrgCreativeWorkData} from '../_types'

/** Provider info nested within the Course schema */
export interface CourseProvider {
  /** Provider organization name */
  name?: string
  /** Provider organization URL */
  sameAs?: string
}

/** Schema.org Course — data shape returned from a Sanity GROQ query */
export interface SchemaOrgCourseData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgCourse'
  /** An alphanumeric code that uniquely identifies the course */
  courseCode?: string
  /** The organization that provides this course */
  provider?: CourseProvider
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgCourse()` */
export interface SchemaOrgCourseConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when course name is missing */
    nameRequired?: string
  }
}
