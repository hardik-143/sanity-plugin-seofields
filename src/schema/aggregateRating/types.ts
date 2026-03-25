/** Schema.org AggregateRating — data shape from GROQ query */
export interface SchemaOrgAggregateRatingData {
  _type?: 'schemaOrgAggregateRating'
  /** Average rating value, e.g. "4.5" */
  ratingValue?: string
  /** Total number of reviews, e.g. "120" */
  reviewCount?: string
}

/** Configuration for `schemaOrgAggregateRating()` */
export interface SchemaOrgAggregateRatingConfig {
  validation?: {
    /** Custom error message when rating value is missing */
    ratingValueRequired?: string
  }
}
