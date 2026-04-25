import {Box} from '@sanity/ui'
import {type ReactElement, useEffect, useState} from 'react'
import {StringInputProps, useClient, useFormValue} from 'sanity'
import styled from 'styled-components'

import {truncate} from '../utils/seoUtils'

const PreviewContainer = styled.div`
  max-width: 600px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 8px;
  overflow: hidden;
`

const PreviewHeader = styled.div`
  background: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const PreviewBody = styled.div`
  padding: 16px;
`

const SerpUrl = styled.p`
  margin: 0 0 4px;
  color: #006621;
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
`

const SerpTitle = styled.h3`
  margin: 0 0 8px;
  color: #1a0dab;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;

  &:hover {
    text-decoration: underline;
  }
`

const SerpDescription = styled.p`
  margin: 0;
  color: #545454;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const LiveIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #4f46e5;
  background: #f0f4ff;
  padding: 4px 8px;
  border-radius: 4px;
`

const SeoPreview = (props: StringInputProps): ReactElement => {
  const {path, schemaType} = props
  const {options} = schemaType as {
    options?: {
      baseUrl?: string
      apiVersion?: string
      prefix?: ((doc: {_type?: string} & Record<string, unknown>) => string) | string
      titleSuffix?: ((doc: {_type?: string} & Record<string, unknown>) => string) | string
      titleSuffixInheritColor?: boolean
      titleSuffixQuery?: string
    }
  }
  const baseUrl = options?.baseUrl || 'https://www.example.com'
  const prefixFunction = options?.prefix as
    | ((doc: {_type?: string} & Record<string, unknown>) => string)
    | undefined
  const titleSuffixOption = options?.titleSuffix
  const titleSuffixInheritColor = options?.titleSuffixInheritColor ?? false
  const titleSuffixQuery = options?.titleSuffixQuery

  const client = useClient({apiVersion: options?.apiVersion ?? '2024-01-01'})
  const [groqTitleSuffix, setGroqTitleSuffix] = useState<string>('')

  useEffect(() => {
    if (!titleSuffixQuery) return
    client
      .fetch<string>(titleSuffixQuery)
      .then((result) => {
        setGroqTitleSuffix(result === null || result === undefined ? '' : String(result))
      })
      .catch(() => {
        setGroqTitleSuffix('')
      })
  }, [titleSuffixQuery, client])
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

  const getTitleSuffix = (): string => {
    if (titleSuffixQuery) return groqTitleSuffix
    if (!titleSuffixOption) return ''
    if (typeof titleSuffixOption === 'function') {
      return titleSuffixOption(rootDoc as {_type?: string} & Record<string, unknown>)
    }
    return titleSuffixOption
  }
  const titleSuffix: string = getTitleSuffix()

  // Build full URL
  const base = (url || baseUrl)?.replace(/\/+$/, '')
  const slugStr = String(slug || '').replace(/^\/+/, '')
  const pref = String(
    prefixFunction ? prefixFunction(rootDoc as {slug?: {current: string}}) : '',
  ).replace(/^\/+|\/+$/g, '')
  const urlPath = [pref, slugStr].filter(Boolean).join('/')
  const finalUrl = urlPath ? `${base}/${urlPath}` : base

  // Extract domain for display
  const domain = (() => {
    try {
      const u = new URL(finalUrl || base)
      return u.hostname
    } catch {
      return 'example.com'
    }
  })()

  // Format URL display with › separator
  const urlDisplay = `${domain}${urlPath ? ` › ${urlPath.split('/').slice(-1)[0]}` : ''}`

  return (
    <Box padding={3}>
      <PreviewContainer>
        <PreviewHeader>
          <span
            style={{
              fontSize: '11px',
              color: '#5f6368',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Search Preview
          </span>
          <LiveIndicator>
            <span
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#4f46e5',
                display: 'inline-block',
              }}
            />
            Live
          </LiveIndicator>
        </PreviewHeader>

        <PreviewBody>
          <SerpUrl>{finalUrl ? urlDisplay : 'example.com › page-url'}</SerpUrl>
          <SerpTitle>
            {title && title.length > 0 ? (
              <>
                {truncate(title, Math.max(1, 60 - (titleSuffix ? titleSuffix.length + 2 : 0)))}
                {titleSuffix && (
                  <span
                    style={
                      titleSuffixInheritColor ? undefined : {color: '#70757a', fontWeight: 400}
                    }
                  >
                    | {titleSuffix}
                  </span>
                )}
              </>
            ) : (
              'Your SEO Title will appear here'
            )}
          </SerpTitle>
          <SerpDescription>
            {description && description.length > 0
              ? truncate(description, 160)
              : 'Your meta description will show up here. Make it compelling!'}
          </SerpDescription>
        </PreviewBody>
      </PreviewContainer>
    </Box>
  )
}

export default SeoPreview
