// ─── Article Schema Types ─────────────────────────────────────────────────────

/** Schema.org Article — data shape returned from a Sanity GROQ query */
export interface SchemaOrgArticleData {
  _type?: 'schemaOrgArticle'
  /** Headline of the article */
  headline?: string
  /** Short summary of the article */
  description?: string
  /** URL of the article image */
  image?: string
  /** Author of the article */
  author?: {name?: string}
  /** Publisher of the article */
  publisher?: {name?: string; logo?: {url?: string}}
  /** Date the article was published */
  datePublished?: string
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgArticle()` */
export interface SchemaOrgArticleConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when headline is missing */
    headlineRequired?: string
  }
}
