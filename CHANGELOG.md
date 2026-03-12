# Changelog

All notable changes to **sanity-plugin-seofields** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
