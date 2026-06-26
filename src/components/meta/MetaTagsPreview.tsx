import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {type ReactElement, useMemo, useState} from 'react'
import {StringInputProps, useClient, useColorScheme, useFormValue} from 'sanity'

import {tokenizeHtml} from '../../utils/syntaxHighlight'

type SeoFieldsValue = {
  title?: string
  description?: string
  metaImage?: {asset?: {_ref?: string} | null} | null
  openGraph?: {
    title?: string
    description?: string
    siteName?: string
    type?: string
    url?: string
    image?: {asset?: {_ref?: string} | null} | null
    imageUrl?: string
  } | null
  twitter?: {
    card?: string
    site?: string
    creator?: string
    title?: string
    description?: string
    image?: {asset?: {_ref?: string} | null} | null
    imageUrl?: string
  } | null
  canonicalUrl?: string
  robots?: {
    noIndex?: boolean
    noFollow?: boolean
    noTranslate?: boolean
    noImageIndex?: boolean
  } | null
  keywords?: string[]
  hreflangs?: Array<{locale: string; url: string}>
  metaAttributes?: Array<{
    key?: string
    type?: string
    value?: string
    image?: {asset?: {_ref?: string} | null} | null
  }>
} | null

function resolveImageUrl(
  asset: {_ref?: string} | null | undefined,
  projectId: string,
  dataset: string,
): string | null {
  const ref = asset?._ref
  if (!ref) return null
  const parts = ref.replace('image-', '').split('-')
  const ext = parts[parts.length - 1]
  const dims = parts[parts.length - 2]
  const id = parts.slice(0, parts.length - 2).join('-')
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${ext}`
}

const MetaTagsPreview = (props: StringInputProps): ReactElement => {
  const {path} = props
  const [expanded, setExpanded] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy')

  const {scheme} = useColorScheme()
  const seoFields = useFormValue([path[0]]) as SeoFieldsValue
  const client = useClient({apiVersion: '2024-01-01'})
  const {projectId = '', dataset = ''} = client.config()

  const rawHtml = useMemo((): string => {
    const lines: string[] = []

    lines.push('<meta charset="UTF-8" />')
    lines.push('<meta name="viewport" content="width=device-width, initial-scale=1" />')

    if (seoFields?.title) lines.push(`<title>${seoFields.title}</title>`)
    if (seoFields?.description)
      lines.push(`<meta name="description" content="${seoFields.description}" />`)

    if (seoFields?.robots) {
      const parts: string[] = []
      if (seoFields.robots.noIndex) parts.push('noindex')
      if (seoFields.robots.noFollow) parts.push('nofollow')
      if (seoFields.robots.noTranslate) parts.push('notranslate')
      if (seoFields.robots.noImageIndex) parts.push('noimageindex')
      if (parts.length) lines.push(`<meta name="robots" content="${parts.join(', ')}" />`)
    }

    if (seoFields?.keywords?.length)
      lines.push(`<meta name="keywords" content="${seoFields.keywords.join(', ')}" />`)

    if (seoFields?.canonicalUrl)
      lines.push(`<link rel="canonical" href="${seoFields.canonicalUrl}" />`)

    const og = seoFields?.openGraph
    if (og?.type) lines.push(`<meta property="og:type" content="${og.type}" />`)
    if (og?.title) lines.push(`<meta property="og:title" content="${og.title}" />`)
    if (og?.description)
      lines.push(`<meta property="og:description" content="${og.description}" />`)
    if (og?.siteName) lines.push(`<meta property="og:site_name" content="${og.siteName}" />`)
    if (og?.url) lines.push(`<meta property="og:url" content="${og.url}" />`)

    const ogImg =
      og?.imageUrl ||
      resolveImageUrl(og?.image?.asset, projectId, dataset) ||
      resolveImageUrl(seoFields?.metaImage?.asset, projectId, dataset)
    if (ogImg) lines.push(`<meta property="og:image" content="${ogImg}" />`)

    const tw = seoFields?.twitter
    if (tw?.card) lines.push(`<meta name="twitter:card" content="${tw.card}" />`)
    if (tw?.site) lines.push(`<meta name="twitter:site" content="${tw.site}" />`)
    if (tw?.creator) lines.push(`<meta name="twitter:creator" content="${tw.creator}" />`)
    if (tw?.title) lines.push(`<meta name="twitter:title" content="${tw.title}" />`)
    if (tw?.description)
      lines.push(`<meta name="twitter:description" content="${tw.description}" />`)

    const twImg = tw?.imageUrl || resolveImageUrl(tw?.image?.asset, projectId, dataset)
    if (twImg) lines.push(`<meta name="twitter:image" content="${twImg}" />`)

    if (seoFields?.hreflangs?.length) {
      for (const e of seoFields.hreflangs) {
        if (e.locale && e.url)
          lines.push(`<link rel="alternate" hreflang="${e.locale}" href="${e.url}" />`)
      }
    }

    if (seoFields?.metaAttributes?.length) {
      for (const attr of seoFields.metaAttributes) {
        if (attr.key && attr.type === 'string' && attr.value) {
          lines.push(`<meta name="${attr.key}" content="${attr.value}" />`)
        } else if (attr.key && attr.type === 'image' && attr.image?.asset) {
          const imgUrl = resolveImageUrl(attr.image.asset, projectId, dataset)
          if (imgUrl) lines.push(`<meta name="${attr.key}" content="${imgUrl}" />`)
        }
      }
    }

    return lines.join('\n')
  }, [seoFields, projectId, dataset])

  const tagCount = useMemo(() => rawHtml.split('\n').filter(Boolean).length, [rawHtml])

  const tokens = useMemo(() => tokenizeHtml(rawHtml, scheme), [rawHtml, scheme])

  const handleCopy = () => {
    navigator.clipboard.writeText(rawHtml).then(() => {
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy'), 2000)
    })
  }

  const isDark = scheme === 'dark'
  const codeBg = isDark ? '#161b22' : '#f6f8fa'
  const codeBorder = isDark ? '#30363d' : '#d0d7de'
  const headerBg = isDark ? '#21262d' : '#f0f2f4'
  const headerBorder = isDark ? '#30363d' : '#d0d7de'
  const headerText = isDark ? '#e6edf3' : '#24292f'

  return (
    <Card padding={3} radius={2} tone="default" border>
      <Stack space={3}>
        {/* Header */}
        <Flex align="center" justify="space-between" gap={3}>
          <Text weight="semibold" size={1}>
            Meta Tags Preview
          </Text>
          <Flex gap={2} align="center">
            <Text size={0} muted>
              {tagCount} tags generated
            </Text>
            <Button
              text={copyLabel}
              tone="default"
              mode="ghost"
              fontSize={1}
              padding={2}
              onClick={handleCopy}
            />
          </Flex>
        </Flex>

        {/* Toggle */}
        <button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: '100%',
            background: headerBg,
            border: `1px solid ${headerBorder}`,
            borderRadius: 6,
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
            color: headerText,
          }}
        >
          <span style={{fontSize: 10}}>{expanded ? '▲' : '▼'}</span>
          {expanded ? 'Hide tags' : 'Show tags'}
        </button>

        {/* Highlighted code block */}
        {expanded && (
          <div
            style={{
              borderRadius: 6,
              border: `1px solid ${codeBorder}`,
              overflow: 'hidden',
            }}
          >
            {/* Code header bar */}
            <div
              style={{
                background: headerBg,
                borderBottom: `1px solid ${headerBorder}`,
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isDark ? '#388bfd' : '#0550ae',
                  display: 'inline-block',
                }}
              />
              <span style={{fontSize: 11, color: headerText, fontFamily: 'monospace'}}>HTML</span>
            </div>

            {/* Tokens */}
            <Box
              as="pre"
              padding={3}
              style={{
                margin: 0,
                maxHeight: 420,
                overflow: 'auto',
                fontSize: 12,
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                backgroundColor: codeBg,
              }}
            >
              {tokens.map((token, idx) => (
                <span key={idx} style={{color: token.color}}>
                  {token.text}
                </span>
              ))}
            </Box>
          </div>
        )}
      </Stack>
    </Card>
  )
}

export default MetaTagsPreview
