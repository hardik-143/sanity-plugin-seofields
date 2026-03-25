import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {articleFields} from './schema'
import type {SchemaOrgArticleData} from './types'

export interface ArticleSchemaProps {
  /** The Schema.org Article data from your Sanity GROQ query. */
  data?: SchemaOrgArticleData | null
}

/**
 * Builds a Schema.org Article JSON-LD object from Sanity data.
 * Returns `null` if required fields (headline) are missing.
 */
export function buildArticleJsonLd(
  data?: SchemaOrgArticleData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Article',
    data as Record<string, unknown> | null | undefined,
    articleFields,
    ['headline'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org Article data.
 * Renders nothing if required fields are missing.
 */
export function ArticleSchema({data}: ArticleSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildArticleJsonLd(data)} />
}

export default ArticleSchema
