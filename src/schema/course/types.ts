// ─── Course Schema Types ──────────────────────────────────────────────────────

/** Provider info nested within the Course schema */
export interface CourseProvider {
  /** Provider organization name */
  name?: string
  /** Provider organization URL */
  sameAs?: string
}

/** Schema.org Course — data shape returned from a Sanity GROQ query */
export interface SchemaOrgCourseData {
  _type?: 'schemaOrgCourse'
  /** Course name */
  name?: string
  /** Short description of the course */
  description?: string
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
