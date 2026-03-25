/**
 * Next.js App Router helpers — safe to import in Server Components.
 *
 * @example
 * import { buildSeoMeta, SeoMetaTags } from 'sanity-plugin-seofields/next'
 * import { WebsiteSchema, ArticleSchema, SchemaOrgScripts } from 'sanity-plugin-seofields/next'
 */
export type {
  BuildSeoMetaOptions,
  SeoFieldsInput,
  SeoMetadata,
  SeoMetaDefaults,
} from './helpers/seoMeta'
export {buildSeoMeta, sanitizeOGType, sanitizeTwitterCard} from './helpers/seoMeta'
export type {SeoMetaTagsProps} from './helpers/SeoMetaTags'
export {SeoMetaTags} from './helpers/SeoMetaTags'

// Schema.org — Combined
export type {SchemaOrgScriptsProps} from './schema/SchemaOrgScripts'
export {SchemaOrgScripts} from './schema/SchemaOrgScripts'

// Schema.org — Individual (also importable from ./next/website etc.)
export type {AggregateRatingSchemaProps} from './schema/aggregateRating/component'
export {AggregateRatingSchema, buildAggregateRatingJsonLd} from './schema/aggregateRating/component'
export type {ArticleSchemaProps} from './schema/article/component'
export {ArticleSchema, buildArticleJsonLd} from './schema/article/component'
export type {BlogPostingSchemaProps} from './schema/blogPosting/component'
export {BlogPostingSchema, buildBlogPostingJsonLd} from './schema/blogPosting/component'
export type {BrandSchemaProps} from './schema/brand/component'
export {BrandSchema, buildBrandJsonLd} from './schema/brand/component'
export type {BreadcrumbListSchemaProps} from './schema/breadcrumbList/component'
export {BreadcrumbListSchema, buildBreadcrumbListJsonLd} from './schema/breadcrumbList/component'
export type {ContactPointSchemaProps} from './schema/contactPoint/component'
export {buildContactPointJsonLd, ContactPointSchema} from './schema/contactPoint/component'
export type {CourseSchemaProps} from './schema/course/component'
export {buildCourseJsonLd, CourseSchema} from './schema/course/component'
export type {EventSchemaProps} from './schema/event/component'
export {buildEventJsonLd, EventSchema} from './schema/event/component'
export type {FAQPageSchemaProps} from './schema/faqPage/component'
export {buildFAQPageJsonLd, FAQPageSchema} from './schema/faqPage/component'
export type {HowToSchemaProps} from './schema/howTo/component'
export {buildHowToJsonLd, HowToSchema} from './schema/howTo/component'
export type {ImageObjectSchemaProps} from './schema/imageObject/component'
export {buildImageObjectJsonLd, ImageObjectSchema} from './schema/imageObject/component'
export type {LocalBusinessSchemaProps} from './schema/localBusiness/component'
export {buildLocalBusinessJsonLd, LocalBusinessSchema} from './schema/localBusiness/component'
export type {OfferSchemaProps} from './schema/offer/component'
export {buildOfferJsonLd, OfferSchema} from './schema/offer/component'
export type {OrganizationSchemaProps} from './schema/organization/component'
export {buildOrganizationJsonLd, OrganizationSchema} from './schema/organization/component'
export type {PersonSchemaProps} from './schema/person/component'
export {buildPersonJsonLd, PersonSchema} from './schema/person/component'
export type {PlaceSchemaProps} from './schema/place/component'
export {buildPlaceJsonLd, PlaceSchema} from './schema/place/component'
export type {PostalAddressSchemaProps} from './schema/postalAddress/component'
export {buildPostalAddressJsonLd, PostalAddressSchema} from './schema/postalAddress/component'
export type {ProductSchemaProps} from './schema/product/component'
export {buildProductJsonLd, ProductSchema} from './schema/product/component'
export type {ReviewSchemaProps} from './schema/review/component'
export {buildReviewJsonLd, ReviewSchema} from './schema/review/component'
export type {SoftwareApplicationSchemaProps} from './schema/softwareApplication/component'
export {
  buildSoftwareApplicationJsonLd,
  SoftwareApplicationSchema,
} from './schema/softwareApplication/component'
export type {VideoObjectSchemaProps} from './schema/videoObject/component'
export {buildVideoObjectJsonLd, VideoObjectSchema} from './schema/videoObject/component'
export type {WebApplicationSchemaProps} from './schema/webApplication/component'
export {buildWebApplicationJsonLd, WebApplicationSchema} from './schema/webApplication/component'
export type {WebPageSchemaProps} from './schema/webPage/component'
export {buildWebPageJsonLd, WebPageSchema} from './schema/webPage/component'
export type {WebsiteSchemaProps} from './schema/website/component'
export {buildWebsiteJsonLd, WebsiteSchema} from './schema/website/component'
