/**
 * Next.js App Router helpers — safe to import in Server Components.
 *
 * @example
 * import { buildSeoMeta, SeoMetaTags } from 'sanity-plugin-seofields/next'
 */
export type {
  BuildSeoMetaOptions,
  SeoFieldsInput,
  SeoMetadata,
  SeoMetaDefaults,
} from './helpers/seoMeta'
export {buildSeoMeta, sanitizeOGType, sanitizeTwitterCard} from './helpers/seoMeta'
export type {SeoMetaTagsProps} from './helpers/SeoMetaTags'
export {SeoMetaTags} from './helpers/SeoMetaTags'
