import {checkUrls, type UrlCheckResult} from '../utils/linkCheck'
import {assertPublicUrl, type ResolveHostFn} from './ssrf'

export interface SeoLinkCheckHandlerConfig {
  /** Maximum URLs accepted per request. Default 50. */
  maxUrls?: number
  /** Per-request timeout in ms. Default 8000. */
  timeoutMs?: number
  /** Maximum concurrent outbound requests per call. Default 5. */
  concurrency?: number
  /** Maximum redirects followed per URL. Default 5. */
  maxRedirects?: number
  /** User-Agent sent with each check. */
  userAgent?: string
  /** Custom DNS resolver used by the SSRF guard (e.g. DNS-over-HTTPS on edge runtimes). */
  resolveHost?: ResolveHostFn
  /** `fetch` implementation. Defaults to the global `fetch`. */
  fetchImpl?: typeof fetch
}

export interface SeoLinkCheckRequestBody {
  urls: string[]
}

export interface SeoLinkCheckResponse {
  results: UrlCheckResult[]
}

export interface SeoLinkCheckHandler {
  (body: SeoLinkCheckRequestBody): Promise<SeoLinkCheckResponse>
}

/** Error with an HTTP status, raised for invalid request bodies. */
export class LinkCheckRequestError extends Error {
  readonly status: number
  constructor(message: string, status = 400) {
    super(message)
    this.name = 'LinkCheckRequestError'
    this.status = status
  }
}

const MAX_URL_LENGTH = 2048

/**
 * Server-side external link checker — the counterpart of `linkChecker.endpoint` in the Studio.
 * Every URL (and every redirect hop) passes an SSRF guard: only http(s), no credentials, and no
 * private / loopback / link-local / reserved destinations.
 */
export function createSeoLinkCheckHandler(
  config: SeoLinkCheckHandlerConfig = {},
): SeoLinkCheckHandler {
  const maxUrls = config.maxUrls ?? 50

  return async function handleSeoLinkCheck(body): Promise<SeoLinkCheckResponse> {
    const urls = (body as Partial<SeoLinkCheckRequestBody> | null | undefined)?.urls
    if (!Array.isArray(urls) || !urls.every((u) => typeof u === 'string')) {
      throw new LinkCheckRequestError('Invalid request body: "urls" must be an array of strings.')
    }
    if (urls.length > maxUrls) {
      throw new LinkCheckRequestError(`Too many URLs: at most ${maxUrls} per request.`)
    }
    if (urls.some((u) => u.length > MAX_URL_LENGTH)) {
      throw new LinkCheckRequestError(`URLs must be at most ${MAX_URL_LENGTH} characters.`)
    }

    const results = await checkUrls(urls, {
      concurrency: config.concurrency ?? 5,
      timeoutMs: config.timeoutMs,
      maxRedirects: config.maxRedirects,
      userAgent: config.userAgent,
      fetchImpl: config.fetchImpl,
      validateUrl: (url) => assertPublicUrl(url, {resolveHost: config.resolveHost}),
    })
    return {results}
  }
}

export interface LinkCheckFetchAdapterOptions {
  /** Origin allowed to call this endpoint (only needed when the Studio is on another origin). */
  cors?: string
  /**
   * Optional gate run before any work, e.g. check a session cookie or a shared header.
   * Return `false` to respond 401.
   */
  authorize?: (request: Request) => boolean | Promise<boolean>
}

/**
 * Standard `Request -> Response` handler for the link checker. Works with Next.js App Router,
 * Remix, SvelteKit, Bun and Deno. On runtimes without `node:dns` (e.g. Cloudflare Workers) pass
 * `resolveHost` in the config.
 */
export function createLinkCheckFetchHandler(
  config: SeoLinkCheckHandlerConfig = {},
  options: LinkCheckFetchAdapterOptions = {},
): (request: Request) => Promise<Response> {
  const handle = createSeoLinkCheckHandler(config)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.cors ? {'Access-Control-Allow-Origin': options.cors} : {}),
  }
  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {status, headers})

  return async function seoLinkCheckFetchHandler(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...headers,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }
    if (request.method !== 'POST') return json({error: 'Method not allowed'}, 405)

    if (options.authorize && !(await options.authorize(request))) {
      return json({error: 'Unauthorized'}, 401)
    }

    let body: SeoLinkCheckRequestBody
    try {
      body = (await request.json()) as SeoLinkCheckRequestBody
    } catch {
      return json({error: 'Invalid JSON body'}, 400)
    }

    try {
      return json(await handle(body), 200)
    } catch (err) {
      const status = err instanceof LinkCheckRequestError ? err.status : 500
      const message = err instanceof Error ? err.message : 'Link check failed.'
      return json({error: message}, status)
    }
  }
}

/**
 * Next.js App Router route handler for the link checker.
 *
 * @example
 * // app/api/seo-links/route.ts
 * import { createLinkCheckNextRouteHandler } from 'sanity-plugin-seofields/server'
 * export const { POST, OPTIONS } = createLinkCheckNextRouteHandler()
 */
export function createLinkCheckNextRouteHandler(
  config?: SeoLinkCheckHandlerConfig,
  options?: LinkCheckFetchAdapterOptions,
): {
  POST: (request: Request) => Promise<Response>
  OPTIONS: (request: Request) => Promise<Response>
} {
  const handler = createLinkCheckFetchHandler(config, options)
  return {POST: handler, OPTIONS: handler}
}
