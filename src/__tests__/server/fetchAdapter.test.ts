/**
 * @jest-environment node
 */
import {createFetchHandler} from '../../server/adapters/fetch'

describe('createFetchHandler', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({choices: [{message: {content: 'Generated title'}}]}),
    })) as jest.Mock
  })

  it('returns { result } for a valid POST request', async () => {
    const handler = createFetchHandler({provider: 'openai', apiKey: 'server-key'})
    const request = new Request('https://example.com/api/seo-ai', {
      method: 'POST',
      body: JSON.stringify({field: 'title', content: 'Page content', focusKeyword: 'kw'}),
    })

    const response = await handler(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({result: 'Generated title'})
  })

  it('rejects non-POST methods with 405', async () => {
    const handler = createFetchHandler({provider: 'openai', apiKey: 'server-key'})
    const response = await handler(new Request('https://example.com/api/seo-ai', {method: 'GET'}))
    expect(response.status).toBe(405)
  })

  it('handles OPTIONS preflight with CORS headers when configured', async () => {
    const handler = createFetchHandler(
      {provider: 'openai', apiKey: 'server-key'},
      {cors: 'https://studio.example.com'},
    )
    const response = await handler(
      new Request('https://example.com/api/seo-ai', {method: 'OPTIONS'}),
    )

    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://studio.example.com')
  })

  it('maps thrown errors to a 500 with an error message', async () => {
    const handler = createFetchHandler({provider: 'openai', apiKey: 'server-key'})
    const request = new Request('https://example.com/api/seo-ai', {
      method: 'POST',
      body: JSON.stringify({content: 'missing field'}),
    })

    const response = await handler(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toMatch(/Invalid request body/)
  })
})
