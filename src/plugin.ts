// plugin.ts
import {type ComponentType, createElement, lazy, Suspense} from 'react'
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

/**
 * Names of top-level fields inside the `seoFields` object type.
 * Use these when assigning fields to groups in `fieldGroups`.
 */
export type SeoObjectFieldName =
  | 'robots'
  | 'preview'
  | 'title'
  | 'description'
  | 'metaImage'
  | 'metaAttributes'
  | 'keywords'
  | 'canonicalUrl'
  | 'openGraph'
  | 'twitter'

/**
 * Defines a single tab/group within the `seoFields` object.
 */
export interface SeoFieldGroup {
  /** Unique key for this group (used internally by Sanity). */
  name: string
  /** Human-readable label shown as the tab title. */
  title: string
  /** Whether this tab is selected by default. Only one group should be `true`. */
  default?: boolean
  /**
   * Field names to include in this group.
   * Use the top-level seoFields field names: `'title'`, `'description'`, `'metaImage'`,
   * `'keywords'`, `'canonicalUrl'`, `'metaAttributes'`, `'robots'`, `'preview'`,
   * `'openGraph'`, `'twitter'`.
   */
  fields: SeoObjectFieldName[]
  /** Optional icon displayed next to the tab title. Must be a React component. */
  icon?: ComponentType
}

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
   * If set to an object, you can provide a custom `prefix` function to modify the URL prefix
   * and/or a `titleSuffix` to append text (e.g. a brand name) after the meta title in the preview.
   *
   * Example:
   * ```
   * seoPreview: {
   *   prefix: (doc) => `/${doc.slug?.current || 'untitled'}`,
   *   titleSuffix: ' | Acme Corp',
   *   // or dynamically:
   *   titleSuffix: (doc) => ` | ${doc.brandName || 'Acme Corp'}`,
   * }
   * ```
   */
  seoPreview?:
    | boolean
    | {
        prefix?: (doc: {_type?: string} & Record<string, unknown>) => string
        /**
         * A static string or function appended to the meta title in the Live Preview.
         * Useful for showing a brand suffix (e.g. `' | Acme Corp'`) that is added
         * via your Next.js title template but not stored in the Sanity field.
         * The suffix is rendered in a muted style so editors can distinguish it from
         * the typed title.  The combined length is checked against the 60-character
         * SERP limit.
         */
        titleSuffix?: string | ((doc: {_type?: string} & Record<string, unknown>) => string)
        /**
         * When `true`, the `titleSuffix` is rendered in the same color and weight
         * as the main title (`#1a0dab`, `fontWeight: 500`) instead of the default
         * muted style (`#70757a`, `fontWeight: 400`).
         *
         * @default false
         */
        titleSuffixInheritColor?: boolean
        /**
         * A GROQ query string whose result is used as the title suffix in the Live Preview.
         * The query runs against your dataset at Studio load time, making it useful for
         * fetching a dynamic value from another document (e.g. a settings singleton).
         * Takes priority over `titleSuffix` when both are provided.
         *
         * @example
         * ```ts
         * titleSuffixQuery: '*[_type == "siteSettings"][0].siteName'
         * ```
         */
        titleSuffixQuery?: string
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
   * Group the SEO fields into tabbed sections inside the `seoFields` object.
   * When configured, the Studio shows tabs (Sanity groups) so editors can
   * switch between e.g. "Meta", "Open Graph", and "Twitter Card" panels.
   *
   * @example
   * fieldGroups: [
   *   { name: 'meta',      title: 'Meta',         default: true,
   *     fields: ['title', 'description', 'metaImage', 'keywords', 'canonicalUrl', 'metaAttributes', 'robots', 'preview'] },
   *   { name: 'openGraph', title: 'Open Graph',   fields: ['openGraph'] },
   *   { name: 'twitter',   title: 'Twitter Card', fields: ['twitter'] },
   * ]
   */
  fieldGroups?: SeoFieldGroup[]
  /**
   * The base URL of your website, used for generating full URLs in the SEO preview.
   * Defaults to 'https://www.example.com' if not provided.
   */
  baseUrl?: string
  /**
   * The Sanity API version to use for all plugin clients (SEO Preview, Health Dashboard).
   * Defaults to '2024-01-01'.
   * @example '2024-01-01'
   */
  apiVersion?: string
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
         * Show or hide the document type column in the results table.
         * Defaults to `true`.
         */
        showTypeColumn?: boolean
        /**
         * Show or hide the Sanity document `_id` under each title.
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
         * @deprecated Use the root-level `apiVersion` option instead.
         * @example
         * // Before (deprecated):
         * healthDashboard: { apiVersion: '2024-01-01' }
         * // After:
         * apiVersion: '2024-01-01'
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
  /** @internal — forwarded to the UI banner when deprecated config keys are detected */
  deprecationWarnings: DeprecationWarning[]
}

// const V132 = 'v1.3.2'
// const CHANGELOG_V132 = `https://github.com/hardik-143/sanity-plugin-seofields/blob/main/CHANGELOG.md#132--2026-03-23`

const resolveDashboardConfig = (
  healthDashboard: SeoFieldsPluginConfig['healthDashboard'],
  rootApiVersion?: string,
): ResolvedDashboardConfig => {
  const cfg = typeof healthDashboard === 'object' ? healthDashboard : undefined

  const deprecationWarnings: DeprecationWarning[] = []
  if (cfg?.apiVersion !== undefined) {
    deprecationWarnings.push({
      key: 'healthDashboard.apiVersion → apiVersion',
      version: 'v1.6.1',
      changelogUrl: 'https://github.com/hardik-143/sanity-plugin-seofields/blob/main/CHANGELOG.md',
    })
    console.warn(
      '[sanity-plugin-seofields] "healthDashboard.apiVersion" is deprecated. Move it to the root "apiVersion" option instead.',
    )
  }

  return {
    enabled: healthDashboard !== false,
    toolTitle: cfg?.tool?.title ?? 'SEO Health',
    toolName: cfg?.tool?.name ?? 'seo-health-dashboard',
    icon: cfg?.content?.icon,
    title: cfg?.content?.title,
    description: cfg?.content?.description,
    showTypeColumn: cfg?.showTypeColumn,
    showDocumentId: cfg?.showDocumentId,
    queryTypes: cfg?.query?.types,
    queryRequireSeo: cfg?.query?.requireSeo,
    queryGroq: cfg?.query?.groq,
    apiVersion: cfg?.apiVersion ?? rootApiVersion,
    licenseKey: cfg?.licenseKey,
    typeDisplayLabels: cfg?.typeDisplayLabels,
    typeColumnMode: cfg?.typeColumnMode,
    titleField: cfg?.titleField,
    getDocumentBadge: cfg?.getDocumentBadge,
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
  const dash = resolveDashboardConfig(healthDashboard, (config as SeoFieldsPluginConfig).apiVersion)

  const LazySeoHealthTool = lazy(() => import('./components/SeoHealthTool'))

  const BoundSeoHealthTool = () =>
    createElement(
      Suspense,
      {fallback: null},
      createElement(LazySeoHealthTool, {
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
