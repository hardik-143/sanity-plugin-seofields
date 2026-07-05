import type {AiConfig} from '../../plugin'
import {createSeoAiHandler, type SeoAiRequestBody} from '../aiHandler'

// Duck-typed instead of importing `express` types, so the package has no dependency on Express.
export interface MinimalRequest {
  method?: string
  body?: unknown
}

export interface MinimalResponse {
  status(code: number): MinimalResponse
  json(body: unknown): void
  setHeader(name: string, value: string): void
  end(): void
}

export interface ExpressAdapterOptions {
  cors?: string
}

/**
 * Express (or Express-compatible) request handler. Requires a JSON body parser
 * (e.g. `app.use(express.json())`) mounted before this route.
 *
 * @example
 * import { createExpressHandler } from 'sanity-plugin-seofields/server'
 * app.post('/api/seo-ai', createExpressHandler({ provider: 'openai', apiKey: process.env.OPENAI_API_KEY }))
 */
export function createExpressHandler(
  config: AiConfig,
  options: ExpressAdapterOptions = {},
): (req: MinimalRequest, res: MinimalResponse) => Promise<void> {
  const handle = createSeoAiHandler(config)

  return async function seoAiExpressHandler(
    req: MinimalRequest,
    res: MinimalResponse,
  ): Promise<void> {
    if (options.cors) res.setHeader('Access-Control-Allow-Origin', options.cors)

    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }

    if (req.method !== 'POST') {
      res.status(405).json({error: 'Method not allowed'})
      return
    }

    try {
      const result = await handle(req.body as SeoAiRequestBody)
      res.status(200).json(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI generation failed.'
      res.status(500).json({error: message})
    }
  }
}
