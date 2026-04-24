// ─── BlogPosting Schema Types ─────────────────────────────────────────────────

import type {SchemaOrgCreativeWorkData} from '../_types'

/** Schema.org BlogPosting — data shape returned from a Sanity GROQ query */
export interface SchemaOrgBlogPostingData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgBlogPosting'
  mainEntityOfPage?: {id?: string}
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgBlogPosting()` */
export interface SchemaOrgBlogPostingConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when headline is missing */
    headlineRequired?: string
  }
}
