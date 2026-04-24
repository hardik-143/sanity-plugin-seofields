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

// ─── Shared base TypeScript types ────────────────────────────────────────────
export type {
  SchemaOrgAggregateRating,
  SchemaOrgArchivedAt,
  SchemaOrgContentRating,
  SchemaOrgCopyrightYear,
  SchemaOrgCreativeWorkData,
  SchemaOrgImageInput,
  SchemaOrgOrganizationInput,
  SchemaOrgPersonOrOrganization,
  SchemaOrgTextOrUrl,
  SchemaOrgThingData,
} from './_types'

// ─── Generator (for custom Schema.org types) ──────────────────────────────────
export type {SchemaFieldDef, SchemaFieldOption, SchemaOrgConfig, SchemaTypeDef} from './generator'
export {buildGenericJsonLd, generateSchemaType} from './generator'

// ─── Shared field factory functions ──────────────────────────────────────────
export type {InLanguageFieldOptions, PolymorphicOptions, SimpleFieldOptions} from './_shared'
export type {DatePublishedFieldOptions} from './_shared'
export {
  datePublishedField,
  descriptionField,
  headlineField,
  IETF_LANGUAGE_OPTIONS,
  inLanguageField,
  nameField,
  polymorphicAdditionalType,
  polymorphicArchivedAt,
  polymorphicAuthor,
  polymorphicCitation,
  polymorphicContentRating,
  polymorphicContributor,
  polymorphicCopyrightHolder,
  polymorphicCreator,
  polymorphicFunder,
  polymorphicGenre,
  polymorphicIdentifier,
  polymorphicImage,
  polymorphicIsBasedOn,
  polymorphicIsPartOf,
  polymorphicKeywords,
  polymorphicLicense,
  polymorphicLocationCreated,
  polymorphicMaintainer,
  polymorphicMaterial,
  polymorphicOwner,
  polymorphicPublisher,
  urlField,
  withCreativeWorkCommons,
  withThingCommons,
} from './_shared'

// ─── Schema Type Picker Component ──────────────────────────────────────────────
export type {SchemaTypeCategory, SchemaTypeInfo} from './components/schemaTypeMetadata'
export {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  SCHEMA_TYPE_METADATA,
} from './components/schemaTypeMetadata'
export {default as TypePickerInput} from './components/TypePickerInput'

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
  schemaOrgCountryPlugin,
  schemaOrgCoursePlugin,
  schemaOrgEventPlugin,
  schemaOrgFAQPagePlugin,
  schemaOrgHowToPlugin,
  schemaOrgImageObjectPlugin,
  schemaOrgLegalServicePlugin,
  schemaOrgLocalBusinessPlugin,
  schemaOrgOfferPlugin,
  schemaOrgOrganizationPlugin,
  schemaOrgPersonPlugin,
  schemaOrgPlacePlugin,
  schemaOrgPostalAddressPlugin,
  schemaOrgProductPlugin,
  schemaOrgRecipePlugin,
  schemaOrgReviewPlugin,
  schemaOrgServicePlugin,
  schemaOrgSocialMediaPostingPlugin,
  schemaOrgSoftwareApplicationPlugin,
  schemaOrgVideoObjectPlugin,
  schemaOrgWebApplicationPlugin,
  schemaOrgWebPagePlugin,
  schemaOrgWebsitePlugin,
} from './schemaOrg'

// Re-export new plugins
export {
  schemaOrgBookPlugin,
  schemaOrgItemListPlugin,
  schemaOrgJobPostingPlugin,
  schemaOrgMoviePlugin,
  schemaOrgMusicAlbumPlugin,
  schemaOrgMusicRecordingPlugin,
  schemaOrgNewsArticlePlugin,
  schemaOrgProfilePagePlugin,
  schemaOrgRestaurantPlugin,
} from './schemaOrg'

