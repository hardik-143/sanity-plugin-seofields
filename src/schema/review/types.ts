// ─── Review Schema Types ──────────────────────────────────────────────────────

/** Schema.org Review — data shape returned from a Sanity GROQ query */
export interface SchemaOrgReviewData {
  _type?: 'schemaOrgReview'
  /** Rating for the reviewed item */
  reviewRating?: {ratingValue?: string}
  /** Author of the review */
  author?: {name?: string}
  /** Full text of the review */
  reviewBody?: string
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
