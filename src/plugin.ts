// plugin.ts
import React from 'react'
import {definePlugin} from 'sanity'

import types from './schemas/types'
import type {DeprecationWarning, DocumentWithSeoHealth} from './types'

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
        /**
         * @deprecated Use `showTypeColumn` instead. Will be removed in a future major version.
         * @see https://github.com/hardik-143/sanity-plugin-seofields/blob/main/CHANGELOG.md#132--2026-03-23
         */
        display?: {
          /** @deprecated Use top-level `showTypeColumn` instead. */
          typeColumn?: boolean
          /** @deprecated Use top-level `showDocumentId` instead. */
          documentId?: boolean
        }
        /**
         * Show or hide the document type column in the results table.
         * Replaces the deprecated `display.typeColumn`.
         * Defaults to `true`.
         */
        showTypeColumn?: boolean
        /**
         * Show or hide the Sanity document `_id` under each title.
         * Replaces the deprecated `display.documentId`.
         * Defaults to `true`.
         */
        showDocumentId?: boolean
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
         * @deprecated Use `typeDisplayLabels` instead. Will be removed in a future major version.
         * @see https://github.com/hardik-143/sanity-plugin-seofields/blob/main/CHANGELOG.md#132--2026-03-23
         *
         * @example
         * typeLabels: { productDrug: 'Products', singleCondition: 'Condition' }
         */
        typeLabels?: Record<string, string>
        /**
         * Map raw `_type` values to human-readable display labels.
         * Replaces the deprecated `typeLabels`.
         * Used in both the Type column and the Type filter dropdown.
         * Any type without an entry falls back to the raw `_type` string.
         *
         * @example
         * typeDisplayLabels: { productDrug: 'Products', singleCondition: 'Condition' }
         */
        typeDisplayLabels?: Record<string, string>
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
         * @deprecated Use `getDocumentBadge` instead. Will be removed in a future major version.
         * @see https://github.com/hardik-143/sanity-plugin-seofields/blob/main/CHANGELOG.md#132--2026-03-23
         *
         * @example
         * docBadge: (doc) => {
         *   if (doc.services === 'NHS')
         *     return { label: 'NHS', bgColor: '#e0f2fe', textColor: '#0369a1' }
         * }
         */
        docBadge?: (
          doc: DocumentWithSeoHealth & Record<string, unknown>,
        ) => {label: string; bgColor?: string; textColor?: string; fontSize?: string} | undefined
        /**
         * Callback function to render a custom badge next to the document title.
         * Replaces the deprecated `docBadge`.
         * Receives the full document and should return badge data or undefined.
         *
         * @example
         * getDocumentBadge: (doc) => {
         *   if (doc.services === 'NHS')
         *     return { label: 'NHS', bgColor: '#e0f2fe', textColor: '#0369a1' }
         *   if (doc.services === 'Private')
         *     return { label: 'Private', bgColor: '#fef3c7', textColor: '#92400e' }
         * }
         */
        getDocumentBadge?: (
          doc: DocumentWithSeoHealth & Record<string, unknown>,
        ) => {label: string; bgColor?: string; textColor?: string; fontSize?: string} | undefined
        /**
         * The `name` of the Sanity structure tool that contains the monitored documents.
         * Required when you have multiple structure tools and the documents live in a
         * non-default one. Clicking a title will navigate to
         * `/{basePath}/{structureTool}/intent/edit/…` directly.
         *
         * @example
         * structureTool: 'common'
         */
        structureTool?: string
        /**
         * Enable preview/demo mode to show dummy data.
         * Useful for testing, documentation, or showcasing the dashboard.
         * When enabled, displays realistic sample documents with various SEO scores.
         * Defaults to `false`.
         *
         * @example
         * previewMode: true
         */
        previewMode?: boolean
        /**
         * Export options for the SEO Health Dashboard.
         * Set to `true` (default) to enable both CSV and JSON export,
         * or configure per-format.
         */
        export?: boolean | {enabled?: boolean; formats?: Array<'csv' | 'json'>}
        /**
         * Show compact inline stat pills in the header row instead of the
         * full 6-card stats grid. Useful for saving vertical space.
         * Defaults to `false`.
         */
        compactStats?: boolean
      }
}

