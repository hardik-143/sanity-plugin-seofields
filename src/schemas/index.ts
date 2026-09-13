import {type ComponentType, createElement, lazy, Suspense} from 'react'
import {
  defineField,
  defineType,
  FieldDefinition,
  FieldGroupDefinition,
  SchemaTypeDefinition,
  StringInputProps,
} from 'sanity'

import GEOChecklist from '../components/geo/GEOChecklist'
import FocusKeywordInput from '../components/meta/FocusKeywordInput'
import HreflangInput from '../components/meta/HreflangInput'
import KeywordsInput from '../components/meta/KeywordsInput'
import MetaDescription from '../components/meta/MetaDescription'
import MetaImage from '../components/meta/MetaImage'
import MetaTagsPreview from '../components/meta/MetaTagsPreview'
import MetaTitle from '../components/meta/MetaTitle'
import {SeoPerformanceUpgradeCard} from '../performanceStub'
import type {SeoFieldGroup, SeoFieldsPluginConfig, SeoObjectFieldName} from '../plugin'
import {
  getFieldHiddenFunction,
  getFieldInfo,
  getKeywordsVisibilityChecker,
  withLicense,
} from '../utils/fieldsUtils'
import {isEmpty} from '../utils/utils'
import openGraph from './types/openGraph'
import twitter from './types/twitter'

// Lazy-load SeoPreview to avoid styled-components breaking `sanity schema extract`
const LazySeoPreview = lazy(() => import('../components/SeoPreview'))
const SeoPreviewWrapper = (props: StringInputProps) =>
  createElement(Suspense, {fallback: null}, createElement(LazySeoPreview, props))
// The summary input is a paid feature living in `seofields-pro`. Keep the
// dynamic import: it keeps the pro bundle out of the schema module graph, which
// `sanity schema extract` walks statically, and it lets a Studio without the pro
// package fall back to the upgrade card instead of failing to load the schema.
const LazySeoPerformanceSummary = lazy(() =>
  import('seofields-pro')
    .then((module) =>
      typeof module.SeoPerformanceSummary === 'function'
        ? {default: module.SeoPerformanceSummary as unknown as ComponentType<StringInputProps>}
        : {default: SeoPerformanceUpgradeCard as unknown as ComponentType<StringInputProps>},
    )
    .catch(() => ({
      default: SeoPerformanceUpgradeCard as unknown as ComponentType<StringInputProps>,
    })),
)
const SeoPerformanceSummaryWrapper = (props: StringInputProps) =>
  createElement(Suspense, {fallback: null}, createElement(LazySeoPerformanceSummary, props))

/**
 * Build a field-name → group-name(s) lookup from the plugin config.
 * A field can appear in multiple groups (Sanity supports `group: string[]`).
 */
function buildFieldGroupMap(groups: SeoFieldGroup[]): Map<SeoObjectFieldName, string[]> {
  const map = new Map<SeoObjectFieldName, string[]>()
  for (const g of groups) {
    for (const fieldName of g.fields) {
      const existing = map.get(fieldName)
      if (existing) {
        existing.push(g.name)
      } else {
        map.set(fieldName, [g.name])
      }
    }
  }
  return map
}

/**
 * Convert plugin `SeoFieldGroup[]` into Sanity `FieldGroupDefinition[]`.
 */
function toSanityGroups(groups: SeoFieldGroup[]): FieldGroupDefinition[] {
  return groups.map((g) => {
    const def: FieldGroupDefinition = {
      name: g.name,
      title: g.title,
      default: g.default,
    }
    if (g.icon && typeof g.icon !== 'string') {
      def.icon = g.icon
    }
    return def
  })
}

/**
 * Attach the `group` property to a field definition when groups are configured.
 */
function withGroup(
  field: FieldDefinition,
  fieldGroupMap: Map<SeoObjectFieldName, string[]> | undefined,
): FieldDefinition {
  if (!fieldGroupMap) return field
  const groups = fieldGroupMap.get(field.name as SeoObjectFieldName)
  if (!groups || groups.length === 0) return field
  return {...field, group: groups.length === 1 ? groups[0] : groups} as FieldDefinition
}

type SeoPreviewConfig = SeoFieldsPluginConfig['seoPreview']

function shouldShowPreviewField(seoPreview: SeoPreviewConfig): boolean {
  if (typeof seoPreview === 'boolean') return seoPreview
  if (typeof seoPreview === 'object') return !isEmpty(seoPreview)
  return false
}

