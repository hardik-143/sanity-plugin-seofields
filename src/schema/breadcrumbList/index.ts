/**
 * Schema.org BreadcrumbList module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgBreadcrumbList } from 'sanity-plugin-seofields/schema/breadcrumbList'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgBreadcrumbList()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { BreadcrumbListSchema } from 'sanity-plugin-seofields/next/breadcrumbList'
 *
 * <BreadcrumbListSchema data={data.breadcrumbList} />
 * ```
 */

// Sanity schema
export {default as schemaOrgBreadcrumbList} from './schema'
export {breadcrumbListFields} from './schema'

// Next.js / React component
export type {BreadcrumbListSchemaProps} from './component'
export {BreadcrumbListSchema, buildBreadcrumbListJsonLd} from './component'

// Types
export type {
  BreadcrumbListItem,
  SchemaOrgBreadcrumbListConfig,
  SchemaOrgBreadcrumbListData,
} from './types'
