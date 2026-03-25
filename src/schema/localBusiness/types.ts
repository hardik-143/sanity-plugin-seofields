// ─── LocalBusiness Schema Types ───────────────────────────────────────────────

/** Schema.org LocalBusiness — data shape returned from a Sanity GROQ query */
export interface SchemaOrgLocalBusinessData {
  _type?: 'schemaOrgLocalBusiness'
  /** Official name of the business */
  name?: string
  /** URL to the business image */
  image?: string
  /** Telephone number */
  telephone?: string
  /** Physical address of the business */
  address?: {streetAddress?: string; addressLocality?: string; addressCountry?: string}
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgLocalBusiness()` */
export interface SchemaOrgLocalBusinessConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when business name is missing */
    nameRequired?: string
  }
}
