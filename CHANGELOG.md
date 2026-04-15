# Changelog

All notable changes to **sanity-plugin-seofields** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.5.5] — 2026-04-15

### ✨ Added

- **`fieldGroups` config option** — New top-level plugin option that groups SEO fields into tabbed sections (Sanity groups) inside the `seoFields` object. Editors can switch between tabs like "Meta", "Open Graph", and "Twitter Card" for a cleaner editing experience. Applies universally to every document using `type: 'seoFields'`.
  ```ts
  seofields({
    fieldGroups: [
      { name: 'meta', title: 'Meta', default: true,
        fields: ['title', 'description', 'metaImage', 'keywords', 'canonicalUrl', 'metaAttributes', 'robots'] },
      { name: 'openGraph', title: 'Open Graph', fields: ['openGraph'] },
      { name: 'twitter', title: 'Twitter Card', fields: ['twitter'] },
    ],
  })
  ```
- **`SeoFieldGroup` type export** — New TypeScript interface for defining field groups, exported from the package entry point.
- **`SeoObjectFieldName` type export** — Union type of all top-level field names in the `seoFields` object (`'title' | 'description' | 'metaImage' | …`), exported for type-safe group configuration.

## [1.5.4] — 2026-04-15

### ✨ Added

- **`baseMeta` schema type** — New `baseMeta` object type that groups the core meta fields (`title`, `description`, `metaImage`, `keywords`, `canonicalUrl`, `metaAttributes`) into a single reusable Sanity object, following the same pattern as the existing `openGraph` and `twitter` types. This allows using basic meta fields independently outside of the top-level `seoFields` object.
- **`baseMetaSchema` export** — The new `baseMeta` type is exported from the package entry point as `baseMetaSchema` for standalone use:
  ```ts
  import { baseMetaSchema } from 'sanity-plugin-seofields'
  ```

---

## [1.5.3] — 2026-04-13

### 🔄 Changed

- **`buildSeoMeta` refactor** — Extracted three private helper functions from `buildSeoMeta` in `seoMeta.ts`: `resolveOgImage`, `resolveTwitterImage`, and `buildCustomMetaMap`. Logic is unchanged; separation improves readability and testability.
- **`SeoMetaTags` return type** — Added explicit `React.JSX.Element` return type annotation to `SeoMetaTags` in `SeoMetaTags.tsx`.

### 🧹 Internal

- Removed unused `SeoFields` type import from `seoMeta.ts`.

---

## [1.5.2] — 2026-04-03

### ✨ Added

- **Export to CSV / JSON** — New export buttons in the dashboard controls bar let you download all currently-filtered documents as a `.csv` or `.json` file. Controlled via the new `export` option in `healthDashboard` config:
  ```ts
  healthDashboard: {
    export: { enabled: true, formats: ['csv', 'json'] }
  }
  ```
  Set `export: false` to hide both buttons entirely, or omit `formats` to show both (default).
- **Pagination** — The documents table is now paginated. Default page size is 25 and can be switched to 50, 100, or 200 per page. The selected page size persists across sessions via `localStorage`. Navigation controls show the current page, total pages, and the document range being displayed.
- **Compact stats mode** — New `compactStats` option in `healthDashboard` config (defaults to `false`). When `true`, replaces the 6-card stats grid with a single row of inline stat pills, saving vertical space in tighter layouts.
- **Persistent filters** — The status and type filter dropdown selections are now saved to `localStorage` and restored automatically on next visit.

### 🔄 Changed

- Extracted `RenderLicenseLoading` and `RenderLicenseInvalid` as standalone components, making the main render path significantly cleaner.
- Moved `VALIDATION_ENDPOINT` and `CACHE_TTL_MS` constants to module scope (previously defined inside the component on every render).
- Filter change handlers now reset the table back to page 1 to avoid showing an empty page when the result count changes.

---

## [1.5.1] — 2026-03-31

### ✨ Added

- **Theme switcher in SEO Health Dashboard** — A three-way light / dark / system toggle is now rendered in the dashboard header (sun, moon, and monitor icons). The selected theme persists across sessions via `localStorage`. System mode automatically follows the OS `prefers-color-scheme` preference and updates live when the OS preference changes.

---

