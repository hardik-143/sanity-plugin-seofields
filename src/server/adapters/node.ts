import type {IncomingMessage, ServerResponse} from 'node:http'

import type {AiConfig} from '../../plugin'
import {createSeoAiHandler, type SeoAiRequestBody} from '../aiHandler'

export interface NodeAdapterOptions {
  cors?: string
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

/**
 * Raw Node `http`/`https` request handler.
 *
 * @example
 * import { createServer } from 'node:http'
 * import { createNodeHandler } from 'sanity-plugin-seofields/server'
 * createServer(createNodeHandler({ provider: 'openai', apiKey: process.env.OPENAI_API_KEY })).listen(3000)
 */
export function createNodeHandler(
  config: AiConfig,
  options: NodeAdapterOptions = {},
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  const handle = createSeoAiHandler(config)

  return async function seoAiNodeHandler(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (options.cors) res.setHeader('Access-Control-Allow-Origin', options.cors)
    res.setHeader('Content-Type', 'application/json')

    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }

    if (req.method !== 'POST') {
      res.writeHead(405)
      res.end(JSON.stringify({error: 'Method not allowed'}))
      return
    }

    try {
      const body = (await readJsonBody(req)) as SeoAiRequestBody
      const result = await handle(body)
      res.writeHead(200)
      res.end(JSON.stringify(result))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI generation failed.'
      res.writeHead(500)
      res.end(JSON.stringify({error: message}))
    }
  }
}
