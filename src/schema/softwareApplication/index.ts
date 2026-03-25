/**
 * Schema.org SoftwareApplication module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgSoftwareApplication } from 'sanity-plugin-seofields/schema/softwareApplication'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgSoftwareApplication()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { SoftwareApplicationSchema } from 'sanity-plugin-seofields/next/softwareApplication'
 *
 * <SoftwareApplicationSchema data={data.seo} />
 * ```
 */

// Sanity schema
export {default as schemaOrgSoftwareApplication} from './schema'
export {softwareApplicationFields} from './schema'

// Next.js / React component
export type {SoftwareApplicationSchemaProps} from './component'
export {buildSoftwareApplicationJsonLd, SoftwareApplicationSchema} from './component'

// Types
export type {SchemaOrgSoftwareApplicationConfig, SchemaOrgSoftwareApplicationData} from './types'