## [1.5.0] — 2026-03-29

### ✨ Added

- **`seofields` CLI** — A new `seofields` binary is included with the package. Run commands directly from your terminal with `npx seofields <command>`.
- **`seofields create-config`** — Interactive wizard that scaffolds a `seofields.cli.ts` or `seofields.cli.js` config file with your project credentials. No more manual config file creation or copy-pasting required.
- **`seofields init`** — Automatically detects your `sanity.config.ts/js` and injects the `seofields()` plugin if not already registered. Supports `--schema-org` flag to also inject `schemaOrg()`.
- **`seofields config`** — Update `seofields()` configuration options directly from the terminal using dotted key flags (e.g. `--baseUrl=https://example.com`, `--healthDashboard.licenseKey=SEOF-…`).
- **`seofields report`** — Queries your Sanity dataset and prints an SEO health report as a formatted table or summary. Scores each document across title, description, image, keywords, and Open Graph fields.
- **`seofields export`** — Exports all documents with SEO fields as JSON or CSV. Useful for audits and spreadsheet analysis.
- **`seofields doctor`** — Checks your local setup: verifies `seofields()` is registered in `sanity.config`, confirms peer dependencies are installed, and detects your CLI config file.
- **`seofields.cli.ts` config file** — Create a `seofields.cli.ts` (or `.js`) file using `defineSeoCli()` to store your project ID, dataset, and token so you never need to pass flags on every command.
- **`defineSeoCli()` helper** — Importable from `sanity-plugin-seofields/define-cli`. Provides full TypeScript types for the CLI config object including `showConnectionInfo` and `types` options.
- **Random color themes** — The CLI banner uses a random accent color on every run, drawn from the plugin's brand color palette.

---

## [1.4.2] — 2026-03-28

### 🔄 Changed

- **Sanity v5 compatibility** — Added `sanity ^5` to peer dependencies. The plugin now officially supports Sanity Studio v3, v4, and v5. No API changes were required — all existing Studio APIs used by the plugin remain unchanged in v5.
- Updated `devDependencies` to use `sanity@^5.0.0` for development and testing.
- Updated README description to reflect v3/v4/v5 support.

---

## [1.4.1] — 2026-03-25

### 🐛 Fixed

- **`IssuesPopover` positioning in desk panes** — The popover that displays hidden SEO issues now renders at the correct position when using `createSeoHealthPane` inside a Sanity desk structure. Changed `position: absolute` to `position: fixed` so popover coordinates (from `getBoundingClientRect()`, which are viewport-relative) align correctly regardless of parent container context or scroll state.

---

## [1.4.0] — 2026-03-25

### ✨ Added

#### Schema.org Structured Data — 24 types

A complete Schema.org JSON-LD system is now built into the plugin. All 24 types are available as Sanity Studio schema fields and as React components that render `<script type="application/ld+json">` tags.

**Supported types:**
`Website` · `Organization` · `WebPage` · `Person` · `Article` · `BlogPosting` · `FAQPage` · `HowTo` · `Product` · `Offer` · `AggregateRating` · `Review` · `BreadcrumbList` · `LocalBusiness` · `Event` · `Course` · `SoftwareApplication` · `WebApplication` · `VideoObject` · `ImageObject` · `Place` · `PostalAddress` · `Brand` · `ContactPoint`

---

#### New import path: `sanity-plugin-seofields/schema`

Register Schema.org types as Sanity plugins. The combined `schemaOrg()` plugin registers all 24 types at once; individual plugins let you register only what you need.

```ts
import {schemaOrg} from 'sanity-plugin-seofields/schema'

// Combined — all 24 types
export default defineConfig({
  plugins: [seofields(), schemaOrg()],
})
```

```ts
// Individual types only
import {
  schemaOrgArticlePlugin,
  schemaOrgFAQPagePlugin,
  schemaOrgProductPlugin,
} from 'sanity-plugin-seofields/schema'

export default defineConfig({
  plugins: [schemaOrgArticlePlugin(), schemaOrgFAQPagePlugin()],
})
```

Once registered, add to any document schema with `defineField`:

```ts
defineField({name: 'structuredData', type: 'schemaOrg'}) // combined array — all 24 types
defineField({name: 'article', type: 'schemaOrgArticle'}) // specific type
defineField({name: 'faq', type: 'schemaOrgFAQPage'})
```

