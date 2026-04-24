/**
 * Schema.org LegalService — extends LocalBusiness.
 * Spec: https://schema.org/LegalService
 *
 * LegalService inherits all fields from LocalBusiness; this schema mirrors the
 * most useful subset and adds legal-specific fields (areaServed, knowsLanguage,
 * knowsAbout).
 */

export interface SchemaOrgLegalServiceData {
  _type?: 'schemaOrgLegalService'
  /** The official name of the legal service / firm. */
  name?: string
  /** A short description of the firm. */
  description?: string
  /** Image URL of the firm. */
  image?: string
  /** Telephone number. */
  telephone?: string
  /** Website URL. */
  url?: string
  /** Logo URL. */
  logoUrl?: string
  /** Price range, e.g. "$$" or "$100-$500". */
  priceRange?: string
  /** Postal address. */
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  /** Geographic coordinates. */
  geo?: {latitude?: string; longitude?: string}
  /** Map URL (e.g. Google Maps). */
  hasMap?: string
  /** Areas of legal expertise (Schema.org `knowsAbout`). */
  knowsAbout?: string[]
  /** Languages the firm operates in. */
  knowsLanguage?: string[]
  /** Geographic areas served. */
  areaServed?: string[]
  /** Opening hours. */
  openingHoursSpecification?: Array<{dayOfWeek?: string; opens?: string; closes?: string}>
  /** Social / external profile URLs. */
  sameAs?: string
}

export interface SchemaOrgLegalServiceConfig {
  validation?: {
    nameRequired?: string
  }
}
