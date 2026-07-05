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
