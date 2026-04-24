// ─── Person Schema Types ──────────────────────────────────────────────────────

/** Organization info nested within the Person schema (worksFor) */
export interface PersonWorksFor {
  /** Organization name */
  name?: string
}

/** Postal address of the person */
export interface PersonAddress {
  /** Street address */
  streetAddress?: string
  /** City */
  addressLocality?: string
  /** Country code, e.g. "US" */
  addressCountry?: string
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
  sameAs?: string
  /** The organization this person works for */
  worksFor?: PersonWorksFor
  /** Email address of the person */
  email?: string
  /** Phone number of the person */
  telephone?: string
  /** A short bio or description of the person */
  description?: string
  /** Gender of the person */
  gender?: string
  /** Date of birth */
  birthDate?: string
  /** The postal address of the person */
  address?: PersonAddress
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
