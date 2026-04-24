import type {SchemaOrgCreativeWorkData, SchemaOrgPersonOrOrganization} from '../_types'

/** Schema.org MusicRecording — data shape from GROQ query */
export interface SchemaOrgMusicRecordingData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgMusicRecording'
  byArtist?: SchemaOrgPersonOrOrganization
  duration?: string
  inAlbum?: string
  isrcCode?: string
  inLanguage?: string
  recordingOf?: string
}

/** Configuration for `schemaOrgMusicRecording()` */
export interface SchemaOrgMusicRecordingConfig {
  validation?: Record<string, string>
}
