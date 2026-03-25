/**
 * Schema.org Article module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgArticle } from 'sanity-plugin-seofields/schema/article'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgArticle()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { ArticleSchema } from 'sanity-plugin-seofields/next/article'
 *
 * <ArticleSchema data={data.article} />
 * ```
 */

// Sanity schema
export {default as schemaOrgArticle} from './schema'
export {articleFields} from './schema'

// Next.js / React component
export type {ArticleSchemaProps} from './component'
export {ArticleSchema, buildArticleJsonLd} from './component'

// Types
export type {SchemaOrgArticleConfig, SchemaOrgArticleData} from './types'
