![sanity-plugin-seofields — the complete SEO toolkit for Sanity Studio](./sanity_plugin_seofields_logo.png)

# sanity-plugin-seofields

**The complete SEO toolkit for Sanity Studio.**

Manage SEO fields, social previews, robots directives, canonical URLs, Schema.org JSON-LD, and studio-wide SEO health checks — directly inside Sanity Studio v3, v4, or v5.

<p><a href="https://www.npmjs.com/package/sanity-plugin-seofields"><img src="https://img.shields.io/npm/v/sanity-plugin-seofields.svg?color=10b981&label=npm" alt="npm version" /></a> <a href="https://www.npmjs.com/package/sanity-plugin-seofields"><img src="https://img.shields.io/npm/dm/sanity-plugin-seofields.svg?color=2563eb&label=downloads" alt="npm downloads" /></a> <a href="./LICENSE"><img src="https://img.shields.io/npm/l/sanity-plugin-seofields.svg?color=f59e0b" alt="license" /></a> <a href="https://github.com/hardik-143/sanity-plugin-seofields"><img src="https://img.shields.io/github/stars/hardik-143/sanity-plugin-seofields?style=social" alt="GitHub stars" /></a> <a href="https://www.sanity.io"><img src="https://img.shields.io/badge/Sanity-v3%20%7C%20v4%20%7C%20v5-f03e2f?logo=sanity" alt="Sanity" /></a> <a href="#compatibility"><img src="https://img.shields.io/badge/TypeScript-ready-3178c6?logo=typescript&logoColor=white" alt="TypeScript" /></a></p>

