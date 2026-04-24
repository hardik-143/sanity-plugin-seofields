// ─── Website Schema Types ─────────────────────────────────────────────────────

import type {SchemaOrgCreativeWorkData} from '../_types'

/** Schema.org WebSite — data shape returned from a Sanity GROQ query */
export interface SchemaOrgWebsiteData extends Pick<
  SchemaOrgCreativeWorkData,
  'name' | 'url' | 'description' | 'inLanguage' | 'publisher' | 'potentialAction'
> {
  _type?: 'schemaOrgWebsite'
  /** ISSN identifier of the website */
  issn?: string
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
