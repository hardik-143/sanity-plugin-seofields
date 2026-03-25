// ─── FAQPage Schema Types ─────────────────────────────────────────────────────

/** A single FAQ question/answer pair */
export interface FAQItem {
  /** The question text */
  name?: string
  /** The accepted answer */
  acceptedAnswer?: {text?: string}
}

/** Schema.org FAQPage — data shape returned from a Sanity GROQ query */
export interface SchemaOrgFAQPageData {
  _type?: 'schemaOrgFAQPage'
  /** List of FAQ questions and answers */
  mainEntity?: FAQItem[]
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgFAQPage()` */
export interface SchemaOrgFAQPageConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when question text is missing */
    questionRequired?: string
  }
}
