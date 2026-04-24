// ─── Shared Schema.org TypeScript Interfaces ──────────────────────────────────
//
// This file defines the shared type primitives and base interfaces used across
// all Schema.org type definitions. Individual schema `types.ts` files extend
// these base interfaces instead of re-declaring common fields.

// ── Polymorphic primitives ────────────────────────────────────────────────────

/** Copyright year: static number or dynamic (current year) */
export type SchemaOrgCopyrightYear = number | {useDynamicYear?: boolean; year?: number}

/** An organization-only value (no Person variant) */
export type SchemaOrgOrganizationInput = {organization?: Record<string, unknown>}

/** Polymorphic image: URL or full ImageObject */
export type SchemaOrgImageInput =
  | {variant: 'url'; url?: string}
  | {variant: 'imageObject'; imageObject?: Record<string, unknown>}

/** Polymorphic author/publisher/contributor: Person or Organization */
export type SchemaOrgPersonOrOrganization =
  | {variant: 'person'; person?: Record<string, unknown>}
  | {variant: 'organization'; organization?: Record<string, unknown>}

/** Polymorphic text or URL value (used for genre, keywords, additionalType, etc.) */
export type SchemaOrgTextOrUrl = {variant: 'text'; text?: string} | {variant: 'url'; url?: string}

// ── Nested object shapes ──────────────────────────────────────────────────────

/** AggregateRating nested object */
export interface SchemaOrgAggregateRating {
  ratingValue?: string
  ratingCount?: number
  reviewCount?: number
  bestRating?: string
  worstRating?: string
  ratingExplanation?: string
}

/** ArchivedAt: URL or WebPage reference */
export type SchemaOrgArchivedAt =
  | {variant: 'url'; url?: string}
  | {variant: 'webPage'; webPage?: {url?: string; name?: string; description?: string}}

/** ContentRating: plain text or structured Rating */
export type SchemaOrgContentRating =
  | {variant: 'text'; text?: string}
  | {
      variant: 'rating'
      rating?: {
        ratingValue?: string
        bestRating?: string
        worstRating?: string
        ratingExplanation?: string
        author?: SchemaOrgPersonOrOrganization
      }
    }

// ── Shared base interfaces ────────────────────────────────────────────────────

export interface Action {
  /** Search URL template with {search_term_string} placeholder */
  target?: string
}

/** All fields shared by every Schema.org Thing type */
export interface SchemaOrgThingData {
  name?: string
  alternateName?: string
  additionalType?: SchemaOrgTextOrUrl
  description?: string
  disambiguatingDescription?: string
  identifier?: SchemaOrgTextOrUrl
  image?: SchemaOrgImageInput
  url?: string
  sameAs?: string
  owner?: SchemaOrgPersonOrOrganization
  /** A potential action associated with this item (Schema.org Thing) */
  potentialAction?: Action
}

/** All fields shared by every Schema.org CreativeWork type (extends Thing) */
export interface SchemaOrgCreativeWorkData extends SchemaOrgThingData {
  /** Internal — overrides the emitted @type in JSON-LD, e.g. "NewsArticle" */
  alternateType?: string

  // Schema.org CreativeWork fields (alphabetical)
  about?: SchemaOrgThingData
  accountablePerson?: Record<string, unknown>
  aggregateRating?: SchemaOrgAggregateRating
  alternativeHeadline?: string
  archivedAt?: SchemaOrgArchivedAt
  author?: SchemaOrgPersonOrOrganization
  award?: string[]
  backstory?: string
  character?: Record<string, unknown>
  citation?: SchemaOrgTextOrUrl
  contentRating?: SchemaOrgContentRating
  contentReferenceTime?: string
  contributor?: SchemaOrgPersonOrOrganization
  copyrightHolder?: SchemaOrgPersonOrOrganization
  copyrightNotice?: string
  copyrightYear?: SchemaOrgCopyrightYear
  creator?: SchemaOrgPersonOrOrganization
  creditText?: string
  dateCreated?: string
  dateModified?: string
  datePublished?: string
  discussionUrl?: string
  editor?: Record<string, unknown>
  funder?: SchemaOrgPersonOrOrganization
  genre?: SchemaOrgTextOrUrl
  headline?: string
  isAccessibleForFree?: boolean
  isBasedOn?: SchemaOrgTextOrUrl
  inLanguage?: string
  isFamilyFriendly?: boolean
  isPartOf?: SchemaOrgTextOrUrl
  keywords?: SchemaOrgTextOrUrl
  learningResourceType?: string
  license?: SchemaOrgTextOrUrl
  locationCreated?: SchemaOrgTextOrUrl
  mainEntity?: SchemaOrgThingData
  maintainer?: SchemaOrgPersonOrOrganization
  material?: SchemaOrgTextOrUrl
  thumbnailUrl?: string
  /** Publisher of the creative work (Person or Organization) */
  publisher?: SchemaOrgPersonOrOrganization
  /** The publishing division which published the work (Organization only) */
  publisherImprint?: SchemaOrgOrganizationInput
}

export type MergePicked<T, K extends keyof T, U> = Pick<T, K> & U
