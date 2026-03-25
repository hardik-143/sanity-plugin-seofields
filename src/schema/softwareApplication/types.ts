// ─── SoftwareApplication Schema Types ─────────────────────────────────────────

/** Schema.org SoftwareApplication — data shape returned from a Sanity GROQ query */
export interface SchemaOrgSoftwareApplicationData {
  _type?: 'schemaOrgSoftwareApplication'
  /** Application name */
  name?: string
  /** Category of the application */
  applicationCategory?: string
  /** Supported operating systems */
  operatingSystem?: string
  /** URL of the application */
  url?: string
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgSoftwareApplication()` */
export interface SchemaOrgSoftwareApplicationConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when application name is missing */
    nameRequired?: string
  }
}
