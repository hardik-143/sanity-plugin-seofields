# 📚 Schema Documentation

Authoritative reference for the schema building blocks included with the Sanity SEO Fields Plugin.

> ℹ️ Import path
>
> Everything documented here ships from sanity-plugin-seofields. No additional entry points are required.

## 📋 Table of Contents

- [Available Schema Factories](#-available-schema-factories)
- [SEO Fields Structure](#-seo-fields-structure)
- [Open Graph Structure](#-open-graph-structure)
- [Twitter Structure](#-twitter-structure)
- [Robots Settings](#-robots-settings)
- [Meta Attributes and Tags](#-meta-attributes-and-tags)
- [Usage Examples](#-usage-examples)
- [Best Practices](#-best-practices)

---

## 🧱 Available Schema Factories

| Export              | Purpose                                                    | Notes                                                     |
| ------------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| seoFieldsSchema     | Complete SEO field set used by the default seoFields type. | Adds preview, validation, and grouped inputs.             |
| openGraphSchema     | Standalone Open Graph object.                              | Matches the Open Graph section inside seoFields.          |
| twitterSchema       | X (formerly Twitter) card settings.                        | Includes card selection, image handling, and link fields. |
| metaTagSchema       | Container for custom meta attributes.                      | Designed to pair with metaAttributeSchema.                |
| metaAttributeSchema | Single meta attribute (string or image).                   | Accepts key/value or key/image pairs.                     |
| robotsSchema        | Robots directives (noindex / nofollow).                    | Shared between seoFields and standalone usage.            |

Each factory returns a schema definition compatible with defineField. You can reuse them directly or compose them into custom schema types.

---

## 🔍 SEO Fields Structure

seoFieldsSchema exposes a grouped set of fields tailored for page-level SEO.

| Field          | Type                   | Description                                                 |
| -------------- | ---------------------- | ----------------------------------------------------------- |
| title          | string                 | Meta title with built-in length validation.                 |
| description    | text                   | Meta description with live character guidance.              |
| canonicalUrl   | url                    | Preferred URL for canonical link tags.                      |
| metaImage      | image                  | Default social sharing image. Alt text strongly encouraged. |
| keywords       | array of string        | Optional keyword helpers for editorial teams.               |
| openGraph      | openGraph              | Nested object powered by openGraphSchema.                   |
| twitter        | twitter                | Nested object from twitterSchema.                           |
| metaAttributes | array of metaAttribute | Custom meta tag key/value pairs.                            |
| robots         | robots                 | Search engine visibility toggles.                           |

When the plugin is enabled, the schema is registered under the Sanity type name seoFields automatically.

---

## 📣 Open Graph Structure

openGraphSchema ships the majority of fields editors need for social sharing cards.

| Field       | Type   | Description                                                   |
| ----------- | ------ | ------------------------------------------------------------- |
| title       | string | Social headline shown on link previews.                       |
| description | text   | Copy that appears beneath the headline.                       |
| url         | url    | Canonical URL for the shared page.                            |
| siteName    | string | Optional brand or site name.                                  |
| type        | string | Limits choices to standard Open Graph types.                  |
| imageType   | string | Switch between uploaded images and external URLs.             |
| image       | image  | Rich image with hotspot/alt support when imageType is upload. |
| imageUrl    | url    | Remote image when imageType is url.                           |

The schema enforces recommended sizes and warns when descriptions exceed typical platform guidance.

---

## 🐦 Twitter Structure

twitterSchema mirrors the Open Graph fields with X-specific guidance.

| Field       | Type   | Description                                                       |
| ----------- | ------ | ----------------------------------------------------------------- |
| card        | string | Card layout selector (summary, summary_large_image, app, player). |
| site        | string | X handle for the publisher (includes @ validation).               |
| creator     | string | X handle for the content author.                                  |
| title       | string | Share title with character limit warnings.                        |
| description | text   | Share description constrained to 200 characters.                  |
| imageType   | string | Matches the Open Graph image mode workflow.                       |
| image       | image  | Upload field with required alt text prompts.                      |
| imageUrl    | url    | Remote image option.                                              |

---

## 🤖 Robots Settings

robotsSchema exposes two booleans: noIndex and noFollow. Editors can flag pages to be excluded from indexing or link crawling without touching code. The plugin defaults both values to false and shows explanatory helper text inside Studio.

---

## 🏷️ Meta Attributes and Tags

Custom meta tags are composed of metaTagSchema and metaAttributeSchema:

- metaTagSchema defines an array of meta attributes with ordering and unique key validation.
- metaAttributeSchema contains the actual key/value editor. Editors can toggle between string values and image references.

Use this pair when you need bespoke meta tags beyond the defaults provided by seoFieldsSchema.

---

## 🛠️ Usage Examples

### Add SEO fields to a document

```ts
import {defineField, defineType} from 'sanity'
import {seoFieldsSchema} from 'sanity-plugin-seofields'

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
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
})
```

### Compose Open Graph as a standalone object

```ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'socialCard',
  title: 'Social Card',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'openGraph',
    }),
  ],
})
```

### Site settings with robots defaults

```ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO Defaults',
      type: 'seoFields',
    }),
    defineField({
      name: 'robotsOverride',
      title: 'Robots Override',
      type: 'robots',
    }),
  ],
})
```

### Custom meta attribute helper

```ts
import {defineField} from 'sanity'

export const customMetaField = defineField({
  name: 'customMeta',
  title: 'Custom Meta Tags',
  type: 'metaTag',
})
```

---

## ✅ Best Practices

- Register seoFields on every document intended for organic search or social sharing.
- Use fieldVisibility or document-level logic to hide sitewide fields when managed elsewhere.
- Encourage editors to provide alt text for every uploaded social image.
- Keep Open Graph and Twitter copy aligned, but tailor it to each network's tone.
- Populate canonical URLs when pages have multiple routes or marketing variants.

---

Need more schema inspiration? Browse the live implementations in src/schemas/ within this repository to see the exact builders the plugin exports.
