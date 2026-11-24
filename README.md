![sanity-plugin-seofields — SEO fields for Sanity Studio](./sanity_plugin_seofields_logo.png)

# sanity-plugin-seofields

**SEO fields, social metadata, Schema.org JSON-LD, AI generation, and SEO health checks for Sanity Studio.**

<p><a href="https://www.npmjs.com/package/sanity-plugin-seofields"><img src="https://img.shields.io/npm/v/sanity-plugin-seofields.svg?color=10b981&label=npm" alt="npm version" /></a> <a href="https://www.npmjs.com/package/sanity-plugin-seofields"><img src="https://img.shields.io/npm/dm/sanity-plugin-seofields.svg?color=2563eb&label=downloads" alt="npm downloads" /></a> <a href="./LICENSE"><img src="https://img.shields.io/npm/l/sanity-plugin-seofields.svg?color=f59e0b" alt="license" /></a> <a href="https://github.com/hardik-143/sanity-plugin-seofields"><img src="https://img.shields.io/github/stars/hardik-143/sanity-plugin-seofields?style=social" alt="GitHub stars" /></a> <a href="https://www.sanity.io"><img src="https://img.shields.io/badge/Sanity-v3%20%7C%20v4%20%7C%20v5%20%7C%20v6-f03e2f?logo=sanity" alt="Sanity" /></a></p>

