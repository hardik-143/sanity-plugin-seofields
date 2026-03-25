/**
 * Schema.org Product module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgProduct } from 'sanity-plugin-seofields/schema/product'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgProduct()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { ProductSchema } from 'sanity-plugin-seofields/next/product'
 *
 * <ProductSchema data={data.seo} />
 * ```
 */

// Sanity schema
export {default as schemaOrgProduct} from './schema'
export {productFields} from './schema'

// Next.js / React component
export type {ProductSchemaProps} from './component'
export {buildProductJsonLd, ProductSchema} from './component'

// Types
export type {ProductBrand, SchemaOrgProductConfig, SchemaOrgProductData} from './types'
