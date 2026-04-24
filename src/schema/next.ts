/**
 * Schema.org React components for Next.js / Server Components.
 *
 * Renders `<script type="application/ld+json">` tags from Sanity GROQ data.
 *
 * Import path: `sanity-plugin-seofields/schema/next`
 *
 * @example Single type
 * ```tsx
 * import { WebsiteSchema } from 'sanity-plugin-seofields/schema/next'
 *
 * export default function Layout({ data }) {
 *   return (
 *     <>
 *       <WebsiteSchema data={data.website} />
 *     </>
 *   )
 * }
 * ```
 *
 * @example Multiple types from schemaOrg combined field
 * ```tsx
 * import { SchemaOrgScripts } from 'sanity-plugin-seofields/schema/next'
 *
 * export default function Layout({ data }) {
 *   return <SchemaOrgScripts items={data.schemaOrg} />
 * }
 * ```
 */

// ─── Combined renderer (for the schemaOrg array field) ────────────────────────
export type {SchemaOrgScriptsProps} from './SchemaOrgScripts'
export {SchemaOrgScripts} from './SchemaOrgScripts'

// ─── Individual components ────────────────────────────────────────────────────
export type {AggregateRatingSchemaProps} from './aggregateRating/component'
export {AggregateRatingSchema, buildAggregateRatingJsonLd} from './aggregateRating/component'
export type {ArticleSchemaProps} from './article/component'
export {ArticleSchema, buildArticleJsonLd} from './article/component'
export type {BlogPostingSchemaProps} from './blogPosting/component'
export {BlogPostingSchema, buildBlogPostingJsonLd} from './blogPosting/component'
export type {BookSchemaProps} from './book/component'
export {BookSchema, buildBookJsonLd} from './book/component'
export type {BrandSchemaProps} from './brand/component'
export {BrandSchema, buildBrandJsonLd} from './brand/component'
export type {BreadcrumbListSchemaProps} from './breadcrumbList/component'
export {BreadcrumbListSchema, buildBreadcrumbListJsonLd} from './breadcrumbList/component'
export type {ContactPointSchemaProps} from './contactPoint/component'
export {buildContactPointJsonLd, ContactPointSchema} from './contactPoint/component'
export type {CountrySchemaProps} from './country/component'
export {buildCountryJsonLd, CountrySchema} from './country/component'
export type {CourseSchemaProps} from './course/component'
export {buildCourseJsonLd, CourseSchema} from './course/component'
export type {EventSchemaProps} from './event/component'
export {buildEventJsonLd, EventSchema} from './event/component'
export type {FAQPageSchemaProps} from './faqPage/component'
export {buildFAQPageJsonLd, FAQPageSchema} from './faqPage/component'
export type {HowToSchemaProps} from './howTo/component'
export {buildHowToJsonLd, HowToSchema} from './howTo/component'
export type {ImageObjectSchemaProps} from './imageObject/component'
export {buildImageObjectJsonLd, ImageObjectSchema} from './imageObject/component'
export type {ItemListSchemaProps} from './itemList/component'
export {buildItemListJsonLd, ItemListSchema} from './itemList/component'
export type {JobPostingSchemaProps} from './jobPosting/component'
export {buildJobPostingJsonLd, JobPostingSchema} from './jobPosting/component'
export type {LegalServiceSchemaProps} from './legalService/component'
export {buildLegalServiceJsonLd, LegalServiceSchema} from './legalService/component'
export type {LocalBusinessSchemaProps} from './localBusiness/component'
export {buildLocalBusinessJsonLd, LocalBusinessSchema} from './localBusiness/component'
export type {MovieSchemaProps} from './movie/component'
export {buildMovieJsonLd, MovieSchema} from './movie/component'
export type {MusicAlbumSchemaProps} from './musicAlbum/component'
export {buildMusicAlbumJsonLd, MusicAlbumSchema} from './musicAlbum/component'
export type {MusicRecordingSchemaProps} from './musicRecording/component'
export {buildMusicRecordingJsonLd, MusicRecordingSchema} from './musicRecording/component'
export type {NewsArticleSchemaProps} from './newsArticle/component'
export {buildNewsArticleJsonLd, NewsArticleSchema} from './newsArticle/component'
export type {OfferSchemaProps} from './offer/component'
export {buildOfferJsonLd, OfferSchema} from './offer/component'
export type {OrganizationSchemaProps} from './organization/component'
export {buildOrganizationJsonLd, OrganizationSchema} from './organization/component'
export type {PersonSchemaProps} from './person/component'
export {buildPersonJsonLd, PersonSchema} from './person/component'
export type {PlaceSchemaProps} from './place/component'
export {buildPlaceJsonLd, PlaceSchema} from './place/component'
export type {PostalAddressSchemaProps} from './postalAddress/component'
export {buildPostalAddressJsonLd, PostalAddressSchema} from './postalAddress/component'
export type {ProductSchemaProps} from './product/component'
export {buildProductJsonLd, ProductSchema} from './product/component'
export type {ProfilePageSchemaProps} from './profilePage/component'
export {buildProfilePageJsonLd, ProfilePageSchema} from './profilePage/component'
export type {RecipeSchemaProps} from './recipe/component'
export {buildRecipeJsonLd, RecipeSchema} from './recipe/component'
export type {RestaurantSchemaProps} from './restaurant/component'
export {buildRestaurantJsonLd, RestaurantSchema} from './restaurant/component'
export type {ReviewSchemaProps} from './review/component'
export {buildReviewJsonLd, ReviewSchema} from './review/component'
export type {ServiceSchemaProps} from './service/component'
export {buildServiceJsonLd, ServiceSchema} from './service/component'
export type {SocialMediaPostingSchemaProps} from './socialMediaPosting/component'
export {
  buildSocialMediaPostingJsonLd,
  SocialMediaPostingSchema,
} from './socialMediaPosting/component'
export type {SoftwareApplicationSchemaProps} from './softwareApplication/component'
export {
  buildSoftwareApplicationJsonLd,
  SoftwareApplicationSchema,
} from './softwareApplication/component'
export type {VideoObjectSchemaProps} from './videoObject/component'
export {buildVideoObjectJsonLd, VideoObjectSchema} from './videoObject/component'
export type {WebApplicationSchemaProps} from './webApplication/component'
export {buildWebApplicationJsonLd, WebApplicationSchema} from './webApplication/component'
export type {WebPageSchemaProps} from './webPage/component'
export {buildWebPageJsonLd, WebPageSchema} from './webPage/component'
export type {WebsiteSchemaProps} from './website/component'
export {buildWebsiteJsonLd, WebsiteSchema} from './website/component'
