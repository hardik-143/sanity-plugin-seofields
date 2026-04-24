import type {SchemaOrgPersonOrOrganization, SchemaOrgThingData} from '../_types'

/** Schema.org AggregateRating — data shape from GROQ query */
export interface SchemaOrgAggregateRatingData extends SchemaOrgThingData {
  _type?: 'schemaOrgAggregateRating'
  /** Average rating value, e.g. "4.5" */
  ratingValue?: string
  /** Highest value in the rating scale, e.g. "5" */
  bestRating?: string
  /** Lowest value in the rating scale, e.g. "1" */
  worstRating?: string
  /** Total number of ratings */
  ratingCount?: string
  /** Total number of reviews, e.g. "120" */
  reviewCount?: string
  /** Short explanation of the rating */
  ratingExplanation?: string
  /** Author — polymorphic Person or Organization */
  author?: SchemaOrgPersonOrOrganization
}

/** Configuration for `schemaOrgAggregateRating()` */
export interface SchemaOrgAggregateRatingConfig {
  validation?: {
    /** Custom error message when rating value is missing */
    ratingValueRequired?: string
    /** Custom error message when owner org name is missing */
    ownerOrgNameRequired?: string
    /** Custom error message when owner person name is missing */
    ownerPersonNameRequired?: string
  }
}
