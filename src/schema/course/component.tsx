/**
 * <CourseSchema> — Renders Schema.org Course JSON-LD structured data.
 *
 * @example
 * ```tsx
 * import { CourseSchema } from 'sanity-plugin-seofields/next/course'
 *
 * const data = await sanityFetch({ query: `*[_type == "course"][0]{ seo }` })
 *
 * <CourseSchema data={data.seo} />
 * ```
 */
import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {courseFields} from './schema'
import type {SchemaOrgCourseData} from './types'

export interface CourseSchemaProps {
  /** The Schema.org Course data from your Sanity GROQ query. */
  data?: SchemaOrgCourseData | null
}

/**
 * Builds a Schema.org Course JSON-LD object from Sanity data.
 * Returns `null` if required fields (name) are missing.
 */
export function buildCourseJsonLd(
  data?: SchemaOrgCourseData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Course',
    data as Record<string, unknown> | null | undefined,
    courseFields,
    ['name'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org Course data.
 * Renders nothing if required fields are missing.
 */
export function CourseSchema({data}: CourseSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildCourseJsonLd(data)} />
}

export default CourseSchema
