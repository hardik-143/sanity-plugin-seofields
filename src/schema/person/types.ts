// ─── Person Schema Types ──────────────────────────────────────────────────────

/** Organization info nested within the Person schema (worksFor) */
export interface PersonWorksFor {
  /** Organization name */
  name?: string
}

/** Schema.org Person — data shape returned from a Sanity GROQ query */
export interface SchemaOrgPersonData {
  _type?: 'schemaOrgPerson'
  /** Full name of the person */
  name?: string
  /** Job title or role */
  jobTitle?: string
  /** URL of the person's profile or website */
  url?: string
  /** URL to a photo/image of this person (mapped to "image" in JSON-LD) */
  imageUrl?: string
  /** Social media and external profile URLs */
  sameAs?: string[]
  /** The organization this person works for */
  worksFor?: PersonWorksFor
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgPerson()` */
export interface SchemaOrgPersonConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when person name is missing */
    nameRequired?: string
  }
}
