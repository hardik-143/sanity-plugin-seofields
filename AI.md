# AI Content Generation

`sanity-plugin-seofields` can generate and refine SEO copy directly inside Sanity Studio — meta title, meta description, focus keyword, keyword suggestions, Open Graph title/description, and X/Twitter title/description. This guide covers configuration, providers, industries, security, and the refinement pipeline.

---

## Quick Start

```ts
// sanity.config.ts
import {defineConfig} from 'sanity'
import seofields from 'sanity-plugin-seofields'

export default defineConfig({
  plugins: [
    seofields({
      ai: {
        provider: 'openai',
        apiKey: process.env.SANITY_STUDIO_OPENAI_API_KEY,
        industry: 'blog',
      },
    }),
  ],
})
```

Once configured, a **Generate with AI** button appears on every supported field.

---

## API Key Security

Sanity Studio is a client-side single-page app — anything in `sanity.config.ts`, including `apiKey`, is bundled into JavaScript that ships to the browser and is readable by anyone with Studio access, regardless of environment-variable naming (`NEXT_PUBLIC_` prefixes only matter for Next.js app code, not Studio bundles).

**For production, don't set `apiKey` directly.** Use `endpoint` with a server-side proxy instead — see [Server-Side Proxy](#server-side-proxy-recommended-for-production) below. If `apiKey` is set without `endpoint`, the plugin logs a `console.warn` in the browser console to flag the exposure.

`apiKey` is fine for local development, prototyping, or Studios that are not publicly accessible.

---

## Generated Fields

| Field                | What it generates      |
| :------------------- | :--------------------- |
| `title`              | SEO meta title         |
| `description`        | SEO meta description   |
| `focusKeyword`       | Primary focus keyword  |
| `keywords`           | Keyword suggestions    |
| `ogTitle`            | Open Graph title       |
| `ogDescription`      | Open Graph description |
| `twitterTitle`       | X/Twitter title        |
| `twitterDescription` | X/Twitter description  |

---

## Providers

| Provider    | Notes                                                                                |
| :---------- | :----------------------------------------------------------------------------------- |
| `openai`    | Default. Requires `apiKey`.                                                          |
| `anthropic` | Requires `apiKey`.                                                                   |
| `groq`      | Requires `apiKey`.                                                                   |
| `gemini`    | Requires `apiKey`.                                                                   |
| `ollama`    | Local models, no key required.                                                       |
| `baseUrl`   | Any OpenAI-compatible endpoint (DeepSeek, xAI Grok, Azure OpenAI, self-hosted, etc.) |

```ts
seofields({
  ai: {
    provider: 'groq',
    apiKey: process.env.SANITY_STUDIO_GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  },
})
```

---

## Server-Side Proxy (recommended for production)

Use `endpoint` to keep provider keys server-side. The Studio POSTs the field name, extracted content, focus keyword, keywords, existing meta, and the configured `industry`/license key to your endpoint; your endpoint returns `{ result: string }`.

```ts
seofields({
  ai: {
    endpoint: '/api/seo/generate',
    industry: 'saas',
  },
})
```

### Ready-made server adapters

`sanity-plugin-seofields/server` ships framework adapters so you don't have to write the proxy handler yourself — the real `apiKey` stays in your server environment only.

```ts
// Next.js — app/api/seo/generate/route.ts
import {createNextRouteHandler} from 'sanity-plugin-seofields/server'

export const {POST, OPTIONS} = createNextRouteHandler({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
})
```

```ts
// Express
import {createExpressHandler} from 'sanity-plugin-seofields/server'

app.post(
  '/api/seo/generate',
  createExpressHandler({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
  }),
)
```

```ts
// Node (no framework)
import {createNodeHandler} from 'sanity-plugin-seofields/server'
import http from 'node:http'

const handler = createNodeHandler({provider: 'openai', apiKey: process.env.OPENAI_API_KEY})
http.createServer(handler).listen(3000)
```

```ts
// Any runtime with Fetch API Request/Response (Cloudflare Workers, Deno, Bun, etc.)
import {createFetchHandler} from 'sanity-plugin-seofields/server'

const handler = createFetchHandler({provider: 'openai', apiKey: process.env.OPENAI_API_KEY})
```

All adapters wrap the same core `createSeoAiHandler(config)`, which runs the full generation + refinement pipeline server-side — identical behavior to direct-provider mode, just with the key off the client.

### Manual proxy contract

If you'd rather write your own handler:

```jsonc
// Request body sent by Studio
{
  "field": "description",
  "content": "Page content extracted from the document",
  "focusKeyword": "sanity seo",
  "keywords": ["sanity", "seo", "plugin"],
  "meta": {"title": "Existing title", "description": "Existing description"},
  "industry": "saas",
  "licenseKey": "..."
}

// Expected response
{
  "result": "Generated SEO text"
}
```

---

## Content Source

`ai.content` tells the plugin which root-document field(s) to extract text from for the AI prompt. Defaults to `'body'`.

```ts
// Single field
content: 'body'

// Multiple fields, priority order
content: ['title', 'excerpt', 'body']

// Per-document-type mapping
content: {
  page: ['sections'],
  news: 'content',
  work: ['content', 'contentExtended'],
  author: 'bio',
  default: 'body', // fallback for any unlisted type
}
```

Nested Portable Text (e.g. `sections[].columns[].content`) is found automatically — no dot-path notation required.

---

## Industries & Prompt Tiers

Setting `industry` swaps generic prompts for domain-specific vocabulary. There are **17 industries** split into two tiers:

