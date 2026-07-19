/**
 * Framework-neutral SEO head helpers.
 *
 * Use this entry point in Astro, Nuxt, Vue, SvelteKit, Remix, and custom SSR
 * renderers that need plain serializable head data instead of React elements
 * or Next.js Metadata.
 *
 * @example
 * import { buildSeoHead } from 'sanity-plugin-seofields/head'
 */
export type {
  BuildSeoMetaOptions,
  SeoFieldsInput,
  SeoHead,
  SeoHeadLinkTag,
  SeoHeadMetaTag,
  SeoMetadata,
  SeoMetaDefaults,
} from './helpers/seoMeta'
export {buildSeoHead, buildSeoMeta, sanitizeOGType, sanitizeTwitterCard} from './helpers/seoMeta'

// Hreflang alternates from `@sanity/document-internationalization` translations
export type {
  BuildHreflangsOptions,
  HreflangLinkEntry,
  HreflangTranslation,
} from './helpers/hreflang'
export {buildHreflangs} from './helpers/hreflang'

// llms.txt generation (https://llmstxt.org)
export type {
  BuildLlmsTxtOptions,
  DocsToLlmsSectionOptions,
  LlmsDoc,
  LlmsLink,
  LlmsSection,
} from './helpers/llmsTxt'
export {buildLlmsTxt, docsToLlmsSection} from './helpers/llmsTxt'