const V132 = 'v1.3.2'
const CHANGELOG_V132 = `https://github.com/hardik-143/sanity-plugin-seofields/blob/main/CHANGELOG.md#132--2026-03-23`

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
  typeDisplayLabels: Record<string, string> | undefined
  typeColumnMode: 'badge' | 'text' | undefined
  titleField: string | Record<string, string> | undefined
  getDocumentBadge:
    | ((
        doc: DocumentWithSeoHealth & Record<string, unknown>,
      ) => {label: string; bgColor?: string; textColor?: string; fontSize?: string} | undefined)
    | undefined
  loadingLicense: string | undefined
  loadingDocuments: string | undefined
  noDocuments: string | undefined
  previewMode: boolean | undefined
  structureTool: string | undefined
  exportEnabled: boolean
  exportFormats: Array<'csv' | 'json'>
  compactStats: boolean
  /** @internal — deprecated keys detected at config-resolution time, forwarded to the UI banner */
  deprecationWarnings: DeprecationWarning[]
}

const resolveDashboardConfig = (
  healthDashboard: SeoFieldsPluginConfig['healthDashboard'],
): ResolvedDashboardConfig => {
  const cfg = typeof healthDashboard === 'object' ? healthDashboard : undefined
  // Detect deprecated plugin-level keys and emit console warnings with guidance on updating to the new config structure. Warnings are collected in an array and also passed to the dashboard component for display in a banner.
  const deprecationWarnings: DeprecationWarning[] = []

  if (cfg?.display?.typeColumn !== undefined) {
    deprecationWarnings.push({
      key: 'display.typeColumn → showTypeColumn',
      version: V132,
      changelogUrl: CHANGELOG_V132,
    })
    if (cfg.showTypeColumn) {
      console.warn(
        `[sanity-plugin-seofields] Both "healthDashboard.display.typeColumn" and "healthDashboard.showTypeColumn" are set. "showTypeColumn" will take precedence. Please remove "healthDashboard.display.typeColumn". See ${CHANGELOG_V132}`,
      )
    } else {
      console.warn(
        `[sanity-plugin-seofields] "healthDashboard.display.typeColumn" is deprecated. Use "healthDashboard.showTypeColumn" instead. See ${CHANGELOG_V132}`,
      )
    }
  }
  if (cfg?.display?.documentId !== undefined) {
    deprecationWarnings.push({
      key: 'display.documentId → showDocumentId',
      version: V132,
      changelogUrl: CHANGELOG_V132,
    })
    if (cfg.showDocumentId) {
      console.warn(
        `[sanity-plugin-seofields] Both "healthDashboard.display.documentId" and "healthDashboard.showDocumentId" are set. "showDocumentId" will take precedence. Please remove "healthDashboard.display.documentId". See ${CHANGELOG_V132}`,
      )
    } else {
      console.warn(
        `[sanity-plugin-seofields] "healthDashboard.display.documentId" is deprecated. Use "healthDashboard.showDocumentId" instead. See ${CHANGELOG_V132}`,
      )
    }
  }
  if (cfg?.typeLabels) {
    deprecationWarnings.push({
      key: 'typeLabels → typeDisplayLabels',
      version: V132,
      changelogUrl: CHANGELOG_V132,
    })
    if (cfg.typeDisplayLabels) {
      console.warn(
        `[sanity-plugin-seofields] Both "healthDashboard.typeLabels" and "healthDashboard.typeDisplayLabels" are set. "typeDisplayLabels" will take precedence. Please remove "typeLabels". See ${CHANGELOG_V132}`,
      )
    } else {
      console.warn(
        `[sanity-plugin-seofields] "healthDashboard.typeLabels" is deprecated. Use "healthDashboard.typeDisplayLabels" instead. See ${CHANGELOG_V132}`,
      )
    }
  }
  if (cfg?.docBadge) {
    deprecationWarnings.push({
      key: 'docBadge → getDocumentBadge',
      version: V132,
      changelogUrl: CHANGELOG_V132,
    })
    if (cfg?.getDocumentBadge) {
      console.warn(
        `[sanity-plugin-seofields] Both "healthDashboard.docBadge" and "healthDashboard.getDocumentBadge" are set. "getDocumentBadge" will take precedence. Please remove "docBadge". See ${CHANGELOG_V132}`,
      )
    } else {
      console.warn(
        `[sanity-plugin-seofields] "healthDashboard.docBadge" is deprecated. Use "healthDashboard.getDocumentBadge" instead. See ${CHANGELOG_V132}`,
      )
    }
  }

  return {
    enabled: healthDashboard !== false,
    toolTitle: cfg?.tool?.title ?? 'SEO Health',
    toolName: cfg?.tool?.name ?? 'seo-health-dashboard',
    icon: cfg?.content?.icon,
    title: cfg?.content?.title,
    description: cfg?.content?.description,
    // New flat keys take precedence; fall back to deprecated display.* for backwards compat
    showTypeColumn: cfg?.showTypeColumn ?? cfg?.display?.typeColumn,
    showDocumentId: cfg?.showDocumentId ?? cfg?.display?.documentId,
    queryTypes: cfg?.query?.types,
    queryRequireSeo: cfg?.query?.requireSeo,
    queryGroq: cfg?.query?.groq,
    apiVersion: cfg?.apiVersion,
    licenseKey: cfg?.licenseKey,
    // New key takes precedence; fall back to deprecated key for backwards compat
    typeDisplayLabels: cfg?.typeDisplayLabels ?? cfg?.typeLabels,
    typeColumnMode: cfg?.typeColumnMode,
    titleField: cfg?.titleField,
    // New key takes precedence; fall back to deprecated key for backwards compat
    getDocumentBadge: cfg?.getDocumentBadge ?? cfg?.docBadge,
    loadingLicense: cfg?.content?.loadingLicense,
    loadingDocuments: cfg?.content?.loadingDocuments,
    noDocuments: cfg?.content?.noDocuments,
    previewMode: cfg?.previewMode,
    structureTool: cfg?.structureTool,
    exportEnabled: (() => {
      const exportCfg = cfg?.export
      if (exportCfg === false) return false
      if (typeof exportCfg === 'object') return exportCfg.enabled ?? true
      return true
    })(),
    exportFormats: (() => {
      const exportCfg = cfg?.export
      if (typeof exportCfg === 'object' && exportCfg.formats) return exportCfg.formats
      return ['csv', 'json'] as Array<'csv' | 'json'>
    })(),
    compactStats: cfg?.compactStats ?? false,
    deprecationWarnings,
  }
}

const seofields = definePlugin<SeoFieldsPluginConfig | void>((config = {}) => {
  const {healthDashboard = true} = config as SeoFieldsPluginConfig
  const dash = resolveDashboardConfig(healthDashboard)

  const LazySeoHealthTool = React.lazy(() => import('./components/SeoHealthTool'))

  const BoundSeoHealthTool = () =>
    React.createElement(
      React.Suspense,
      {fallback: null},
      React.createElement(LazySeoHealthTool, {
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
        typeDisplayLabels: dash.typeDisplayLabels,
        typeColumnMode: dash.typeColumnMode,
        titleField: dash.titleField,
        getDocumentBadge: dash.getDocumentBadge,
        loadingLicense: dash.loadingLicense,
        loadingDocuments: dash.loadingDocuments,
        noDocuments: dash.noDocuments,
        previewMode: dash.previewMode,
        structureTool: dash.structureTool,
        exportEnabled: dash.exportEnabled,
        exportFormats: dash.exportFormats,
        compactStats: dash.compactStats,
        _deprecationWarnings: dash.deprecationWarnings,
      }),
    )

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
