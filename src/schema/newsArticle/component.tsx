import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {newsArticleFields} from './schema'
import type {SchemaOrgNewsArticleData} from './types'

export interface NewsArticleSchemaProps {
  data?: SchemaOrgNewsArticleData | null
}

export function buildNewsArticleJsonLd(
  data?: SchemaOrgNewsArticleData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'NewsArticle',
    data as Record<string, unknown> | null | undefined,
    newsArticleFields,
    ['headline', 'datePublished'],
  )
}

export function NewsArticleSchema({data}: NewsArticleSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildNewsArticleJsonLd(data)} />
}

export default NewsArticleSchema
