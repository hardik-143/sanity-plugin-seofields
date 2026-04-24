// ─── Product Schema Types ─────────────────────────────────────────────────────

/** Brand info nested within the Product schema */
export interface ProductBrand {
  /** Brand name */
  name?: string
}

/** Pricing and availability information */
export interface ProductOffer {
  /** The price of the product, e.g. "29.99" */
  price?: string
  /** ISO 4217 currency code, e.g. "USD" */
  priceCurrency?: string
  /** Product availability status (Schema.org URL) */
  availability?: string
  /** URL of the product offer page */
  url?: string
  /** The condition of the product (Schema.org URL) */
  itemCondition?: string
}

/** Overall rating based on a collection of reviews */
export interface ProductAggregateRating {
  /** The average rating, e.g. "4.5" */
  ratingValue?: string
  /** Total number of reviews */
  reviewCount?: string
  /** The highest possible rating, e.g. "5" */
  bestRating?: string
}

/** A single product review */
export interface ProductReview {
  /** Reviewer name */
  author?: string
  /** Rating value, e.g. "5" */
  reviewRating?: string
  /** Review text */
  reviewBody?: string
}

/** Schema.org Product — data shape returned from a Sanity GROQ query */
export interface SchemaOrgProductData {
  _type?: 'schemaOrgProduct'
  /** Product name */
  name?: string
  /** Product image (URL or ImageObject) */
  image?: import('../article/types').SchemaOrgImageInput
  /** Short description of the product */
  description?: string
  /** The brand of the product */
  brand?: ProductBrand
  /** Stock Keeping Unit */
  sku?: string
  /** Global Trade Item Number */
  gtin?: string
  /** Manufacturer Part Number */
  mpn?: string
  /** Pricing and availability information */
  offers?: ProductOffer
  /** Overall rating based on a collection of reviews */
  aggregateRating?: ProductAggregateRating
  /** Product reviews */
  review?: ProductReview[]
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
