import type {AiConfig} from '../../plugin'
import {createFetchHandler, type FetchAdapterOptions} from './fetch'

/**
 * Next.js App Router route handler.
 *
 * @example
 * // app/api/seo-ai/route.ts
 * import { createNextRouteHandler } from 'sanity-plugin-seofields/server'
 *
 * export const { POST, OPTIONS } = createNextRouteHandler({
 *   provider: 'openai',
 *   apiKey: process.env.OPENAI_API_KEY,
 * })
 */
export function createNextRouteHandler(
  config: AiConfig,
  options?: FetchAdapterOptions,
): {
  POST: (request: Request) => Promise<Response>
  OPTIONS: (request: Request) => Promise<Response>
} {
  const handler = createFetchHandler(config, options)
  return {POST: handler, OPTIONS: handler}
}
