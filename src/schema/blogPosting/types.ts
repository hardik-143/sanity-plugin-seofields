// ─── BlogPosting Schema Types ─────────────────────────────────────────────────

/** Schema.org BlogPosting — data shape returned from a Sanity GROQ query */
export interface SchemaOrgBlogPostingData {
  _type?: 'schemaOrgBlogPosting'
  /** Headline of the blog post */
  headline?: string
  /** Short summary of the blog post */
  description?: string
  /** Author of the blog post */
  author?: {name?: string}
  /** Date the blog post was published */
  datePublished?: string
  /** Main entity of the page */
  mainEntityOfPage?: {id?: string}
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgBlogPosting()` */
export interface SchemaOrgBlogPostingConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when headline is missing */
    headlineRequired?: string
  }
}
