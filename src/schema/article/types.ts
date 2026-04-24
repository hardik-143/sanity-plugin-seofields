// ─── Article Schema Types ─────────────────────────────────────────────────────

// Re-export shared primitives so existing imports from this file keep working
export type {
  SchemaOrgAggregateRating,
  SchemaOrgArchivedAt,
  SchemaOrgContentRating,
  SchemaOrgCopyrightYear,
  SchemaOrgCreativeWorkData,
  SchemaOrgImageInput,
  SchemaOrgOrganizationInput,
  SchemaOrgPersonOrOrganization,
  SchemaOrgTextOrUrl,
  SchemaOrgThingData,
} from '../_types'

import type {SchemaOrgCreativeWorkData} from '../_types'

/** Schema.org Article — data shape returned from a Sanity GROQ query */
export interface SchemaOrgArticleData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgArticle'
  /** The section of the publication (e.g. "Sports"). */
  articleSection?: string
  articleBody?: string
  wordCount?: number
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgArticle()` */
export interface SchemaOrgArticleConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when headline is missing */
    headlineRequired?: string
  }
}
