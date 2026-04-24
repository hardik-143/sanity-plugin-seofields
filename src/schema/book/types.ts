import type {SchemaOrgAggregateRating, SchemaOrgCreativeWorkData} from '../_types'

/** Schema.org Book — data shape from GROQ query */
export interface SchemaOrgBookData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgBook'
  isbn?: string
  numberOfPages?: number
  bookFormat?: string
  bookEdition?: string
  inLanguage?: string
  /** Override with typed shape */
  aggregateRating?: SchemaOrgAggregateRating
  review?: unknown[]
  workExample?: unknown[]
}

/** Configuration for `schemaOrgBook()` */
export interface SchemaOrgBookConfig {
  validation?: Record<string, string>
}
