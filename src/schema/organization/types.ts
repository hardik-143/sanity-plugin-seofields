import type {SanityImage} from '../../types'

// ─── Organization Schema Types ────────────────────────────────────────────────

/** Contact point nested within the Organization schema */
export interface OrganizationContactPoint {
  /** e.g. "customer support", "sales", "technical support" */
  contactType?: string
  /** Contact email address */
  email?: string
  /** Languages supported, e.g. ["English", "Spanish"] */
  availableLanguage?: string[]
}

/** Schema.org Organization — data shape returned from a Sanity GROQ query */
export interface SchemaOrgOrganizationData {
  _type?: 'schemaOrgOrganization'
  /** Official name of the organization */
  name?: string
  /** Full URL of the organization website */
  url?: string
  /** Direct URL to the organization logo */
  logoUrl?: string
  /** Sanity image upload for the logo (use imageUrlResolver to convert) */
  logo?: SanityImage
  /** Short description of the organization */
  description?: string
  /** Social media and external profile URLs */
  sameAs?: string[]
  /** Primary contact information */
  contactPoint?: OrganizationContactPoint
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgOrganization()` */
export interface SchemaOrgOrganizationConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when organization name is missing */
    nameRequired?: string
    /** Custom error message when organization URL is missing */
    urlRequired?: string
  }
}
