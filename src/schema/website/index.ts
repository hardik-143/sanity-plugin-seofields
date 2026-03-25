/**
 * Schema.org WebSite module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgWebsite } from 'sanity-plugin-seofields/schema/website'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgWebsite()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { WebsiteSchema } from 'sanity-plugin-seofields/next/website'
 *
 * <WebsiteSchema data={data.website} />
 * ```
 */

// Sanity schema
export {default as schemaOrgWebsite} from './schema'
export {websiteFields} from './schema'

// Next.js / React component
export type {WebsiteSchemaProps} from './component'
export {buildWebsiteJsonLd, WebsiteSchema} from './component'

// Types
export type {SchemaOrgWebsiteConfig, SchemaOrgWebsiteData, WebsitePublisher} from './types'
