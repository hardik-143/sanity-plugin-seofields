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

export type openGraphFieldKeys =
  | 'openGraphUrl'
  | 'openGraphTitle'
  | 'openGraphDescription'
  | 'openGraphSiteName'
  | 'openGraphType'
  | 'openGraphImageType'
  | 'openGraphImage'
  | 'openGraphImageUrl'

export type twitterFieldKeys =
  | 'twitterCard'
  | 'twitterSite'
  | 'twitterCreator'
  | 'twitterTitle'
  | 'twitterDescription'
  | 'twitterImageType'
  | 'twitterImage'
  | 'twitterImageUrl'

export type AllFieldKeys = SeoFieldKeys | openGraphFieldKeys | twitterFieldKeys

export interface FieldVisibilityConfig {
  hiddenFields?: AllFieldKeys[]
  postType?: string
}

export interface SeoFieldsPluginConfig {
  /**
   * Enable or configure the SEO preview feature.
   * If set to `true`, the SEO preview will be enabled with default settings.
   * If set to an object, you can provide a custom prefix function to modify the URL prefix in the preview.
   * The prefix function receives the current document as an argument and should return a string.
   * Example:
   * ```
   * seoPreview: {
   *   prefix: (doc) => `/${doc.slug?.current || 'untitled'}`
   * }
   * ```
   */
  seoPreview?:
    | boolean
    | {
        prefix?: (doc: {_type?: string} & Record<string, unknown>) => string
      }

  /**
   * A mapping of field keys to their configuration settings.
   * This allows customization of field titles and descriptions.
   * For example, to change the title of the 'title' field:
   */
  fieldOverrides?: {
    [key in AllFieldKeys]?: SeoFieldConfig
  }
  /**
   * A mapping of document types to field visibility configurations.
   * This allows you to specify which fields should be hidden for specific document types.
   */
  fieldVisibility?: {
    [postType: string]: FieldVisibilityConfig
  }

  /**
   * A list of fields that should be hidden by default in all document types.
   * This can be overridden by specific document type settings in `fieldVisibility`.
   */
  defaultHiddenFields?: AllFieldKeys[]
  /**
   * The base URL of your website, used for generating full URLs in the SEO preview.
   * Defaults to 'https://www.example.com' if not provided.
   */
  baseUrl?: string
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
