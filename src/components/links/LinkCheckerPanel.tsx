import {Badge, Box, Button, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {
  type ReactElement,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {type StringInputProps, useClient, useFormValue} from 'sanity'

import type {LinkCheckerConfig} from '../../plugin'
import {checkReferences, type ReferenceStatus, type UrlCheckResult} from '../../utils/linkCheck'
import {extractDocumentLinks, type ExtractedLink} from '../../utils/links'

type RowStatus = 'ok' | 'broken' | 'warning' | 'unchecked' | 'error'

interface Row {
  link: ExtractedLink
  status: RowStatus
  message: string
}

interface CheckState {
  signature: string
  refs: Map<string, ReferenceStatus>
  urls: Map<string, UrlCheckResult>
  endpointError?: string
}

const TONE: Record<RowStatus, 'positive' | 'caution' | 'critical' | 'default'> = {
  ok: 'positive',
  broken: 'critical',
  error: 'critical',
  warning: 'caution',
  unchecked: 'default',
}

const BATCH_SIZE = 50

function describe(link: ExtractedLink): string {
  if (link.kind === 'internal') return `Reference → ${link.refId}`
  return link.href ?? ''
}

function rowFor(link: ExtractedLink, state: CheckState | null, hasEndpoint: boolean): Row | null {
  switch (link.kind) {
    case 'anchor':
    case 'mailto':
    case 'tel':
      return null
    case 'invalid':
      return {link, status: 'broken', message: 'Malformed URL'}
    case 'unsupported':
      return {link, status: 'warning', message: 'Unsupported URL scheme'}
    case 'internal': {
      const status = state?.refs.get(link.refId ?? '')
      if (!status) return {link, status: 'unchecked', message: 'Not checked yet'}
      if (status === 'ok') return {link, status: 'ok', message: 'Published document'}
      if (status === 'unpublished') {
        return {link, status: 'warning', message: 'Referenced document is not published'}
      }
      return {
        link,
        status: link.weak ? 'warning' : 'broken',
        message: 'Referenced document does not exist',
      }
    }
    default: {
      if (!link.url) {
        return {
          link,
          status: 'unchecked',
          message: 'Relative link — set `linkChecker.baseUrl` (or root `baseUrl`) to check it',
        }
      }
      const result = state?.urls.get(link.url)
      if (!result) {
        return {
          link,
          status: 'unchecked',
          message: hasEndpoint
            ? 'Not checked yet'
            : 'External links need a server-side check: set `linkChecker.endpoint` or run `npx seofields links`',
        }
      }
      const code = result.httpStatus ? `HTTP ${result.httpStatus}` : ''
      const message = [code, result.message].filter(Boolean).join(' — ') || 'OK'
      if (result.status === 'ok') return {link, status: 'ok', message}
      if (result.status === 'skipped') return {link, status: 'unchecked', message}
      return {link, status: result.status, message}
    }
  }
}

async function checkViaEndpoint(
  endpoint: string,
  urls: string[],
): Promise<Map<string, UrlCheckResult>> {
  const map = new Map<string, UrlCheckResult>()
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({urls: urls.slice(i, i + BATCH_SIZE)}),
    })
    const data = (await res.json().catch(() => ({}))) as {
      results?: UrlCheckResult[]
      error?: string
    }
    if (!res.ok || !Array.isArray(data.results)) {
      throw new Error(data.error || `Link check endpoint responded with HTTP ${res.status}`)
    }
    for (const r of data.results) map.set(r.url, r)
  }
  return map
}

function LinkRow({row}: {row: Row}): ReactElement {
  const {link} = row
  return (
    <Card padding={3} radius={2} tone={TONE[row.status]}>
      <Stack space={2}>
        <Flex gap={2} align="center">
          <Badge tone={TONE[row.status]} fontSize={0}>
            {row.status}
          </Badge>
          <Box flex={1} style={{minWidth: 0}}>
            <Text size={1} weight="medium" textOverflow="ellipsis">
              {describe(link)}
            </Text>
          </Box>
        </Flex>
        <Text size={1} muted>
          {row.message}
        </Text>
        <Text size={0} muted>
          {link.label ? `“${link.label}” · ` : ''}
          <code>{link.path}</code>
        </Text>
      </Stack>
    </Card>
  )
}

