/** Schema.org ContactPoint — data shape from GROQ query */
export interface SchemaOrgContactPointData {
  _type?: 'schemaOrgContactPoint'
  /** Type of contact, e.g. "customer support", "sales" */
  contactType?: string
  /** Contact email address */
  email?: string
  /** Contact telephone number */
  telephone?: string
  /** Languages supported, e.g. ["English"] */
  availableLanguage?: string[]
}

/** Configuration for `schemaOrgContactPoint()` */
export interface SchemaOrgContactPointConfig {
  validation?: {
    /** Custom error message when contact type is missing */
    contactTypeRequired?: string
  }
}
