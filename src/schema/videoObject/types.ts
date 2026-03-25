/** Schema.org VideoObject — data shape from GROQ query */
export interface SchemaOrgVideoObjectData {
  _type?: 'schemaOrgVideoObject'
  /** Name of the video */
  name?: string
  /** Description of the video */
  description?: string
  /** URL of the video thumbnail image */
  thumbnailUrl?: string
  /** Date the video was uploaded (ISO 8601) */
  uploadDate?: string
  /** URL to the actual video file */
  contentUrl?: string
}

/** Configuration for `schemaOrgVideoObject()` */
export interface SchemaOrgVideoObjectConfig {
  validation?: {
    /** Custom error message when video name is missing */
    nameRequired?: string
  }
}
