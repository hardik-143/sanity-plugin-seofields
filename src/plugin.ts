// plugin.ts
import React from 'react'
import {definePlugin} from 'sanity'

import SeoHealthTool from './components/SeoHealthTool'
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

export type ValidHiddenFieldKeys = Exclude<
  AllFieldKeys,
  'openGraphImageUrl' | 'twitterImageUrl' | 'openGraphImageType' | 'twitterImageType'
>

export interface FieldVisibilityConfig {
  hiddenFields?: ValidHiddenFieldKeys[]
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
  fieldOverrides?: Partial<Record<AllFieldKeys, SeoFieldConfig>>
  /**
   * A mapping of document types to field visibility configurations.
   * This allows you to specify which fields should be hidden for specific document types.
   */
  fieldVisibility?: Record<string, FieldVisibilityConfig>

  /**
   * A list of fields that should be hidden by default in all document types.
   * This can be overridden by specific document type settings in `fieldVisibility`.
   */
  defaultHiddenFields?: ValidHiddenFieldKeys[]
  /**
   * The base URL of your website, used for generating full URLs in the SEO preview.
   * Defaults to 'https://www.example.com' if not provided.
   */
  baseUrl?: string
  /**
   * Enable or configure the SEO Health Dashboard tool.
   * If set to `true`, the dashboard is enabled with all defaults.
   * If set to an object, you can customise the tool and dashboard settings.
   * Defaults to `true`.
   * Example:
   * ```
   * healthDashboard: {
   *   toolTitle: 'SEO Overview',  // Studio nav tab label
   *   content: {
   *     icon: '🔍',               // Emoji icon shown before the page heading
   *     title: 'My SEO Dashboard',// Page heading inside the tool (no emoji)
   *     description: 'Track SEO across all documents', // Subtitle under the heading
   *   },
   *   display: {
   *     typeColumn: false,        // Hide the document type column (default: true)
   *     documentId: false,        // Hide the document ID under titles (default: true)
   *   },
   *   query: {
   *     // Option 1 – filter by specific document types
   *     types: ['post', 'page'],
   *     // Option 2 – provide a full custom GROQ query (takes precedence over `types`)
   *     // Must return documents with at least: _id, _type, title, seo, _updatedAt
   *     groq: `*[seo != null && defined(slug.current)]{ _id, _type, title, slug, seo, _updatedAt }`,
   *   },
   * }
   * ```
   */
  healthDashboard?:
    | boolean
    | {
        tool?: {
          title?: string
          name?: string
        }
        toolTitle?: string
        content?: {
          icon?: string
          title?: string
          description?: string
        }
        display?: {
          typeColumn?: boolean
          documentId?: boolean
        }
        query?: {
          /**
           * Limit the dashboard to specific document types.
           * Example: `['post', 'page']`
           */
          types?: string[]
          /**
           * When using `types`, also require the `seo` field to be non-null.
           * Set to `false` to include documents of those types even if `seo` is missing.
           * Defaults to `true`.
           */
          requireSeo?: boolean
          /**
           * Provide a fully custom GROQ query. Takes precedence over `types`.
           * The query must return documents with at least: _id, _type, title, seo, _updatedAt
           */
          groq?: string
        }
        /**
         * The Sanity API version to use for the client (e.g. '2023-01-01').
         * Defaults to '2023-01-01'.
         */
        apiVersion?: string
        /**
         * License key for the SEO Health Dashboard pro feature.
         * Obtain a license at https://sanity-plugin-seofields.thehardik.in
         */
        licenseKey?: string
      }
}

const seofields = definePlugin<SeoFieldsPluginConfig | void>((config = {}) => {
  const {healthDashboard = true} = config as SeoFieldsPluginConfig
  const dashboardEnabled = healthDashboard !== false
  const dashboardToolTitle =
    typeof healthDashboard === 'object'
      ? (healthDashboard.tool?.title ?? 'SEO Health')
      : 'SEO Health'
  const dashboardName =
    typeof healthDashboard === 'object'
      ? (healthDashboard.tool?.name ?? 'seo-health-dashboard')
      : 'seo-health-dashboard'
  const dashboardPageIcon =
    typeof healthDashboard === 'object' ? (healthDashboard.content?.icon ?? undefined) : undefined
  const dashboardPageTitle =
    typeof healthDashboard === 'object' ? (healthDashboard.content?.title ?? undefined) : undefined
  const dashboardDescription =
    typeof healthDashboard === 'object'
      ? (healthDashboard.content?.description ?? undefined)
      : undefined
  const dashboardShowTypeColumn =
    typeof healthDashboard === 'object'
      ? (healthDashboard.display?.typeColumn ?? undefined)
      : undefined
  const dashboardShowDocumentId =
    typeof healthDashboard === 'object'
      ? (healthDashboard.display?.documentId ?? undefined)
      : undefined
  const dashboardQueryTypes =
    typeof healthDashboard === 'object' ? (healthDashboard.query?.types ?? undefined) : undefined
  const dashboardQueryRequireSeo =
    typeof healthDashboard === 'object'
      ? (healthDashboard.query?.requireSeo ?? undefined)
      : undefined
  const dashboardQueryGroq =
    typeof healthDashboard === 'object' ? (healthDashboard.query?.groq ?? undefined) : undefined
  const dashboardApiVersion =
    typeof healthDashboard === 'object' ? (healthDashboard.apiVersion ?? undefined) : undefined
  const dashboardLicenseKey =
    typeof healthDashboard === 'object' ? (healthDashboard.licenseKey ?? undefined) : undefined

  const BoundSeoHealthTool = () =>
    React.createElement(SeoHealthTool, {
      icon: dashboardPageIcon,
      title: dashboardPageTitle,
      description: dashboardDescription,
      showTypeColumn: dashboardShowTypeColumn,
      showDocumentId: dashboardShowDocumentId,
      queryTypes: dashboardQueryTypes,
      queryRequireSeo: dashboardQueryRequireSeo,
      customQuery: dashboardQueryGroq,
      apiVersion: dashboardApiVersion,
      licenseKey: dashboardLicenseKey,
    })

  return {
    name: 'sanity-plugin-seofields',
    schema: {
      types: types(config as SeoFieldsPluginConfig), // pass config down to schemas
    },
    ...(dashboardEnabled && {
      tools: [
        {
          name: dashboardName,
          title: dashboardToolTitle,
          component: BoundSeoHealthTool,
          icon: () => '📊',
        },
      ],
    }),
  }
})

export default seofields
