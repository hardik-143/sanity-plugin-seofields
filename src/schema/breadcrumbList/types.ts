// ─── BreadcrumbList Schema Types ──────────────────────────────────────────────

/** A single item in a BreadcrumbList */
export interface BreadcrumbListItem {
  /** Position of this item in the breadcrumb trail */
  position?: number
  /** Display label for this breadcrumb */
  name?: string
  /** URL for this breadcrumb */
  item?: string
}

/** Schema.org BreadcrumbList — data shape returned from a Sanity GROQ query */
export interface SchemaOrgBreadcrumbListData {
  _type?: 'schemaOrgBreadcrumbList'
  /** Ordered list of breadcrumb items */
  itemListElement?: BreadcrumbListItem[]
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgBreadcrumbList()` */
export interface SchemaOrgBreadcrumbListConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when position is missing */
    positionRequired?: string
    /** Custom error message when name is missing */
    nameRequired?: string
  }
}
