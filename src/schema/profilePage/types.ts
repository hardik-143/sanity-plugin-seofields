import type {SchemaOrgThingData} from '../_types'

/** Schema.org ProfilePage — data shape from GROQ query */
export interface SchemaOrgProfilePageData extends SchemaOrgThingData {
  _type?: 'schemaOrgProfilePage'
  dateCreated?: string
  dateModified?: string
  mainEntity?: {
    name?: string
    url?: string
    image?: string
    description?: string
    sameAs?: string
    jobTitle?: string
    alumniOf?: string
    knowsAbout?: string[]
    interactionStatistic?: Array<{
      interactionType?: string
      userInteractionCount?: number
    }>
  }
}

/** Configuration for `schemaOrgProfilePage()` */
export interface SchemaOrgProfilePageConfig {
  validation?: Record<string, string>
}
