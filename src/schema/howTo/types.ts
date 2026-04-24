// ─── HowTo Schema Types ──────────────────────────────────────────────────────

import type {SchemaOrgCreativeWorkData} from '../_types'

/** A single step in a HowTo guide */
export interface HowToStepItem {
  /** Name of the step */
  name?: string
  /** Description of the step */
  text?: string
  /** URL for this specific step */
  url?: string
  /** URL of an image for this step */
  image?: string
}

/** Estimated cost to complete the how-to */
export interface HowToMonetaryAmount {
  /** ISO 4217 currency code, e.g. "USD" */
  currency?: string
  /** The cost amount, e.g. "25.00" */
  value?: string
}

/** A supply needed for the how-to */
export interface HowToSupply {
  /** Supply name */
  name?: string
}

/** A tool needed for the how-to */
export interface HowToTool {
  /** Tool name */
  name?: string
}

/** Schema.org HowTo — data shape returned from a Sanity GROQ query */
export interface SchemaOrgHowToData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgHowTo'
  totalTime?: string
  estimatedCost?: HowToMonetaryAmount
  supply?: HowToSupply[]
  tool?: HowToTool[]
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