[Documentation](https://sanity-plugin-seofields.thehardik.in/docs) ·
[Quick start](https://sanity-plugin-seofields.thehardik.in/docs/quick-start) ·
[Configuration](https://sanity-plugin-seofields.thehardik.in/docs/configuration) ·
[AI](https://sanity-plugin-seofields.thehardik.in/docs/ai) ·
[Schema.org](https://sanity-plugin-seofields.thehardik.in/docs/schema-org) ·
[CLI](https://sanity-plugin-seofields.thehardik.in/docs/cli)

---

## Features

- Complete `seoFields` object type for title, description, canonical URL, keywords, meta image, robots, Open Graph, X/Twitter, hreflang, and custom meta tags
- Live SEO preview inside Sanity Studio
- Optional SEO Health Dashboard for document audits and CSV/JSON exports
- Readability analysis of the document body: Flesch score, grade level, sentence and paragraph
  length, passive voice, repeated sentence openings and subheading distribution
- Broken-link checker for Portable Text links, document references and SEO URLs, in Studio and
  from the CLI (`seofields links`)
- AI-assisted SEO copy generation with server-side proxy helpers
- Schema.org JSON-LD schema types and React/Next.js render helpers
- Framework-neutral head helpers for Next.js, Astro, Nuxt, Vue, SvelteKit, Remix, and custom renderers
- CLI for setup, diagnostics, reports, and exports

## Installation

```bash
npm install sanity-plugin-seofields
```

Peer dependencies:

```txt
sanity          ^3 || ^4 || ^5 || ^6
@sanity/icons   >=3
react           ^18 || ^19
```

Sanity Studio 3, 4, 5 and 6 are all supported. Icons are rendered through the root
`<Icon symbol="…" />` API from `@sanity/icons`, the one entry point shared by icons v3, v4
and v5 — so the plugin works on Studio 6 (which ships `@sanity/icons@5`, where the named
icon exports such as `ApiIcon` were removed) without dropping older Studios.

## Quick Start

Register the plugin in `sanity.config.ts`:

```ts
import {defineConfig} from 'sanity'
import seofields from 'sanity-plugin-seofields'

export default defineConfig({
  // ...
  plugins: [seofields()],
})
```

Add SEO fields to a document schema:

```ts
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

Render SEO metadata in Next.js:

```ts
import type {Metadata} from 'next'
import {buildSeoMeta} from 'sanity-plugin-seofields/next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()

  return buildSeoMeta({
    seo: page.seo,
    baseUrl: 'https://example.com',
    path: `/${page.slug}`,
    defaults: {
      title: page.title,
      description: 'Default site description',
    },
  })
}
```

For Astro, Nuxt, Vue, SvelteKit, Remix, or custom renderers, use `buildSeoHead()` from
`sanity-plugin-seofields/head`.

Full guide: [Frontend integration](https://sanity-plugin-seofields.thehardik.in/docs/frontend-integration)

## Readability analysis

The `seoFields` object includes a **Readability** panel that analyses the document's main content —
not just the meta description. It shows the Flesch reading-ease score and label, the
Flesch-Kincaid grade level, average sentence length, word/sentence counts, and these checks:

| Check                   | Passes when                                         |
| :---------------------- | :-------------------------------------------------- |
| Flesch reading ease     | Score is 50 or higher                               |
| Sentence length         | At most 25% of sentences have more than 20 words    |
| Paragraph length        | No paragraph is longer than 150 words               |
| Passive voice           | At most 10% of sentences look passive (estimate)    |
| Consecutive sentences   | No 3+ sentences in a row start with the same word   |
| Subheading distribution | No more than 300 words of text without a subheading |

It reads Portable Text (headings come from `h1`–`h6` styles), plain strings and nested objects. By
default it analyses the `body` field (or `ai.content` if you set it); point it at your own fields
with the same shape as `ai.content`:

```ts
seofields({
  readability: {
    content: {post: 'body', page: ['intro', 'sections'], default: 'body'},
    thresholds: {longSentenceWords: 25}, // optional
  },
  // readability: false — hide the panel
})
```

The heuristics (syllable counting, sentence splitting, passive-voice detection) are written for
**English** and are much less reliable for other languages.

Readability does **not** change the SEO health score unless you opt in, so existing scores stay the
same. Opt in with `calculateHealthScore(doc, {readability: true})` or
`npx seofields report --readability`; readability then contributes 10 of the 100 points.
`analyzeContentReadability()` and `extractDocBlocks()` are exported if you want to run the analysis
yourself.

## Broken-link checker

The **Link Checker** panel in `seoFields` finds every link in the document — Portable Text link
annotations, internal-link annotations, references to other documents, URL fields such as the
canonical URL, Open Graph URL and hreflang URLs, and fields named `url` / `href` / `*Url`. Click
**Check links** to:

- flag references to documents that **don't exist** or are **not published** (checked with the
  Studio's own client);
- check external URLs for `4xx`/`5xx` responses and network errors — **only if you configure an
  endpoint**. Browsers block cross-origin link checks (CORS), so external checks must run on a
  server. Without an endpoint, external links are listed as not checked.

Add the endpoint with the handler from `sanity-plugin-seofields/server`. It checks URLs with HEAD
(falling back to GET), a timeout, a concurrency limit and redirect following, and blocks requests to
private, loopback and link-local addresses and to anything other than http/https (SSRF protection):

```ts
// app/api/seo-links/route.ts (Next.js App Router)
import {createLinkCheckNextRouteHandler} from 'sanity-plugin-seofields/server'

export const {POST, OPTIONS} = createLinkCheckNextRouteHandler(
  {maxUrls: 50, timeoutMs: 8000},
  {cors: 'https://my-studio.sanity.studio'},
)
```

```ts
seofields({
  baseUrl: 'https://example.com', // used to resolve relative links like /pricing
  linkChecker: {endpoint: 'https://example.com/api/seo-links'},
  // linkChecker: false — hide the panel
})
```

`createLinkCheckFetchHandler` works on any Fetch API runtime. On runtimes without `node:dns`
(Cloudflare Workers, for example) pass `resolveHost` so the SSRF guard can resolve hostnames. Use
the `authorize` option to restrict who can call the endpoint.

To audit a whole dataset — or run the check in CI — use the CLI, which checks external URLs from
your machine:

```bash
npx seofields links --base-url https://example.com --fail-on-broken
```

## Search Console and GA4 document view

> **Paid feature.** The implementation ships in `seofields-pro`, which is installed
> automatically as a dependency of this plugin, and needs an active analytics subscription.
> Studios that cannot resolve `seofields-pro` show an upgrade card in place of the view.
> The imports below are unchanged either way.

The hosted analytics add-on can resolve the production URL for a document and show Search Console
and GA4 metrics in a dedicated Studio view. Reuse one configuration object for the field summary and
the Structure Builder view:

```ts
import {defineConfig} from 'sanity'
import {structureTool, type DefaultDocumentNodeResolver} from 'sanity/structure'
import seofields, {
  createSeoPerformanceView,
  type SeoPerformanceConfig,
} from 'sanity-plugin-seofields'

const seoPerformance: SeoPerformanceConfig = {
  documentTypes: ['page', 'post'],
  resolveUrl: (document) => {
    const slug = (document.slug as {current?: string} | undefined)?.current
    return slug ? `https://example.com/${slug}` : null
  },
}

const PerformanceView = createSeoPerformanceView(seoPerformance)

const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) =>
  S.document().views([
    S.view.form(),
    ...(['page', 'post'].includes(schemaType)
      ? [S.view.component(PerformanceView).id('performance').title('Performance')]
      : []),
  ])

export default defineConfig({
  // ...project and dataset
  plugins: [structureTool({defaultDocumentNode}), seofields({seoPerformance})],
})
```

The Google OAuth credentials remain in the hosted service. Editors do not add Google client secrets,
refresh tokens, or service-account keys to the Studio configuration.

## Common Links

| Topic                      | Link                                                                           |
| :------------------------- | :----------------------------------------------------------------------------- |
| Quick start                | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/quick-start)          |
| Plugin configuration       | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/configuration)        |
| Frontend integration       | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/frontend-integration) |
| AI content generation      | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/ai)                   |
| SEO Health Dashboard       | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/dashboard)            |
| Schema.org structured data | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/schema-org)           |
| CLI                        | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/cli)                  |
| License key                | [Get license](https://sanity-plugin-seofields.thehardik.in/get-license)        |

## Package Exports

| Import path                           | Use                                                          |
| :------------------------------------ | :----------------------------------------------------------- |
| `sanity-plugin-seofields`             | Studio plugin, schema types, dashboard helpers, shared types |
| `sanity-plugin-seofields/head`        | Framework-neutral SEO helpers                                |
| `sanity-plugin-seofields/server`      | Server-side AI proxy and link-check handlers                 |
| `sanity-plugin-seofields/next`        | Next.js metadata helpers and React meta tags                 |
| `sanity-plugin-seofields/schema`      | Schema.org Sanity schema plugins                             |
| `sanity-plugin-seofields/schema/next` | Schema.org React JSON-LD components                          |
| `sanity-plugin-seofields/define-cli`  | CLI configuration helper                                     |

## CLI

```bash
npx seofields
```

Docs: [CLI guide](https://sanity-plugin-seofields.thehardik.in/docs/cli)

## Compatibility

| Runtime         | Supported              |
| :-------------- | :--------------------- |
| Node.js         | `>=18`                 |
| Sanity Studio   | `^3`, `^4`, `^5`, `^6` |
| `@sanity/icons` | `>=3` (v3, v4, v5)     |
| React           | `^18`, `^19`           |
| Module format   | ESM and CommonJS       |
| TypeScript      | Included               |

## Contributing

- [GitHub repository](https://github.com/hardik-143/sanity-plugin-seofields)
- [Open an issue](https://github.com/hardik-143/sanity-plugin-seofields/issues)
- [Contributing guide](./CONTRIBUTING.md)

## License

[MIT](./LICENSE) © [Hardik Desai](https://github.com/hardik-143)