**Exports from `sanity-plugin-seofields/schema`:**

- `schemaOrg()` — combined Sanity plugin (all 24 types + the `schemaOrg` array type)
- `schemaOrgArticlePlugin()`, `schemaOrgFAQPagePlugin()`, `schemaOrgProductPlugin()` … (one per type)
- Individual raw schema definitions: `schemaOrgArticle`, `schemaOrgWebsite`, `schemaOrgProduct` … (24 total, for manual `schema.types` registration)
- `generateSchemaType()` — generator utility for building custom Schema.org types
- `buildGenericJsonLd()` — generic JSON-LD builder
- TypeScript interfaces: `SchemaFieldDef`, `SchemaFieldOption`, `SchemaTypeDef`, `SchemaOrgConfig`, `SchemaOrgCombinedConfig`

---

#### New export path: `sanity-plugin-seofields/schema/next`

React/Next.js components that render `<script type="application/ld+json">` tags from Sanity document data.

```tsx
import {SchemaOrgScripts} from 'sanity-plugin-seofields/schema/next'

// Render all structured data from the combined array field
;<SchemaOrgScripts data={doc.structuredData} />
```

**Exports from `sanity-plugin-seofields/schema/next`:**

- `SchemaOrgScripts` — renders all JSON-LD scripts from a combined `schemaOrg` array field, automatically dispatching to the correct renderer per `_type`
- `SchemaOrgScript` — low-level single script tag renderer

---

#### Schema.org components also available from `sanity-plugin-seofields/next`

All 24 Schema.org React components and their JSON-LD builder functions are re-exported from the existing `/next` entry point for convenience:

```tsx
import {
  ArticleSchema,
  FAQPageSchema,
  ProductSchema,
  OrganizationSchema,
  WebsiteSchema,
  BreadcrumbListSchema,
  SchemaOrgScripts,
  // ... all 24
} from 'sanity-plugin-seofields/next'
```

Each component renders a single `<script type="application/ld+json">` tag. Each also exports a `build*JsonLd()` function for generating the JSON-LD object directly (useful for SSG, sitemaps, or custom rendering):

```ts
import {buildArticleJsonLd, buildProductJsonLd} from 'sanity-plugin-seofields/next'

const json = buildArticleJsonLd(doc.article) // returns plain JSON-LD object
```

---

#### Schema.org generator — build your own types

A declarative generator lets you define custom Schema.org types using a plain field definition array, then auto-generates the Sanity schema, JSON-LD builder, and React component:

```ts
import {generateSchemaType, buildGenericJsonLd} from 'sanity-plugin-seofields/schema'

const myType = generateSchemaType({
  name: 'schemaOrgRecipe',
  schemaType: 'Recipe',
  title: 'Schema.org — Recipe',
  fields: [
    {name: 'name', title: 'Name', type: 'string', required: {key: 'name', message: 'Required'}},
    {name: 'cookTime', title: 'Cook Time', type: 'string'},
  ],
})
```

---

### 🚀 Improved

- **`SeoHealthTool` and `SeoHealthDashboard` are now lazy-loaded** — wrapped in `React.lazy()` + `React.Suspense`. The Studio bundle no longer pays the upfront cost of loading the dashboard code until it is actually navigated to, improving initial Studio load time.

---

## [1.3.2] — 2026-03-23

### ✨ Added

- **Refresh button** — a "Refresh" button now appears in the dashboard header. Clicking it re-fetches documents without a full-page loading flash: the button icon spins while the update completes, and the table updates in place. The button is disabled while an initial load or refresh is already in progress.
- **Non-string title warning** — when a document's `title` field is not a plain string (e.g. a Portable Text array returned from a custom GROQ query), an amber inline badge is shown in the Title column instead of a broken/empty link. The badge reads `*"⚠ title is not a string — use pt::text(title) in query.groq"*` with a tooltip explaining the fix.

### 🔄 Renamed (with backwards-compatible deprecations)

Four configuration keys have been renamed for clarity and consistency. The old
keys still work but are **deprecated** — a visible amber warning banner will
appear in the dashboard whenever a deprecated key is detected. The old keys will
be removed in a future major release.

