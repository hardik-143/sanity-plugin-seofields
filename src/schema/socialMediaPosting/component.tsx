import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {socialMediaPostingFields} from './schema'
import type {SchemaOrgSocialMediaPostingData} from './types'

export interface SocialMediaPostingSchemaProps {
  /** The Schema.org SocialMediaPosting data from your Sanity GROQ query. */
  data?: SchemaOrgSocialMediaPostingData | null
}

/**
 * Builds a Schema.org SocialMediaPosting JSON-LD object from Sanity data.
 * Returns `null` if required fields (headline) are missing.
 */
export function buildSocialMediaPostingJsonLd(
  data?: SchemaOrgSocialMediaPostingData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'SocialMediaPosting',
    data as Record<string, unknown> | null | undefined,
    socialMediaPostingFields,
    ['headline'],
  )
}

/**
 * Renders a `<script type="application/ld+json">` tag with Schema.org SocialMediaPosting data.
 * Renders nothing if required fields are missing.
 */
export function SocialMediaPostingSchema({
  data,
}: SocialMediaPostingSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildSocialMediaPostingJsonLd(data)} />
}

export default SocialMediaPostingSchema