| Tier         | Industries                                                                                                    | Prompts per field                        |
| :----------- | :------------------------------------------------------------------------------------------------------------ | :--------------------------------------- |
| **Free** (8) | `blog`, `restaurant`, `travel`, `ecommerce`, `education`, `fitness`, `hospitality`, `nonprofit`               | 4 free, 6 more with a license (10 total) |
| **Pro** (9)  | `healthcare`, `pharmacy`, `finance`, `realestate`, `saas`, `legal`, `insurance`, `automotive`, `homeServices` | All 10 require a license                 |

```ts
seofields({
  ai: {
    provider: 'openai',
    apiKey: process.env.SANITY_STUDIO_OPENAI_API_KEY,
    industry: 'healthcare', // pro industry — needs licenseKey
  },
  licenseKey: process.env.SANITY_STUDIO_SEO_LICENSE_KEY,
})
```

Without `industry` set, generation uses generic (non-industry) prompts, which are always free.

Get a license: [sanity-plugin-seofields.thehardik.in/get-license](https://sanity-plugin-seofields.thehardik.in/get-license)

---

## Custom Prompts

Write your own prompt wording using the same document values the built-in prompts use. Your function
receives a `CustomPromptValues` object and returns the prompt string sent to the provider:

```ts
type CustomPromptValues = {
  field: 'title' | 'description' | 'focusKeyword' | 'keywords' | 'ogTitle' | 'ogDescription' | 'twitterTitle' | 'twitterDescription'
  content: string          // extracted document text (same source the plugin uses)
  focusKeyword: string
  keywords: string[]
  meta?: { title?: string; description?: string; slug?: string }
  industry?: AiIndustry
}
```

**Free tier — one custom prompt** via `customPrompt`. The function itself decides how to branch on
`field`/`industry`:

```ts
seofields({
  ai: {
    provider: 'openai',
    apiKey: process.env.SANITY_STUDIO_OPENAI_API_KEY,
    customPrompt: (v) =>
      `Write a punchy 55-character SEO ${v.field} for our brand about: ${v.content.slice(0, 200)}.
Return only the text.`,
  },
})
```

**Paid tier — up to 5 generic + 5 per industry** via `customPrompts` (unlocked behind a validated
license):

```ts
seofields({
  ai: {
    provider: 'openai',
    apiKey: process.env.SANITY_STUDIO_OPENAI_API_KEY,
    industry: 'saas',
    customPrompts: {
      generic: [fnA, fnB],                 // up to 5
      byIndustry: { saas: [fn1, fn2, fn3] }, // up to 5 per industry
      merge: true,                          // mix with built-in angles; omit/false = replace
    },
  },
  licenseKey: process.env.SANITY_STUDIO_SEO_LICENSE_KEY,
})
```

- **Replace by default** — custom prompts replace the built-in angle pool for the field. Set
  `merge: true` to add them to the built-in pool instead (the plugin randomly picks per generation).
- Without a valid license, `customPrompts` collapses to a **single** prompt (same as the free tier).
- **Proxy mode caveat:** functions can't cross the HTTP boundary. When using `endpoint`, set
  `customPrompt`/`customPrompts` on your **server** handler config (`createSeoAiHandler`), not the
  Studio's `ai` config.

---

## Generation & Refinement Pipeline

Each generation attempt runs through automatic refinement passes before being accepted:

1. **Length** — rewritten if outside the field's target character range.
2. **Keyword injection** — rewritten to naturally include a required keyword if missing (title/description).
3. **Readability** — simplified if the meta description scores too low on readability.
4. **Focus keyword verbatim match** — re-derives the keyword if it doesn't appear in the existing title/description.

If every attempt still fails validation, the plugin returns either the **first** raw response or the **last** attempt's output, controlled by `keepFirstOnValidationFail`.

---

## Full Config Reference

| Option                      | Description                                                                                                                      |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `provider`                  | `openai`, `anthropic`, `groq`, `gemini`, or `ollama`. Defaults to `openai`.                                                      |
| `apiKey`                    | Provider API key. Not required for `ollama` or `endpoint` mode. **Bundled client-side — see [security](#api-key-security)**.     |
| `model`                     | Override the provider's default model.                                                                                           |
| `baseUrl`                   | Override the provider base URL for any OpenAI-compatible API.                                                                    |
| `endpoint`                  | Proxy endpoint URL. Key stays server-side — see [server-side proxy](#server-side-proxy-recommended-for-production).              |
| `temperature`               | Sampling temperature. Defaults to `0.7`.                                                                                         |
| `content`                   | Root document field(s) used as source content. `string \| string[] \| Record<string, string \| string[]>`. Defaults to `'body'`. |
| `industry`                  | Prompt context — see [industries & tiers](#industries--prompt-tiers).                                                            |
| `customPrompt`              | Free: one custom prompt function `(values) => string`. See [custom prompts](#custom-prompts).                                    |
| `customPrompts`             | Paid: `{ generic?, byIndustry?, merge? }` — up to 5 each, behind a license. See [custom prompts](#custom-prompts).               |
| `testMode`                  | Use static demo outputs, no provider API call.                                                                                   |
| `maxRetries`                | Full generation attempts before returning a result. Defaults to `2`.                                                             |
| `keepFirstOnValidationFail` | `true` returns the first raw response when every attempt fails validation; `false`/undefined (default) returns the last attempt. |
| `buttonWidth`               | `'full'` (default) stretches the Generate button to fill the field; `'auto'` left-aligns it at normal width.                     |

Full reference (with live examples): [AI Integration docs](https://sanity-plugin-seofields.thehardik.in/docs/ai)
