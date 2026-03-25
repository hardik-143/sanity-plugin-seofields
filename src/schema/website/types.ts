// ─── Website Schema Types ─────────────────────────────────────────────────────

/** Publisher info nested within the WebSite schema */
export interface WebsitePublisher {
  /** Publisher organization name */
  name?: string
  /** Publisher organization URL */
  url?: string
  /** Direct URL to the publisher logo image */
  logoUrl?: string
}

/** Schema.org WebSite — data shape returned from a Sanity GROQ query */
export interface SchemaOrgWebsiteData {
  _type?: 'schemaOrgWebsite'
  /** Website name, e.g. "My Website" */
  name?: string
  /** Full URL of the website, e.g. "https://www.example.com" */
  url?: string
  /** Short description of the website */
  description?: string
  /** Language code, e.g. "en" */
  inLanguage?: string
  /** The organization that publishes this website */
  publisher?: WebsitePublisher
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgWebsite()` */
export interface SchemaOrgWebsiteConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when website name is missing */
    nameRequired?: string
    /** Custom error message when website URL is missing */
    urlRequired?: string
  }
}
