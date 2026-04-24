// ─── LocalBusiness Schema Types ───────────────────────────────────────────────

/** Geographic coordinates of the business */
export interface LocalBusinessGeoCoordinates {
  /** Latitude, e.g. "40.7128" */
  latitude?: string
  /** Longitude, e.g. "-74.0060" */
  longitude?: string
}

/** Opening hours for a specific day */
export interface LocalBusinessOpeningHoursSpec {
  /** Day of the week */
  dayOfWeek?: string
  /** Opening time, e.g. "09:00" */
  opens?: string
  /** Closing time, e.g. "17:00" */
  closes?: string
}

/** Schema.org LocalBusiness — data shape returned from a Sanity GROQ query */
export interface SchemaOrgLocalBusinessData {
  _type?: 'schemaOrgLocalBusiness'
  /** Official name of the business */
  name?: string
  /** URL to the business image */
  image?: string
  /** Telephone number */
  telephone?: string
  /** Physical address of the business */
  address?: {streetAddress?: string; addressLocality?: string; addressCountry?: string}
  /** The website URL of the business */
  url?: string
  /** URL to the business logo image (mapped to "logo" in JSON-LD) */
  logoUrl?: string
  /** The price range of the business */
  priceRange?: string
  /** Geographic coordinates of the business */
  geo?: LocalBusinessGeoCoordinates
  /** URL to a map of the business location */
  hasMap?: string
  /** Business opening hours for each day */
  openingHoursSpecification?: LocalBusinessOpeningHoursSpec[]
  /** URLs of social media profiles */
  sameAs?: string
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgLocalBusiness()` */
export interface SchemaOrgLocalBusinessConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when business name is missing */
    nameRequired?: string
  }
}
