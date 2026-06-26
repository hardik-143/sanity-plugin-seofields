import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {type JSX, useEffect, useMemo, useState} from 'react'
import type {InputProps} from 'sanity'
import {useClient, useColorScheme, useFormValue} from 'sanity'

import {tokenizeJson} from '../../utils/syntaxHighlight'
import {buildSchemaOrgJsonLd, buildSchemaOrgJsonLds} from '../SchemaOrgScripts'

type DocumentRecord = {_id?: string; _type?: string; title?: string} & Record<string, unknown>

type DocumentViewDocument =
  | DocumentRecord
  | {
      displayed?: DocumentRecord | null
      draft?: DocumentRecord | null
      published?: DocumentRecord | null
    }
  | null

interface ExistingSlug {
  _id: string
  _type?: string
  title?: string
  slug?: string
}

export interface SchemaOrgJsonLdPreviewOptions {
  /**
   * The base site URL used with the document slug to show a resolved page URL.
   * Defaults to `https://www.example.com`.
   */
  baseUrl?: string
  /**
   * Document field used for the slug. Supports dot paths such as `seo.slug`.
   * Defaults to `slug`.
   */
  slugField?: string
  /**
   * Combined Schema.org field on the document. Defaults to `schemaOrg`.
   */
  schemaOrgField?: string
  /**
   * Optional path segment placed before the document slug, e.g. `blog`.
   * Can be a function of the current document.
   */
  pathPrefix?: string | ((document: DocumentRecord) => string)
  /**
   * Full override for building the resolved document URL.
   */
  urlBuilder?: (document: DocumentRecord) => string
  /**
   * API version for the slug-list query.
   */
  apiVersion?: string
  /**
   * Custom GROQ query for the slug list. Should return `_id`, optional `title`,
   * and `slug` as a string.
   */
  slugQuery?: string
  /**
   * Show existing slugs for the same document type.
   * Defaults to `true` for document previews and `false` for field input previews.
   */
  showSlugList?: boolean
  /**
   * Max number of existing slugs to fetch. Defaults to `25`.
   */
  maxSlugItems?: number
  /**
   * Title field used in the slug list. Defaults to `title`.
   */
  titleField?: string
}

export interface SchemaOrgJsonLdPreviewProps extends SchemaOrgJsonLdPreviewOptions {
  /** Schema.org value to preview. Uses `document[schemaOrgField]` when omitted. */
  value?: Record<string, unknown> | Array<Record<string, unknown>> | null
  /** Current Sanity document or document-view `document` prop. */
  document?: DocumentViewDocument
  /** Optional document id from a Sanity document-node component view. */
  documentId?: string
  /** Optional schema type from a Sanity document-node component view. */
  schemaType?: string
  /** Fallback Schema.org type name for individual object inputs. */
  schemaTypeName?: string
  /** Internal flag used by field input previews. */
  fieldPreview?: boolean
}

function normalizeDocument(document?: DocumentViewDocument): DocumentRecord {
  if (!document) return {} as DocumentRecord
  if ('displayed' in document || 'draft' in document || 'published' in document) {
    const viewDocument = document as {
      displayed?: DocumentRecord | null
      draft?: DocumentRecord | null
      published?: DocumentRecord | null
    }
    const resolved = viewDocument.displayed ?? viewDocument.draft ?? viewDocument.published
    if (resolved) return resolved
    return {} as DocumentRecord
  }
  return document
}

function getPathValue(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, part) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[part]
  }, source)
}

function resolveSlug(document: DocumentRecord, slugField: string): string {
  const raw = getPathValue(document, slugField)
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object' && 'current' in raw) {
    const current = (raw as {current?: unknown}).current
    return typeof current === 'string' ? current : ''
  }
  return ''
}

function normalizePathSegment(value: string): string {
  return value.replace(/^\/+|\/+$/g, '')
}

function resolveDocumentUrl(
  document: DocumentRecord,
  options: Pick<
    SchemaOrgJsonLdPreviewOptions,
    'baseUrl' | 'slugField' | 'pathPrefix' | 'urlBuilder'
  >,
): string {
  if (options.urlBuilder) return options.urlBuilder(document)

  const baseUrl = (options.baseUrl || 'https://www.example.com').replace(/\/+$/, '')
  const slug = normalizePathSegment(resolveSlug(document, options.slugField || 'slug'))
  const prefix =
    typeof options.pathPrefix === 'function'
      ? options.pathPrefix(document)
      : options.pathPrefix || ''
  const prefixSegment = normalizePathSegment(prefix)
  const path = [prefixSegment, slug].filter(Boolean).join('/')

  return path ? `${baseUrl}/${path}` : baseUrl
}

