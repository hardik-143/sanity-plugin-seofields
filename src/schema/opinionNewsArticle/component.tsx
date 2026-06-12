import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {opinionNewsArticleFields} from './schema'
import type {SchemaOrgOpinionNewsArticleData} from './types'

export interface OpinionNewsArticleSchemaProps {
  data?: SchemaOrgOpinionNewsArticleData | null
}

export function buildOpinionNewsArticleJsonLd(
  data?: SchemaOrgOpinionNewsArticleData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'OpinionNewsArticle',
    data as Record<string, unknown> | null | undefined,
    opinionNewsArticleFields,
    ['headline', 'datePublished'],
  )
}

export function OpinionNewsArticleSchema({
  data,
}: OpinionNewsArticleSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildOpinionNewsArticleJsonLd(data)} />
}

export default OpinionNewsArticleSchema
