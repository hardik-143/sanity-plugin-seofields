// ─── HowTo Schema Types ──────────────────────────────────────────────────────

/** A single step in a HowTo guide */
export interface HowToStepItem {
  /** Name of the step */
  name?: string
  /** Description of the step */
  text?: string
}

/** Schema.org HowTo — data shape returned from a Sanity GROQ query */
export interface SchemaOrgHowToData {
  _type?: 'schemaOrgHowTo'
  /** Name of the how-to guide */
  name?: string
  /** Short description of the how-to guide */
  description?: string
  /** Steps in the how-to guide */
  step?: HowToStepItem[]
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgHowTo()` */
export interface SchemaOrgHowToConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when name is missing */
    nameRequired?: string
    /** Custom error message when step name is missing */
    stepNameRequired?: string
  }
}