| Deprecated key                       | Replacement key                     | Notes                                        |
| ------------------------------------ | ----------------------------------- | -------------------------------------------- |
| `healthDashboard.display.typeColumn` | `healthDashboard.showTypeColumn`    | Promoted to a top-level flat key             |
| `healthDashboard.display.documentId` | `healthDashboard.showDocumentId`    | Promoted to a top-level flat key             |
| `healthDashboard.typeLabels`         | `healthDashboard.typeDisplayLabels` | Renamed for clarity                          |
| `healthDashboard.docBadge`           | `healthDashboard.getDocumentBadge`  | Renamed to follow `get*` callback convention |

**Migration — update your `sanity.config.ts`:**

```diff
 seofields({
   healthDashboard: {
     licenseKey: 'SEOF-XXXX-XXXX-XXXX',
-    display: {
-      typeColumn: true,
-      documentId: false,
-    },
+    showTypeColumn: true,
+    showDocumentId: false,
-    typeLabels: { productDrug: 'Products' },
+    typeDisplayLabels: { productDrug: 'Products' },
-    docBadge: (doc) => ({ label: doc.status }),
+    getDocumentBadge: (doc) => ({ label: doc.status }),
   },
 })
```

The same renames apply when using `SeoHealthDashboardProps` directly (e.g. via
`createSeoHealthPane`).

---

## [1.3.1] — 2026-03-21

### 🧹 Internal

- Replaced `as any` type casts in schema index with proper `FieldDefinition` typing.
- Fixed negated condition in image cross-check logic.

---

## [1.3.0] — 2026-03-21

### ✨ Added

- **Inline image validation components** — five new Sanity Studio input components that render live, colour-coded feedback hints directly below image upload/URL fields. Feedback cross-checks whether all three image types (meta, OG, Twitter) are set, prompting the editor when any are missing.
- **Image validation helpers** — new utility functions that power the inline components and can also be reused in custom tooling. Each function returns colour-coded feedback messages and performs cross-field image coverage checks.
- Added an `isSubImageSet` utility that correctly detects whether an OG or Twitter sub-object has an image configured, supporting both asset upload and URL modes.

### 🔧 Changed

- **SEO Health Dashboard scoring** — OpenGraph and Twitter card scores are now included in the overall score. Added an Image Completeness bonus when all three image types are present, and robots `noIndex` now contributes to the score when indexing is enabled.
- Image validation components are automatically registered on their respective schema fields — no consumer-side configuration needed; existing installs pick up the inline hints on upgrade.

## [1.2.7] — 2026-03-19

### 🐛 Fixed

- **`SeoFieldsInput` now exported from `sanity-plugin-seofields/next`** — the type was defined in `seoMeta.ts` but missing from the `/next` re-export, making `import type { SeoFieldsInput } from 'sanity-plugin-seofields/next'` fail at compile time.

---

## [1.2.6] — 2026-03-19

### 🔧 Internal

- Migrated build tool from `@sanity/pkg-utils` to `tsup` — replaced `package.config.ts` with `tsup.config.ts` for a leaner, faster build pipeline.
- Simplified TypeScript configuration — removed separate `tsconfig.dist.json` and `tsconfig.settings.json`, consolidating settings into a single `tsconfig.json`.
- Updated `package.json`: set `"type": "module"`, added `"main"` / `"module"` fields, and expanded the exports map with explicit `types`, `source`, `import`, and `require` conditions for both entry points.

---

## [1.2.5] — 2026-03-18

### 🔄 Changed

- Cleaned up internal JSDoc and website documentation wording for the `sanity-plugin-seofields/next` entry point.
- Reverted exports map to flat string values (`import`/`require` as plain strings) — `@sanity/pkg-utils` does not support nested condition objects and rejects the package during build validation.

---

## [1.2.4] — 2026-03-18

### ✨ Added

- **`sanity-plugin-seofields/next` entry point** — New sub-path export for use in Next.js Server Components and `generateMetadata()` functions.

  ```ts
  import {buildSeoMeta, SeoMetaTags} from 'sanity-plugin-seofields/next'
  ```

