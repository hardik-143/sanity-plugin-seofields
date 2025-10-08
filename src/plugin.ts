// plugin.ts
import {definePlugin} from 'sanity'
import types from './schemas/types'

export interface SeoFieldConfig {
  title?: string
  description?: string
}

export type SeoFieldKeys =
  | 'title'
  | 'description'
  | 'canonicalUrl'
  | 'metaImage'
  | 'keywords'
  | 'metaAttributes'
  | 'robots'

export type SitewideFieldKeys = 'openGraphSiteName' | 'twitterSite'

export type AllFieldKeys = SeoFieldKeys | SitewideFieldKeys

export interface FieldVisibilityConfig {
  hiddenFields?: AllFieldKeys[]
  postType?: string
}

export interface SeoFieldsPluginConfig {
  seoPreview?: boolean
  fieldOverrides?: {
    [key in SeoFieldKeys]?: SeoFieldConfig
  }
  fieldVisibility?: {
    [postType: string]: FieldVisibilityConfig
  }
  defaultHiddenFields?: AllFieldKeys[]
}

const seofields = definePlugin<SeoFieldsPluginConfig | void>((config = {}) => {
  return {
    name: 'sanity-plugin-seofields',
    schema: {
      types: types(config as SeoFieldsPluginConfig), // pass config down to schemas
    },
  }
})

export default seofields
