// ─── WebPage Schema Types ─────────────────────────────────────────────────────

/** Website info nested within the WebPage schema (isPartOf) */
export interface WebPageWebSite {
  /** URL of the parent website */
  url?: string
}

/** Schema.org WebPage — data shape returned from a Sanity GROQ query */
export interface SchemaOrgWebPageData {
  _type?: 'schemaOrgWebPage'
  /** Page title */
  name?: string
  /** Full URL of the page */
  url?: string
  /** Short description of the page */
  description?: string
  /** Language code, e.g. "en" */
  inLanguage?: string
  /** The website this page is part of */
  isPartOf?: WebPageWebSite
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgWebPage()` */
export interface SchemaOrgWebPageConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when page name is missing */
    nameRequired?: string
    /** Custom error message when page URL is missing */
    urlRequired?: string
  }
}
