# 🔍 Sanity SEO Fields Plugin

[![npm version](https://img.shields.io/npm/v/sanity-plugin-seofields.svg?color=brightgreen&label=npm)](https://www.npmjs.com/package/sanity-plugin-seofields)
[![npm downloads](https://img.shields.io/npm/dm/sanity-plugin-seofields.svg?color=blue)](https://www.npmjs.com/package/sanity-plugin-seofields)
[![license](https://img.shields.io/npm/l/sanity-plugin-seofields.svg?color=yellow)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/hardik-143/sanity-plugin-seofields?style=social)](https://github.com/hardik-143/sanity-plugin-seofields)

A Sanity Studio (v3/v4/v5) plugin to manage SEO fields — meta tags, Open Graph, Twitter Cards, robots directives, and structured data.

📖 **[Full Documentation →](https://sanity-plugin-seofields.thehardik.in/docs)**

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

An optional Studio tool that scores SEO completeness across all documents, highlights missing fields, and links directly to documents.

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

The plugin ships 24 Schema.org types as Sanity schema definitions + React components that render `<script type="application/ld+json">` tags.

### 1. Register schema types in Studio

```ts
// sanity.config.ts
import {schemaOrg} from 'sanity-plugin-seofields/schema'

export default defineConfig({
  plugins: [seofields(), schemaOrg()],  // all 24 types at once
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
defineField({name: 'schemaOrg', type: 'schemaOrg'})   // combined array field
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

**Available types:** `Article`, `BlogPosting`, `BreadcrumbList`, `Course`, `Event`, `FAQPage`, `HowTo`, `ImageObject`, `LocalBusiness`, `Offer`, `Organization`, `Person`, `Place`, `Product`, `Review`, `SoftwareApplication`, `VideoObject`, `WebApplication`, `WebPage`, `Website`, and more.

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