/** Options shared between the `preview` field and the `title` field's suffix behavior. */
function getSeoPreviewSuffixOptions(seoPreview: SeoPreviewConfig): Record<string, unknown> {
  if (typeof seoPreview !== 'object' || !seoPreview) return {}
  const extra: Record<string, unknown> = {}
  if (seoPreview.titleSuffix) extra.titleSuffix = seoPreview.titleSuffix
  if (seoPreview.titleSuffixQuery) extra.titleSuffixQuery = seoPreview.titleSuffixQuery
  return extra
}

function getPreviewFieldOptions(config: SeoFieldsPluginConfig): Record<string, unknown> {
  const seoPreview = config.seoPreview
  const extra: Record<string, unknown> = {}
  if (typeof seoPreview === 'object' && seoPreview) {
    if (seoPreview.prefix) extra.prefix = seoPreview.prefix
    if (seoPreview.titleSuffixInheritColor) {
      extra.titleSuffixInheritColor = seoPreview.titleSuffixInheritColor
    }
  }

  return {
    baseUrl: config.baseUrl || 'https://www.example.com',
    ...(config.apiVersion ? {apiVersion: config.apiVersion} : {}),
    ...getSeoPreviewSuffixOptions(seoPreview),
    ...extra,
  }
}

function getAiOption(config: SeoFieldsPluginConfig): Record<string, unknown> {
  return config.ai ? {ai: withLicense(config.ai, config.licenseKey)} : {}
}

function getTitleFieldOptions(config: SeoFieldsPluginConfig): Record<string, unknown> {
  return {
    ...(config.apiVersion ? {apiVersion: config.apiVersion} : {}),
    ...getSeoPreviewSuffixOptions(config.seoPreview),
    ...getAiOption(config),
    isKeywordsVisible: getKeywordsVisibilityChecker(config),
  }
}

function buildGeoChecklistField(
  config: SeoFieldsPluginConfig,
  fieldGroupMap: Map<SeoObjectFieldName, string[]> | undefined,
): FieldDefinition[] {
  if (config.geo === false) return []
  return [
    withGroup(
      defineField({
        name: 'geoChecklist',
        ...getFieldInfo('geoChecklist', config.fieldOverrides),
        type: 'string',
        readOnly: true,
        components: {
          input: GEOChecklist,
        },
        options: {
          ...(config.licenseKey ? {licenseKey: config.licenseKey} : {}),
        } as Record<string, unknown>,
        hidden: getFieldHiddenFunction('geoChecklist', config),
      }),
      fieldGroupMap,
    ),
  ]
}

function buildMetaTagsPreviewField(
  config: SeoFieldsPluginConfig,
  fieldGroupMap: Map<SeoObjectFieldName, string[]> | undefined,
): FieldDefinition[] {
  if (config.metaTagsPreview === false) return []
  return [
    withGroup(
      defineField({
        name: 'metaTagsPreview',
        ...getFieldInfo('metaTagsPreview', config.fieldOverrides),
        type: 'string',
        readOnly: true,
        components: {
          input: MetaTagsPreview,
        },
        hidden: getFieldHiddenFunction('metaTagsPreview', config),
      }),
      fieldGroupMap,
    ),
  ]
}

