/**
 * <OrganizationSchema> — Renders Schema.org Organization JSON-LD structured data.
 *
 * @example
 * ```tsx
 * import { OrganizationSchema } from 'sanity-plugin-seofields/next/organization'
 *
 * const data = await sanityFetch({ query: `*[_type == "settings"][0]{ organization }` })
 *
 * <OrganizationSchema data={data.organization} />
 * ```
 */
import {JSX} from 'react'

import type {SanityImage} from '../../types'
import {SchemaOrgScript} from '../SchemaOrgScript'
import type {SchemaOrgOrganizationData} from './types'

export interface OrganizationSchemaProps {
  /** The Schema.org Organization data from your Sanity GROQ query. */
  data?: SchemaOrgOrganizationData | null
  /**
   * Resolve a Sanity image asset to a URL string (for the logo field).
   * Only needed if you use the Sanity image upload field instead of logoUrl.
   *
   * @example
   * imageUrlResolver={(img) => urlFor(img).width(600).url()}
   */
  imageUrlResolver?: (image: SanityImage) => string | null | undefined
}

/**
 * Builds a Schema.org Organization JSON-LD object from Sanity data.
 * Returns `null` if required fields (name, url) are missing.
 */
export function buildOrganizationJsonLd(
  data?: SchemaOrgOrganizationData | null,
  imageUrlResolver?: (image: SanityImage) => string | null | undefined,
): Record<string, unknown> | null {
  if (!data?.name || !data?.url) return null

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
  }

  // Resolve logo — prefer explicit URL, fall back to Sanity image
  const logoUrl =
    data.logoUrl || (data.logo && imageUrlResolver ? imageUrlResolver(data.logo) : undefined)
  if (logoUrl) jsonLd.logo = logoUrl

  if (data.description) jsonLd.description = data.description

  if (data.sameAs) jsonLd.sameAs = data.sameAs

  if (data.contactPoint?.contactType) {
    const cp: Record<string, unknown> = {
      '@type': 'ContactPoint',
      contactType: data.contactPoint.contactType,
    }
    if (data.contactPoint.email) cp.email = data.contactPoint.email
    if (data.contactPoint.availableLanguage?.length) {
      cp.availableLanguage = data.contactPoint.availableLanguage
    }
    jsonLd.contactPoint = cp
  }

  return jsonLd
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org Organization data.
 * Renders nothing if required fields are missing.
 */
export function OrganizationSchema({
  data,
  imageUrlResolver,
}: OrganizationSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildOrganizationJsonLd(data, imageUrlResolver)} />
}

export default OrganizationSchema
