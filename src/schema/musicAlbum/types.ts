import type {SchemaOrgCreativeWorkData, SchemaOrgPersonOrOrganization} from '../_types'

/** Schema.org MusicAlbum — data shape from GROQ query */
export interface SchemaOrgMusicAlbumData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgMusicAlbum'
  byArtist?: SchemaOrgPersonOrOrganization
  numTracks?: number
  albumProductionType?: string
  albumReleaseType?: string
  inLanguage?: string
  track?: Array<{
    name?: string
    duration?: string
    url?: string
  }>
}

/** Configuration for `schemaOrgMusicAlbum()` */
export interface SchemaOrgMusicAlbumConfig {
  validation?: Record<string, string>
}