const LinkCheckerPanel = (props: StringInputProps): ReactElement => {
  const {schemaType} = props
  const options = (schemaType as {options?: {linkChecker?: LinkCheckerConfig; apiVersion?: string}})
    .options
  const config = options?.linkChecker ?? {}
  const endpoint = config.endpoint
  const client = useClient({apiVersion: options?.apiVersion ?? '2024-01-01'})

  const doc = useFormValue([]) as Record<string, unknown> | undefined
  const deferredDoc = useDeferredValue(doc)

  const links = useMemo(
    () =>
      extractDocumentLinks(deferredDoc, {
        baseUrl: config.baseUrl,
        includeReferences: config.checkReferences !== false,
      }),
    [deferredDoc, config.baseUrl, config.checkReferences],
  )

  const refIds = useMemo(
    () => Array.from(new Set(links.flatMap((l) => (l.refId ? [l.refId] : [])))),
    [links],
  )
  const urls = useMemo(
    () => Array.from(new Set(links.flatMap((l) => (l.url ? [l.url] : [])))),
    [links],
  )
  const signature = useMemo(() => JSON.stringify([refIds, urls]), [refIds, urls])

  const [state, setState] = useState<CheckState | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const runCheck = useCallback(async () => {
    setRunning(true)
    setError(null)
    try {
      const refs = refIds.length
        ? await checkReferences(refIds, (query, params) =>
            client.fetch<string[]>(query, params, {perspective: 'raw'}),
          )
        : new Map<string, ReferenceStatus>()

      let urlResults = new Map<string, UrlCheckResult>()
      let endpointError: string | undefined
      if (endpoint && urls.length) {
        try {
          urlResults = await checkViaEndpoint(endpoint, urls)
        } catch (err) {
          endpointError = err instanceof Error ? err.message : String(err)
        }
      }
      if (mounted.current) setState({signature, refs, urls: urlResults, endpointError})
    } catch (err) {
      if (mounted.current) setError(err instanceof Error ? err.message : String(err))
    } finally {
      if (mounted.current) setRunning(false)
    }
  }, [client, endpoint, refIds, signature, urls])

  const handleClick = useCallback(() => {
    runCheck().catch(() => undefined)
  }, [runCheck])

  const rows = useMemo(
    () => links.map((l) => rowFor(l, state, Boolean(endpoint))).filter((r): r is Row => r !== null),
    [links, state, endpoint],
  )

  const counts = rows.reduce<Record<RowStatus, number>>(
    (acc, r) => ({...acc, [r.status]: acc[r.status] + 1}),
    {ok: 0, broken: 0, warning: 0, unchecked: 0, error: 0},
  )
  const problemRows = rows.filter((r) => r.status === 'broken' || r.status === 'error')
  const warningRows = rows.filter((r) => r.status === 'warning')
  const uncheckedRows = rows.filter((r) => r.status === 'unchecked')
  const stale = state !== null && state.signature !== signature
  const internalCount = links.filter((l) => l.kind === 'internal').length

  return (
    <Card radius={2} border overflow="hidden">
      <Box padding={3}>
        <Flex align="center" justify="space-between" gap={3} wrap="wrap">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Link checker
            </Text>
            <Text size={0} muted>
              {rows.length} {rows.length === 1 ? 'link' : 'links'} · {internalCount} document{' '}
              {internalCount === 1 ? 'reference' : 'references'} ·{' '}
              {endpoint ? 'external checks via endpoint' : 'internal references only'}
            </Text>
          </Stack>
          <Button
            text={state ? 'Re-check links' : 'Check links'}
            mode="ghost"
            fontSize={1}
            padding={2}
            disabled={running || rows.length === 0}
            icon={running ? Spinner : undefined}
            onClick={handleClick}
          />
        </Flex>
      </Box>

      {(state || error) && (
        <Card borderTop padding={3} tone="transparent">
          <Stack space={3}>
            {error && (
              <Text size={1} muted>
                Check failed: {error}
              </Text>
            )}
            {state?.endpointError && (
              <Text size={1} muted>
                External check failed: {state.endpointError}
              </Text>
            )}
            {stale && (
              <Text size={1} muted>
                Links changed since the last check — run it again for up-to-date results.
              </Text>
            )}
            <Flex gap={2} wrap="wrap">
              <Badge tone="critical">{counts.broken + counts.error} broken</Badge>
              <Badge tone="caution">{counts.warning} warnings</Badge>
              <Badge tone="positive">{counts.ok} OK</Badge>
              <Badge>{counts.unchecked} not checked</Badge>
            </Flex>
            {problemRows.length + warningRows.length === 0 && counts.ok > 0 && (
              <Text size={1} muted>
                No broken links or references found.
              </Text>
            )}
            {[...problemRows, ...warningRows].map((row) => (
              <LinkRow key={row.link.path} row={row} />
            ))}
            {uncheckedRows.length > 0 && (
              <details>
                <summary style={{cursor: 'pointer'}}>
                  <Text as="span" size={1} muted>
                    {uncheckedRows.length} not checked
                  </Text>
                </summary>
                <Stack space={2} marginTop={2}>
                  {uncheckedRows.map((row) => (
                    <LinkRow key={row.link.path} row={row} />
                  ))}
                </Stack>
              </details>
            )}
          </Stack>
        </Card>
      )}
    </Card>
  )
}

export default LinkCheckerPanel
