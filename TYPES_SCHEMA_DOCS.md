# 📚 Types & Schema Documentation

Complete TypeScript type definitions and schema documentation for the Sanity SEO Fields Plugin.

## 📋 Table of Contents

- [Core SEO Types](#core-seo-types)
- [Supporting Types](#supporting-types)
- [Sanity Asset Types](#sanity-asset-types)
- [Usage Examples](#usage-examples)
- [Type Guards](#type-guards)
- [Best Practices](#best-practices)

---

## 🎯 Core SEO Types

### `SeoFields`

The main SEO fields object containing all SEO-related data.

```typescript
export type SeoFields = {
  _type: 'seoFields'
  robots?: Robots
  preview?: string
  title?: string
  description?: string
  metaImage?: SanityImage
  metaAttributes?: Array<MetaAttribute>
  keywords?: Array<string>
  canonicalUrl?: string
  openGraph?: OpenGraph
  twitter?: Twitter
}
```

#### Properties

| Property         | Type                   | Description                           | Required |
| ---------------- | ---------------------- | ------------------------------------- | -------- |
| `_type`          | `'seoFields'`          | Sanity document type identifier       | ✅       |
| `robots`         | `Robots`               | Search engine crawling directives     | ❌       |
| `preview`        | `string`               | SEO preview (read-only)               | ❌       |
| `title`          | `string`               | HTML meta title (max 70 chars)        | ❌       |
| `description`    | `string`               | HTML meta description (max 160 chars) | ❌       |
| `metaImage`      | `SanityImage`          | Default social sharing image          | ❌       |
| `metaAttributes` | `Array<MetaAttribute>` | Custom meta attributes                | ❌       |
| `keywords`       | `Array<string>`        | SEO keywords                          | ❌       |
| `canonicalUrl`   | `string`               | Canonical URL for duplicate content   | ❌       |
| `openGraph`      | `OpenGraph`            | Open Graph social media settings      | ❌       |
| `twitter`        | `Twitter`              | Twitter Card settings                 | ❌       |

---

### `OpenGraph`

Open Graph meta tags for social media sharing optimization.

```typescript
export type OpenGraph = {
  _type: 'openGraph'
  title?: string
  description?: string
  siteName?: string
  type?: 'website' | 'article' | 'profile' | 'book' | 'music' | 'video' | 'product'
  imageType?: 'upload' | 'url'
  image?: SanityImage
  imageUrl?: string
}
```

#### Properties

| Property      | Type                | Description                              | Recommended Size     |
| ------------- | ------------------- | ---------------------------------------- | -------------------- |
| `_type`       | `'openGraph'`       | Type identifier                          | -                    |
| `title`       | `string`            | Social media title (max 95 chars)        | -                    |
| `description` | `string`            | Social media description (max 200 chars) | -                    |
| `siteName`    | `string`            | Website name                             | -                    |
| `type`        | `OpenGraphType`     | Content type for Open Graph              | Default: `'website'` |
| `imageType`   | `'upload' \| 'url'` | Image source type                        | Default: `'upload'`  |
| `image`       | `SanityImage`       | Uploaded image for sharing               | 1200x630px           |
| `imageUrl`    | `string`            | External image URL                       | 1200x630px           |

#### Open Graph Types

- `website` - General website pages
- `article` - Blog posts, news articles
- `profile` - User profiles, about pages
- `book` - Book pages, publications
- `music` - Music albums, songs
- `video` - Video content
- `product` - E-commerce products

---

### `Twitter`

Twitter Card specific meta tags and settings.

```typescript
export type Twitter = {
  _type: 'twitter'
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  title?: string
  description?: string
  image?: SanityImageWithAlt
}
```

#### Properties

| Property      | Type                 | Description                         | Requirements                     |
| ------------- | -------------------- | ----------------------------------- | -------------------------------- |
| `_type`       | `'twitter'`          | Type identifier                     | -                                |
| `card`        | `TwitterCardType`    | Twitter Card type                   | Default: `'summary_large_image'` |
| `site`        | `string`             | Twitter handle (@username)          | Must start with @                |
| `title`       | `string`             | Twitter title (max 70 chars)        | -                                |
| `description` | `string`             | Twitter description (max 200 chars) | -                                |
| `image`       | `SanityImageWithAlt` | Image with required alt text        | See sizes below                  |

#### Twitter Card Types & Image Requirements

| Card Type             | Image Size        | Use Case                  |
| --------------------- | ----------------- | ------------------------- |
| `summary`             | 120x120px minimum | Small image, text-focused |
| `summary_large_image` | 280x150px minimum | Large image display       |
| `app`                 | 120x120px minimum | Mobile app promotion      |
| `player`              | 280x150px minimum | Video/audio content       |

---

### `Robots`

Search engine crawler directives.

```typescript
export type Robots = {
  _type: 'robots'
  noIndex?: boolean
  noFollow?: boolean
}
```

#### Properties

| Property   | Type       | Description                     | Default |
| ---------- | ---------- | ------------------------------- | ------- |
| `_type`    | `'robots'` | Type identifier                 | -       |
| `noIndex`  | `boolean`  | Prevent search engine indexing  | `false` |
| `noFollow` | `boolean`  | Prevent following links on page | `false` |

#### Common Combinations

- `noIndex: false, noFollow: false` - Normal indexing (default)
- `noIndex: true, noFollow: false` - Don't index but follow links
- `noIndex: false, noFollow: true` - Index but don't follow links
- `noIndex: true, noFollow: true` - No indexing, no link following

---

## 🛠️ Supporting Types

### `MetaAttribute`

Individual meta attribute for custom HTML meta tags.

```typescript
export type MetaAttribute = {
  _type: 'metaAttribute'
  key?: string
  type?: 'string' | 'image'
  value?: string
  image?: SanityImage
}
```

#### Properties

| Property | Type                  | Description                        | Example                     |
| -------- | --------------------- | ---------------------------------- | --------------------------- |
| `_type`  | `'metaAttribute'`     | Type identifier                    | -                           |
| `key`    | `string`              | Meta attribute name                | `"theme-color"`, `"author"` |
| `type`   | `'string' \| 'image'` | Value type                         | `"string"`                  |
| `value`  | `string`              | String value (when type is string) | `"#000000"`, `"John Doe"`   |
| `image`  | `SanityImage`         | Image value (when type is image)   | -                           |

#### Common Meta Attributes

```typescript
// Theme color
{
  _type: 'metaAttribute',
  key: 'theme-color',
  type: 'string',
  value: '#000000'
}

// Author
{
  _type: 'metaAttribute',
  key: 'author',
  type: 'string',
  value: 'John Doe'
}

// Viewport
{
  _type: 'metaAttribute',
  key: 'viewport',
  type: 'string',
  value: 'width=device-width, initial-scale=1'
}
```

---

### `MetaTag`

Collection of meta attributes.

```typescript
export type MetaTag = {
  _type: 'metaTag'
  metaAttributes?: Array<
    {
      _key: string
    } & MetaAttribute
  >
}
```

#### Properties

| Property         | Type                   | Description                               |
| ---------------- | ---------------------- | ----------------------------------------- |
| `_type`          | `'metaTag'`            | Type identifier                           |
| `metaAttributes` | `Array<MetaAttribute>` | Array of meta attributes with Sanity keys |

---

## 🖼️ Sanity Asset Types

### `SanityImageAsset`

Complete Sanity image asset with metadata.

```typescript
export type SanityImageAsset = {
  _id: string
  _type: 'sanity.imageAsset'
  _createdAt: string
  _updatedAt: string
  _rev: string
  originalFilename?: string
  label?: string
  title?: string
  description?: string
  altText?: string
  sha1hash?: string
  extension?: string
  mimeType?: string
  size?: number
  assetId?: string
  uploadId?: string
  path?: string
  url?: string
  metadata?: SanityImageMetadata
  source?: SanityAssetSourceData
}
```

### `SanityImageMetadata`

Image metadata including dimensions, palette, and technical data.

```typescript
export type SanityImageMetadata = {
  _type: 'sanity.imageMetadata'
  location?: Geopoint
  dimensions?: SanityImageDimensions
  palette?: SanityImagePalette
  lqip?: string
  blurHash?: string
  hasAlpha?: boolean
  isOpaque?: boolean
}
```

### `SanityImageDimensions`

Image dimensions and aspect ratio.

```typescript
export type SanityImageDimensions = {
  _type: 'sanity.imageDimensions'
  height: number
  width: number
  aspectRatio: number
}
```

### Image Hotspot & Crop

For responsive image handling:

```typescript
export type SanityImageHotspot = {
  _type: 'sanity.imageHotspot'
  x: number // 0-1, horizontal position
  y: number // 0-1, vertical position
  height: number // 0-1, hotspot height
  width: number // 0-1, hotspot width
}

export type SanityImageCrop = {
  _type: 'sanity.imageCrop'
  top: number // 0-1, crop from top
  bottom: number // 0-1, crop from bottom
  left: number // 0-1, crop from left
  right: number // 0-1, crop from right
}
```

---

## 💡 Usage Examples

### Basic SEO Fields Implementation

```typescript
import type {SeoFields} from 'sanity-plugin-seofields'

const pageSeo: SeoFields = {
  _type: 'seoFields',
  title: 'My Awesome Page - Company Name',
  description: 'Discover amazing content on our page with detailed information about our services.',
  keywords: ['awesome', 'page', 'services', 'company'],
  canonicalUrl: 'https://example.com/my-page',
  robots: {
    _type: 'robots',
    noIndex: false,
    noFollow: false,
  },
  openGraph: {
    _type: 'openGraph',
    title: 'My Awesome Page',
    description: 'Social media optimized description for sharing.',
    type: 'website',
    siteName: 'Company Name',
  },
  twitter: {
    _type: 'twitter',
    card: 'summary_large_image',
    site: '@company',
    title: 'My Awesome Page',
    description: 'Twitter optimized description.',
  },
}
```

### Document Schema Integration

```typescript
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
      default: false,
    },
  ],
})
```

### Frontend Implementation (Next.js)

```typescript
import type {SeoFields} from 'sanity-plugin-seofields'
import Head from 'next/head'

interface PageProps {
  seo?: SeoFields
}

export function PageHead({seo}: PageProps) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seo?.title || 'Default Title'}</title>
      <meta name="description" content={seo?.description || 'Default description'} />

      {/* Keywords */}
      {seo?.keywords && (
        <meta name="keywords" content={seo.keywords.join(', ')} />
      )}

      {/* Canonical URL */}
      {seo?.canonicalUrl && (
        <link rel="canonical" href={seo.canonicalUrl} />
      )}

      {/* Robots */}
      {seo?.robots?.noIndex && (
        <meta name="robots" content="noindex" />
      )}
      {seo?.robots?.noFollow && (
        <meta name="robots" content="nofollow" />
      )}

      {/* Open Graph */}
      {seo?.openGraph && (
        <>
          <meta property="og:title" content={seo.openGraph.title} />
          <meta property="og:description" content={seo.openGraph.description} />
          <meta property="og:type" content={seo.openGraph.type || 'website'} />
          {seo.openGraph.siteName && (
            <meta property="og:site_name" content={seo.openGraph.siteName} />
          )}
        </>
      )}

      {/* Twitter */}
      {seo?.twitter && (
        <>
          <meta name="twitter:card" content={seo.twitter.card || 'summary'} />
          {seo.twitter.site && (
            <meta name="twitter:site" content={seo.twitter.site} />
          )}
          {seo.twitter.title && (
            <meta name="twitter:title" content={seo.twitter.title} />
          )}
          {seo.twitter.description && (
            <meta name="twitter:description" content={seo.twitter.description} />
          )}
        </>
      )}

      {/* Custom Meta Attributes */}
      {seo?.metaAttributes?.map((attr, index) => (
        attr.type === 'string' && attr.key && attr.value ? (
          <meta key={index} name={attr.key} content={attr.value} />
        ) : null
      ))}
    </Head>
  )
}
```

---

## 🔍 Type Guards

Use these utility functions to safely check types:

```typescript
export function isSeoFields(obj: any): obj is SeoFields {
  return obj && obj._type === 'seoFields'
}

export function isOpenGraph(obj: any): obj is OpenGraph {
  return obj && obj._type === 'openGraph'
}

export function isTwitter(obj: any): obj is Twitter {
  return obj && obj._type === 'twitter'
}

export function isMetaAttribute(obj: any): obj is MetaAttribute {
  return obj && obj._type === 'metaAttribute'
}

// Usage example
if (isSeoFields(data)) {
  // TypeScript now knows data is SeoFields
  console.log(data.title)
}
```

---

## ✅ Best Practices

### Character Limits

| Field               | Recommended   | Maximum   | Warning Point |
| ------------------- | ------------- | --------- | ------------- |
| Meta Title          | 50-60 chars   | 70 chars  | 60 chars      |
| Meta Description    | 140-150 chars | 160 chars | 150 chars     |
| OG Title            | 85-95 chars   | 95 chars  | 90 chars      |
| OG Description      | 180-200 chars | 200 chars | 190 chars     |
| Twitter Title       | 60-70 chars   | 70 chars  | 65 chars      |
| Twitter Description | 180-200 chars | 200 chars | 190 chars     |

### Image Specifications

#### Open Graph Images

- **Recommended**: 1200x630px (1.91:1 ratio)
- **Minimum**: 600x315px
- **Maximum**: 5MB
- **Formats**: JPG, PNG, WebP

#### Twitter Images

- **Summary Card**: 120x120px minimum (1:1 ratio)
- **Large Image**: 280x150px minimum (1.87:1 ratio)
- **Maximum**: 5MB
- **Alt text**: Always required

### SEO Guidelines

1. **Meta Title**: Include primary keyword, brand name, keep under 60 chars
2. **Meta Description**: Compelling call-to-action, include keywords naturally
3. **Keywords**: 3-10 relevant terms, avoid keyword stuffing
4. **Canonical URL**: Always use absolute URLs
5. **Images**: Optimize for web, include alt text
6. **Open Graph**: Use high-quality images, engaging titles
7. **Twitter**: Optimize for mobile viewing

### TypeScript Usage

```typescript
// ✅ Good: Type-safe access
const title: string = seo?.title ?? 'Default Title'

// ✅ Good: Optional chaining with fallbacks
const ogImage = seo?.openGraph?.image?.asset?.url ?? '/default-og-image.jpg'

// ✅ Good: Type guards for safety
if (isOpenGraph(seo?.openGraph)) {
  console.log(seo.openGraph.title)
}

// ❌ Avoid: Direct access without null checks
const title = seo.title // Could throw error

// ❌ Avoid: Type assertions without guards
const og = seo.openGraph as OpenGraph // Unsafe
```

---

## 🔗 Related Documentation

- [Main README](./README.md) - Installation and basic usage
- [Sanity Schema Documentation](https://www.sanity.io/docs/schema-types)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

---

Made with ❤️ for the Sanity community