- **`buildSeoMeta(options)`** — Converts a Sanity SEO object into a structured metadata object compatible with Next.js App Router's `Metadata` type. Returns `title`, `description`, `keywords`, `robots`, `openGraph`, `twitter`, `alternates.canonical`, and `other` (custom meta attributes). Safe to call in RSC / `generateMetadata()`.

  ```ts
  export async function generateMetadata({params}): Promise<Metadata> {
    const {data} = await sanityFetch({query: SEO_QUERY, params})
    return buildSeoMeta({
      seo: data.seo,
      baseUrl: 'https://example.com',
      path: '/about',
      defaults: {title: 'My Site', siteName: 'My Site'},
      imageUrlResolver: (img) => urlFor(img).width(1200).url(),
    })
  }
  ```

- **`<SeoMetaTags>`** — Framework-agnostic React component that renders all SEO meta tags as plain React elements (`<title>`, `<meta>`, `<link rel="canonical">`). Designed for Next.js Pages Router `<Head>`, Nuxt, Remix, or any SSR `<head>` slot. Also works in Next.js App Router RSC when imported from `sanity-plugin-seofields/next`.

  ```tsx
  import {SeoMetaTags} from 'sanity-plugin-seofields/next'

  // Next.js App Router (RSC)
  export default async function Page({params}) {
    const {data} = await sanityFetch({query: BLOG_QUERY, params})
    return (
      <>
        <SeoMetaTags data={data.seo} baseUrl="https://example.com" path={`/blogs/${params.slug}`} />
        <main>...</main>
      </>
    )
  }
  ```

### 🔄 Changed

- **`MetaAttribute.key` and `MetaAttribute.type`** are now optional (`key?`, `type?`) — previously required, this change aligns the type with real Sanity document shapes where these fields may be absent.
- **`OpenGraphSettings`** gains an explicit `url?: string` field (maps to `og:url`).
- **`TwitterCardSettings`** gains an explicit `creator?: string` field (maps to `twitter:creator`).
- **`SeoFields`** now includes `metaAttributes?: MetaAttribute[]` in its type definition (was missing despite being part of the schema).

---

## [1.2.3] — 2026-03-12

### ✨ Added

- **`structureTool` option** — New `healthDashboard.structureTool` option that routes document-title clicks directly to a named Structure tool instead of relying on Sanity's generic intent resolver. Required when you have multiple structure tools and the monitored documents live in a non-default one. Clicking a title navigates to `/{basePath}/{structureTool}/intent/edit/id=…;type=…/` directly.

  ```ts
  healthDashboard: {
    licenseKey: 'SEOF-XXXX-XXXX-XXXX',
    structureTool: 'common',
  }
  ```

  Also available as a prop on `SeoHealthDashboardProps` and `SeoHealthPaneOptions` for direct component usage.

---

## [1.2.2] — 2026-03-11

### ✨ Added

- **Desk Structure Pane** (`createSeoHealthPane`) — Embed the SEO Health Dashboard directly inside Sanity Studio's Structure tool.
  - `createSeoHealthPane(S, options)` — returns a `ComponentBuilder` with a built-in `.child()` resolver so clicking any document row opens the document editor as a pane to the right. Automatically wires up `schemaType` via `childParameters`.
  - `options.licenseKey` is **required**.
  - Exported from the package root as `createSeoHealthPane` and `SeoHealthPaneOptions`.

  ```ts
  import {createSeoHealthPane} from 'sanity-plugin-seofields'

  structure: (S) =>
    S.list().items([
      S.listItem()
        .title('SEO Health')
        .child(
          createSeoHealthPane(S, {
            licenseKey: 'SEOF-XXXX-XXXX-XXXX',
            query: `*[_type == "post" && defined(seo)]{ _id, _type, title, slug, seo, _updatedAt }`,
          }),
        ),
    ])
  ```

- **Title truncation in split pane** — Document titles now truncate with an ellipsis at any pane width. Fixed by propagating `min-width: 0` through the full flex ancestor chain and adding a dedicated `TitleCell` wrapper.

- **Stats grid auto-wrapping** — The stats bar cards now use `repeat(auto-fit, minmax(130px, 1fr))` instead of a fixed 6-column grid. Cards wrap naturally at narrow pane widths and always fill the full available width when there is space.

---

## [1.2.1] — 2026-03-10

