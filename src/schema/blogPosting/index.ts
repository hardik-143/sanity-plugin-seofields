/**
 * Schema.org BlogPosting module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgBlogPosting } from 'sanity-plugin-seofields/schema/blogPosting'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgBlogPosting()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { BlogPostingSchema } from 'sanity-plugin-seofields/next/blogPosting'
 *
 * <BlogPostingSchema data={data.blogPosting} />
 * ```
 */

// Sanity schema
export {default as schemaOrgBlogPosting} from './schema'
export {blogPostingFields} from './schema'

// Next.js / React component
export type {BlogPostingSchemaProps} from './component'
export {BlogPostingSchema, buildBlogPostingJsonLd} from './component'

// Types
export type {SchemaOrgBlogPostingConfig, SchemaOrgBlogPostingData} from './types'
