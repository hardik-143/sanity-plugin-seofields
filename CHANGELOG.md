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
