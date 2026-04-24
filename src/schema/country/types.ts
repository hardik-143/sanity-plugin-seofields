/**
 * Schema.org Country — extends Place.
 * Spec: https://schema.org/Country
 *
 * Country inherits all fields from Place. This schema captures the most useful
 * subset for SEO / structured data.
 */

import type {SchemaOrgImageInput} from '../_types'

export interface SchemaOrgCountryData {
  _type?: 'schemaOrgCountry'
  /** Common English name, e.g. "United States". */
  name?: string
  /** Alternate name (e.g. native name, abbreviation). */
  alternateName?: string
  /** ISO 3166-1 alpha-2 country code, e.g. "US". */
  identifier?: string
  /** Short description. */
  description?: string
  /** Canonical URL (e.g. Wikipedia page or government site). */
  url?: string
  /** An image representing the country (URL or full ImageObject). */
  image?: SchemaOrgImageInput
  /** Authoritative external URLs (Wikidata, Wikipedia, geonames, etc.). */
  sameAs?: string
  /** Postal address (typically just `addressCountry`). */
  address?: {addressCountry?: string}
}

export interface SchemaOrgCountryConfig {
  validation?: {
    nameRequired?: string
  }
}
