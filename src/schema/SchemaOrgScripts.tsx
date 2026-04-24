/**
 * <SchemaOrgScripts> — Renders multiple Schema.org JSON-LD script tags
 * from a combined `schemaOrg` array field.
 *
 * @example
 * ```tsx
 * import { SchemaOrgScripts } from 'sanity-plugin-seofields/next'
 *
 * const data = await sanityFetch({ query: `*[_type == "settings"][0]{ structuredData }` })
 *
 * <SchemaOrgScripts data={data.structuredData} />
 * ```
 */
import {JSX} from 'react'

import {aggregateRatingFields} from './aggregateRating/schema'
import {articleFields} from './article/schema'
import {blogPostingFields} from './blogPosting/schema'
import {bookFields} from './book/schema'
import {brandFields} from './brand/schema'
import {breadcrumbListFields} from './breadcrumbList/schema'
import {contactPointFields} from './contactPoint/schema'
import {countryFields} from './country/schema'
import {courseFields} from './course/schema'
import {eventFields} from './event/schema'
import {faqPageFields} from './faqPage/schema'
import {buildGenericJsonLd, SchemaFieldDef} from './generator'
import {howToFields} from './howTo/schema'
import {imageObjectFields} from './imageObject/schema'
import {itemListFields} from './itemList/schema'
import {jobPostingFields} from './jobPosting/schema'
import {legalServiceFields} from './legalService/schema'
import {localBusinessFields} from './localBusiness/schema'
import {movieFields} from './movie/schema'
import {musicAlbumFields} from './musicAlbum/schema'
import {musicRecordingFields} from './musicRecording/schema'
import {newsArticleFields} from './newsArticle/schema'
import {offerFields} from './offer/schema'
import {buildOrganizationJsonLd} from './organization/component'
import {personFields} from './person/schema'
import {placeFields} from './place/schema'
import {postalAddressFields} from './postalAddress/schema'
import {productFields} from './product/schema'
import {profilePageFields} from './profilePage/schema'
import {recipeFields} from './recipe/schema'
import {restaurantFields} from './restaurant/schema'
import {reviewFields} from './review/schema'
import {SchemaOrgScript} from './SchemaOrgScript'
import {serviceFields} from './service/schema'
import {socialMediaPostingFields} from './socialMediaPosting/schema'
import {softwareApplicationFields} from './softwareApplication/schema'
import {videoObjectFields} from './videoObject/schema'
import {webApplicationFields} from './webApplication/schema'
import {webPageFields} from './webPage/schema'
import {buildWebsiteJsonLd} from './website/component'

// ─── Type → Builder Registry ──────────────────────────────────────────────────

interface GenericEntry {
  schemaType: string
  fields: SchemaFieldDef[]
  requiredFields: string[]
}

