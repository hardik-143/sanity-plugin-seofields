import type {SchemaOrgCreativeWorkData} from '../_types'

/** Schema.org ImageObject — data shape from GROQ query */
export interface SchemaOrgImageObjectData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgImageObject'
  /** Image width in pixels */
  width?: number
  /** Image height in pixels */
  height?: number
  /** Caption or alt text for the image */
  caption?: string
  /** Direct URL to the image file */
  contentUrl?: string
  /** The location where the image was taken */
  contentLocation?: string
}

/** Configuration for `schemaOrgImageObject()` */
export interface SchemaOrgImageObjectConfig {
  validation?: {
    /** Custom error message when image URL is missing */
    urlRequired?: string
  }
}
