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
- Added field visibility controls to `siteName` and `site` fields using `getFieldHiddenFunction`

### Technical Improvements

- Refactored schema types to accept and utilize plugin configuration
- Enhanced field utilities with better type safety and configuration support
- Improved plugin architecture with granular field control capabilities

### Pull Request Links

- 🌐 Add field visibility feature and update Twitter branding to X [#1](https://github.com/hardik-143/sanity-plugin-seofields/pull/1) [@crimsonwebteam](https://github.com/crimsonwebteam)
