/**
 * Schema.org Person module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgPerson } from 'sanity-plugin-seofields/schema/person'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgPerson()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { PersonSchema } from 'sanity-plugin-seofields/next/person'
 *
 * <PersonSchema data={data.person} />
 * ```
 */

// Sanity schema
export {default as schemaOrgPerson} from './schema'
export {personFields} from './schema'

// Next.js / React component
export type {PersonSchemaProps} from './component'
export {buildPersonJsonLd, PersonSchema} from './component'

// Types
export type {PersonWorksFor, SchemaOrgPersonConfig, SchemaOrgPersonData} from './types'
