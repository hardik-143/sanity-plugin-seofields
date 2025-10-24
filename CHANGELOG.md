# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Initial setup and configuration of the changelog.md file.

## [1.0.2] - 2024-09-23

### Added

- Enhanced plugin configuration with customizable field titles and descriptions
- New `SeoFieldsPluginConfig` interface for type-safe configuration
- `fieldOverrides` configuration option to customize individual field properties
- Support for customizing all SEO field types: `title`, `description`, `canonicalUrl`, `metaImage`, `keywords`
- Full TypeScript support for configuration options
- New `SeoField`, `SeoFieldKeys` types exported for advanced usage
- Introduced `seoPreview` configuration options if wanted to enable/disable the SEO preview feature | default is `true`.

### Changed

- Plugin now accepts detailed configuration object with field customization
- Enhanced TypeScript type definitions for better developer experience

### Example Usage

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

## [1.0.3] - 2025-09-24

### Added

- Added new SEO field type: `metaAttributes` for additional meta tags
- Extended `SeoFieldKeys` type to include `metaAttributes`
- Updated `SeoFieldsPluginConfig` to support `metaAttributes` in `fieldOverrides`

### Changed

- Renamed field configuration interface from `SeoField` to `SeoFieldConfig` for clarity
- Updated field configuration property from `fields` to `fieldOverrides` for better semantic meaning

### Example Usage

```typescript
seofields({
  seoPreview: true,
  fieldOverrides: {
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

```typescript
seofields({
  seoPreview: true,
  fieldOverrides: {
    title: {
      title: 'Page Title',
      description: 'The main title for search engines',
    },
    description: {
      title: 'Meta Description',
      description: 'Brief description for search results',
    },
    metaAttributes: {
      title: 'Custom Meta Tags',
      description: 'Additional meta attributes for advanced SEO',
    },
  },
} satisfies SeoFieldsPluginConfig)
```

## [1.0.4] - 2025-10-04

### Added

- Added `url` field to Open Graph schema for canonical URL specification
- Updated `OpenGraph` TypeScript type to include `url` field
- Enhanced Open Graph settings with proper URL handling for social media sharing

## [1.0.5] - 2025-10-05

### Added

- Added `creator` field to Twitter TypeScript type for content creator attribution
- Updated `Twitter` type to include creator handle field for better Twitter Card support

### Fixed

- Fixed missing `creator` field in Twitter TypeScript type definition

## [1.0.6] - 2025-10-08

### Added

- Added `fieldVisibility` configuration option for controlling field visibility per document type
- New `FieldVisibilityConfig` interface for type-safe field visibility control
- `defaultHiddenFields` configuration option to globally hide specific fields
- New field keys: `SitewideFieldKeys` including `openGraphSiteName` and `twitterSite`
- Updated `AllFieldKeys` type to include both SEO and sitewide field keys
- Enhanced field utility functions: `isFieldHidden` and `getFieldHiddenFunction`
- Dynamic field visibility based on document type through `fieldVisibility` configuration

### Changed

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

### Pull Request Links

- 🌐 Add field visibility feature and update Twitter branding to X [#1](https://github.com/hardik-143/sanity-plugin-seofields/pull/1) [@crimsonwebteam](https://github.com/crimsonwebteam)

## [1.0.7] - 2025-10-12

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


## [1.0.8] - 2025-10-15
### Fixed
- Fixed issue with initial value assignment in SEO preview field schema
In `src/schemas/index.ts`, updated the `initialValue` assignment for the SEO preview field schema to ensure it is correctly set as an empty string.

