/**
 * Metadata for Schema.org types — used by the TypePickerInput.
 * Each entry describes a type for the visual picker UI.
 */

export type SchemaTypeCategory =
  | 'content'
  | 'commerce'
  | 'media'
  | 'people'
  | 'navigation'
  | 'location'
  | 'software'
  | 'education'

export interface SchemaTypeInfo {
  /** Internal Sanity type name, e.g. "schemaOrgArticle" */
  type: string
  /** Display title */
  title: string
  /** Short description shown in the picker */
  description: string
  /** Category for grouping */
  category: SchemaTypeCategory
  /** Search keywords (matched in addition to title) */
  keywords: string[]
}

export const CATEGORY_LABELS: Record<SchemaTypeCategory, string> = {
  content: 'Content & Pages',
  commerce: 'Commerce & Reviews',
  media: 'Media',
  people: 'People & Organizations',
  navigation: 'Navigation',
  location: 'Location & Events',
  software: 'Software',
  education: 'Education',
}

export const CATEGORY_ORDER: SchemaTypeCategory[] = [
  'content',
  'commerce',
  'people',
  'media',
  'navigation',
  'location',
  'software',
  'education',
]

export const SCHEMA_TYPE_METADATA: SchemaTypeInfo[] = [
  // ─── Content & Pages ──────────────────────────────────────────────
  {
    type: 'schemaOrgWebsite',
    title: 'Website',
    description: 'Represents an entire website with search action support.',
    category: 'content',
    keywords: ['site', 'homepage', 'search action'],
  },
  {
    type: 'schemaOrgWebPage',
    title: 'Web Page',
    description: 'A single web page with metadata and publisher info.',
    category: 'content',
    keywords: ['page', 'about', 'contact', 'landing'],
  },
  {
    type: 'schemaOrgArticle',
    title: 'Article',
    description: 'News articles, blog posts, and editorial content.',
    category: 'content',
    keywords: ['news', 'blog', 'post', 'editorial', 'story'],
  },
  {
    type: 'schemaOrgBlogPosting',
    title: 'Blog Posting',
    description: 'Blog post with author, date, and content metadata.',
    category: 'content',
    keywords: ['blog', 'post', 'writing'],
  },
  {
    type: 'schemaOrgFAQPage',
    title: 'FAQ Page',
    description: 'Frequently asked questions with rich result support.',
    category: 'content',
    keywords: ['faq', 'questions', 'answers', 'help'],
  },
  {
    type: 'schemaOrgHowTo',
    title: 'How-To',
    description: 'Step-by-step instructions with supplies, tools, and costs.',
    category: 'content',
    keywords: ['tutorial', 'guide', 'steps', 'instructions', 'diy'],
  },
  {
    type: 'schemaOrgRecipe',
    title: 'Recipe',
    description: 'Cooking recipes with ingredients, nutrition, and times.',
    category: 'content',
    keywords: ['cooking', 'food', 'ingredients', 'nutrition', 'meal'],
  },
  {
    type: 'schemaOrgSocialMediaPosting',
    title: 'Social Media Posting',
    description: 'Social media content with shared links and engagement.',
    category: 'content',
    keywords: ['social', 'post', 'share', 'twitter', 'facebook'],
  },

  // ─── Commerce & Reviews ───────────────────────────────────────────
  {
    type: 'schemaOrgProduct',
    title: 'Product',
    description: 'Products with pricing, ratings, and availability.',
    category: 'commerce',
    keywords: ['ecommerce', 'shop', 'buy', 'price', 'store'],
  },
  {
    type: 'schemaOrgOffer',
    title: 'Offer',
    description: 'Pricing and availability for products or services.',
    category: 'commerce',
    keywords: ['price', 'deal', 'discount', 'availability'],
  },
  {
    type: 'schemaOrgAggregateRating',
    title: 'Aggregate Rating',
    description: 'Overall rating from multiple reviews.',
    category: 'commerce',
    keywords: ['stars', 'rating', 'score', 'average'],
  },
  {
    type: 'schemaOrgReview',
    title: 'Review',
    description: 'Individual review with rating and author.',
    category: 'commerce',
    keywords: ['feedback', 'testimonial', 'rating', 'critique'],
  },
  {
    type: 'schemaOrgBrand',
    title: 'Brand',
    description: 'Brand identity and recognition.',
    category: 'commerce',
    keywords: ['brand', 'label', 'manufacturer'],
  },
  {
    type: 'schemaOrgService',
    title: 'Service',
    description: 'Professional services with provider and catalog.',
    category: 'commerce',
    keywords: ['consulting', 'professional', 'provider', 'catalog'],
  },

  // ─── People & Organizations ───────────────────────────────────────
  {
    type: 'schemaOrgPerson',
    title: 'Person',
    description: 'Individual profile with contact info and social links.',
    category: 'people',
    keywords: ['author', 'profile', 'employee', 'contact'],
  },
  {
    type: 'schemaOrgOrganization',
    title: 'Organization',
    description: 'Company or organization with departments and contacts.',
    category: 'people',
    keywords: ['company', 'business', 'corporation', 'ngo'],
  },
  {
    type: 'schemaOrgLocalBusiness',
    title: 'Local Business',
    description: 'Local business with hours, location, and reviews.',
    category: 'people',
    keywords: ['store', 'restaurant', 'shop', 'local', 'maps'],
  },
  {
    type: 'schemaOrgContactPoint',
    title: 'Contact Point',
    description: 'Contact information — phone, email, languages.',
    category: 'people',
    keywords: ['phone', 'email', 'support', 'helpdesk'],
  },
  {
    type: 'schemaOrgPostalAddress',
    title: 'Postal Address',
    description: 'Physical mailing address.',
    category: 'people',
    keywords: ['address', 'street', 'zip', 'city', 'mailing'],
  },

  // ─── Media ────────────────────────────────────────────────────────
  {
    type: 'schemaOrgImageObject',
    title: 'Image Object',
    description: 'Image with metadata, author, and location.',
    category: 'media',
    keywords: ['photo', 'picture', 'graphic', 'illustration'],
  },
  {
    type: 'schemaOrgVideoObject',
    title: 'Video Object',
    description: 'Video with thumbnails, duration, and seek actions.',
    category: 'media',
    keywords: ['video', 'youtube', 'vimeo', 'clip', 'film'],
  },

  // ─── Navigation ───────────────────────────────────────────────────
  {
    type: 'schemaOrgBreadcrumbList',
    title: 'Breadcrumb List',
    description: 'Page hierarchy breadcrumb trail for navigation.',
    category: 'navigation',
    keywords: ['breadcrumb', 'path', 'hierarchy', 'trail'],
  },

  // ─── Location & Events ────────────────────────────────────────────
  {
    type: 'schemaOrgEvent',
    title: 'Event',
    description: 'Events with dates, location, and organizer.',
    category: 'location',
    keywords: ['conference', 'meetup', 'webinar', 'concert'],
  },
  {
    type: 'schemaOrgPlace',
    title: 'Place',
    description: 'A physical location with address.',
    category: 'location',
    keywords: ['venue', 'location', 'landmark', 'spot'],
  },
  {
    type: 'schemaOrgCountry',
    title: 'Country',
    description: 'A country (extends Place) — useful for geographic targeting.',
    category: 'location',
    keywords: ['country', 'nation', 'geography', 'region'],
  },
  {
    type: 'schemaOrgLegalService',
    title: 'Legal Service',
    description: 'Law firm or legal practice (extends LocalBusiness).',
    category: 'people',
    keywords: ['law', 'lawyer', 'attorney', 'firm', 'legal'],
  },

  // ─── Software ─────────────────────────────────────────────────────
  {
    type: 'schemaOrgSoftwareApplication',
    title: 'Software Application',
    description: 'Desktop or mobile application.',
    category: 'software',
    keywords: ['app', 'tool', 'program', 'desktop', 'mobile'],
  },
  {
    type: 'schemaOrgWebApplication',
    title: 'Web Application',
    description: 'Web-based application or SaaS tool.',
    category: 'software',
    keywords: ['webapp', 'saas', 'online', 'cloud'],
  },

  // ─── Education ────────────────────────────────────────────────────
  {
    type: 'schemaOrgCourse',
    title: 'Course',
    description: 'Educational course with provider info.',
    category: 'education',
    keywords: ['learning', 'class', 'training', 'workshop', 'tutorial'],
  },

  // ─── New Schema Types ──────────────────────────────────────────────
  {
    type: 'schemaOrgJobPosting',
    title: 'Job Posting',
    description: 'A job listing with salary, location, and requirements.',
    category: 'people',
    keywords: ['job', 'career', 'hiring', 'employment', 'vacancy', 'work'],
  },
  {
    type: 'schemaOrgRestaurant',
    title: 'Restaurant',
    description: 'A restaurant or dining establishment.',
    category: 'commerce',
    keywords: ['restaurant', 'dining', 'food', 'cuisine', 'eatery'],
  },
  {
    type: 'schemaOrgMovie',
    title: 'Movie',
    description: 'A movie or film with cast and crew details.',
    category: 'media',
    keywords: ['movie', 'film', 'cinema', 'motion picture'],
  },
  {
    type: 'schemaOrgBook',
    title: 'Book',
    description: 'A book, e-book, or audiobook publication.',
    category: 'commerce',
    keywords: ['book', 'ebook', 'publication', 'novel', 'isbn'],
  },
  {
    type: 'schemaOrgNewsArticle',
    title: 'News Article',
    description: 'A news story — distinct from generic Article for news publishers.',
    category: 'content',
    keywords: ['news', 'journalism', 'press', 'story', 'report'],
  },
  {
    type: 'schemaOrgItemList',
    title: 'Item List',
    description: 'An ordered or unordered list of items (carousel).',
    category: 'navigation',
    keywords: ['list', 'carousel', 'items', 'collection'],
  },
  {
    type: 'schemaOrgProfilePage',
    title: 'Profile Page',
    description: 'A profile page for a person or organization.',
    category: 'content',
    keywords: ['profile', 'about', 'bio', 'author', 'creator'],
  },
  {
    type: 'schemaOrgMusicRecording',
    title: 'Music Recording',
    description: 'An individual song or music track.',
    category: 'media',
    keywords: ['song', 'track', 'music', 'recording', 'single'],
  },
  {
    type: 'schemaOrgMusicAlbum',
    title: 'Music Album',
    description: 'A music album or collection of tracks.',
    category: 'media',
    keywords: ['album', 'music', 'record', 'lp', 'ep', 'release'],
  },
]
