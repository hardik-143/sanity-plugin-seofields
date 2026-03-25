/** Schema.org Offer — data shape from GROQ query */
export interface SchemaOrgOfferData {
  _type?: 'schemaOrgOffer'
  /** Price of the offer, e.g. "199.99" */
  price?: string
  /** Currency code, e.g. "USD" */
  priceCurrency?: string
  /** Schema.org availability URL, e.g. "https://schema.org/InStock" */
  availability?: string
  /** URL of the offer page */
  url?: string
}

/** Configuration for `schemaOrgOffer()` */
export interface SchemaOrgOfferConfig {
  validation?: {
    /** Custom error message when price is missing */
    priceRequired?: string
  }
}
