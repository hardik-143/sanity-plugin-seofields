import React from 'react'
import {Stack, Text, Box} from '@sanity/ui'
import {StringInputProps, useFormValue} from 'sanity'
import {truncate} from '../utils/seoUtils'

interface SeoPreviewProps {
  title?: string
  description?: string
  url?: string
}

const SeoPreview = (props: StringInputProps) => {
  const {path} = props
  const parent = useFormValue(['seoFields']) || {
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
  }

  const {
    metaTitle: title,
    metaDescription: description,
    canonicalUrl: url,
  } = parent as {
    metaTitle?: string
    metaDescription?: string
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
          {url || 'https://www.example.com/page-url'}
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
