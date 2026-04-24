/**
 * Schema.org WebPage module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgWebPage } from 'sanity-plugin-seofields/schema/webPage'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgWebPage()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { WebPageSchema } from 'sanity-plugin-seofields/next/webPage'
 *
 * <WebPageSchema data={data.seo} />
 * ```
 */

// Sanity schema
export {default as schemaOrgWebPage} from './schema'
export {webPageFields} from './schema'

// Next.js / React component
export type {WebPageSchemaProps} from './component'
export {buildWebPageJsonLd, WebPageSchema} from './component'

// Types
export type {SchemaOrgWebPageConfig, SchemaOrgWebPageData} from './types'
