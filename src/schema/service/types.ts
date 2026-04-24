// ─── Service Schema Types ─────────────────────────────────────────────────────

/** Provider info nested within the Service schema */
export interface ServiceProvider {
  /** Provider name */
  name?: string
  /** Provider URL */
  url?: string
}

/** A single offer in the catalog */
export interface ServiceOffer {
  /** Offer name */
  name?: string
}

/** Offer catalog nested within the Service schema */
export interface ServiceOfferCatalog {
  /** Catalog name */
  name?: string
  /** List of offers */
  itemListElement?: ServiceOffer[]
}

/** Schema.org Service — data shape returned from a Sanity GROQ query */
export interface SchemaOrgServiceData {
  _type?: 'schemaOrgService'
  /** Service name */
  name?: string
  /** Type of service */
  serviceType?: string
  /** Short description of the service */
  description?: string
  /** URL of the service page */
  url?: string
  /** Organization that provides the service */
  provider?: ServiceProvider
  /** Geographic area served */
  areaServed?: string
  /** Catalog of offers for the service */
  hasOfferCatalog?: ServiceOfferCatalog
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgService()` */
export interface SchemaOrgServiceConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when service name is missing */
    nameRequired?: string
  }
}
