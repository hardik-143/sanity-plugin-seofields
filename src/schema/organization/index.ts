/**
 * Schema.org Organization module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgOrganization } from 'sanity-plugin-seofields/schema/organization'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgOrganization()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { OrganizationSchema } from 'sanity-plugin-seofields/next/organization'
 *
 * <OrganizationSchema data={data.organization} />
 * ```
 */

// Sanity schema
export {default as schemaOrgOrganization} from './schema'
export {organizationFields} from './schema'

// Next.js / React component
export type {OrganizationSchemaProps} from './component'
export {buildOrganizationJsonLd, OrganizationSchema} from './component'

// Types
export type {
  OrganizationContactPoint,
  SchemaOrgOrganizationConfig,
  SchemaOrgOrganizationData,
} from './types'
