import {createExpressHandler, type MinimalResponse} from '../../server/adapters/express'

function mockResponse(): MinimalResponse & {statusCode?: number; body?: unknown} {
  const res: Partial<MinimalResponse> & {statusCode?: number; body?: unknown} = {}
  res.status = jest.fn((code: number) => {
    res.statusCode = code
    return res as MinimalResponse
  })
  res.json = jest.fn((body: unknown) => {
    res.body = body
  })
  res.setHeader = jest.fn()
  res.end = jest.fn()
  return res as MinimalResponse & {statusCode?: number; body?: unknown}
}

describe('createExpressHandler', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({choices: [{message: {content: 'Generated title'}}]}),
    })) as jest.Mock
  })

  it('returns 200 with { result } for a valid request body', async () => {
    const handler = createExpressHandler({provider: 'openai', apiKey: 'server-key'})
    const res = mockResponse()

    await handler({method: 'POST', body: {field: 'title', content: 'Page content'}}, res)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({result: 'Generated title'})
  })

  it('rejects non-POST methods with 405', async () => {
    const handler = createExpressHandler({provider: 'openai', apiKey: 'server-key'})
    const res = mockResponse()

    await handler({method: 'GET'}, res)

    expect(res.statusCode).toBe(405)
  })

  it('sets the CORS header when configured', async () => {
    const handler = createExpressHandler(
      {provider: 'openai', apiKey: 'server-key'},
      {cors: 'https://studio.example.com'},
    )
    const res = mockResponse()

    await handler({method: 'POST', body: {field: 'title', content: 'Page content'}}, res)

    expect(res.setHeader).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'https://studio.example.com',
    )
  })
})
