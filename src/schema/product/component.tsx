/**
 * <ProductSchema> — Renders Schema.org Product JSON-LD structured data.
 *
 * @example
 * ```tsx
 * import { ProductSchema } from 'sanity-plugin-seofields/next/product'
 *
 * const data = await sanityFetch({ query: `*[_type == "product"][0]{ seo }` })
 *
 * <ProductSchema data={data.seo} />
 * ```
 */
import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {productFields} from './schema'
import type {SchemaOrgProductData} from './types'

export interface ProductSchemaProps {
  /** The Schema.org Product data from your Sanity GROQ query. */
  data?: SchemaOrgProductData | null
}

/**
 * Builds a Schema.org Product JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildProductJsonLd(
  data?: SchemaOrgProductData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Product',
    data as Record<string, unknown> | null | undefined,
    productFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org Product data.
 * Renders nothing if required fields are missing.
 */
export function ProductSchema({data}: ProductSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildProductJsonLd(data)} />
}

export default ProductSchema
