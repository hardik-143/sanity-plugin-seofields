import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {blogPostingFields} from './schema'
import type {SchemaOrgBlogPostingData} from './types'

export interface BlogPostingSchemaProps {
  /** The Schema.org BlogPosting data from your Sanity GROQ query. */
  data?: SchemaOrgBlogPostingData | null
}

/**
 * Builds a Schema.org BlogPosting JSON-LD object from Sanity data.
 * Returns `null` if required fields (headline) are missing.
 */
export function buildBlogPostingJsonLd(
  data?: SchemaOrgBlogPostingData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'BlogPosting',
    data as Record<string, unknown> | null | undefined,
    blogPostingFields,
    ['headline'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org BlogPosting data.
 * Renders nothing if required fields are missing.
 */
export function BlogPostingSchema({data}: BlogPostingSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildBlogPostingJsonLd(data)} />
}

export default BlogPostingSchema
