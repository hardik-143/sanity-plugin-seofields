/**
 * Schema.org plugins for sanity-plugin-seofields.
 *
 * Use as Sanity plugins (in `plugins` array) rather than raw schema types.
 *
 * @example Combined — all types at once
 * ```ts
 * import { schemaOrg } from 'sanity-plugin-seofields/schema'
 *
 * export default defineConfig({
 *   plugins: [schemaOrg()],
 * })
 * ```
 *
 * @example Individual — only the types you need
 * ```ts
 * import { schemaOrgArticlePlugin, schemaOrgFAQPagePlugin } from 'sanity-plugin-seofields/schema'
 *
 * export default defineConfig({
 *   plugins: [schemaOrgArticlePlugin(), schemaOrgFAQPagePlugin()],
 * })
 * ```
 *
 * @example Then use in any document schema
 * ```ts
 * defineField({ name: 'structuredData', type: 'schemaOrg' })
 * defineField({ name: 'article', type: 'schemaOrgArticle' })
 * ```
 */
import {definePlugin, defineType} from 'sanity'

import schemaOrgAggregateRatingSchema from './aggregateRating/schema'
import schemaOrgArticleSchema from './article/schema'
import schemaOrgBlogPostingSchema from './blogPosting/schema'
import schemaOrgBrandSchema from './brand/schema'
import schemaOrgBreadcrumbListSchema from './breadcrumbList/schema'
import schemaOrgContactPointSchema from './contactPoint/schema'
import schemaOrgCourseSchema from './course/schema'
import schemaOrgEventSchema from './event/schema'
import schemaOrgFAQPageSchema from './faqPage/schema'
import type {SchemaOrgConfig} from './generator'
import schemaOrgHowToSchema from './howTo/schema'
import schemaOrgImageObjectSchema from './imageObject/schema'
import schemaOrgLocalBusinessSchema from './localBusiness/schema'
import schemaOrgOfferSchema from './offer/schema'
import schemaOrgOrganizationSchema from './organization/schema'
import schemaOrgPersonSchema from './person/schema'
import schemaOrgPlaceSchema from './place/schema'
import schemaOrgPostalAddressSchema from './postalAddress/schema'
import schemaOrgProductSchema from './product/schema'
import schemaOrgReviewSchema from './review/schema'
import schemaOrgSoftwareApplicationSchema from './softwareApplication/schema'
import schemaOrgVideoObjectSchema from './videoObject/schema'
import schemaOrgWebApplicationSchema from './webApplication/schema'
import schemaOrgWebPageSchema from './webPage/schema'
import schemaOrgWebsiteSchema from './website/schema'

// ─── Combined Config ──────────────────────────────────────────────────────────

/** Per-type validation overrides for the combined `schemaOrg()` plugin. */
export interface SchemaOrgCombinedConfig {
  website?: SchemaOrgConfig
  organization?: SchemaOrgConfig
  webPage?: SchemaOrgConfig
  person?: SchemaOrgConfig
  breadcrumbList?: SchemaOrgConfig
  imageObject?: SchemaOrgConfig
  article?: SchemaOrgConfig
  blogPosting?: SchemaOrgConfig
  faqPage?: SchemaOrgConfig
  howTo?: SchemaOrgConfig
  product?: SchemaOrgConfig
  offer?: SchemaOrgConfig
  aggregateRating?: SchemaOrgConfig
  review?: SchemaOrgConfig
  brand?: SchemaOrgConfig
  localBusiness?: SchemaOrgConfig
  postalAddress?: SchemaOrgConfig
  contactPoint?: SchemaOrgConfig
  softwareApplication?: SchemaOrgConfig
  webApplication?: SchemaOrgConfig
  event?: SchemaOrgConfig
  place?: SchemaOrgConfig
  videoObject?: SchemaOrgConfig
  course?: SchemaOrgConfig
}

// ─── Array type member list ───────────────────────────────────────────────────

const ALL_SCHEMA_ORG_TYPES = [
  'schemaOrgWebsite',
  'schemaOrgOrganization',
  'schemaOrgWebPage',
  'schemaOrgPerson',
  'schemaOrgArticle',
  'schemaOrgBlogPosting',
  'schemaOrgBreadcrumbList',
  'schemaOrgFAQPage',
  'schemaOrgHowTo',
  'schemaOrgProduct',
  'schemaOrgOffer',
  'schemaOrgAggregateRating',
  'schemaOrgReview',
  'schemaOrgBrand',
  'schemaOrgLocalBusiness',
  'schemaOrgEvent',
  'schemaOrgPlace',
  'schemaOrgSoftwareApplication',
  'schemaOrgWebApplication',
  'schemaOrgVideoObject',
  'schemaOrgCourse',
  'schemaOrgImageObject',
  'schemaOrgPostalAddress',
  'schemaOrgContactPoint',
] as const

// ─── Individual Plugins ───────────────────────────────────────────────────────

