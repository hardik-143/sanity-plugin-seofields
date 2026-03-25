// ─── WebApplication Schema Types ──────────────────────────────────────────────

/** Schema.org WebApplication — data shape returned from a Sanity GROQ query */
export interface SchemaOrgWebApplicationData {
  _type?: 'schemaOrgWebApplication'
  /** Application name */
  name?: string
  /** URL of the web application */
  url?: string
  /** Category of the application */
  applicationCategory?: string
  /** Supported operating systems */
  operatingSystem?: string
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgWebApplication()` */
export interface SchemaOrgWebApplicationConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when application name is missing */
    nameRequired?: string
    /** Custom error message when application URL is missing */
    urlRequired?: string
  }
}
