/**
 * Schema.org Sanity plugins — register structured data types in Sanity Studio.
 *
 * Import path: `sanity-plugin-seofields/schema`
 * For React/Next.js components use: `sanity-plugin-seofields/next`
 *
 * @example Combined — all 24 types at once
 * ```ts
 * import { schemaOrg } from 'sanity-plugin-seofields/schema'
 * export default defineConfig({ plugins: [schemaOrg()] })
 * ```
 *
 * @example Individual plugins
 * ```ts
 * import { schemaOrgArticlePlugin } from 'sanity-plugin-seofields/schema'
 * export default defineConfig({ plugins: [schemaOrgArticlePlugin()] })
 * ```
 */

// ─── Generator (for custom Schema.org types) ──────────────────────────────────
export type {SchemaFieldDef, SchemaFieldOption, SchemaOrgConfig, SchemaTypeDef} from './generator'
export {buildGenericJsonLd, generateSchemaType} from './generator'

// ─── Combined plugin + all individual plugins ─────────────────────────────────
export type {SchemaOrgCombinedConfig} from './schemaOrg'
export {
  schemaOrg,
  schemaOrgAggregateRatingPlugin,
  schemaOrgArticlePlugin,
  schemaOrgBlogPostingPlugin,
  schemaOrgBrandPlugin,
  schemaOrgBreadcrumbListPlugin,
  schemaOrgContactPointPlugin,
  schemaOrgCoursePlugin,
  schemaOrgEventPlugin,
  schemaOrgFAQPagePlugin,
  schemaOrgHowToPlugin,
  schemaOrgImageObjectPlugin,
  schemaOrgLocalBusinessPlugin,
  schemaOrgOfferPlugin,
  schemaOrgOrganizationPlugin,
  schemaOrgPersonPlugin,
  schemaOrgPlacePlugin,
  schemaOrgPostalAddressPlugin,
  schemaOrgProductPlugin,
  schemaOrgReviewPlugin,
  schemaOrgSoftwareApplicationPlugin,
  schemaOrgVideoObjectPlugin,
  schemaOrgWebApplicationPlugin,
  schemaOrgWebPagePlugin,
  schemaOrgWebsitePlugin,
} from './schemaOrg'

// ─── Individual schema factories (advanced: schema.types manual registration) ──
export {default as schemaOrgAggregateRating} from './aggregateRating/schema'
export {default as schemaOrgArticle} from './article/schema'
export {default as schemaOrgBlogPosting} from './blogPosting/schema'
export {default as schemaOrgBrand} from './brand/schema'
export {default as schemaOrgBreadcrumbList} from './breadcrumbList/schema'
export {default as schemaOrgContactPoint} from './contactPoint/schema'
export {default as schemaOrgCourse} from './course/schema'
export {default as schemaOrgEvent} from './event/schema'
export {default as schemaOrgFAQPage} from './faqPage/schema'
export {default as schemaOrgHowTo} from './howTo/schema'
export {default as schemaOrgImageObject} from './imageObject/schema'
export {default as schemaOrgLocalBusiness} from './localBusiness/schema'
export {default as schemaOrgOffer} from './offer/schema'
export {default as schemaOrgOrganization} from './organization/schema'
export {default as schemaOrgPerson} from './person/schema'
export {default as schemaOrgPlace} from './place/schema'
export {default as schemaOrgPostalAddress} from './postalAddress/schema'
export {default as schemaOrgProduct} from './product/schema'
export {default as schemaOrgReview} from './review/schema'
export {default as schemaOrgSoftwareApplication} from './softwareApplication/schema'
export {default as schemaOrgVideoObject} from './videoObject/schema'
export {default as schemaOrgWebApplication} from './webApplication/schema'
export {default as schemaOrgWebPage} from './webPage/schema'
export {default as schemaOrgWebsite} from './website/schema'

// ─── Data types (type GROQ query results) ─────────────────────────────────────
export type {
  SchemaOrgAggregateRatingConfig,
  SchemaOrgAggregateRatingData,
} from './aggregateRating/types'
export type {SchemaOrgArticleConfig, SchemaOrgArticleData} from './article/types'
export type {SchemaOrgBlogPostingConfig, SchemaOrgBlogPostingData} from './blogPosting/types'
export type {SchemaOrgBrandConfig, SchemaOrgBrandData} from './brand/types'
export type {
  SchemaOrgBreadcrumbListConfig,
  SchemaOrgBreadcrumbListData,
} from './breadcrumbList/types'
export type {SchemaOrgContactPointConfig, SchemaOrgContactPointData} from './contactPoint/types'
export type {SchemaOrgCourseConfig, SchemaOrgCourseData} from './course/types'
export type {SchemaOrgEventConfig, SchemaOrgEventData} from './event/types'
export type {SchemaOrgFAQPageConfig, SchemaOrgFAQPageData} from './faqPage/types'
export type {SchemaOrgHowToConfig, SchemaOrgHowToData} from './howTo/types'
export type {SchemaOrgImageObjectConfig, SchemaOrgImageObjectData} from './imageObject/types'
export type {SchemaOrgLocalBusinessConfig, SchemaOrgLocalBusinessData} from './localBusiness/types'
export type {SchemaOrgOfferConfig, SchemaOrgOfferData} from './offer/types'
export type {
  OrganizationContactPoint,
  SchemaOrgOrganizationConfig,
  SchemaOrgOrganizationData,
} from './organization/types'
export type {SchemaOrgPersonConfig, SchemaOrgPersonData} from './person/types'
export type {SchemaOrgPlaceConfig, SchemaOrgPlaceData} from './place/types'
export type {SchemaOrgPostalAddressConfig, SchemaOrgPostalAddressData} from './postalAddress/types'
export type {SchemaOrgProductConfig, SchemaOrgProductData} from './product/types'
export type {SchemaOrgReviewConfig, SchemaOrgReviewData} from './review/types'
export type {
  SchemaOrgSoftwareApplicationConfig,
  SchemaOrgSoftwareApplicationData,
} from './softwareApplication/types'
export type {SchemaOrgVideoObjectConfig, SchemaOrgVideoObjectData} from './videoObject/types'
export type {
  SchemaOrgWebApplicationConfig,
  SchemaOrgWebApplicationData,
} from './webApplication/types'
export type {SchemaOrgWebPageConfig, SchemaOrgWebPageData} from './webPage/types'
export type {SchemaOrgWebsiteConfig, SchemaOrgWebsiteData, WebsitePublisher} from './website/types'
