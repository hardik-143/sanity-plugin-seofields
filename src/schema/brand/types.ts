/** Schema.org Brand — data shape from GROQ query */
export interface SchemaOrgBrandData {
  _type?: 'schemaOrgBrand'
  /** Brand name */
  name?: string
}

/** Configuration for `schemaOrgBrand()` */
export interface SchemaOrgBrandConfig {
  validation?: {
    /** Custom error message when brand name is missing */
    nameRequired?: string
  }
}
