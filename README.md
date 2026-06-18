![sanity-plugin-seofields — the complete SEO toolkit for Sanity Studio](./sanity_plugin_seofields_logo.png)

# sanity-plugin-seofields

**The complete SEO toolkit for Sanity Studio.**

Manage SEO fields, social previews, robots directives, canonical URLs, Schema.org JSON-LD, and studio-wide SEO health checks — directly inside Sanity Studio v3, v4, or v5.

<p><a href="https://www.npmjs.com/package/sanity-plugin-seofields"><img src="https://img.shields.io/npm/v/sanity-plugin-seofields.svg?color=10b981&label=npm" alt="npm version" /></a> <a href="https://www.npmjs.com/package/sanity-plugin-seofields"><img src="https://img.shields.io/npm/dm/sanity-plugin-seofields.svg?color=2563eb&label=downloads" alt="npm downloads" /></a> <a href="./LICENSE"><img src="https://img.shields.io/npm/l/sanity-plugin-seofields.svg?color=f59e0b" alt="license" /></a> <a href="https://github.com/hardik-143/sanity-plugin-seofields"><img src="https://img.shields.io/github/stars/hardik-143/sanity-plugin-seofields?style=social" alt="GitHub stars" /></a> <a href="https://www.sanity.io"><img src="https://img.shields.io/badge/Sanity-v3%20%7C%20v4%20%7C%20v5-f03e2f?logo=sanity" alt="Sanity" /></a> <a href="#compatibility"><img src="https://img.shields.io/badge/TypeScript-ready-3178c6?logo=typescript&logoColor=white" alt="TypeScript" /></a></p>

