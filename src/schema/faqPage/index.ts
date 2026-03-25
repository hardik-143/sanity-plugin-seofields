/**
 * Schema.org FAQPage module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgFAQPage } from 'sanity-plugin-seofields/schema/faqPage'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgFAQPage()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { FAQPageSchema } from 'sanity-plugin-seofields/next/faqPage'
 *
 * <FAQPageSchema data={data.faqPage} />
 * ```
 */

// Sanity schema
export {default as schemaOrgFAQPage} from './schema'
export {faqPageFields} from './schema'

// Next.js / React component
export type {FAQPageSchemaProps} from './component'
export {buildFAQPageJsonLd, FAQPageSchema} from './component'

// Types
export type {FAQItem, SchemaOrgFAQPageConfig, SchemaOrgFAQPageData} from './types'
