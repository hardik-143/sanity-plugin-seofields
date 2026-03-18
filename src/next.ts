/**
 * Next.js App Router helpers — safe to import in Server Components.
 *
 * @example
 * import { buildSeoMeta, SeoMetaTags } from 'sanity-plugin-seofields/next'
 */
export {buildSeoMeta, sanitizeOGType, sanitizeTwitterCard} from './helpers/seoMeta'

export type {BuildSeoMetaOptions, SeoMetaDefaults, SeoMetadata} from './helpers/seoMeta'

export {SeoMetaTags} from './helpers/SeoMetaTags'
export type {SeoMetaTagsProps} from './helpers/SeoMetaTags'
