import type {AiConfig, AiIndustry} from '../plugin'
import {generateSeoText} from '../utils/seoContentGen'
import type {MetaContext, SeoGenField} from '../utils/seoPrompts'

export interface SeoAiRequestBody {
  field: SeoGenField
  content: string
  focusKeyword?: string
  keywords?: string[]
  meta?: MetaContext
  /** Industry chosen in the Studio's `ai.industry` config — forwarded so proxy mode matches direct-provider mode. */
  industry?: AiIndustry
  /** License key forwarded from the Studio's `ai._licenseKey` — determines which prompt pool proxy mode uses. */
  licenseKey?: string
}

export interface SeoAiHandler {
  (body: SeoAiRequestBody): Promise<{result: string}>
}

function isValidBody(body: unknown): body is SeoAiRequestBody {
  if (!body || typeof body !== 'object') return false
  const {field, content} = body as Record<string, unknown>
  return typeof field === 'string' && typeof content === 'string'
}

/**
 * Runs the full SEO text generation pipeline (prompting, retries, validation) server-side using
 * a real `AiConfig` — including `apiKey` — which never has to be sent to the browser. Pair with
 * `endpoint` in the Studio's `ai` config, and one of the framework adapters in
 * `sanity-plugin-seofields/server` to expose it over HTTP.
 *
 * NOTE: `customPrompt` / `customPrompts` are functions and cannot cross the HTTP boundary, so in
 * proxy mode they must be set on THIS server config (the `AiConfig` passed here), not on the Studio's
 * `ai` config. They apply automatically since this handler runs `generateSeoText` with `config`.
 */
export function createSeoAiHandler(config: AiConfig): SeoAiHandler {
  return async function handleSeoAiRequest(body: SeoAiRequestBody): Promise<{result: string}> {
    if (!isValidBody(body)) {
      throw new Error('Invalid request body: "field" and "content" are required.')
    }

    const {field, content, focusKeyword = '', keywords = [], meta, industry, licenseKey} = body
    const mergedConfig: AiConfig = {
      ...config,
      industry: industry ?? config.industry,
      _licenseKey: licenseKey ?? config._licenseKey,
    }
    const result = await generateSeoText(field, content, focusKeyword, keywords, {
      config: mergedConfig,
      meta,
    })
    return {result}
  }
}