### ✨ Added

- **`previewMode`** — New `healthDashboard.previewMode` option that loads realistic dummy documents into the SEO Health Dashboard without querying your dataset. Useful for showcasing, documentation screenshots, and testing the dashboard UI before real content exists.
  - License validation is bypassed when `previewMode` is active.
  - An amber **"Preview Mode"** badge is shown in the dashboard header to make the state visually obvious.

  ```ts
  healthDashboard: {
    previewMode: true,
  }
  ```

  The dummy dataset includes 7 sample documents (`post`, `page`, `product`) covering the full score range — excellent, good, fair, and poor/missing — so every part of the dashboard UI is exercised.

### 🔄 Changed

- **Dynamic type-badge colours** — Type badges in the Type column are no longer mapped to a fixed. Colours are now derived at runtime from a 16-colour palette using a deterministic hash of the `_type` string. This means:
  - Any document type — including custom ones — automatically receives a distinct, consistent colour.
  - The same type always gets the same colour across renders.
  - No configuration is required.

---

## [1.2.0] — 2026-03-09

### ✨ Added

- **`typeLabels`** — Map raw `_type` values to human-readable display labels. Applied in both the Type column and the Type filter dropdown; any unmapped type falls back to the raw `_type` string.

  ```ts
  typeLabels: { productDrug: 'Products', singleCondition: 'Condition' }
  ```

- **`typeColumnMode`** — Control how the Type column is rendered.
  - `'badge'` (default) — coloured pill badge, consistent with score badges.
  - `'text'` — plain inline text, useful for dense layouts.

- **`titleField`** — Specify which document field to use as the display title in the dashboard. Supports a single field name for all types, or a per-type map. Unmapped types always fall back to `title`.

  ```ts
  titleField: 'name'
  // — or per-type —
  titleField: { post: 'title', product: 'name', category: 'label' }
  ```

- **`docBadge`** — Callback that renders a custom badge inline with the document title. Receives the full document and returns `{ label, bgColor?, textColor?, fontSize? }` or `undefined` to render nothing.

  ```ts
  docBadge: (doc) => {
    if (doc.services === 'NHS') return {label: 'NHS', bgColor: '#e0f2fe', textColor: '#0369a1'}
    if (doc.services === 'Private')
      return {label: 'Private', bgColor: '#fef3c7', textColor: '#92400e'}
  }
  ```

- **`content.loadingLicense`**, **`content.loadingDocuments`**, **`content.noDocuments`** — Custom text for the three loading/empty states of the dashboard. Grouped under the existing `content` block so all text-content customisation is in one place.
  ```ts
  content: {
    loadingLicense: 'Checking your plan…',
    loadingDocuments: 'Fetching content, hang tight…',
    noDocuments: 'No pages with SEO fields yet.',
  }
  ```

### 🔄 Changed

- **`emptyState` removed** — The `emptyState` config block has been removed. Its three keys (`loadingLicense`, `loadingDocuments`, `noDocuments`) are now part of the `content` block (see above). Migrate by moving the keys under `content`.
- **Meta description threshold unified** — The valid meta description length range is now consistently **120–160 characters** across both the inline field feedback and the Health Dashboard score. Previously the two checks used different lower bounds.

---

## [1.1.1] — 2026-03-08

### 🔄 Changed

- **License validation — differentiated invalid-key UI**: Users who supply a `licenseKey` that fails validation now see a distinct "Invalid License Key" screen (❌) with a message explaining the key is invalid or revoked, rather than the generic upgrade prompt shown when no key is provided at all.
- **License validation — no-key prompt improved**: When `licenseKey` is omitted entirely, the lock screen now shows a full `sanity.config.ts` code snippet demonstrating exactly where to add the key, making first-time setup clearer.
- **License validation — manual cache bypass**: Added a "Click here" button on the invalid-key screen that clears the `sessionStorage` cache entry for the current project and immediately re-runs the validation request against the server. This avoids the 1-hour cache window when a user has just updated their key without needing a full page reload.

---

## [1.1.0] — 2026-03-07

### ✨ Added

