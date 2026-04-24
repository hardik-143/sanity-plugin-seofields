// ─── SocialMediaPosting Schema Types ──────────────────────────────────────────

import type {SchemaOrgCreativeWorkData} from '../_types'

/** Shared content item nested within the SocialMediaPosting schema */
export interface SocialMediaPostingSharedContent {
  /** URL of the shared page */
  url?: string
  /** Headline of the shared page */
  headline?: string
}

/** Schema.org SocialMediaPosting — data shape returned from a Sanity GROQ query */
export interface SchemaOrgSocialMediaPostingData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgSocialMediaPosting'
  sharedContent?: SocialMediaPostingSharedContent[]
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgSocialMediaPosting()` */
export interface SchemaOrgSocialMediaPostingConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when post headline is missing */
    headlineRequired?: string
  }
}
