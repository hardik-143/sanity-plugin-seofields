/** Schema.org PostalAddress — data shape from GROQ query */
export interface SchemaOrgPostalAddressData {
  _type?: 'schemaOrgPostalAddress'
  /** Street address, e.g. "123 Main St" */
  streetAddress?: string
  /** City or locality, e.g. "New York" */
  addressLocality?: string
  /** Postal or ZIP code, e.g. "10001" */
  postalCode?: string
  /** Country code, e.g. "US" */
  addressCountry?: string
}

/** Configuration for `schemaOrgPostalAddress()` */
export interface SchemaOrgPostalAddressConfig {
  validation?: Record<string, string>
}
