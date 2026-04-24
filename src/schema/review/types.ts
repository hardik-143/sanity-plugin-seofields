// ─── Review Schema Types ──────────────────────────────────────────────────────

import type {SchemaOrgCreativeWorkData} from '../_types'

/** Item reviewed nested within the Review schema */
export interface ReviewItemReviewed {
  /** Name of the reviewed item */
  name?: string
  /** URL of the reviewed item */
  url?: string
}

/** Schema.org Review — data shape returned from a Sanity GROQ query */
export interface SchemaOrgReviewData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgReview'
  /** Rating for the reviewed item */
  reviewRating?: {ratingValue?: string}
  /** Full text of the review */
  reviewBody?: string
  /** The item that is being reviewed */
  itemReviewed?: ReviewItemReviewed
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgReview()` */
export interface SchemaOrgReviewConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when rating value is missing */
    ratingValueRequired?: string
    /** Custom error message when author name is missing */
    authorNameRequired?: string
  }
}