export const schemaOrgWebsitePlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-website',
  schema: {types: [schemaOrgWebsiteSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgOrganizationPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-organization',
  schema: {types: [schemaOrgOrganizationSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgWebPagePlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-webpage',
  schema: {types: [schemaOrgWebPageSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgPersonPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-person',
  schema: {types: [schemaOrgPersonSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgBreadcrumbListPlugin = definePlugin<SchemaOrgConfig | void>(
  (config = {}) => ({
    name: 'sanity-plugin-seofields/schema-org-breadcrumblist',
    schema: {types: [schemaOrgBreadcrumbListSchema(config as SchemaOrgConfig)]},
  }),
)

export const schemaOrgImageObjectPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-imageobject',
  schema: {types: [schemaOrgImageObjectSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgArticlePlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-article',
  schema: {types: [schemaOrgArticleSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgBlogPostingPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-blogposting',
  schema: {types: [schemaOrgBlogPostingSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgFAQPagePlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-faqpage',
  schema: {types: [schemaOrgFAQPageSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgHowToPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-howto',
  schema: {types: [schemaOrgHowToSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgProductPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-product',
  schema: {types: [schemaOrgProductSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgOfferPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-offer',
  schema: {types: [schemaOrgOfferSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgAggregateRatingPlugin = definePlugin<SchemaOrgConfig | void>(
  (config = {}) => ({
    name: 'sanity-plugin-seofields/schema-org-aggregaterating',
    schema: {types: [schemaOrgAggregateRatingSchema(config as SchemaOrgConfig)]},
  }),
)

export const schemaOrgReviewPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-review',
  schema: {types: [schemaOrgReviewSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgBrandPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-brand',
  schema: {types: [schemaOrgBrandSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgLocalBusinessPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-localbusiness',
  schema: {types: [schemaOrgLocalBusinessSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgPostalAddressPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-postaladdress',
  schema: {types: [schemaOrgPostalAddressSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgContactPointPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-contactpoint',
  schema: {types: [schemaOrgContactPointSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgSoftwareApplicationPlugin = definePlugin<SchemaOrgConfig | void>(
  (config = {}) => ({
    name: 'sanity-plugin-seofields/schema-org-softwareapplication',
    schema: {types: [schemaOrgSoftwareApplicationSchema(config as SchemaOrgConfig)]},
  }),
)

export const schemaOrgWebApplicationPlugin = definePlugin<SchemaOrgConfig | void>(
  (config = {}) => ({
    name: 'sanity-plugin-seofields/schema-org-webapplication',
    schema: {types: [schemaOrgWebApplicationSchema(config as SchemaOrgConfig)]},
  }),
)

export const schemaOrgEventPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-event',
  schema: {types: [schemaOrgEventSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgPlacePlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-place',
  schema: {types: [schemaOrgPlaceSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgVideoObjectPlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-videoobject',
  schema: {types: [schemaOrgVideoObjectSchema(config as SchemaOrgConfig)]},
}))

export const schemaOrgCoursePlugin = definePlugin<SchemaOrgConfig | void>((config = {}) => ({
  name: 'sanity-plugin-seofields/schema-org-course',
  schema: {types: [schemaOrgCourseSchema(config as SchemaOrgConfig)]},
}))

// ─── Combined Plugin ──────────────────────────────────────────────────────────

/**
 * Registers **all** Schema.org types as a single Sanity plugin.
 * Includes a combined `schemaOrg` array type for multi-type fields.
 *
 * @example
 * ```ts
 * import { schemaOrg } from 'sanity-plugin-seofields/schema'
 *
 * export default defineConfig({
 *   plugins: [schemaOrg()],
 * })
 * ```
 */
export const schemaOrg = definePlugin<SchemaOrgCombinedConfig | void>((config = {}) => {
  const c = config as SchemaOrgCombinedConfig
  return {
    name: 'sanity-plugin-seofields/schema-org',
    schema: {
      types: [
        schemaOrgWebsiteSchema(c.website),
        schemaOrgOrganizationSchema(c.organization),
        schemaOrgWebPageSchema(c.webPage),
        schemaOrgPersonSchema(c.person),
        schemaOrgBreadcrumbListSchema(c.breadcrumbList),
        schemaOrgImageObjectSchema(c.imageObject),
        schemaOrgArticleSchema(c.article),
        schemaOrgBlogPostingSchema(c.blogPosting),
        schemaOrgFAQPageSchema(c.faqPage),
        schemaOrgHowToSchema(c.howTo),
        schemaOrgProductSchema(c.product),
        schemaOrgOfferSchema(c.offer),
        schemaOrgAggregateRatingSchema(c.aggregateRating),
        schemaOrgReviewSchema(c.review),
        schemaOrgBrandSchema(c.brand),
        schemaOrgLocalBusinessSchema(c.localBusiness),
        schemaOrgPostalAddressSchema(c.postalAddress),
        schemaOrgContactPointSchema(c.contactPoint),
        schemaOrgSoftwareApplicationSchema(c.softwareApplication),
        schemaOrgWebApplicationSchema(c.webApplication),
        schemaOrgEventSchema(c.event),
        schemaOrgPlaceSchema(c.place),
        schemaOrgVideoObjectSchema(c.videoObject),
        schemaOrgCourseSchema(c.course),
        // Combined array type — lets editors add multiple schemas
        defineType({
          name: 'schemaOrg',
          title: 'Schema.org Structured Data',
          type: 'array',
          of: ALL_SCHEMA_ORG_TYPES.map((type) => ({type})),
          options: {
            insertMenu: {
              views: [
                {
                  name: 'grid',
                },
              ],
            },
          },
        }),
      ],
    },
  }
})