const GENERIC_TYPES: Record<string, GenericEntry> = {
  schemaOrgWebPage: {schemaType: 'WebPage', fields: webPageFields, requiredFields: ['name']},
  schemaOrgPerson: {schemaType: 'Person', fields: personFields, requiredFields: ['name']},
  schemaOrgBreadcrumbList: {
    schemaType: 'BreadcrumbList',
    fields: breadcrumbListFields,
    requiredFields: [],
  },
  schemaOrgImageObject: {
    schemaType: 'ImageObject',
    fields: imageObjectFields,
    requiredFields: ['url'],
  },
  schemaOrgArticle: {schemaType: 'Article', fields: articleFields, requiredFields: ['headline']},
  schemaOrgBlogPosting: {
    schemaType: 'BlogPosting',
    fields: blogPostingFields,
    requiredFields: ['headline'],
  },
  schemaOrgFAQPage: {schemaType: 'FAQPage', fields: faqPageFields, requiredFields: []},
  schemaOrgHowTo: {schemaType: 'HowTo', fields: howToFields, requiredFields: ['name']},
  schemaOrgProduct: {schemaType: 'Product', fields: productFields, requiredFields: ['name']},
  schemaOrgOffer: {schemaType: 'Offer', fields: offerFields, requiredFields: ['price']},
  schemaOrgAggregateRating: {
    schemaType: 'AggregateRating',
    fields: aggregateRatingFields,
    requiredFields: ['ratingValue'],
  },
  schemaOrgReview: {schemaType: 'Review', fields: reviewFields, requiredFields: []},
  schemaOrgBrand: {schemaType: 'Brand', fields: brandFields, requiredFields: ['name']},
  schemaOrgLocalBusiness: {
    schemaType: 'LocalBusiness',
    fields: localBusinessFields,
    requiredFields: ['name'],
  },
  schemaOrgPostalAddress: {
    schemaType: 'PostalAddress',
    fields: postalAddressFields,
    requiredFields: [],
  },
  schemaOrgContactPoint: {
    schemaType: 'ContactPoint',
    fields: contactPointFields,
    requiredFields: [],
  },
  schemaOrgSoftwareApplication: {
    schemaType: 'SoftwareApplication',
    fields: softwareApplicationFields,
    requiredFields: ['name'],
  },
  schemaOrgWebApplication: {
    schemaType: 'WebApplication',
    fields: webApplicationFields,
    requiredFields: ['name'],
  },
  schemaOrgEvent: {schemaType: 'Event', fields: eventFields, requiredFields: ['name']},
  schemaOrgPlace: {schemaType: 'Place', fields: placeFields, requiredFields: ['name']},
  schemaOrgVideoObject: {
    schemaType: 'VideoObject',
    fields: videoObjectFields,
    requiredFields: ['name'],
  },
  schemaOrgCourse: {schemaType: 'Course', fields: courseFields, requiredFields: ['name']},
  schemaOrgLegalService: {
    schemaType: 'LegalService',
    fields: legalServiceFields,
    requiredFields: ['name'],
  },
  schemaOrgCountry: {schemaType: 'Country', fields: countryFields, requiredFields: ['name']},
  schemaOrgBook: {schemaType: 'Book', fields: bookFields, requiredFields: ['name']},
  schemaOrgItemList: {
    schemaType: 'ItemList',
    fields: itemListFields,
    requiredFields: ['name'],
  },
  schemaOrgJobPosting: {
    schemaType: 'JobPosting',
    fields: jobPostingFields,
    requiredFields: ['title'],
  },
  schemaOrgMovie: {schemaType: 'Movie', fields: movieFields, requiredFields: ['name']},
  schemaOrgMusicAlbum: {
    schemaType: 'MusicAlbum',
    fields: musicAlbumFields,
    requiredFields: ['name'],
  },
  schemaOrgMusicRecording: {
    schemaType: 'MusicRecording',
    fields: musicRecordingFields,
    requiredFields: ['name'],
  },
  schemaOrgNewsArticle: {
    schemaType: 'NewsArticle',
    fields: newsArticleFields,
    requiredFields: ['headline'],
  },
  schemaOrgProfilePage: {
    schemaType: 'ProfilePage',
    fields: profilePageFields,
    requiredFields: ['name'],
  },
  schemaOrgRecipe: {schemaType: 'Recipe', fields: recipeFields, requiredFields: ['name']},
  schemaOrgRestaurant: {
    schemaType: 'Restaurant',
    fields: restaurantFields,
    requiredFields: ['name'],
  },
  schemaOrgService: {schemaType: 'Service', fields: serviceFields, requiredFields: ['name']},
  schemaOrgSocialMediaPosting: {
    schemaType: 'SocialMediaPosting',
    fields: socialMediaPostingFields,
    requiredFields: ['headline'],
  },
}

function buildJsonLdForItem(item: Record<string, unknown>): Record<string, unknown> | null {
  const type = item._type as string | undefined
  if (!type) return null

  // Website and Organization use custom builders
  if (type === 'schemaOrgWebsite') {
    return buildWebsiteJsonLd(item as Parameters<typeof buildWebsiteJsonLd>[0])
  }
  if (type === 'schemaOrgOrganization') {
    return buildOrganizationJsonLd(item as Parameters<typeof buildOrganizationJsonLd>[0])
  }

  // All other types use the generic builder
  const entry = GENERIC_TYPES[type]
  if (!entry) return null
  return buildGenericJsonLd(entry.schemaType, item, entry.fields, entry.requiredFields)
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface SchemaOrgScriptsProps {
  /** Array of Schema.org items from the combined `schemaOrg` field. */
  data?: Array<Record<string, unknown>> | null
}

/**
 * Renders one `<script type="application/ld+json">` tag per Schema.org item.
 * Skips items that fail validation (missing required fields).
 */
export function SchemaOrgScripts({data}: SchemaOrgScriptsProps): JSX.Element | null {
  if (!data?.length) return null

  const scripts = data
    .map((item) => buildJsonLdForItem(item))
    .filter((jsonLd): jsonLd is Record<string, unknown> => jsonLd !== null)

  if (!scripts.length) return null

  return (
    <>
      {scripts.map((jsonLd) => (
        <SchemaOrgScript key={JSON.stringify(jsonLd)} jsonLd={jsonLd} />
      ))}
    </>
  )
}

export default SchemaOrgScripts