[**Documentation**](https://sanity-plugin-seofields.thehardik.in/docs) &nbsp;•&nbsp; [Quick Start](#quick-start) &nbsp;•&nbsp; [Configuration](#configuration) &nbsp;•&nbsp; [AI](#ai-content-generation) &nbsp;•&nbsp; [Schema.org](#schemaorg-structured-data) &nbsp;•&nbsp; [CLI](#cli)

---

## Why This Plugin

Most Sanity SEO plugins stop at title and description fields. `sanity-plugin-seofields` gives editors and developers a full SEO workflow — from per-document fields all the way to studio-wide audits.

| Feature                | What you get                                           |
| :--------------------- | :----------------------------------------------------- |
| Structured SEO fields  | Complete field group for every document                |
| Live SERP preview      | See the Google result while editing                    |
| Open Graph + X/Twitter | Full social card controls                              |
| Robots + canonical     | Indexing directives and canonical URLs                 |
| Custom meta tags       | Reusable `metaTag` / `metaAttribute` types             |
| Schema.org JSON-LD     | 39 types for structured data                           |
| Frontend helpers       | Next.js Metadata, React tags, and plain head data      |
| AI content generation  | Generate + refine SEO copy, 5 providers, 17 industries |
| SEO Health Dashboard   | Audit documents across the whole studio                |
| CLI                    | Setup, reports, and exports                            |

Use it as a simple field plugin, a structured data system, or a complete SEO operations layer for your Sanity projects.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Registered Schema Types](#registered-schema-types)
- [Configuration](#configuration)
- [AI Content Generation](#ai-content-generation)
- [SEO Health Dashboard](#seo-health-dashboard)
- [Schema.org Structured Data](#schemaorg-structured-data)
- [Frontend Integration](#frontend-integration)
- [Frontend Head Exports](#frontend-head-exports)
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
- Keyword and focus-keyword scoring rewards actual placement/prominence in title and description, not just presence
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

<img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/nextjs.svg" width="20" height="20" align="center" alt="Next.js"/> Next.js&nbsp;&nbsp;
<img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/astro.svg" width="20" height="20" align="center" alt="Astro"/> Astro&nbsp;&nbsp;
<img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/nuxtjs.svg" width="20" height="20" align="center" alt="Nuxt"/> Nuxt&nbsp;&nbsp;
<img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/vue.svg" width="20" height="20" align="center" alt="Vue"/> Vue&nbsp;&nbsp;
<img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/svelte.svg" width="20" height="20" align="center" alt="SvelteKit"/> SvelteKit&nbsp;&nbsp;
Remix

<br />
<br />

- `buildSeoMeta()` for Next.js App Router `generateMetadata()`
- `<SeoMetaTags />` for framework-agnostic React rendering
- `buildSeoHead()` for Astro, Nuxt, Vue, SvelteKit, Remix, and custom head renderers
- Schema.org React components for Next.js/React plus JSON-LD builders for custom frontends
- Image URL resolver hooks for Sanity asset pipelines
- Sanitizers for Open Graph type and Twitter Card values

</details>

<details>
<summary><b>AI Content Generation</b></summary>

<br />

- "Generate with AI" button for title, description, focus keyword, keywords, Open Graph, and X/Twitter fields
- 5 providers — OpenAI, Anthropic, Groq, Gemini, Ollama — plus any OpenAI-compatible `baseUrl`
- 17 industry-specific prompt contexts (8 free, 9 pro) at up to 10 prompt variations per field
- Secure server-side proxy adapters for Next.js, Express, Node, and Fetch-API runtimes — keeps API keys off the client
- Per-document-type content source mapping, including nested Portable Text
- Automatic length, keyword, and readability refinement passes with retry

See [AI.md](./AI.md) for full setup, security notes, and configuration reference.

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

This single install also brings in the licensed helper package used internally for pro features.
You do **not** need to install `seofields-pro` separately.

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

### 4. Render SEO Metadata Outside Next.js

Use `buildSeoHead()` when your framework expects plain head tag data instead of
Next.js `Metadata` or React elements.

```ts
import {buildSeoHead} from 'sanity-plugin-seofields/head'

const head = buildSeoHead({
  seo: page.seo,
  baseUrl: 'https://example.com',
  path: `/${page.slug}`,
  defaults: {
    title: page.title,
    description: 'Default site description',
    siteName: 'My Site',
  },
  imageUrlResolver: (image) => urlFor(image).width(1200).height(630).url(),
})
```

`head` is serializable and framework-neutral:

```ts
{
  title: 'Page title',
  meta: [
    {name: 'description', content: '...'},
    {property: 'og:title', content: '...'},
    {name: 'twitter:card', content: 'summary_large_image'},
  ],
  link: [
    {rel: 'canonical', href: 'https://example.com/page'},
    {rel: 'alternate', hreflang: 'fr-FR', href: 'https://example.com/fr/page'},
  ],
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
| `robots`        | Indexing, crawling, translation, and image indexing directives               |
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
  },
  licenseKey: process.env.SANITY_STUDIO_SEO_LICENSE_KEY,
})
```

| Option                | Description                                                                            |
| :-------------------- | :------------------------------------------------------------------------------------- |
| `seoPreview`          | Enable or disable the live preview shown inside SEO fields                             |
| `fieldOverrides`      | Customize field titles, descriptions, validation, and field metadata                   |
| `defaultHiddenFields` | Hide specific SEO fields globally                                                      |
| `fieldVisibility`     | Hide specific SEO fields for specific document types                                   |
| `fieldGroups`         | Customize how fields are grouped in the `seoFields` object                             |
| `apiVersion`          | Sanity API version used by plugin clients                                              |
| `hreflang`            | Auto-populate hreflangs from translations — see [Hreflang auto-populate](#hreflang-auto-populate) |
| `dashboard`           | Enable and configure the SEO Health Dashboard tool                                     |
| `licenseKey`          | License key for pro features (dashboard, publish gate, pro industries)                 |
| `ai`                  | Enable "Generate with AI" fields — see [AI Content Generation](#ai-content-generation) |

Full reference: [Configuration docs](https://sanity-plugin-seofields.thehardik.in/docs/configuration)

---

## AI Content Generation

Add an `ai` object to the plugin config to show a **Generate with AI** button on `title`, `description`, `focusKeyword`, `keywords`, `ogTitle`, `ogDescription`, `twitterTitle`, and `twitterDescription`.

```ts
seofields({
  ai: {
    provider: 'openai',
    apiKey: process.env.SANITY_STUDIO_OPENAI_API_KEY,
    industry: 'blog',
  },
})
```

**Providers** — `openai` (default), `anthropic`, `groq`, `gemini`, `ollama` (local models, no key required), or any OpenAI-compatible `baseUrl` (DeepSeek, xAI Grok, Azure OpenAI, self-hosted).

**API key security** — Sanity Studio is client-side; an `apiKey` set directly is bundled into browser JS and readable by anyone with Studio access, regardless of env-var naming. For production, use `endpoint` with a server-side proxy adapter instead:

```ts
// Next.js — app/api/seo/generate/route.ts
import {createNextRouteHandler} from 'sanity-plugin-seofields/server'

export const {POST, OPTIONS} = createNextRouteHandler({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY, // stays server-side
})
```

`sanity-plugin-seofields/server` also ships `createExpressHandler`, `createNodeHandler`, and `createFetchHandler` (Cloudflare Workers, Deno, Bun). Each wraps the same generation pipeline as direct-provider mode — only the key location changes.

**Industries & prompt tiers** — 17 industries, 10 prompt variations per field:

| Tier     | Industries                                                                                                    | Prompts per field                        |
| :------- | :------------------------------------------------------------------------------------------------------------ | :--------------------------------------- |
| Free (8) | `blog`, `restaurant`, `travel`, `ecommerce`, `education`, `fitness`, `hospitality`, `nonprofit`               | 4 free, 6 more with a license (10 total) |
| Pro (9)  | `healthcare`, `pharmacy`, `finance`, `realestate`, `saas`, `legal`, `insurance`, `automotive`, `homeServices` | All 10 require a license                 |

Without `industry` set, generation uses generic prompts, which are always free.

**Custom prompts** — write your own prompt wording with `customPrompt` (free: one function) or `customPrompts` (paid: up to 5 generic + 5 per industry, behind a license). Your function receives all extracted document values (`content`, `focusKeyword`, `keywords`, `meta`, `field`, `industry`) and returns the prompt string. Custom prompts replace the built-in pool by default; set `merge: true` to mix them in. In proxy mode set them on the server handler config. See [AI.md → Custom Prompts](./AI.md#custom-prompts).

```ts
seofields({
  ai: {
    provider: 'openai',
    apiKey: process.env.SANITY_STUDIO_OPENAI_API_KEY,
    customPrompt: (v) => `Write a 55-char SEO ${v.field} about: ${v.content.slice(0, 200)}`,
  },
})
```

**Content source** (`ai.content`) — defaults to the document's `body` field. Accepts a single field, an array of fields in priority order, or a per-document-type mapping with a `default` fallback. Nested Portable Text is found automatically.

**Refinement pipeline** — each generation attempt is checked for target character length, required keyword presence (injected if missing), readability (simplified if too complex), and focus-keyword verbatim match against existing title/description. Controlled by `maxRetries` and `keepFirstOnValidationFail`.

Full guide: [AI.md](./AI.md) &nbsp;•&nbsp; [AI Integration docs](https://sanity-plugin-seofields.thehardik.in/docs/ai)

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
      licenseKey: process.env.SANITY_STUDIO_SEO_LICENSE_KEY,
      dashboard: {
        enabled: true,
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

Get a license key: [Get license](https://sanity-plugin-seofields.thehardik.in/get-license)

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

## Frontend Integration

The plugin stores SEO fields under the `seoFields` object. If you are comparing
examples from other Sanity SEO plugins, map the names carefully:

| Common name in other plugins | `sanity-plugin-seofields` field |
| :--------------------------- | :------------------------------ |
| `seo.metaTitle`              | `seo.title`                     |
| `seo.metaDescription`        | `seo.description`               |
| `seo.metaImage`              | `seo.metaImage`                 |
| `seo.twitter.cardType`       | `seo.twitter.card`              |
| `seo.hreflang`               | `seo.hreflangs[]`               |

### Shared GROQ Fragment

```ts
export const SEO_FRAGMENT = `{
  title,
  seo {
    title,
    description,
    canonicalUrl,
    metaImage { asset-> { url }, alt },
    keywords,
    robots { noIndex, noFollow, noTranslate, noImageIndex },
    hreflangs[] { locale, url },
    openGraph {
      title, description, url, siteName, type,
      imageType, imageUrl,
      image { asset-> { url }, alt }
    },
    twitter {
      card, site, creator, title, description,
      imageType, imageUrl,
      image { asset-> { url }, alt }
    },
    metaAttributes[] { _key, key, type, value }
  }
}`

export const PAGE_QUERY = `
  *[_type == "page" && slug.current == $slug][0] ${SEO_FRAGMENT}
`
```

### <img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/nextjs.svg" width="20" height="20" align="center" alt=""/> Next.js App Router

```tsx
// app/[slug]/page.tsx
import type {Metadata} from 'next'
import {buildSeoMeta} from 'sanity-plugin-seofields/next'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import {PAGE_QUERY} from '@/sanity/lib/queries'

export async function generateMetadata(props: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await props.params
  const page = await client.fetch(PAGE_QUERY, {slug})

  return buildSeoMeta({
    seo: page?.seo,
    baseUrl: 'https://example.com',
    path: '/' + slug,
    defaults: {
      title: page?.title || 'My Site',
      description: 'Default site description',
      siteName: 'My Site',
      twitterSite: '@mysite',
    },
    imageUrlResolver: (image) => urlFor(image).width(1200).height(630).url(),
  })
}
```

### <img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/astro.svg" width="20" height="20" align="center" alt=""/> Astro

```astro
--- // src/pages/[slug].astro
import {buildSeoHead} from 'sanity-plugin-seofields/head'
import {client} from '@/lib/sanity'
import Layout from '@/layouts/Layout.astro'
import {PAGE_QUERY} from '@/lib/queries'

const {slug} = Astro.params
const page = await client.fetch(PAGE_QUERY, {slug})

if (!page) return Astro.redirect('/404')

const head = buildSeoHead({
  seo: page.seo,
  baseUrl: 'https://example.com',
  path: '/' + slug,
  defaults: {
    title: page.title,
    description: 'Default site description',
    siteName: 'My Site',
  },
})
---

<Layout head={head}>
  <h1>{page.title}</h1>
</Layout>
```

Render the tags in your layout:

```astro
--- // src/layouts/Layout.astro
const {head} = Astro.props
---

<html lang="en">
  <head>
    <title>{head.title}</title>
    {head.meta.map((tag) =>
      'property' in tag ? (
        <meta property={tag.property} content={tag.content} />
      ) : (
        <meta name={tag.name} content={tag.content} />
      )
    )}
    {head.link.map((tag) => (
      <link rel={tag.rel} href={tag.href} hreflang={tag.hreflang} />
    ))}
  </head>
  <body>
    <slot />
  </body>
</html>
```

### <img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/nuxtjs.svg" width="20" height="20" align="center" alt=""/> Nuxt 3

```vue
<!-- pages/[slug].vue -->
<script setup lang="ts">
import {buildSeoHead} from 'sanity-plugin-seofields/head'

const route = useRoute()
const page = await useSeoData(route.params.slug as string)

const head = buildSeoHead({
  seo: page?.seo,
  baseUrl: 'https://example.com',
  path: '/' + route.params.slug,
  defaults: {
    title: page?.title || 'My Site',
    description: 'Default site description',
    siteName: 'My Site',
  },
})

useHead({
  title: head.title,
  meta: head.meta,
  link: head.link,
})
</script>

<template>
  <main>
    <h1>{{ page?.title }}</h1>
  </main>
</template>
```

### <img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/vue.svg" width="20" height="20" align="center" alt=""/> Vue 3 Standalone

Use `@unhead/vue` or another Vue head manager:

```vue
<script setup lang="ts">
import {useHead} from '@unhead/vue'
import {buildSeoHead} from 'sanity-plugin-seofields/head'
import {client} from '@/lib/sanity'
import {PAGE_QUERY} from '@/lib/queries'

const props = defineProps<{slug: string}>()
const page = await client.fetch(PAGE_QUERY, {slug: props.slug})

const head = buildSeoHead({
  seo: page?.seo,
  baseUrl: 'https://example.com',
  path: '/' + props.slug,
  defaults: {title: page?.title || 'My Site', siteName: 'My Site'},
})

useHead({
  title: head.title,
  meta: head.meta,
  link: head.link,
})
</script>
```

### <img src="https://sanity-plugin-seofields.thehardik.in/icons/frameworks/svelte.svg" width="20" height="20" align="center" alt=""/> SvelteKit

```ts
// src/routes/[slug]/+page.ts
import {buildSeoHead} from 'sanity-plugin-seofields/head'
import type {PageLoad} from './$types'
import {client} from '$lib/sanity'
import {PAGE_QUERY} from '$lib/queries'

export const load: PageLoad = async ({params}) => {
  const page = await client.fetch(PAGE_QUERY, {slug: params.slug})

  return {
    page,
    head: buildSeoHead({
      seo: page?.seo,
      baseUrl: 'https://example.com',
      path: '/' + params.slug,
      defaults: {
        title: page?.title || 'My Site',
        description: 'Default site description',
        siteName: 'My Site',
      },
    }),
  }
}
```

```svelte
<!-- src/routes/[slug]/+page.svelte -->
<script lang="ts">
  import type {PageData} from './$types'
  export let data: PageData
</script>

<svelte:head>
  {#if data.head.title}
    <title>{data.head.title}</title>
  {/if}

  {#each data.head.meta as tag}
    {#if 'property' in tag}
      <meta property={tag.property} content={tag.content} />
    {:else}
      <meta name={tag.name} content={tag.content} />
    {/if}
  {/each}

  {#each data.head.link as tag}
    <link rel={tag.rel} href={tag.href} hreflang={tag.hreflang} />
  {/each}
</svelte:head>

<main>
  <h1>{data.page?.title}</h1>
</main>
```

Detailed guide: [Frontend integration](https://sanity-plugin-seofields.thehardik.in/docs/frontend-integration)

---

## Frontend Head Exports

Use this entry point for Astro, Nuxt, Vue, SvelteKit, Remix, and any frontend
that wants plain serializable head data without importing the Studio plugin or
React helpers.

```ts
import {
  buildSeoHead,
  buildSeoMeta,
  sanitizeOGType,
  sanitizeTwitterCard,
} from 'sanity-plugin-seofields/head'
```

Common usage:

- Use `buildSeoHead()` in Astro, Nuxt, Vue, SvelteKit, Remix, and custom renderers
- Use `buildSeoMeta()` if you want the normalized metadata object but not React components
- Pass an `imageUrlResolver` when your Sanity image data needs URL building

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

## Hreflang auto-populate

For projects using [`@sanity/document-internationalization`](https://github.com/sanity-io/document-internationalization), derive hreflang alternates from your translation references instead of typing them by hand.

**Frontend** — `buildHreflangs()` turns the resolved `_translations` array into entries and feeds `buildSeoMeta`:

```ts
import {buildSeoMeta, buildHreflangs} from 'sanity-plugin-seofields/next' // or /head

// GROQ: "_translations": *[_type=="translation.metadata" && references(^._id)].translations[].value->{ language, "slug": slug.current }
export async function generateMetadata() {
  return buildSeoMeta({
    seo: data.seo,
    baseUrl: 'https://example.com',
    path: `/${data.slug.current}`,
    hreflangs: buildHreflangs(data._translations, {
      baseUrl: 'https://example.com',
      xDefault: 'en',
      // resolvePath: (t) => `/${t.language}/${t.slug}`,
    }),
  })
}
```

**Studio** — enable `hreflang.autoFill` to add a **Sync from translations** button to the `hreflangs` field (entries stay editable):

```ts
seofields({
  baseUrl: 'https://example.com',
  hreflang: {autoFill: true /*, localeField: 'language', resolvePath */},
})
```

The Studio sync reads `translation.metadata` via the standard client — no extra dependency required.

---

## llms.txt generator

Generate an [llms.txt](https://llmstxt.org) file from your Sanity content with `buildLlmsTxt()` + `docsToLlmsSection()` (framework-neutral, exported from `/head` and `/next`):

```ts
import {buildLlmsTxt, docsToLlmsSection} from 'sanity-plugin-seofields/head'

const body = buildLlmsTxt({
  title: 'Acme',
  summary: 'Everything Acme, for humans and LLMs.',
  baseUrl: 'https://acme.com',
  sections: [
    docsToLlmsSection(posts, {title: 'Blog', baseUrl: 'https://acme.com'}),
    docsToLlmsSection(docsPages, {title: 'Docs', baseUrl: 'https://acme.com'}),
  ],
})
// serve `body` from /llms.txt (route handler or build step)
```

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
| `sanity-plugin-seofields/head`        | Framework-neutral SEO helpers (`buildSeoHead`, `buildSeoMeta`)         |
| `sanity-plugin-seofields/server`      | Server-side AI proxy adapters (Next.js, Express, Node, Fetch API)      |
| `sanity-plugin-seofields/next`        | Next.js metadata helpers, React meta tags, and Schema.org components   |
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
