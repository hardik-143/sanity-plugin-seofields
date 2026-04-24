import type {SchemaOrgCreativeWorkData} from '../_types'

/** SeekToAction nested within the VideoObject schema (potentialAction) */
export interface VideoObjectSeekAction {
  /** Video URL with {seek_to_second_number} placeholder */
  target?: string
  /** Offset parameter name */
  startOffsetInput?: string
}

/** Schema.org VideoObject — data shape from GROQ query */
export interface SchemaOrgVideoObjectData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgVideoObject'
  /** Date the video was uploaded (ISO 8601) */
  uploadDate?: string
  /** URL to the actual video file */
  contentUrl?: string
  /** URL for an embeddable player */
  embedUrl?: string
  /** Video duration in ISO 8601 format */
  duration?: string
  /** Override potentialAction with VideoObject-specific seek action */
  potentialAction?: VideoObjectSeekAction
}

/** Configuration for `schemaOrgVideoObject()` */
export interface SchemaOrgVideoObjectConfig {
  validation?: {
    /** Custom error message when video name is missing */
    nameRequired?: string
  }
}