function isSafeGroqPath(path: string): boolean {
  return /^[A-Za-z0-9_.]+$/.test(path)
}

function buildDefaultSlugQuery(slugField: string, titleField: string): string | null {
  if (!isSafeGroqPath(slugField) || !isSafeGroqPath(titleField)) return null
  const slugExpression = slugField.endsWith('.current') ? slugField : `${slugField}.current`
  return `*[_type == $type && defined(${slugExpression}) && !(_id in path("drafts.**"))] | order(${slugExpression} asc)[0...$limit]{
    _id,
    _type,
    "title": ${titleField},
    "slug": ${slugExpression}
  }`
}

function normalizeSchemaOrgValue(
  value: SchemaOrgJsonLdPreviewProps['value'],
  document: DocumentRecord,
  schemaOrgField: string,
  schemaTypeName?: string,
): Array<Record<string, unknown>> {
  const raw = value ?? getPathValue(document, schemaOrgField)
  if (Array.isArray(raw)) {
    return raw.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
  }
  if (raw && typeof raw === 'object') {
    const item = raw as Record<string, unknown>
    return [{...(schemaTypeName && !item._type ? {_type: schemaTypeName} : {}), ...item}]
  }
  return []
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function JsonLdCodeBlock({
  jsonLdItems,
  fieldPreview,
  scheme,
}: {
  jsonLdItems: Record<string, unknown>[]
  fieldPreview: boolean
  scheme: 'light' | 'dark'
}): JSX.Element {
  const isDark = scheme === 'dark'
  const codeBg = isDark ? '#161b22' : '#f6f8fa'
  const codeBorder = isDark ? '#30363d' : '#d0d7de'
  const headerBg = isDark ? '#21262d' : '#f0f2f4'
  const headerBorder = isDark ? '#30363d' : '#d0d7de'
  const headerText = isDark ? '#e6edf3' : '#24292f'

  const [copyLabel, setCopyLabel] = useState('Copy')

  const raw = formatJson(jsonLdItems.length === 1 ? jsonLdItems[0] : jsonLdItems)
  const tokens = useMemo(() => tokenizeJson(raw, scheme), [raw, scheme])

  const handleCopy = () => {
    navigator.clipboard.writeText(raw).then(() => {
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy'), 2000)
    })
  }

  if (!jsonLdItems.length) {
    return (
      <Card border radius={2} padding={0} style={{overflow: 'hidden'}}>
        <Box padding={3}>
          <Text size={1} muted>
            Fill the required Schema.org fields to generate JSON-LD.
          </Text>
        </Box>
      </Card>
    )
  }

  return (
    <div style={{borderRadius: 6, border: `1px solid ${codeBorder}`, overflow: 'hidden'}}>
      {/* Header bar */}
      <div
        style={{
          background: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isDark ? '#388bfd' : '#0550ae',
              display: 'inline-block',
            }}
          />
          <span style={{fontSize: 11, color: headerText, fontFamily: 'monospace'}}>JSON-LD</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: 'none',
            border: `1px solid ${headerBorder}`,
            borderRadius: 4,
            padding: '2px 8px',
            cursor: 'pointer',
            fontSize: 11,
            color: headerText,
          }}
        >
          {copyLabel}
        </button>
      </div>

      {/* Highlighted JSON */}
      <Box
        as="pre"
        padding={3}
        style={{
          margin: 0,
          maxHeight: fieldPreview ? 360 : 520,
          overflow: 'auto',
          fontSize: 12,
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          lineHeight: 1.6,
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
  )
}

export function SchemaOrgJsonLdPreview({
  value,
  document,
  documentId,
  schemaType,
  schemaTypeName,
  fieldPreview = false,
  baseUrl,
  slugField = 'slug',
  schemaOrgField = 'schemaOrg',
  pathPrefix,
  urlBuilder,
  apiVersion = '2024-01-01',
  slugQuery,
  showSlugList,
  maxSlugItems = 25,
  titleField = 'title',
}: SchemaOrgJsonLdPreviewProps): JSX.Element {
  const {scheme} = useColorScheme()
  const client = useClient({apiVersion})
  const initialDocument = useMemo(() => normalizeDocument(document), [document])
  const [fetchedDocument, setFetchedDocument] = useState<DocumentRecord | null>(null)
  const [existingSlugs, setExistingSlugs] = useState<ExistingSlug[]>([])
  const [slugListError, setSlugListError] = useState<string>('')

  useEffect(() => {
    if (initialDocument._id || !documentId) {
      setFetchedDocument(null)
      return
    }

    client
      .fetch<DocumentRecord | null>(`*[_id == $id][0]`, {id: documentId})
      .then((result) => setFetchedDocument(result))
      .catch(() => setFetchedDocument(null))
  }, [client, documentId, initialDocument._id])

  const currentDocument = useMemo(
    () =>
      ({
        ...(fetchedDocument ?? initialDocument),
        ...(schemaType && !(fetchedDocument ?? initialDocument)._type ? {_type: schemaType} : {}),
      }) as DocumentRecord,
    [fetchedDocument, initialDocument, schemaType],
  )

  const resolvedUrl = useMemo(
    () => resolveDocumentUrl(currentDocument, {baseUrl, slugField, pathPrefix, urlBuilder}),
    [currentDocument, baseUrl, slugField, pathPrefix, urlBuilder],
  )

  const items = useMemo(
    () => normalizeSchemaOrgValue(value, currentDocument, schemaOrgField, schemaTypeName),
    [value, currentDocument, schemaOrgField, schemaTypeName],
  )

  const jsonLdItems = useMemo(() => {
    if (Array.isArray(value ?? getPathValue(currentDocument, schemaOrgField))) {
      return buildSchemaOrgJsonLds(items)
    }
    return items
      .map((item) => buildSchemaOrgJsonLd(item))
      .filter((jsonLd): jsonLd is Record<string, unknown> => jsonLd !== null)
  }, [currentDocument, items, schemaOrgField, value])

  const shouldShowSlugList = showSlugList ?? !fieldPreview
  const documentType = currentDocument._type

  useEffect(() => {
    if (!shouldShowSlugList || !documentType) {
      setExistingSlugs([])
      setSlugListError('')
      return
    }

    const query = slugQuery ?? buildDefaultSlugQuery(slugField, titleField)
    if (!query) {
      setExistingSlugs([])
      setSlugListError('Slug list disabled because slugField/titleField is not a safe GROQ path.')
      return
    }

    client
      .fetch<ExistingSlug[]>(query, {type: documentType, limit: maxSlugItems})
      .then((result) => {
        setExistingSlugs(Array.isArray(result) ? result : [])
        setSlugListError('')
      })
      .catch(() => {
        setExistingSlugs([])
        setSlugListError('Could not fetch existing slugs.')
      })
  }, [client, documentType, maxSlugItems, shouldShowSlugList, slugField, slugQuery, titleField])

  return (
    <Card border radius={2} padding={3} tone="transparent">
      <Stack space={3}>
        <Flex align="center" justify="space-between" gap={3}>
          <Text size={1} weight="semibold">
            Live JSON-LD Preview
          </Text>
          <Text size={0} muted>
            {jsonLdItems.length
              ? `${jsonLdItems.length} item${jsonLdItems.length > 1 ? 's' : ''}`
              : 'No output'}
          </Text>
        </Flex>

        <Card border radius={2} padding={3}>
          <Stack space={2}>
            <Text size={0} muted>
              Resolved document URL
            </Text>
            <Text size={1} style={{wordBreak: 'break-word'}}>
              {resolvedUrl}
            </Text>
          </Stack>
        </Card>

        <JsonLdCodeBlock jsonLdItems={jsonLdItems} fieldPreview={fieldPreview} scheme={scheme} />

        {shouldShowSlugList && (
          <Card border radius={2} padding={3}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Existing slugs{documentType ? ` for ${documentType}` : ''}
              </Text>
              {slugListError && (
                <Text size={1} muted>
                  {slugListError}
                </Text>
              )}
              {!slugListError && existingSlugs.length > 0 && (
                <Stack space={2}>
                  {existingSlugs.map((item) => (
                    <Flex key={item._id} align="center" justify="space-between" gap={3}>
                      <Text size={1} style={{minWidth: 0}}>
                        {item.title || item.slug || item._id}
                      </Text>
                      <Text size={0} muted style={{wordBreak: 'break-word', textAlign: 'right'}}>
                        {item.slug}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              )}
              {!slugListError && existingSlugs.length === 0 && (
                <Text size={1} muted>
                  No existing slugs found.
                </Text>
              )}
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  )
}

export function SchemaOrgJsonLdPreviewInput(props: InputProps): JSX.Element {
  const {renderDefault, schemaType} = props
  const rootDocument = (useFormValue([]) as DocumentRecord | null) ?? {}
  const options = (
    schemaType as {options?: {schemaOrgJsonLdPreview?: SchemaOrgJsonLdPreviewOptions}}
  ).options?.schemaOrgJsonLdPreview
  const value = (props as {value?: Record<string, unknown> | Array<Record<string, unknown>>}).value

  return (
    <Stack space={3}>
      <SchemaOrgJsonLdPreview
        {...options}
        value={value ?? null}
        document={rootDocument}
        schemaTypeName={(schemaType as {name?: string}).name}
        fieldPreview
      />
      {renderDefault(props)}
    </Stack>
  )
}

export default SchemaOrgJsonLdPreview
