![sanity-plugin-seofields — SEO fields for Sanity Studio](./sanity_plugin_seofields_logo.png)

# sanity-plugin-seofields

**SEO fields, social metadata, Schema.org JSON-LD, AI generation, and SEO health checks for Sanity Studio.**

<p><a href="https://www.npmjs.com/package/sanity-plugin-seofields"><img src="https://img.shields.io/npm/v/sanity-plugin-seofields.svg?color=10b981&label=npm" alt="npm version" /></a> <a href="https://www.npmjs.com/package/sanity-plugin-seofields"><img src="https://img.shields.io/npm/dm/sanity-plugin-seofields.svg?color=2563eb&label=downloads" alt="npm downloads" /></a> <a href="./LICENSE"><img src="https://img.shields.io/npm/l/sanity-plugin-seofields.svg?color=f59e0b" alt="license" /></a> <a href="https://github.com/hardik-143/sanity-plugin-seofields"><img src="https://img.shields.io/github/stars/hardik-143/sanity-plugin-seofields?style=social" alt="GitHub stars" /></a> <a href="https://www.sanity.io"><img src="https://img.shields.io/badge/Sanity-v3%20%7C%20v4%20%7C%20v5-f03e2f?logo=sanity" alt="Sanity" /></a></p>

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
sanity   ^3 || ^4 || ^5
react    ^18 || ^19
```

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

## Common Links

| Topic | Link |
| :---- | :--- |
| Quick start | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/quick-start) |
| Plugin configuration | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/configuration) |
| Frontend integration | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/frontend-integration) |
| AI content generation | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/ai) |
| SEO Health Dashboard | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/dashboard) |
| Schema.org structured data | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/schema-org) |
| CLI | [Docs](https://sanity-plugin-seofields.thehardik.in/docs/cli) |
| License key | [Get license](https://sanity-plugin-seofields.thehardik.in/get-license) |

## Package Exports

| Import path | Use |
| :---------- | :-- |
| `sanity-plugin-seofields` | Studio plugin, schema types, dashboard helpers, shared types |
| `sanity-plugin-seofields/head` | Framework-neutral SEO helpers |
| `sanity-plugin-seofields/server` | Server-side AI proxy adapters |
| `sanity-plugin-seofields/next` | Next.js metadata helpers and React meta tags |
| `sanity-plugin-seofields/schema` | Schema.org Sanity schema plugins |
| `sanity-plugin-seofields/schema/next` | Schema.org React JSON-LD components |
| `sanity-plugin-seofields/define-cli` | CLI configuration helper |

## CLI

```bash
npx seofields
```

Docs: [CLI guide](https://sanity-plugin-seofields.thehardik.in/docs/cli)

## Compatibility

| Runtime | Supported |
| :------ | :-------- |
| Node.js | `>=18` |
| Sanity Studio | `^3`, `^4`, `^5` |
| React | `^18`, `^19` |
| Module format | ESM and CommonJS |
| TypeScript | Included |

## Contributing

- [GitHub repository](https://github.com/hardik-143/sanity-plugin-seofields)
- [Open an issue](https://github.com/hardik-143/sanity-plugin-seofields/issues)
- [Contributing guide](./CONTRIBUTING.md)

## License

[MIT](./LICENSE) © [Hardik Desai](https://github.com/hardik-143)
