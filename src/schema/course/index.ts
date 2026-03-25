/**
 * Schema.org Course module for sanity-plugin-seofields.
 *
 * @example Sanity schema registration
 * ```ts
 * import { schemaOrgCourse } from 'sanity-plugin-seofields/schema/course'
 *
 * export default defineConfig({
 *   schema: { types: [schemaOrgCourse()] },
 * })
 * ```
 *
 * @example Next.js component
 * ```tsx
 * import { CourseSchema } from 'sanity-plugin-seofields/next/course'
 *
 * <CourseSchema data={data.seo} />
 * ```
 */

// Sanity schema
export {default as schemaOrgCourse} from './schema'
export {courseFields} from './schema'

// Next.js / React component
export type {CourseSchemaProps} from './component'
export {buildCourseJsonLd, CourseSchema} from './component'

// Types
export type {CourseProvider, SchemaOrgCourseConfig, SchemaOrgCourseData} from './types'
