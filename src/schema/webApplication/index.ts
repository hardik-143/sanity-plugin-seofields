/**
 * Schema.org WebApplication module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgWebApplication } from 'sanity-plugin-seofields/schema/webApplication'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgWebApplication()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { WebApplicationSchema } from 'sanity-plugin-seofields/next/webApplication'
 *
 * <WebApplicationSchema data={data.seo} />
 * ```
 */

// Sanity schema
export {default as schemaOrgWebApplication} from './schema'
export {webApplicationFields} from './schema'

// Next.js / React component
export type {WebApplicationSchemaProps} from './component'
export {buildWebApplicationJsonLd, WebApplicationSchema} from './component'

// Types
export type {SchemaOrgWebApplicationConfig, SchemaOrgWebApplicationData} from './types'
