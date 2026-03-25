// ─── Product Schema Types ─────────────────────────────────────────────────────

/** Brand info nested within the Product schema */
export interface ProductBrand {
  /** Brand name */
  name?: string
}

/** Schema.org Product — data shape returned from a Sanity GROQ query */
export interface SchemaOrgProductData {
  _type?: 'schemaOrgProduct'
  /** Product name */
  name?: string
  /** URL to the product image (mapped to "image" in JSON-LD) */
  imageUrl?: string
  /** Short description of the product */
  description?: string
  /** The brand of the product */
  brand?: ProductBrand
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgProduct()` */
export interface SchemaOrgProductConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when product name is missing */
    nameRequired?: string
  }
}