- **SEO Health Dashboard** — a new built-in Studio tool (`📊 SEO Health Dashboard`) that gives a bird's-eye view of SEO completeness across all documents that have an `seo` field.
  - Summary stat cards showing total documents, average score, and counts per health tier (Excellent / Good / Fair / Poor / Missing).
  - Per-document score (0–95) calculated from meta title, meta description, OG title, OG description, Twitter title, Twitter description, and robots settings.
  - Color-coded score badges: green ≥ 80, amber ≥ 60, orange ≥ 40, red < 40.
  - Inline issue list — up to 2 top issues surfaced per row with overflow count.
  - Clickable document titles that open the document directly in the Sanity desk in a new tab.
  - Live search, status filter (All / Excellent / Good / Fair / Poor / Missing), and sort controls (by score or title).

---

## [1.0.10] — 2025-12-14

### ✨ Added

- Documented the full set of `fieldOverrides` and `fieldVisibility` keys in README field configuration guidance.
- Expanded Field Specifications in README to cover canonical URLs, meta attributes, default share images, keywords, Open Graph metadata, Twitter branding updates, and robots toggles now available in Studio.
- Rebuilt schema reference docs listing the available schema factories and their usage examples.

### ❌ Removed

- Removed references to the `dist/types` entry point and legacy TypeScript import snippets from documentation, clarifying that only the plugin bundle is exported.

---

## [1.0.9] — 2025-12-06

### ✨ Added

- Exported the `FeedbackType` helpers for use across validation-driven UI components.

### 🔄 Changed

- Hardened plugin configuration typings, including the new `ValidHiddenFieldKeys` guard and stricter `fieldOverrides` typing.
- Returned explicit `SchemaTypeDefinition` instances from the schema factories, ensuring config is forwarded while keeping Sanity typings intact.
- Refreshed SEO form inputs to rely on shared feedback types, memoised keyword lookups, and clearer schema option typing.
- Reordered public exports so schema factories are grouped consistently with the plugin entry point.

### 🐛 Fixed

