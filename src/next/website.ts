/**
 * Next.js WebSite Schema.org component.
 *
 * @example
 * ```tsx
 * import { WebsiteSchema } from 'sanity-plugin-seofields/next/website'
 *
 * <WebsiteSchema data={data.website} />
 * ```
 */
export type {WebsiteSchemaProps} from '../schema/website/component'
export {buildWebsiteJsonLd, WebsiteSchema} from '../schema/website/component'
export type {SchemaOrgWebsiteData, WebsitePublisher} from '../schema/website/types'