[**Documentation**](https://sanity-plugin-seofields.thehardik.in/docs) &nbsp;•&nbsp; [Quick Start](#quick-start) &nbsp;•&nbsp; [Configuration](#configuration) &nbsp;•&nbsp; [Schema.org](#schemaorg-structured-data) &nbsp;•&nbsp; [CLI](#cli)

---

## Why This Plugin

Most Sanity SEO plugins stop at title and description fields. `sanity-plugin-seofields` gives editors and developers a full SEO workflow — from per-document fields all the way to studio-wide audits.

| Feature                | What you get                               |
| :--------------------- | :----------------------------------------- |
| Structured SEO fields  | Complete field group for every document    |
| Live SERP preview      | See the Google result while editing        |
| Open Graph + X/Twitter | Full social card controls                  |
| Robots + canonical     | Indexing directives and canonical URLs     |
| Custom meta tags       | Reusable `metaTag` / `metaAttribute` types |
| Schema.org JSON-LD     | 39 types for structured data               |
| Next.js helpers        | Metadata and script rendering              |
| SEO Health Dashboard   | Audit documents across the whole studio    |
| CLI                    | Setup, reports, and exports                |

Use it as a simple field plugin, a structured data system, or a complete SEO operations layer for your Sanity projects.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Registered Schema Types](#registered-schema-types)
- [Configuration](#configuration)
- [SEO Health Dashboard](#seo-health-dashboard)
- [Schema.org Structured Data](#schemaorg-structured-data)
- [Next.js & React Exports](#nextjs--react-exports)
- [CLI](#cli)
- [Package Exports](#package-exports)
- [Compatibility](#compatibility)
- [Contributing](#contributing)
- [License](#license)

---

## Features

<details open>
<summary><b>Studio SEO Fields</b></summary>

<br />

- `seoFields` object type for a complete SEO field group
- Meta title, meta description, keywords, canonical URL, and meta image fields
- Open Graph title, description, image, URL, type, and site name
- X/Twitter Card title, description, image, site, creator, and card type
- Robots controls for `noindex`, `nofollow`, `noarchive`, `nosnippet`, and related directives
- Custom meta tags through reusable `metaTag` and `metaAttribute` types
- Configurable field labels, descriptions, groups, visibility, and per-document behavior
- Optional live SEO preview inside the Studio field UI

</details>

<details>
<summary><b>SEO Health Dashboard</b></summary>

<br />

- Studio tool for scanning SEO coverage across documents
- 0–100 scoring per document
- Missing title, description, image, canonical, robots, and social metadata checks
- Document-type filters
- Query customization
- Optional custom scoring logic
- CSV and JSON export
- Direct links back to documents that need work
- Demo mode for docs, previews, and onboarding

</details>

<details>
<summary><b>Schema.org / JSON-LD</b></summary>

<br />

- 39 Schema.org types as Sanity object schemas
- Combined Schema.org array field for flexible content modeling
- Individual schema plugins when you only need specific types
- Type picker UI for editors
- React components that render `<script type="application/ld+json">`
- `buildXJsonLd()` helpers for server-side rendering and custom frameworks
- Shared primitives for people, organizations, images, ratings, offers, and language fields

</details>

<details>
<summary><b>Frontend Helpers</b></summary>

<br />

- `buildSeoMeta()` for Next.js App Router `generateMetadata()`
- `<SeoMetaTags />` for framework-agnostic React rendering
- Schema.org React components for Next.js and other React frameworks
- Image URL resolver hooks for Sanity asset pipelines
- Sanitizers for Open Graph type and Twitter Card values

</details>

<details>
<summary><b>CLI</b></summary>

<br />

- Guided setup command
- Project checks and doctor-style diagnostics
- SEO data reports
- JSON and CSV export for audits, backups, and client review
- Config support via `defineSeoCli()`

</details>

---

## Installation

```bash
npm install sanity-plugin-seofields
```

Peer dependencies:

```txt
sanity   ^3 || ^4 || ^5
react    ^18 || ^19
```

---

## Quick Start

### 1. Register the Plugin

```ts
// sanity.config.ts
import {defineConfig} from 'sanity'
import seofields from 'sanity-plugin-seofields'

export default defineConfig({
  // ...
  plugins: [seofields()],
})
```

### 2. Add SEO Fields to a Document

```ts
// schemas/page.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
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

> The `seoFields` type is registered automatically by the plugin.

### 3. Render SEO Metadata in Next.js

```ts
// app/[slug]/page.tsx
import type {Metadata} from 'next'
import {buildSeoMeta} from 'sanity-plugin-seofields/next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()

  return buildSeoMeta({
    seo: page.seo,
    baseUrl: 'https://example.com',
    path: `/pages/${page.slug}`,
    defaults: {
      title: page.title,
      description: 'Default site description',
    },
  })
}
```

Full guide: [Frontend integration](https://sanity-plugin-seofields.thehardik.in/docs/frontend-integration)

---

## Registered Schema Types

| Type            | Purpose                                                                      |
| :-------------- | :--------------------------------------------------------------------------- |
| `seoFields`     | Complete SEO field bundle for document schemas                               |
| `openGraph`     | Open Graph metadata for Facebook, LinkedIn, Slack, and other social surfaces |
| `twitter`       | X/Twitter Card metadata                                                      |
| `robots`        | Indexing and crawling directives                                             |
| `metaTag`       | Custom meta tag container                                                    |
| `metaAttribute` | Single custom meta attribute                                                 |

---

## Configuration

```ts
import seofields from 'sanity-plugin-seofields'

seofields({
  seoPreview: true,
  fieldOverrides: {
    title: {
      title: 'Meta Title',
      description: 'Recommended length: 50-60 characters.',
    },
  },
  defaultHiddenFields: ['twitterSite'],
  fieldVisibility: {
    post: {
      hiddenFields: ['openGraphSiteName'],
    },
  },
  dashboard: {
    enabled: true,
    licenseKey: process.env.SANITY_STUDIO_SEO_LICENSE_KEY,
  },
})
```

| Option                | Description                                                          |
| :-------------------- | :------------------------------------------------------------------- |
| `seoPreview`          | Enable or disable the live preview shown inside SEO fields           |
| `fieldOverrides`      | Customize field titles, descriptions, validation, and field metadata |
| `defaultHiddenFields` | Hide specific SEO fields globally                                    |
| `fieldVisibility`     | Hide specific SEO fields for specific document types                 |
| `fieldGroups`         | Customize how fields are grouped in the `seoFields` object           |
| `apiVersion`          | Sanity API version used by plugin clients                            |
| `dashboard`           | Enable and configure the SEO Health Dashboard tool                   |

Full reference: [Configuration docs](https://sanity-plugin-seofields.thehardik.in/docs/configuration)

---

## SEO Health Dashboard

The dashboard is a Studio tool that helps teams find SEO gaps before they ship content.

```ts
// sanity.config.ts
import {defineConfig} from 'sanity'
import seofields from 'sanity-plugin-seofields'

export default defineConfig({
  plugins: [
    seofields({
      dashboard: {
        enabled: true,
        licenseKey: process.env.SANITY_STUDIO_SEO_LICENSE_KEY,
        query: {
          types: ['page', 'post', 'product'],
        },
        export: {
          enabled: true,
          formats: ['csv', 'json'],
        },
      },
    }),
  ],
})
```

Dashboard capabilities:

- Audit all configured document types
- View SEO score, status, and missing fields
- Filter documents by score and document type
- Export reports as CSV or JSON
- Open the exact document that needs updates
- Customize document title, subtitle, and preview display

Get a dashboard license: [Get license](https://sanity-plugin-seofields.thehardik.in/get-license)

Dashboard docs: [SEO Health Dashboard](https://sanity-plugin-seofields.thehardik.in/docs/dashboard)

---

## Schema.org Structured Data

<details open>
<summary><b>Register all Schema.org types</b></summary>

<br />

```ts
// sanity.config.ts
import {defineConfig} from 'sanity'
import seofields from 'sanity-plugin-seofields'
import {schemaOrg} from 'sanity-plugin-seofields/schema'

export default defineConfig({
  plugins: [seofields(), schemaOrg()],
})
```

</details>

<details>
<summary><b>Register only the types you need</b></summary>

<br />

```ts
import {
  schemaOrgArticlePlugin,
  schemaOrgFAQPagePlugin,
  schemaOrgProductPlugin,
} from 'sanity-plugin-seofields/schema'

export default defineConfig({
  plugins: [schemaOrgArticlePlugin(), schemaOrgFAQPagePlugin(), schemaOrgProductPlugin()],
})
```

</details>

<details>
<summary><b>Add Schema.org fields to a document</b></summary>

<br />

```ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  type: 'document',
  fields: [
    defineField({
      name: 'schemaOrg',
      title: 'Structured Data',
      type: 'schemaOrg',
    }),
  ],
})
```

</details>

<details>
<summary><b>Render JSON-LD on the frontend</b></summary>

<br />

```tsx
import {SchemaOrgScripts} from 'sanity-plugin-seofields/schema/next'

export function Page({page}: {page: PageData}) {
  return <SchemaOrgScripts items={page.schemaOrg} />
}
```

Render individual types:

```tsx
import {ArticleSchema, FAQPageSchema, ProductSchema} from 'sanity-plugin-seofields/schema/next'

export function Page({page}: {page: PageData}) {
  return (
    <>
      <ArticleSchema data={page.articleSchema} />
      <FAQPageSchema data={page.faqSchema} />
      <ProductSchema data={page.productSchema} />
    </>
  )
}
```

</details>

<br />

**Available Schema.org types** (39)

`AggregateRating` · `Article` · `BlogPosting` · `Book` · `Brand` · `BreadcrumbList` · `ContactPoint` · `Country` · `Course` · `Event` · `FAQPage` · `HowTo` · `ImageObject` · `ItemList` · `JobPosting` · `LegalService` · `LocalBusiness` · `Movie` · `MusicAlbum` · `MusicRecording` · `NewsArticle` · `Offer` · `OpinionNewsArticle` · `Organization` · `Person` · `Place` · `PostalAddress` · `Product` · `ProfilePage` · `Recipe` · `Restaurant` · `Review` · `Service` · `SocialMediaPosting` · `SoftwareApplication` · `VideoObject` · `WebApplication` · `WebPage` · `Website`

Schema.org docs: [Structured data guide](https://sanity-plugin-seofields.thehardik.in/docs/schema-org)

---

## Next.js & React Exports

```ts
import {
  buildSeoMeta,
  SeoMetaTags,
  sanitizeOGType,
  sanitizeTwitterCard,
} from 'sanity-plugin-seofields/next'
```

Common usage:

- Use `buildSeoMeta()` in Next.js App Router `generateMetadata()`
- Use `<SeoMetaTags />` in React layouts or frameworks where you control the `<head>`
- Use `SchemaOrgScripts` or individual schema components for JSON-LD
- Pass an `imageUrlResolver` when your Sanity image data needs URL building

Docs: [Frontend integration](https://sanity-plugin-seofields.thehardik.in/docs/frontend-integration)

---

## CLI

Run the CLI:

```bash
npx seofields
```

Useful commands:

```bash
npx seofields init                                          # Guided setup
npx seofields doctor                                        # Diagnostics
npx seofields report                                        # SEO data report
npx seofields export --format json --output seo-report.json # JSON export
npx seofields export --format csv  --output seo-report.csv  # CSV export
```

CLI docs: [CLI guide](https://sanity-plugin-seofields.thehardik.in/docs/cli)

---

## Package Exports

| Import path                           | Use                                                                    |
| :------------------------------------ | :--------------------------------------------------------------------- |
| `sanity-plugin-seofields`             | Studio plugin, base schema types, dashboard pane factory, shared types |
| `sanity-plugin-seofields/next`        | SEO metadata helpers and Schema.org React components                   |
| `sanity-plugin-seofields/schema`      | Schema.org Sanity schema plugins and type exports                      |
| `sanity-plugin-seofields/schema/next` | Schema.org React JSON-LD components                                    |
| `sanity-plugin-seofields/define-cli`  | CLI configuration helper                                               |

---

## Compatibility

| Runtime       | Supported                 |
| :------------ | :------------------------ |
| Node.js       | `>=18`                    |
| Sanity Studio | `^3`, `^4`, `^5`          |
| React         | `^18`, `^19`              |
| Module format | ESM and CommonJS builds   |
| TypeScript    | Type definitions included |

---

## Contributing

Issues and pull requests are welcome.

- [GitHub repository](https://github.com/hardik-143/sanity-plugin-seofields)
- [Open an issue](https://github.com/hardik-143/sanity-plugin-seofields/issues)
- [Contributing guide](./CONTRIBUTING.md)

If the plugin helps your project, consider leaving a star on the [GitHub repo](https://github.com/hardik-143/sanity-plugin-seofields), a review on the [docs site](https://sanity-plugin-seofields.thehardik.in/reviews), or a rating in the [Sanity Plugin Directory](https://www.sanity.io/plugins/sanity-plugin-seofields).

---

## License

[MIT](./LICENSE) © [Hardik Desai](https://github.com/hardik-143)
