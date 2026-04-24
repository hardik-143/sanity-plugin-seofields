/**
 * Schema.org SocialMediaPosting module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgSocialMediaPosting } from 'sanity-plugin-seofields/schema'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgSocialMediaPosting()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { SocialMediaPostingSchema } from 'sanity-plugin-seofields/schema/next'
 *
 * <SocialMediaPostingSchema data={data.socialMediaPosting} />
 * ```
 */

// Sanity schema
export {default as schemaOrgSocialMediaPosting} from './schema'
export {socialMediaPostingFields} from './schema'

// Next.js / React component
export type {SocialMediaPostingSchemaProps} from './component'
export {buildSocialMediaPostingJsonLd, SocialMediaPostingSchema} from './component'

// Types
export type {SchemaOrgSocialMediaPostingConfig, SchemaOrgSocialMediaPostingData} from './types'
