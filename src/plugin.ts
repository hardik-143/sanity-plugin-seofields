// plugin.ts
import React from 'react'
import {definePlugin} from 'sanity'

import SeoHealthTool from './components/SeoHealthTool'
import types from './schemas/types'
import type {DocumentWithSeoHealth} from './types'

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
          /** Text shown while the license key is being verified. Defaults to "Verifying license…" */
          loadingLicense?: string
          /** Text shown while documents are being fetched. Defaults to "Loading documents…" */
          loadingDocuments?: string
          /** Text shown when the query returns zero results. Defaults to "No documents found" */
          noDocuments?: string
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
        /**
         * Map raw `_type` values to human-readable display labels.
         * Used in both the Type column and the Type filter dropdown.
         * Any type without an entry falls back to the raw `_type` string.
         *
         * @example
         * typeLabels: { productDrug: 'Products', singleCondition: 'Condition' }
         */
        typeLabels?: Record<string, string>
        /**
         * Controls how the document type is rendered in the Type column.
         * - `'badge'` (default) — coloured pill
         * - `'text'` — plain text, useful for dense layouts
         */
        typeColumnMode?: 'badge' | 'text'
        /**
         * The document field to use as the display title in the dashboard.
         *
         * - `string` — use this field for every document type (e.g. `'name'`)
         * - `Record<string, string>` — per-type mapping; unmapped types fall back to `title`
         *
         * @example
         * titleField: 'name'
         *
         * @example
         * titleField: { post: 'title', product: 'name', category: 'label' }
         */
        titleField?: string | Record<string, string>
        /**
         * Callback function to render a custom badge next to the document title.
         * Receives the full document and should return badge data or undefined.
         *
         * @example
         * docBadge: (doc) => {
         *   if (doc.services === 'NHS')
         *     return { label: 'NHS', bgColor: '#e0f2fe', textColor: '#0369a1' }
         *   if (doc.services === 'Private')
         *     return { label: 'Private', bgColor: '#fef3c7', textColor: '#92400e' }
         * }
         */
        docBadge?: (
          doc: DocumentWithSeoHealth & Record<string, unknown>,
        ) => {label: string; bgColor?: string; textColor?: string; fontSize?: string} | undefined
      }
}

interface ResolvedDashboardConfig {
  enabled: boolean
  toolTitle: string
  toolName: string
  icon: string | undefined
  title: string | undefined
  description: string | undefined
  showTypeColumn: boolean | undefined
  showDocumentId: boolean | undefined
  queryTypes: string[] | undefined
  queryRequireSeo: boolean | undefined
  queryGroq: string | undefined
  apiVersion: string | undefined
  licenseKey: string | undefined
  typeLabels: Record<string, string> | undefined
  typeColumnMode: 'badge' | 'text' | undefined
  titleField: string | Record<string, string> | undefined
  docBadge:
    | ((
        doc: DocumentWithSeoHealth & Record<string, unknown>,
      ) => {label: string; bgColor?: string; textColor?: string; fontSize?: string} | undefined)
    | undefined
  loadingLicense: string | undefined
  loadingDocuments: string | undefined
  noDocuments: string | undefined
}

const resolveDashboardConfig = (
  healthDashboard: SeoFieldsPluginConfig['healthDashboard'],
): ResolvedDashboardConfig => {
  const cfg = typeof healthDashboard === 'object' ? healthDashboard : undefined
  return {
    enabled: healthDashboard !== false,
    toolTitle: cfg?.tool?.title ?? 'SEO Health',
    toolName: cfg?.tool?.name ?? 'seo-health-dashboard',
    icon: cfg?.content?.icon,
    title: cfg?.content?.title,
    description: cfg?.content?.description,
    showTypeColumn: cfg?.display?.typeColumn,
    showDocumentId: cfg?.display?.documentId,
    queryTypes: cfg?.query?.types,
    queryRequireSeo: cfg?.query?.requireSeo,
    queryGroq: cfg?.query?.groq,
    apiVersion: cfg?.apiVersion,
    licenseKey: cfg?.licenseKey,
    typeLabels: cfg?.typeLabels,
    typeColumnMode: cfg?.typeColumnMode,
    titleField: cfg?.titleField,
    docBadge: cfg?.docBadge,
    loadingLicense: cfg?.content?.loadingLicense,
    loadingDocuments: cfg?.content?.loadingDocuments,
    noDocuments: cfg?.content?.noDocuments,
  }
}

const seofields = definePlugin<SeoFieldsPluginConfig | void>((config = {}) => {
  const {healthDashboard = true} = config as SeoFieldsPluginConfig
  const dash = resolveDashboardConfig(healthDashboard)

  const BoundSeoHealthTool = () =>
    React.createElement(SeoHealthTool, {
      icon: dash.icon,
      title: dash.title,
      description: dash.description,
      showTypeColumn: dash.showTypeColumn,
      showDocumentId: dash.showDocumentId,
      queryTypes: dash.queryTypes,
      queryRequireSeo: dash.queryRequireSeo,
      customQuery: dash.queryGroq,
      apiVersion: dash.apiVersion,
      licenseKey: dash.licenseKey,
      typeLabels: dash.typeLabels,
      typeColumnMode: dash.typeColumnMode,
      titleField: dash.titleField,
      docBadge: dash.docBadge,
      loadingLicense: dash.loadingLicense,
      loadingDocuments: dash.loadingDocuments,
      noDocuments: dash.noDocuments,
    })

  return {
    name: 'sanity-plugin-seofields',
    schema: {
      types: types(config as SeoFieldsPluginConfig),
    },
    ...(dash.enabled && {
      tools: [
        {
          name: dash.toolName,
          title: dash.toolTitle,
          component: BoundSeoHealthTool,
          icon: () => '📊',
        },
      ],
    }),
  }
})

export default seofields
