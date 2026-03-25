import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {breadcrumbListFields} from './schema'
import type {SchemaOrgBreadcrumbListData} from './types'

export interface BreadcrumbListSchemaProps {
  /** The Schema.org BreadcrumbList data from your Sanity GROQ query. */
  data?: SchemaOrgBreadcrumbListData | null
}

/**
 * Builds a Schema.org BreadcrumbList JSON-LD object from Sanity data.
 * Returns `null` if data is missing.
 */
export function buildBreadcrumbListJsonLd(
  data?: SchemaOrgBreadcrumbListData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'BreadcrumbList',
    data as Record<string, unknown> | null | undefined,
    breadcrumbListFields,
    [],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org BreadcrumbList data.
 * Renders nothing if data is missing.
 */
export function BreadcrumbListSchema({data}: BreadcrumbListSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildBreadcrumbListJsonLd(data)} />
}

export default BreadcrumbListSchema
