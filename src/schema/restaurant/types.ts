import type {SchemaOrgThingData} from '../_types'

/** Schema.org Restaurant — data shape from GROQ query */
export interface SchemaOrgRestaurantData extends SchemaOrgThingData {
  _type?: 'schemaOrgRestaurant'
  telephone?: string
  servesCuisine?: string
  priceRange?: string
  menu?: string
  acceptsReservations?: boolean
  address?: Record<string, unknown>
  geo?: Record<string, unknown>
  openingHoursSpecification?: unknown[]
  aggregateRating?: Record<string, unknown>
  hasMap?: string
  logoUrl?: string
  paymentAccepted?: string
  currenciesAccepted?: string
}

/** Configuration for `schemaOrgRestaurant()` */
export interface SchemaOrgRestaurantConfig {
  validation?: Record<string, string>
}