export default function seoFieldsSchema(config: SeoFieldsPluginConfig = {}): SchemaTypeDefinition {
  const groupsCfg = config.fieldGroups
  const fieldGroupMap = groupsCfg?.length ? buildFieldGroupMap(groupsCfg) : undefined
  const sanityGroups = groupsCfg?.length ? toSanityGroups(groupsCfg) : undefined

  return defineType({
    name: 'seoFields',
    title: 'SEO Fields',
    type: 'object',
    ...(sanityGroups ? {groups: sanityGroups} : {}),
    fields: [
      withGroup(
        defineField({
          name: 'robots',
          title: 'Robots Settings',
          type: 'robots',
          hidden: getFieldHiddenFunction('robots', config),
        }),
        fieldGroupMap,
      ),
      // 👇 conditionally spread preview field
      ...(shouldShowPreviewField(config.seoPreview)
        ? [
            withGroup(
              defineField({
                name: 'preview',
                title: 'SEO Preview',
                type: 'string',
                components: {input: SeoPreviewWrapper},
                options: getPreviewFieldOptions(config) as Record<string, unknown>,
                initialValue: '' as string,
                readOnly: true,
              }),
              fieldGroupMap,
            ),
          ]
        : []),

      withGroup(
        defineField({
          name: 'title',
          ...getFieldInfo('title', config.fieldOverrides),
          type: 'string',
          components: {
            input: MetaTitle,
          },
          options: getTitleFieldOptions(config) as Record<string, unknown>,
          hidden: getFieldHiddenFunction('title', config),
        }),
        fieldGroupMap,
      ),
      withGroup(
        defineField({
          name: 'description',
          ...getFieldInfo('description', config.fieldOverrides),
          type: 'text',
          rows: 3,
          components: {
            input: MetaDescription,
          },
          options: {
            ...getAiOption(config),
            isKeywordsVisible: getKeywordsVisibilityChecker(config),
          } as Record<string, unknown>,
          hidden: getFieldHiddenFunction('description', config),
        }),
        fieldGroupMap,
      ),
      withGroup(
        defineField({
          name: 'metaImage',
          ...getFieldInfo('metaImage', config.fieldOverrides),
          type: 'image',
          options: {
            hotspot: true,
          },
          components: {
            input: MetaImage,
          },
          hidden: getFieldHiddenFunction('metaImage', config),
        }),
        fieldGroupMap,
      ),
      withGroup(
        defineField({
          name: 'metaAttributes',
          ...getFieldInfo('metaAttributes', config.fieldOverrides),
          type: 'array',
          of: [{type: 'metaAttribute'}],
          hidden: getFieldHiddenFunction('metaAttributes', config),
        }),
        fieldGroupMap,
      ),
      withGroup(
        defineField({
          name: 'keywords',
          ...getFieldInfo('keywords', config.fieldOverrides),
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
          description:
            'Add relevant keywords for this page. These keywords will be used for SEO purposes.',
          components: config.ai ? {input: KeywordsInput} : undefined,
          options: getAiOption(config) as Record<string, unknown>,
          hidden: getFieldHiddenFunction('keywords', config),
        }),
        fieldGroupMap,
      ),
      withGroup(
        defineField({
          name: 'canonicalUrl',
          ...getFieldInfo('canonicalUrl', config.fieldOverrides),
          title: 'Canonical URL',
          type: 'url',
          description:
            'Specify the canonical URL for this page. This helps prevent duplicate content issues by indicating the preferred version of a page.',
          hidden: getFieldHiddenFunction('canonicalUrl', config),
        }),
        fieldGroupMap,
      ),
      withGroup(
        defineField({
          name: 'focusKeyword',
          ...getFieldInfo('focusKeyword', config.fieldOverrides),
          type: 'string',
          components: {
            input: FocusKeywordInput,
          },
          options: getAiOption(config) as Record<string, unknown>,
          hidden: getFieldHiddenFunction('focusKeyword', config),
        }),
        fieldGroupMap,
      ),
      withGroup(
        defineField({
          name: 'hreflangs',
          ...getFieldInfo('hreflangs', config.fieldOverrides),
          type: 'array',
          of: [{type: 'hreflangEntry'}],
          description:
            'Add alternate language/region versions. Include x-default for the fallback URL.',
          ...(config.hreflang?.autoFill
            ? {
                components: {input: HreflangInput},
                options: {
                  hreflang: config.hreflang,
                  baseUrl: config.baseUrl,
                  apiVersion: config.apiVersion,
                } as Record<string, unknown>,
              }
            : {}),
          hidden: getFieldHiddenFunction('hreflangs', config),
        }),
        fieldGroupMap,
      ),
      ...buildGeoChecklistField(config, fieldGroupMap),
      ...buildMetaTagsPreviewField(config, fieldGroupMap),
      ...(config.seoPerformance &&
      config.seoPerformance.enabled !== false &&
      config.seoPerformance.summary !== false
        ? [
            withGroup(
              defineField({
                name: 'performanceSummary',
                title: 'Search performance',
                type: 'string',
                readOnly: true,
                components: {input: SeoPerformanceSummaryWrapper},
                options: {performance: config.seoPerformance} as Record<string, unknown>,
                hidden: ({document}: {document?: Record<string, unknown>}) => {
                  const allowed = config.seoPerformance?.documentTypes
                  return Boolean(
                    allowed?.length && !allowed.includes(String(document?._type || '')),
                  )
                },
              }),
              fieldGroupMap,
            ),
          ]
        : []),
      withGroup(openGraph(config) as unknown as FieldDefinition, fieldGroupMap),
      withGroup(twitter(config) as unknown as FieldDefinition, fieldGroupMap),
    ],
  })
}
