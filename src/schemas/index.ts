import {createElement, lazy, Suspense} from 'react'
import {
  defineField,
  defineType,
  FieldDefinition,
  FieldGroupDefinition,
  SchemaTypeDefinition,
  StringInputProps,
} from 'sanity'

import MetaDescription from '../components/meta/MetaDescription'
import MetaImage from '../components/meta/MetaImage'
import MetaTitle from '../components/meta/MetaTitle'
import type {SeoFieldGroup, SeoFieldsPluginConfig, SeoObjectFieldName} from '../plugin'
import {getFieldHiddenFunction, getFieldInfo} from '../utils/fieldsUtils'
import {isEmpty} from '../utils/utils'
import openGraph from './types/openGraph'
import twitter from './types/twitter'

// Lazy-load SeoPreview to avoid styled-components breaking `sanity schema extract`
const LazySeoPreview = lazy(() => import('../components/SeoPreview'))
const SeoPreviewWrapper = (props: StringInputProps) =>
  createElement(Suspense, {fallback: null}, createElement(LazySeoPreview, props))

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
      ...((typeof config.seoPreview === 'boolean' && config.seoPreview) ||
      (typeof config.seoPreview === 'object' && !isEmpty(config.seoPreview))
        ? [
            withGroup(
              defineField({
                name: 'preview',
                title: 'SEO Preview',
                type: 'string',
                components: {input: SeoPreviewWrapper},
                options: {
                  baseUrl: config.baseUrl || 'https://www.example.com',
                  ...(config.apiVersion ? {apiVersion: config.apiVersion} : {}),
                  ...(typeof config.seoPreview === 'object' &&
                  config.seoPreview &&
                  config.seoPreview.prefix
                    ? {prefix: config.seoPreview.prefix}
                    : {}),
                  ...(typeof config.seoPreview === 'object' &&
                  config.seoPreview &&
                  config.seoPreview.titleSuffix
                    ? {titleSuffix: config.seoPreview.titleSuffix}
                    : {}),
                  ...(typeof config.seoPreview === 'object' &&
                  config.seoPreview &&
                  config.seoPreview.titleSuffixInheritColor
                    ? {titleSuffixInheritColor: config.seoPreview.titleSuffixInheritColor}
                    : {}),
                  ...(typeof config.seoPreview === 'object' &&
                  config.seoPreview &&
                  config.seoPreview.titleSuffixQuery
                    ? {titleSuffixQuery: config.seoPreview.titleSuffixQuery}
                    : {}),
                } as Record<string, unknown>,
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
      withGroup(openGraph(config) as unknown as FieldDefinition, fieldGroupMap),
      withGroup(twitter(config) as unknown as FieldDefinition, fieldGroupMap),
    ],
  })
}
