import type {AiConfig} from '../../plugin'
import {createSeoAiHandler, type SeoAiRequestBody} from '../aiHandler'

export interface FetchAdapterOptions {
  /** Origin allowed to call this endpoint. Only needed when the proxy is deployed on a
   *  different origin than the Studio (same-app routes don't hit CORS at all). */
  cors?: string
}

function corsHeaders(options: FetchAdapterOptions): Record<string, string> {
  return options.cors ? {'Access-Control-Allow-Origin': options.cors} : {}
}

/**
 * Standard `Request -> Response` handler. Works as-is for Next.js App Router route handlers,
 * Cloudflare Workers, Deno, Bun, Remix, and SvelteKit — anything built on the Fetch API.
 */
export function createFetchHandler(
  config: AiConfig,
  options: FetchAdapterOptions = {},
): (request: Request) => Promise<Response> {
  const handle = createSeoAiHandler(config)
  const headers = {'Content-Type': 'application/json', ...corsHeaders(options)}

  return async function seoAiFetchHandler(request: Request): Promise<Response> {
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

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({error: 'Method not allowed'}), {status: 405, headers})
    }

    try {
      const body = (await request.json()) as SeoAiRequestBody
      const result = await handle(body)
      return new Response(JSON.stringify(result), {status: 200, headers})
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI generation failed.'
      return new Response(JSON.stringify({error: message}), {status: 500, headers})
    }
  }
}