- Ensured config-driven hidden logic reaches nested Open Graph and X image selectors. [#2](https://github.com/hardik-143/sanity-plugin-seofields/issues/2)

---

## [1.0.8] — 2025-10-15

### 🐛 Fixed

- Fixed incorrect initial value assignment in the SEO preview field schema — the value is now correctly set to an empty string.

---

## [1.0.7] — 2025-10-12

**SEO Preview System:**

- `seoPreview` - boolean to enable/disable SEO preview feature (default: true)
- `seoPreview.prefix` - Custom prefix function for dynamic preview generation based on document data
- `baseUrl` - Configure preview base URL for SEO preview functionality

### Plugin Configuration Interface Updates

**New Field Keys Added:**

- `twitterImageType` - Missing field key for X image type selection
- `twitterImageUrl` - Missing field key for X external image URL

**Enhanced Configuration Options:**

- `SeoFieldsPluginConfig.seoPreview` - Now supports both boolean and object with prefix function
- `SeoFieldsPluginConfig.baseUrl` - New string option for setting preview base URL
- `SeoFieldsPluginConfig.fieldVisibility` - Per-document-type field visibility control
- `SeoFieldsPluginConfig.defaultHiddenFields` - Global field hiding capability

**Type System Improvements:**

- `AllFieldKeys` - Union type covering all 27+ field keys across SEO, Open Graph, and Twitter
- `FieldVisibilityConfig` - Interface for field visibility configuration per document type
- `SeoFieldConfig` - Interface for customizing field titles and descriptions

### Configuration Usage Examples

**Advanced SEO Preview Configuration:**

```typescript
// Advanced SEO Preview Configuration with prefix shown in the preview URL
seofields({
  seoPreview: {
    prefix: (doc) => `${doc._type === 'page' ? 'Page' : 'Article'}: `,
  },
  baseUrl: 'https://your-domain.com',
})
```

Preview URL pattern:

- https://your-domain.com/{slugified-prefix}/{document_slug}

Examples:

- For doc: { \_type: 'page', slug: { current: 'about-us' } }
  - https://your-domain.com/page/about-us
- For doc: { \_type: 'post', slug: { current: 'hello-world' } }
  - https://your-domain.com/article/hello-world

**Field Visibility Configuration:**

```typescript
seofields({
  fieldVisibility: {
    page: {
      hiddenFields: ['openGraphSiteName', 'twitterSite', 'twitterImageType', 'twitterImageUrl'],
    },
    post: {
      hiddenFields: ['canonicalUrl', 'openGraphType'],
    },
  },
  defaultHiddenFields: ['openGraphSiteName', 'twitterSite'],
})
```

**Complete Field Override Configuration:**

```typescript
seofields({
  fieldOverrides: {
    twitterImageType: {
      title: 'X Image Upload Method',
      description: 'Choose how to add an image for X (formerly Twitter) cards',
    },
    twitterImageUrl: {
      title: 'X External Image URL',
      description: 'Enter the full URL of an external image for X cards',
    },
  },
})
```

---

## [1.0.6] — 2025-10-08

### ✨ Added

- Added `fieldVisibility` configuration option for controlling field visibility per document type
- New `FieldVisibilityConfig` interface for type-safe field visibility control
- `defaultHiddenFields` configuration option to globally hide specific fields
- New field keys: `SitewideFieldKeys` including `openGraphSiteName` and `twitterSite`
- Updated `AllFieldKeys` type to include both SEO and sitewide field keys
- Enhanced field utility functions: `isFieldHidden` and `getFieldHiddenFunction`
- Dynamic field visibility based on document type through `fieldVisibility` configuration

### 🔄 Changed

- Updated Twitter schema title from "Twitter" to "X (Formerly Twitter)"
- Updated Twitter field titles to reference "X" instead of "Twitter":
  - "Site Twitter Handle" → "Site X Handle"
  - "Twitter Title" → "X Title"
  - "Twitter Creator Handle" → "X Creator Handle"
  - "Twitter Description" → "X Description"
  - "Twitter Image" → "X Image"
- Updated field descriptions to reference "X (formerly Twitter)"
- Enhanced Twitter and OpenGraph schemas to accept configuration parameters
- Added field visibility controls to `openGraphSiteName` and `twitterSite` fields using `getFieldHiddenFunction`

### Technical Improvements

- Refactored schema types to accept and utilize plugin configuration
- Enhanced field utilities with better type safety and configuration support
- Improved plugin architecture with granular field control capabilities

### 🔗 References

- Add field visibility feature and update Twitter branding to X [#1](https://github.com/hardik-143/sanity-plugin-seofields/pull/1) by [@crimsonwebteam](https://github.com/crimsonwebteam)

---

## [1.0.5] — 2025-10-05

### ✨ Added

- Added `creator` field to Twitter TypeScript type for content creator attribution
- Updated `Twitter` type to include creator handle field for better Twitter Card support

### 🐛 Fixed

- Fixed missing `creator` field in Twitter TypeScript type definition

---

## [1.0.4] — 2025-10-04

### ✨ Added

- Added `url` field to Open Graph schema for canonical URL specification
- Updated `OpenGraph` TypeScript type to include `url` field
- Enhanced Open Graph settings with proper URL handling for social media sharing

---

## [1.0.3] — 2025-09-24

### ✨ Added

- Enhanced field override examples and documentation
- Support for multiple field override patterns with `fieldOverrides` configuration
- Improved plugin configuration documentation with real-world usage examples
- Basic configuration example: customize individual field titles and descriptions
- Advanced configuration example: custom meta attributes with field overrides

### 🔄 Changed

- Refined configuration examples to demonstrate both basic and advanced usage patterns
- Clarified field override behavior for custom meta attributes

---

## [1.0.2] — 2024-09-23

### ✨ Added

- Enhanced plugin configuration with customizable field titles and descriptions
- New `SeoFieldsPluginConfig` interface for type-safe configuration
- `fieldOverrides` configuration option to customize individual field properties
- Support for customizing all SEO field types: `title`, `description`, `canonicalUrl`, `metaImage`, `keywords`
- Full TypeScript support for configuration options
- New `SeoField`, `SeoFieldKeys` types exported for advanced usage
- Introduced `seoPreview` configuration options if wanted to enable/disable the SEO preview feature | default is `true`.

### 🔄 Changed

- Plugin now accepts detailed configuration object with field customization
- Enhanced TypeScript type definitions for better developer experience

### 📄 Example Usage

```typescript
seofields({
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
} satisfies SeoFieldsPluginConfig)
```
