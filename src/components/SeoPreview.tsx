import {Box, Stack, Text} from '@sanity/ui'
import React from 'react'
import {StringInputProps, useFormValue} from 'sanity'

import {truncate} from '../utils/seoUtils'

const SeoPreview = (props: StringInputProps): React.ReactElement => {
  const {path, schemaType} = props
  const {options} = schemaType as {
    options?: {
      baseUrl?: string
      prefix?: ((doc: {_type?: string} & Record<string, unknown>) => string) | string
    }
  }
  const baseUrl = options?.baseUrl || 'https://www.example.com'
  const prefixFunction = options?.prefix as
    | ((doc: {_type?: string} & Record<string, unknown>) => string)
    | undefined
  const parent = useFormValue([path[0]]) || {
    title: '',
    description: '',
    canonicalUrl: '',
  }
  const rootDoc: {
    slug?: {current: string}
  } = useFormValue([]) || {
    slug: {current: ''},
  }
  const slug: string = rootDoc?.slug?.current || ''

  const {
    title,
    description,
    canonicalUrl: url,
  } = parent as {
    title?: string
    description?: string
    canonicalUrl?: string
  }

  return (
    <Box
      padding={3}
      style={{
        maxWidth: 600,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Stack space={3}>
        {/* URL */}
        <Text size={1} style={{color: '#006621', fontSize: 12, lineHeight: 1.3, marginBottom: 3}}>
          {(() => {
            const base = (url || baseUrl)?.replace(/\/+$/, '')
            const slugStr = String(slug || '').replace(/^\/+/, '')
            const pref = String(
              prefixFunction ? prefixFunction(rootDoc as {slug?: {current: string}}) : '',
            ).replace(/^\/+|\/+$/g, '')
            const urlPath = [pref, slugStr].filter(Boolean).join('/')
            const finalUrl = urlPath ? `${base}/${urlPath}` : base

            return (
              <a
                href={finalUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{color: 'inherit', textDecoration: 'none'}}
              >
                {finalUrl || 'https://www.example.com/page-url'}
              </a>
            )
          })()}
        </Text>

        {/* Title */}
        <Text
          size={3}
          weight="bold"
          style={{
            color: '#1a0dab',
            fontSize: 18,
            lineHeight: 1.4,
            marginBottom: 3,
          }}
        >
          {title ? truncate(title, 60) : 'Meta Title Preview'}
        </Text>

        {/* Description */}
        <Text
          size={2}
          style={{
            color: '#545454',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {description ? truncate(description, 160) : 'Meta description will appear here…'}
        </Text>
      </Stack>
    </Box>
  )
}

export default SeoPreview
