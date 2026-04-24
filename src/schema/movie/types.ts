import type {
  SchemaOrgAggregateRating,
  SchemaOrgCreativeWorkData,
  SchemaOrgPersonOrOrganization,
} from '../_types'

/** Schema.org Movie — data shape from GROQ query */
export interface SchemaOrgMovieData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgMovie'
  director?: SchemaOrgPersonOrOrganization
  actor?: SchemaOrgPersonOrOrganization[]
  musicBy?: SchemaOrgPersonOrOrganization
  producer?: SchemaOrgPersonOrOrganization
  productionCompany?: Record<string, unknown>
  duration?: string
  /** Override with typed shape */
  aggregateRating?: SchemaOrgAggregateRating
  review?: unknown[]
  trailer?: Record<string, unknown>
  countryOfOrigin?: string
  inLanguage?: string
}

/** Configuration for `schemaOrgMovie()` */
export interface SchemaOrgMovieConfig {
  validation?: Record<string, string>
}
