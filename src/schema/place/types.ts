// ─── Place Schema Types ───────────────────────────────────────────────────────

/** Schema.org Place — data shape returned from a Sanity GROQ query */
export interface SchemaOrgPlaceData {
  _type?: 'schemaOrgPlace'
  /** Name of the place */
  name?: string
  /** Physical address of the place */
  address?: {addressLocality?: string; addressCountry?: string}
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgPlace()` */
export interface SchemaOrgPlaceConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when place name is missing */
    nameRequired?: string
  }
}