// ─── Individual schema factories (advanced: schema.types manual registration) ──
export {default as schemaOrgAggregateRating} from './aggregateRating/schema'
export {default as schemaOrgArticle} from './article/schema'
export {default as schemaOrgBlogPosting} from './blogPosting/schema'
export {default as schemaOrgBook} from './book/schema'
export {default as schemaOrgBrand} from './brand/schema'
export {default as schemaOrgBreadcrumbList} from './breadcrumbList/schema'
export {default as schemaOrgContactPoint} from './contactPoint/schema'
export {default as schemaOrgCountry} from './country/schema'
export {default as schemaOrgCourse} from './course/schema'
export {default as schemaOrgEvent} from './event/schema'
export {default as schemaOrgFAQPage} from './faqPage/schema'
export {default as schemaOrgHowTo} from './howTo/schema'
export {default as schemaOrgImageObject} from './imageObject/schema'
export {default as schemaOrgItemList} from './itemList/schema'
export {default as schemaOrgJobPosting} from './jobPosting/schema'
export {default as schemaOrgLegalService} from './legalService/schema'
export {default as schemaOrgLocalBusiness} from './localBusiness/schema'
export {default as schemaOrgMovie} from './movie/schema'
export {default as schemaOrgMusicAlbum} from './musicAlbum/schema'
export {default as schemaOrgMusicRecording} from './musicRecording/schema'
export {default as schemaOrgNewsArticle} from './newsArticle/schema'
export {default as schemaOrgOffer} from './offer/schema'
export {default as schemaOrgOrganization} from './organization/schema'
export {default as schemaOrgPerson} from './person/schema'
export {default as schemaOrgPlace} from './place/schema'
export {default as schemaOrgPostalAddress} from './postalAddress/schema'
export {default as schemaOrgProduct} from './product/schema'
export {default as schemaOrgProfilePage} from './profilePage/schema'
export {default as schemaOrgRecipe} from './recipe/schema'
export {default as schemaOrgRestaurant} from './restaurant/schema'
export {default as schemaOrgReview} from './review/schema'
export {default as schemaOrgService} from './service/schema'
export {default as schemaOrgSocialMediaPosting} from './socialMediaPosting/schema'
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
export type {SchemaOrgBookConfig, SchemaOrgBookData} from './book/types'
export type {SchemaOrgBrandConfig, SchemaOrgBrandData} from './brand/types'
export type {
  SchemaOrgBreadcrumbListConfig,
  SchemaOrgBreadcrumbListData,
} from './breadcrumbList/types'
export type {SchemaOrgContactPointConfig, SchemaOrgContactPointData} from './contactPoint/types'
export type {SchemaOrgCountryConfig, SchemaOrgCountryData} from './country/types'
export type {SchemaOrgCourseConfig, SchemaOrgCourseData} from './course/types'
export type {SchemaOrgEventConfig, SchemaOrgEventData} from './event/types'
export type {SchemaOrgFAQPageConfig, SchemaOrgFAQPageData} from './faqPage/types'
export type {SchemaOrgHowToConfig, SchemaOrgHowToData} from './howTo/types'
export type {SchemaOrgImageObjectConfig, SchemaOrgImageObjectData} from './imageObject/types'
export type {SchemaOrgItemListConfig, SchemaOrgItemListData} from './itemList/types'
export type {SchemaOrgJobPostingConfig, SchemaOrgJobPostingData} from './jobPosting/types'
export type {SchemaOrgLegalServiceConfig, SchemaOrgLegalServiceData} from './legalService/types'
export type {SchemaOrgLocalBusinessConfig, SchemaOrgLocalBusinessData} from './localBusiness/types'
export type {SchemaOrgMovieConfig, SchemaOrgMovieData} from './movie/types'
export type {SchemaOrgMusicAlbumConfig, SchemaOrgMusicAlbumData} from './musicAlbum/types'
export type {
  SchemaOrgMusicRecordingConfig,
  SchemaOrgMusicRecordingData,
} from './musicRecording/types'
export type {SchemaOrgNewsArticleConfig, SchemaOrgNewsArticleData} from './newsArticle/types'
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
export type {SchemaOrgProfilePageConfig, SchemaOrgProfilePageData} from './profilePage/types'
export type {SchemaOrgRecipeConfig, SchemaOrgRecipeData} from './recipe/types'
export type {SchemaOrgRestaurantConfig, SchemaOrgRestaurantData} from './restaurant/types'
export type {SchemaOrgReviewConfig, SchemaOrgReviewData} from './review/types'
export type {SchemaOrgServiceConfig, SchemaOrgServiceData} from './service/types'
export type {
  SchemaOrgSocialMediaPostingConfig,
  SchemaOrgSocialMediaPostingData,
} from './socialMediaPosting/types'
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
export type {SchemaOrgWebsiteConfig, SchemaOrgWebsiteData} from './website/types'
