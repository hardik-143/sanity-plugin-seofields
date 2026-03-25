/** Schema.org ImageObject — data shape from GROQ query */
export interface SchemaOrgImageObjectData {
  _type?: 'schemaOrgImageObject'
  /** URL of the image */
  url?: string
  /** Image width in pixels */
  width?: number
  /** Image height in pixels */
  height?: number
  /** Caption or alt text for the image */
  caption?: string
}

/** Configuration for `schemaOrgImageObject()` */
export interface SchemaOrgImageObjectConfig {
  validation?: {
    /** Custom error message when image URL is missing */
    urlRequired?: string
  }
}
