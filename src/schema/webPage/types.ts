// ─── WebPage Schema Types ─────────────────────────────────────────────────────

import type {SchemaOrgCreativeWorkData} from '../_types'

/** Schema.org WebPage — data shape returned from a Sanity GROQ query */
export interface SchemaOrgWebPageData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgWebPage'
  /** Language code, e.g. "en" */
  inLanguage?: string
  /** The specific type of web page (WebPage, AboutPage, ContactPage, etc.) */
  pageType?: string
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
