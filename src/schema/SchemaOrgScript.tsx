/**
 * Shared component that renders a `<script type="application/ld+json">` tag.
 * Used by all Schema.org type components.
 */
import {JSX} from 'react'

import {escapeJsonForScript} from './utils'

export function SchemaOrgScript({
  jsonLd,
}: {
  jsonLd: Record<string, unknown> | null
}): JSX.Element | null {
  if (!jsonLd) return null

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: escapeJsonForScript(JSON.stringify(jsonLd))}}
    />
  )
}
