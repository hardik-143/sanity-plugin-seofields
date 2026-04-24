import type {SchemaOrgImageInput} from '../_types'

/** Schema.org Brand — data shape from GROQ query */
export interface SchemaOrgBrandData {
  _type?: 'schemaOrgBrand'
  /** Brand name */
  name?: string
  /** A slogan or tagline for the brand */
  slogan?: string
  /** An image representing the brand (URL or full ImageObject) */
  image?: SchemaOrgImageInput
}

/** Configuration for `schemaOrgBrand()` */
export interface SchemaOrgBrandConfig {
  validation?: {
    /** Custom error message when brand name is missing */
    nameRequired?: string
  }
}
