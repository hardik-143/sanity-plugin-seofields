/**
 * Link checking primitives shared by the Studio panel, the CLI (`seofields links`) and the
 * server-side link-check handler.
 *
 * External URL checks are meant to run **server-side** (CLI or your own endpoint): browsers block
 * cross-origin requests that don't opt in via CORS, so a Studio cannot reliably check them itself.
 */

export type LinkStatus =
  /** 2xx, or a redirect chain that ends in 2xx. */
  | 'ok'
  /** 404/410/other 4xx, or 5xx. */
  | 'broken'
  /** 401/403/429/999 and similar — reachable but blocking automated checks; verify by hand. */
  | 'warning'
  /** Network failure, DNS failure or timeout. */
  | 'error'
  /** Not requested (blocked by the URL guard, or not an http(s) URL). */
  | 'skipped'

export interface UrlCheckResult {
  url: string
  status: LinkStatus
  /** Final HTTP status code, when a response was received. */
  httpStatus?: number
  /** URL after following redirects (only set when it differs from `url`). */
  finalUrl?: string
  redirects: number
  /** Method that produced the final result. */
  method?: 'HEAD' | 'GET'
  message?: string
}

export interface CheckUrlOptions {
  /** Per-request timeout in ms. Default 8000. */
  timeoutMs?: number
  /** Maximum redirects to follow. Default 5. */
  maxRedirects?: number
  /** `fetch` implementation. Defaults to the global `fetch`. */
  fetchImpl?: typeof fetch
  /** User-Agent header. Default `sanity-plugin-seofields-link-checker`. */
  userAgent?: string
  /**
   * Called before every request, including each redirect hop. Throw a `BlockedUrlError` to skip the
   * URL (e.g. an SSRF guard); any other error is reported as `status: 'error'`.
   */
  validateUrl?: (url: URL) => void | Promise<void>
}

export interface CheckUrlsOptions extends CheckUrlOptions {
  /** Maximum number of requests in flight. Default 5. */
  concurrency?: number
}

/** Thrown by a `validateUrl` hook to mark a URL as not allowed (it is reported as `skipped`). */
export class BlockedUrlError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BlockedUrlError'
  }
}

const DEFAULT_USER_AGENT = 'sanity-plugin-seofields-link-checker'

/** Map an HTTP status code to a link status. */
export function classifyHttpStatus(code: number): LinkStatus {
  if (code >= 200 && code < 300) return 'ok'
  if (code >= 300 && code < 400) return 'warning'
  if (code === 401 || code === 403 || code === 429 || code === 999) return 'warning'
  return 'broken'
}

function statusMessage(code: number): string | undefined {
  if (code === 401 || code === 403) return 'Access denied to automated requests — check manually'
  if (code === 429) return 'Rate limited — check again later'
  if (code === 999) return 'Site blocks automated requests — check manually'
  if (code === 404) return 'Not found'
  if (code === 410) return 'Gone'
  if (code >= 500) return 'Server error'
  if (code >= 300 && code < 400) return 'Redirect without a Location header'
  return undefined
}

/** Run `fn` over `items` with at most `limit` concurrent calls, preserving order. */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  const workers = Array.from({length: Math.max(1, Math.min(limit, items.length))}, async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index], index)
    }
  })
  await Promise.all(workers)
  return results
}

async function request(
  url: URL,
  method: 'HEAD' | 'GET',
  options: Required<Pick<CheckUrlOptions, 'timeoutMs' | 'userAgent'>> & {fetchImpl: typeof fetch},
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), options.timeoutMs)
  try {
    const res = await options.fetchImpl(url.href, {
      method,
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        'User-Agent': options.userAgent,
        Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
      },
    })
    // We only need the status — don't download bodies.
    try {
      await res.body?.cancel()
    } catch {
      // ignore
    }
    return res
  } finally {
    clearTimeout(timer)
  }
}

function errorMessage(err: unknown, timeoutMs: number): string {
  if (err instanceof Error && err.name === 'AbortError') return `Timed out after ${timeoutMs}ms`
  const e = err as {code?: string; cause?: {code?: string}} | undefined
  const code = e?.code ?? e?.cause?.code
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') return 'Host not found'
  if (code === 'ECONNREFUSED') return 'Connection refused'
  if (code === 'ECONNRESET') return 'Connection reset'
  if (code === 'CERT_HAS_EXPIRED' || code?.startsWith('ERR_TLS')) return `TLS error (${code})`
  return err instanceof Error ? err.message : String(err)
}

/**
 * Check a single URL: HEAD first, falling back to GET when HEAD fails or returns an error status
 * (many servers mishandle HEAD). Redirects are followed manually so `validateUrl` sees every hop.
 */
