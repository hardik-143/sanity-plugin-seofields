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
