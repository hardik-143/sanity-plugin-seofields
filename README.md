# sanity-plugin-seofields

[![npm version](https://img.shields.io/npm/v/sanity-plugin-seofields.svg?color=brightgreen&label=npm)](https://www.npmjs.com/package/sanity-plugin-seofields)
[![npm downloads](https://img.shields.io/npm/dm/sanity-plugin-seofields.svg?color=blue)](https://www.npmjs.com/package/sanity-plugin-seofields)
[![license](https://img.shields.io/npm/l/sanity-plugin-seofields.svg?color=yellow)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/hardik-143/sanity-plugin-seofields?style=social)](https://github.com/hardik-143/sanity-plugin-seofields)

**The only Sanity SEO plugin with a built-in audit dashboard.**

Manage meta tags, Open Graph, Twitter Cards, robots directives, and 38 Schema.org/JSON-LD types — all inside Sanity Studio v3/v4/v5.

📖 **[Full Documentation →](https://sanity-plugin-seofields.thehardik.in/docs)**

---

> ⭐ If this plugin saves you time, please [leave a rating on the Sanity Plugin Directory](https://www.sanity.io/plugins/sanity-plugin-seofields), [star it on GitHub](https://github.com/hardik-143/sanity-plugin-seofields), and [leave a review on the docs site](https://sanity-plugin-seofields.thehardik.in/reviews). It helps other developers find it.

<!-- Demo GIF: SEO Health Dashboard in action -->
<!-- Add a screen recording here showing the SEO Health Dashboard scoring documents, the live SERP preview, and the Schema.org JSON-LD editor -->
<!-- Recommended tools: LICEcap (Mac/Windows), Kap (Mac), or ScreenToGif (Windows) -->

---

## Installation

```bash
npm install sanity-plugin-seofields
```

## Quick Start

### 1. Register the plugin

```ts
// sanity.config.ts
import {defineConfig} from 'sanity'
import seofields from 'sanity-plugin-seofields'

export default defineConfig({
  plugins: [seofields()],
})
```

### 2. Add SEO fields to a document

```ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'seo', type: 'seoFields'}),
  ],
})
```

That's it. The `seoFields` type is automatically registered by the plugin.

---

## Available Schema Types

| Type            | Description                          |
| --------------- | ------------------------------------ |
| `seoFields`     | Complete SEO bundle (recommended)    |
| `openGraph`     | Open Graph tags for social sharing   |
| `twitter`       | X (Twitter) Card settings            |
| `metaTag`       | Container for custom meta attributes |
| `metaAttribute` | Single key/value meta attribute      |
| `robots`        | noindex / nofollow directives        |

---

## Configuration

```ts
seofields({
  seoPreview: true,
  fieldOverrides: {
    title: {title: 'Page Title'},
  },
  defaultHiddenFields: ['openGraphSiteName', 'twitterSite'],
  fieldVisibility: {
    post: {hiddenFields: ['twitterSite']},
  },
})
```

| Option                | Type      | Default | Description                             |
| --------------------- | --------- | ------- | --------------------------------------- |
| `seoPreview`          | `boolean` | `true`  | Enable/disable live SEO preview         |
| `fieldOverrides`      | `object`  | `{}`    | Customize field titles and descriptions |
| `defaultHiddenFields` | `array`   | `[]`    | Hide sitewide fields globally           |
| `fieldVisibility`     | `object`  | `{}`    | Hide fields per document type           |

→ [Full configuration reference](https://sanity-plugin-seofields.thehardik.in/docs/configuration)

---

## SEO Health Dashboard

> **This is the feature that sets this plugin apart from every other Sanity SEO plugin.**

A built-in Studio tool that audits SEO completeness across all your documents at once — scores each document, highlights missing fields, and links directly to what needs fixing. No external tools. No leaving Studio.

Requires a free license key — [get yours here](https://sanity-plugin-seofields.thehardik.in/get-license).

```ts
seofields({
  dashboard: {
    enabled: true,
    licenseKey: process.env.SANITY_STUDIO_SEO_LICENSE_KEY,
  },
})
```

→ [Dashboard docs](https://sanity-plugin-seofields.thehardik.in/docs/dashboard)

---

## Schema.org / JSON-LD

The plugin ships 38 Schema.org types as Sanity schema definitions + React components that render `<script type="application/ld+json">` tags.

### 1. Register schema types in Studio

```ts
// sanity.config.ts
import {schemaOrg} from 'sanity-plugin-seofields/schema'

export default defineConfig({
  plugins: [seofields(), schemaOrg()], // all 38 types at once
})
```

Or register only what you need:

```ts
import {schemaOrgArticlePlugin, schemaOrgOrganizationPlugin} from 'sanity-plugin-seofields/schema'

export default defineConfig({
  plugins: [seofields(), schemaOrgArticlePlugin(), schemaOrgOrganizationPlugin()],
})
```

### 2. Add to a document schema

```ts
defineField({name: 'schemaOrg', type: 'schemaOrg'}) // combined array field
// or individual types:
defineField({name: 'article', type: 'schemaOrgArticle'})
```

### 3. Render in Next.js

```tsx
// Combined renderer
import {SchemaOrgScripts} from 'sanity-plugin-seofields/schema/next'

export default function Layout({data}) {
  return <SchemaOrgScripts items={data.schemaOrg} />
}

// Or individual components
import {ArticleSchema, OrganizationSchema} from 'sanity-plugin-seofields/schema/next'

export default function Page({data}) {
  return (
    <>
      <ArticleSchema data={data.article} />
      <OrganizationSchema data={data.org} />
    </>
  )
}
```

**All 38 available types:** `AggregateRating`, `Article`, `BlogPosting`, `Book`, `Brand`, `BreadcrumbList`, `ContactPoint`, `Country`, `Course`, `Event`, `FAQPage`, `HowTo`, `ImageObject`, `ItemList`, `JobPosting`, `LegalService`, `LocalBusiness`, `Movie`, `MusicAlbum`, `MusicRecording`, `NewsArticle`, `Offer`, `Organization`, `Person`, `Place`, `PostalAddress`, `Product`, `ProfilePage`, `Recipe`, `Restaurant`, `Review`, `Service`, `SocialMediaPosting`, `SoftwareApplication`, `VideoObject`, `WebApplication`, `WebPage`, `Website`.

→ [Schema.org docs](https://sanity-plugin-seofields.thehardik.in/docs/schema-org)

---

## Next.js Integration

```ts
import {buildSeoMeta, SeoMetaTags} from 'sanity-plugin-seofields/next'
```

→ [Next.js integration guide](https://sanity-plugin-seofields.thehardik.in/docs/nextjs)

---

## CLI

```bash
npx seofields
```

→ [CLI docs](https://sanity-plugin-seofields.thehardik.in/docs/cli)

---

## Links

- 📖 [Documentation](https://sanity-plugin-seofields.thehardik.in/docs)
- 🐛 [Issues](https://github.com/hardik-143/sanity-plugin-seofields/issues)
- 📦 [npm](https://www.npmjs.com/package/sanity-plugin-seofields)
- 📝 [Changelog](./CHANGELOG.md)

## Contributing

PRs and issues are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
