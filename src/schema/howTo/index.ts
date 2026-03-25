/**
 * Schema.org HowTo module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgHowTo } from 'sanity-plugin-seofields/schema/howTo'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgHowTo()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { HowToSchema } from 'sanity-plugin-seofields/next/howTo'
 *
 * <HowToSchema data={data.howTo} />
 * ```
 */

// Sanity schema
export {default as schemaOrgHowTo} from './schema'
export {howToFields} from './schema'

// Next.js / React component
export type {HowToSchemaProps} from './component'
export {buildHowToJsonLd, HowToSchema} from './component'

// Types
export type {HowToStepItem, SchemaOrgHowToConfig, SchemaOrgHowToData} from './types'
