# 🔍 Sanity SEO Fields Plugin

[![npm version](https://img.shields.io/npm/v/sanity-plugin-seofields.svg?color=brightgreen&label=npm)](https://www.npmjs.com/package/sanity-plugin-seofields)
[![npm downloads](https://img.shields.io/npm/dm/sanity-plugin-seofields.svg?color=blue)](https://www.npmjs.com/package/sanity-plugin-seofields)
[![license](https://img.shields.io/npm/l/sanity-plugin-seofields.svg?color=yellow)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/hardik-143/sanity-plugin-seofields?color=orange)](https://github.com/hardik-143/sanity-plugin-seofields/issues)
[![GitHub stars](https://img.shields.io/github/stars/hardik-143/sanity-plugin-seofields?style=social)](https://github.com/hardik-143/sanity-plugin-seofields)

A comprehensive Sanity Studio v3 plugin to manage SEO fields like meta titles, descriptions, Open Graph tags, and X (Formerly Twitter) Cards for structured, search-optimized content.

## ✨ Features

- 🎯 **Meta Tags**: Title, description, keywords, and canonical URLs
- 📱 **Open Graph**: Complete social media sharing optimization
- 🐦 **X (Formerly Twitter) Cards**: X-specific meta tags with image support
- 🤖 **Robots Control**: Index/follow settings for search engines
- 🖼️ **Image Management**: Optimized image handling for social sharing
- 📋 **Live Preview**: Real-time SEO preview as you edit
- 🔧 **TypeScript Support**: Full type definitions included
- 📊 **Custom Attributes**: Flexible meta attribute system
- ✅ **Validation**: Built-in character limits and best practices
- 🎛️ **Field Visibility**: Hide sitewide fields on specific content types

## 📦 Installation

```bash
npm install sanity-plugin-seofields
```

or

```bash
yarn add sanity-plugin-seofields
```

## 🚀 Quick Start

### 1. Add the Plugin

Add the plugin to your `sanity.config.ts` (or `.js`) file:

```typescript
import {defineConfig} from 'sanity'
import seofields from 'sanity-plugin-seofields'

export default defineConfig({
  name: 'your-project',
  title: 'Your Project',
  projectId: 'your-project-id',
  dataset: 'production',

  plugins: [
    seofields(), // Add the SEO fields plugin
    // ... other plugins
  ],

  schema: {
    types: [
      // ... your schema types
    ],
  },
})
```

### 2. Add SEO Fields to Your Documents

Add the SEO fields to any document type in your schema:

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
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
    }),
    // Add SEO fields
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
})
```

### 3. Using Individual SEO Components

You can also use individual components:

```typescript
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    // ... other fields

    // Individual SEO components
    defineField({
      name: 'openGraph',
      title: 'Open Graph',
      type: 'openGraph',
    }),
    defineField({
      name: 'twitterCard',
      title: 'X (Formerly Twitter) Card',
      type: 'twitter',
    }),
    defineField({
      name: 'metaAttributes',
      title: 'Custom Meta Tags',
      type: 'metaTag',
    }),
  ],
})
```

## 🎨 Available Schema Types

| Type            | Description               | Use Case                         |
| --------------- | ------------------------- | -------------------------------- |
| `seoFields`     | Complete SEO package      | Main SEO fields for any document |
| `openGraph`     | Open Graph meta tags      | Social media sharing             |
| `twitter`       | X (Formerly Twitter) Card settings | X-specific optimization    |
| `metaTag`       | Custom meta attributes    | Advanced meta tag management     |
| `metaAttribute` | Individual meta attribute | Building custom meta tags        |
| `robots`        | Search engine directives  | Control indexing and crawling    |

## 🔧 Configuration Options

### Basic Configuration

```typescript
import seofields from 'sanity-plugin-seofields'

export default defineConfig({
  plugins: [
    seofields(), // Use default configuration
  ],
})
```

### Advanced Configuration

You can customize field titles and descriptions, control SEO preview functionality, and manage field visibility:

```typescript
import seofields, {SeoFieldsPluginConfig} from 'sanity-plugin-seofields'

export default defineConfig({
  plugins: [
    seofields({
      seoPreview: true, // Enable/disable SEO preview (default: true)
      fieldOverrides: {
        title: {
          title: 'Page Title',
          description: 'The main title that appears in search results',
        },
        description: {
          title: 'Meta Description',
          description: 'A brief description of the page content for search engines',
        },
        canonicalUrl: {
          title: 'Canonical URL',
          description: 'The preferred URL for this page to avoid duplicate content issues',
        },
        metaImage: {
          title: 'Social Media Image',
          description: 'Image used when sharing this page on social media',
        },
        keywords: {
          title: 'SEO Keywords',
          description: 'Keywords that describe the content of this page',
        },
      },
      // Hide sitewide fields on specific content types
      fieldVisibility: {
        page: {
          hiddenFields: ['openGraphSiteName', 'twitterSite']
        },
        post: {
          hiddenFields: ['openGraphSiteName', 'twitterSite']
        }
      },
      // Or hide fields globally
      defaultHiddenFields: ['openGraphSiteName', 'twitterSite']
    } satisfies SeoFieldsPluginConfig),
  ],
})
```

### Configuration Options

| Option                | Type      | Default | Description                                 |
| --------------------- | --------- | ------- | ------------------------------------------- |
| `seoPreview`          | `boolean` | `true`  | Enable/disable the live SEO preview feature |
| `fieldOverrides`      | `object`  | `{}`    | Customize field titles and descriptions     |
| `fieldVisibility`     | `object`  | `{}`    | Hide sitewide fields on specific post types |
| `defaultHiddenFields` | `array`   | `[]`    | Hide sitewide fields globally               |

#### Field Configuration

Each field in the `fieldOverrides` object can have:

- `title` - Custom title for the field
- `description` - Custom description/help text for the field

**Available field keys:**

- `title`
- `description`
- `canonicalUrl`
- `metaImage`
- `keywords`
- `metaAttributes`

#### Field Visibility Configuration

Control which fields are visible on different content types. You can hide any SEO field on any post type:

**Available field keys:**
- `title` - Meta Title field
- `description` - Meta Description field
- `canonicalUrl` - Canonical URL field
- `metaImage` - Meta Image field
- `keywords` - Keywords field
- `metaAttributes` - Custom Meta Attributes field
- `robots` - Robots Settings field
- `openGraphSiteName` - Open Graph Site Name field (sitewide)
- `twitterSite` - X (Formerly Twitter) Site Handle field (sitewide)

**Example configurations:**

```typescript
// Hide fields globally
seofields({
  defaultHiddenFields: ['openGraphSiteName', 'twitterSite', 'keywords']
})

// Hide fields on specific content types
seofields({
  fieldVisibility: {
    page: {
      hiddenFields: ['openGraphSiteName', 'twitterSite', 'keywords']
    },
    post: {
      hiddenFields: ['openGraphSiteName', 'metaAttributes']
    },
    product: {
      hiddenFields: ['canonicalUrl', 'robots']
    }
  }
})
```

This is particularly useful when you want to:
- Manage sitewide settings (like site name and X handle) in a dedicated Site Settings document
- Simplify the editing experience by hiding fields that aren't relevant for certain content types
- Create different SEO workflows for different content types

### Field Specifications

#### Meta Title

- **Max Length**: 70 characters (warning at 60)
- **Purpose**: Search engine result headlines
- **Best Practice**: Include primary keywords, keep under 60 chars

#### Meta Description

- **Max Length**: 160 characters (warning at 150)
- **Purpose**: Search result descriptions
- **Best Practice**: Compelling summary with keywords

#### Open Graph Image

- **Recommended Size**: 1200x630px
- **Minimum Size**: 600x315px
- **Aspect Ratio**: 1.91:1
- **Formats**: JPG, PNG, WebP

#### Open Graph URL

- **Purpose**: Canonical URL for social media sharing
- **Format**: Full URL with protocol (https://)
- **Best Practice**: Use the preferred URL for the page to avoid duplicate content issues
- **Required**: Should match the actual page URL for consistency

#### X (Formerly Twitter) Card Image

- **Summary Card**: Minimum 120x120px
- **Large Image**: Minimum 280x150px
- **Required**: Alt text for accessibility

#### X (Formerly Twitter) Card Creator

- **Purpose**: Attribution to content creator on X (formerly Twitter)
- **Format**: X handle with @ symbol (e.g., @creator)
- **Usage**: Identifies the individual author of the content
- **Best Practice**: Use actual X handles for proper attribution

## 💻 TypeScript Usage

The plugin includes full TypeScript support:

```typescript
import type {
  SeoFields,
  OpenGraphSettings,
  TwitterCardSettings,
  SeoFieldsPluginConfig,
} from 'sanity-plugin-seofields'

// Plugin configuration
const pluginConfig: SeoFieldsPluginConfig = {
  seoPreview: true,
  fields: {
    title: {
      title: 'Page Title',
      description: 'The main title for search engines',
    },
    description: {
      title: 'Meta Description',
      description: 'Brief description for search results',
    },
  },
}

// Use in your document interfaces
interface PageDocument {
  _type: 'page'
  title: string
  seo?: SeoFields
}

// Type-safe field access
const seoData: SeoFields = {
  _type: 'seoFields',
  title: 'My Page Title',
  description: 'A great page description',
  openGraph: {
    _type: 'openGraph',
    title: 'Social Media Title',
    description: 'Social media description',
    url: 'https://example.com/page',
    type: 'website',
  },
  twitter: {
    _type: 'twitter',
    card: 'summary_large_image',
    site: '@example',
    creator: '@creator',
    title: 'Twitter Title',
    description: 'Twitter description',
  },
}
```

### Available Types

```typescript
import type {
  SeoFields,
  SeoFieldsPluginConfig,
  SeoFieldConfig,
  SeoFieldKeys,
  SitewideFieldKeys,
  FieldVisibilityConfig,
  OpenGraphSettings,
  TwitterCardSettings,
  MetaAttribute,
  MetaTag,
  RobotsSettings,
  SanityImage,
} from 'sanity-plugin-seofields'
```

## 🎛️ Field Visibility Feature

The field visibility feature allows you to hide any SEO field on specific content types. This is perfect for managing sitewide settings in a dedicated Site Settings document or creating customized editing experiences for different content types.

### Quick Example

```typescript
// Hide specific fields on different content types
seofields({
  fieldVisibility: {
    page: {
      hiddenFields: ['openGraphSiteName', 'twitterSite', 'keywords']
    },
    post: {
      hiddenFields: ['openGraphSiteName', 'metaAttributes']
    },
    product: {
      hiddenFields: ['canonicalUrl', 'robots']
    }
  }
})
```

### Site Settings Integration

Create a Site Settings document to manage sitewide fields:

```typescript
// schemas/siteSettings.ts
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'openGraphSiteName',
      title: 'Open Graph Site Name',
      type: 'string',
    }),
    defineField({
      name: 'twitterSite',
      title: 'X (Formerly Twitter) Site Handle',
      type: 'string',
    }),
  ],
})
```

### Complete SEO Setup

```typescript
// In your schema
defineField({
  name: 'seo',
  title: 'SEO & Social Media',
  type: 'seoFields',
  group: 'seo', // Optional: group in a tab
})
```

### Custom Meta Tags

```typescript
// For advanced users who need custom meta tags
defineField({
  name: 'customMeta',
  title: 'Custom Meta Tags',
  type: 'metaTag',
  description: 'Add custom meta attributes for specific needs',
})
```

### Open Graph Only

```typescript
// If you only need Open Graph
defineField({
  name: 'socialSharing',
  title: 'Social Media Sharing',
  type: 'openGraph',
})
```

## 🌐 Frontend Integration

### Next.js Example

```typescript
import {SeoFields} from 'sanity-plugin-seofields'
import Head from 'next/head'

