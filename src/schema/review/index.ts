/**
 * Schema.org Review module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgReview } from 'sanity-plugin-seofields/schema/review'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgReview()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { ReviewSchema } from 'sanity-plugin-seofields/next/review'
 *
 * <ReviewSchema data={data.review} />
 * ```
 */

// Sanity schema
export {default as schemaOrgReview} from './schema'
export {reviewFields} from './schema'

// Next.js / React component
export type {ReviewSchemaProps} from './component'
export {buildReviewJsonLd, ReviewSchema} from './component'

// Types
export type {SchemaOrgReviewConfig, SchemaOrgReviewData} from './types'