export async function checkUrl(
  rawUrl: string,
  options: CheckUrlOptions = {},
): Promise<UrlCheckResult> {
  const timeoutMs = options.timeoutMs ?? 8000
  const maxRedirects = options.maxRedirects ?? 5
  const userAgent = options.userAgent ?? DEFAULT_USER_AGENT
  const fetchImpl = options.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined)
  if (!fetchImpl) {
    return {url: rawUrl, status: 'error', redirects: 0, message: 'No fetch implementation'}
  }

  let current: URL
  try {
    current = new URL(rawUrl)
  } catch {
    return {url: rawUrl, status: 'broken', redirects: 0, message: 'Malformed URL'}
  }
  if (current.protocol !== 'http:' && current.protocol !== 'https:') {
    return {url: rawUrl, status: 'skipped', redirects: 0, message: 'Only http(s) URLs are checked'}
  }

  let method: 'HEAD' | 'GET' = 'HEAD'
  let redirects = 0
  const finish = (r: Omit<UrlCheckResult, 'url' | 'redirects'>): UrlCheckResult => ({
    url: rawUrl,
    redirects,
    ...(current.href === new URL(rawUrl).href ? {} : {finalUrl: current.href}),
    ...r,
  })

  for (;;) {
    try {
      if (options.validateUrl) await options.validateUrl(current)
    } catch (err) {
      if (err instanceof BlockedUrlError || (err as Error)?.name === 'BlockedUrlError') {
        return finish({status: 'skipped', message: (err as Error).message})
      }
      return finish({status: 'error', message: errorMessage(err, timeoutMs)})
    }

    let res: Response
    try {
      res = await request(current, method, {timeoutMs, userAgent, fetchImpl})
    } catch (err) {
      // Retry with GET unless HEAD simply timed out (GET would very likely time out too).
      if (method === 'HEAD' && !(err instanceof Error && err.name === 'AbortError')) {
        method = 'GET'
        continue
      }
      return finish({status: 'error', method, message: errorMessage(err, timeoutMs)})
    }

    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      if (redirects >= maxRedirects) {
        return finish({
          status: 'warning',
          httpStatus: res.status,
          method,
          message: `More than ${maxRedirects} redirects`,
        })
      }
      try {
        current = new URL(location, current)
      } catch {
        return finish({status: 'broken', httpStatus: res.status, method, message: 'Bad redirect'})
      }
      if (current.protocol !== 'http:' && current.protocol !== 'https:') {
        return finish({status: 'skipped', method, message: 'Redirects to a non-http(s) URL'})
      }
      redirects++
      continue
    }

    if (method === 'HEAD' && res.status >= 400) {
      method = 'GET'
      continue
    }

    const status = classifyHttpStatus(res.status)
    const message = statusMessage(res.status)
    return finish({status, httpStatus: res.status, method, ...(message ? {message} : {})})
  }
}

/** Check many URLs with a concurrency limit. Duplicate URLs are only requested once. */
export async function checkUrls(
  urls: readonly string[],
  options: CheckUrlsOptions = {},
): Promise<UrlCheckResult[]> {
  const unique = Array.from(new Set(urls))
  const results = await mapWithConcurrency(unique, options.concurrency ?? 5, (url) =>
    checkUrl(url, options),
  )
  const byUrl = new Map(results.map((r) => [r.url, r]))
  return urls.map((u) => byUrl.get(u) as UrlCheckResult)
}

export type ReferenceStatus =
  /** A published document with this ID exists. */
  | 'ok'
  /** Only a draft exists — the link will be dead on the published site. */
  | 'unpublished'
  /** No document (draft or published) with this ID. */
  | 'missing'

/**
 * Runs a GROQ query and returns the matching IDs. Use a client with the `raw` perspective
 * (and a token) so drafts are visible, e.g.
 * `(query, params) => client.fetch(query, params, {perspective: 'raw'})`.
 */
export type IdQueryFn = (query: string, params: {ids: string[]}) => Promise<string[]>

export const REFERENCE_QUERY = '*[_id in $ids]._id'

/** Check which referenced document IDs exist as published documents, drafts only, or not at all. */
export async function checkReferences(
  ids: readonly string[],
  queryIds: IdQueryFn,
  chunkSize = 100,
): Promise<Map<string, ReferenceStatus>> {
  const unique = Array.from(new Set(ids.filter(Boolean)))
  const found = new Set<string>()
  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize)
    const withDrafts = chunk.flatMap((id) => [id, `drafts.${id}`])
    const existing = await queryIds(REFERENCE_QUERY, {ids: withDrafts})
    for (const id of existing ?? []) found.add(id)
  }
  const result = new Map<string, ReferenceStatus>()
  for (const id of unique) {
    if (found.has(id)) result.set(id, 'ok')
    else if (found.has(`drafts.${id}`)) result.set(id, 'unpublished')
    else result.set(id, 'missing')
  }
  return result
}
