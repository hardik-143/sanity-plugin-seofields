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

/** Department nested within the Organization schema */
export interface OrganizationDepartment {
  /** Department name */
  name?: string
  /** Department URL */
  url?: string
  /** Department phone number */
  telephone?: string
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
  /** An alias or alternate name for the organization */
  alternateName?: string
  /** Social media and external profile URLs */
  sameAs?: string
  /** Primary contact information */
  contactPoint?: OrganizationContactPoint
  /** Departments within the organization */
  department?: OrganizationDepartment[]
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
