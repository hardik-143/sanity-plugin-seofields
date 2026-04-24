// ─── Event Schema Types ───────────────────────────────────────────────────────

import type {SchemaOrgPersonOrOrganization} from '../_types'

/** Schema.org Event — data shape returned from a Sanity GROQ query */
export interface SchemaOrgEventData {
  _type?: 'schemaOrgEvent'
  /** Name of the event */
  name?: string
  /** Start date of the event (ISO 8601) */
  startDate?: string
  /** A person or organization that sponsors the event */
  sponsor?: SchemaOrgPersonOrOrganization
  /** Location of the event */
  location?: {name?: string; address?: string}
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgEvent()` */
export interface SchemaOrgEventConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when event name is missing */
    nameRequired?: string
  }
}
