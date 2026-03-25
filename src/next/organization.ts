/**
 * Next.js Organization Schema.org component.
 *
 * @example
 * ```tsx
 * import { OrganizationSchema } from 'sanity-plugin-seofields/next/organization'
 *
 * <OrganizationSchema data={data.organization} />
 * ```
 */
export type {OrganizationSchemaProps} from '../schema/organization/component'
export {buildOrganizationJsonLd, OrganizationSchema} from '../schema/organization/component'
export type {
  OrganizationContactPoint,
  SchemaOrgOrganizationData,
} from '../schema/organization/types'