interface SEOProps {
  seo?: SeoFields
}

export function SEOHead({seo}: SEOProps) {
  if (!seo) return null

  return (
    <Head>
      {seo.title && <title>{seo.title}</title>}
      {seo.description && (
        <meta name="description" content={seo.description} />
      )}

      {/* Open Graph */}
      {seo.openGraph?.title && (
        <meta property="og:title" content={seo.openGraph.title} />
      )}
      {seo.openGraph?.description && (
        <meta property="og:description" content={seo.openGraph.description} />
      )}
      {seo.openGraph?.url && (
        <meta property="og:url" content={seo.openGraph.url} />
      )}

      {/* Twitter */}
      {seo.twitter?.card && (
        <meta name="twitter:card" content={seo.twitter.card} />
      )}
      {seo.twitter?.site && (
        <meta name="twitter:site" content={seo.twitter.site} />
      )}
      {seo.twitter?.creator && (
        <meta name="twitter:creator" content={seo.twitter.creator} />
      )}

      {/* Robots */}
      {seo.robots?.noIndex && <meta name="robots" content="noindex" />}
      {seo.robots?.noFollow && <meta name="robots" content="nofollow" />}

      {/* Canonical URL */}
      {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
    </Head>
  )
}
```

### React/Gatsby Example

```typescript
import {Helmet} from 'react-helmet'
import {SeoFields} from 'sanity-plugin-seofields'

interface SEOProps {
  seo?: SeoFields
}

export function SEO({seo}: SEOProps) {
  return (
    <Helmet>
      <title>{seo?.title}</title>
      <meta name="description" content={seo?.description} />

      {/* Keywords */}
      {seo?.keywords && (
        <meta name="keywords" content={seo.keywords.join(', ')} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={seo?.openGraph?.title} />
      <meta property="og:description" content={seo?.openGraph?.description} />
      <meta property="og:url" content={seo?.openGraph?.url} />
      <meta property="og:type" content={seo?.openGraph?.type || 'website'} />

      {/* Twitter */}
      {seo?.twitter?.card && (
        <meta name="twitter:card" content={seo.twitter.card} />
      )}
      {seo?.twitter?.site && (
        <meta name="twitter:site" content={seo.twitter.site} />
      )}
      {seo?.twitter?.creator && (
        <meta name="twitter:creator" content={seo.twitter.creator} />
      )}
    </Helmet>
  )
}
```

## 📚 API Reference

### Main Export

```typescript
import seofields from 'sanity-plugin-seofields'
```

### Schema Types

- `seoFields` - Complete SEO fields object
- `openGraph` - Open Graph meta tags
- `twitter` - Twitter Card settings
- `metaTag` - Custom meta tag collection
- `metaAttribute` - Individual meta attribute
- `robots` - Search engine robots settings

### TypeScript Types

All types are exported from the main module for use in your project.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

[MIT](LICENSE) © [Desai Hardik](https://github.com/hardik-143)

## 🆘 Support

- 📧 Email: dhardik1430@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/hardik-143/sanity-plugin-seofields/issues)
- 📖 Documentation: [Types & Schema Docs](./TYPES_SCHEMA_DOCS.md)

---

Made with ❤️ for the Sanity community
