/**
 * Server-side AI proxy helpers — run these behind your own backend so the AI provider API key
 * never reaches the Studio's client-side bundle. Pair with `endpoint` in the plugin's `ai` config.
 *
 * @example
 * // app/api/seo-ai/route.ts (Next.js App Router)
 * import { createNextRouteHandler } from 'sanity-plugin-seofields/server'
 * export const { POST, OPTIONS } = createNextRouteHandler({
 *   provider: 'openai',
 *   apiKey: process.env.OPENAI_API_KEY,
 * })
 *
 * // sanity.config.ts
 * seoFields({ ai: { endpoint: '/api/seo-ai' } })
 */
export type {
  ExpressAdapterOptions,
  MinimalRequest,
  MinimalResponse,
} from './server/adapters/express'
export {createExpressHandler} from './server/adapters/express'
export type {FetchAdapterOptions} from './server/adapters/fetch'
export {createFetchHandler} from './server/adapters/fetch'
export {createNextRouteHandler} from './server/adapters/nextjs'
export type {NodeAdapterOptions} from './server/adapters/node'
export {createNodeHandler} from './server/adapters/node'
export type {SeoAiHandler, SeoAiRequestBody} from './server/aiHandler'
export {createSeoAiHandler} from './server/aiHandler'

/**
 * Server-side broken-link checker — pair with `linkChecker.endpoint` in the plugin config.
 *
 * @example
 * // app/api/seo-links/route.ts (Next.js App Router)
 * import { createLinkCheckNextRouteHandler } from 'sanity-plugin-seofields/server'
 * export const { POST, OPTIONS } = createLinkCheckNextRouteHandler()
 *
 * // sanity.config.ts
 * seoFields({ linkChecker: { endpoint: 'https://example.com/api/seo-links' } })
 */
export type {
  LinkCheckFetchAdapterOptions,
  SeoLinkCheckHandler,
  SeoLinkCheckHandlerConfig,
  SeoLinkCheckRequestBody,
  SeoLinkCheckResponse,
} from './server/linkCheckHandler'
export {
  createLinkCheckFetchHandler,
  createLinkCheckNextRouteHandler,
  createSeoLinkCheckHandler,
  LinkCheckRequestError,
} from './server/linkCheckHandler'
export type {PublicUrlOptions, ResolveHostFn} from './server/ssrf'
export {assertPublicUrl, isPrivateAddress} from './server/ssrf'
export type {CheckUrlOptions, CheckUrlsOptions, LinkStatus, UrlCheckResult} from './utils/linkCheck'
export {BlockedUrlError, checkUrl, checkUrls} from './utils/linkCheck'
