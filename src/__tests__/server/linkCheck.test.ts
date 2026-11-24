/**
 * @jest-environment node
 */
import {createLinkCheckFetchHandler, createSeoLinkCheckHandler} from '../../server/linkCheckHandler'
import {assertPublicUrl, isPrivateAddress} from '../../server/ssrf'
import {BlockedUrlError, checkUrl, checkUrls, classifyHttpStatus} from '../../utils/linkCheck'

type Route = {status: number; location?: string} | Error
type Routes = Record<string, Route | {HEAD?: Route; GET?: Route}>

/** Fake fetch driven by a URL → response table. Records every call. */
function fakeFetch(routes: Routes) {
  const calls: Array<{url: string; method: string}> = []
  const impl = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? 'GET'
    calls.push({url, method})
    const entry = routes[url]
    const route =
      entry && !(entry instanceof Error) && !('status' in entry)
        ? (entry as {HEAD?: Route; GET?: Route})[method as 'HEAD' | 'GET']
        : (entry as Route | undefined)
    if (!route) return new Response(null, {status: 404})
    if (route instanceof Error) throw route
    const headers = route.location ? {location: route.location} : undefined
    return new Response(null, {status: route.status, headers})
  }) as unknown as typeof fetch
  return {impl, calls}
}

describe('classifyHttpStatus', () => {
  it.each([
    [200, 'ok'],
    [204, 'ok'],
    [301, 'warning'],
    [401, 'warning'],
    [403, 'warning'],
    [429, 'warning'],
    [404, 'broken'],
    [410, 'broken'],
    [500, 'broken'],
    [503, 'broken'],
  ])('%i → %s', (code, status) => {
    expect(classifyHttpStatus(code)).toBe(status)
  })
})

describe('checkUrl', () => {
  it('uses HEAD when it succeeds', async () => {
    const {impl, calls} = fakeFetch({'https://a.test/': {status: 200}})
    const result = await checkUrl('https://a.test/', {fetchImpl: impl})
    expect(result).toEqual({
      url: 'https://a.test/',
      status: 'ok',
      httpStatus: 200,
      redirects: 0,
      method: 'HEAD',
    })
    expect(calls).toEqual([{url: 'https://a.test/', method: 'HEAD'}])
  })

  it('falls back to GET when HEAD returns an error status', async () => {
    const {impl, calls} = fakeFetch({'https://a.test/': {HEAD: {status: 405}, GET: {status: 200}}})
    const result = await checkUrl('https://a.test/', {fetchImpl: impl})
    expect(result.status).toBe('ok')
    expect(result.method).toBe('GET')
    expect(calls.map((c) => c.method)).toEqual(['HEAD', 'GET'])
  })

  it('falls back to GET when HEAD throws', async () => {
    const {impl} = fakeFetch({
      'https://a.test/': {HEAD: new TypeError('socket hang up'), GET: {status: 200}},
    })
    expect((await checkUrl('https://a.test/', {fetchImpl: impl})).status).toBe('ok')
  })

  it('reports 404 as broken after both methods fail', async () => {
    const {impl} = fakeFetch({'https://a.test/missing': {status: 404}})
    const result = await checkUrl('https://a.test/missing', {fetchImpl: impl})
    expect(result).toMatchObject({
      status: 'broken',
      httpStatus: 404,
      method: 'GET',
      message: 'Not found',
    })
  })

  it('follows redirects manually and reports the final URL', async () => {
    const {impl} = fakeFetch({
      'https://a.test/old': {status: 301, location: '/new'},
      'https://a.test/new': {status: 200},
    })
    const result = await checkUrl('https://a.test/old', {fetchImpl: impl})
    expect(result).toMatchObject({status: 'ok', redirects: 1, finalUrl: 'https://a.test/new'})
  })

  it('validates every redirect hop', async () => {
    const {impl, calls} = fakeFetch({
      'https://a.test/': {status: 302, location: 'http://169.254.169.254/latest/meta-data'},
    })
    const validateUrl = jest.fn(async (url: URL) => {
      if (url.hostname === '169.254.169.254') throw new BlockedUrlError('private')
    })
    const result = await checkUrl('https://a.test/', {fetchImpl: impl, validateUrl})
    expect(result).toMatchObject({status: 'skipped', message: 'private'})
    expect(validateUrl).toHaveBeenCalledTimes(2)
    expect(calls).toHaveLength(1)
  })

  it('stops after maxRedirects', async () => {
    const {impl} = fakeFetch({'https://a.test/loop': {status: 302, location: '/loop'}})
    const result = await checkUrl('https://a.test/loop', {fetchImpl: impl, maxRedirects: 3})
    expect(result).toMatchObject({
      status: 'warning',
      redirects: 3,
      message: 'More than 3 redirects',
    })
  })

  it('times out slow requests without retrying', async () => {
    const impl = jest.fn(
      (_url: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            const err = new Error('aborted')
            err.name = 'AbortError'
            reject(err)
          })
        }),
    ) as unknown as typeof fetch
    const result = await checkUrl('https://slow.test/', {fetchImpl: impl, timeoutMs: 20})
    expect(result).toMatchObject({status: 'error', message: 'Timed out after 20ms'})
    expect(impl).toHaveBeenCalledTimes(1)
  })

  it('rejects malformed and non-http URLs without a request', async () => {
    const {impl, calls} = fakeFetch({})
    expect((await checkUrl('not a url', {fetchImpl: impl})).status).toBe('broken')
    expect((await checkUrl('ftp://a.test/x', {fetchImpl: impl})).status).toBe('skipped')
    expect(calls).toHaveLength(0)
  })
})

describe('checkUrls', () => {
  it('dedupes and respects the concurrency limit', async () => {
    let inFlight = 0
    let peak = 0
    const impl = jest.fn(async () => {
      inFlight++
      peak = Math.max(peak, inFlight)
      await new Promise((r) => setTimeout(r, 5))
      inFlight--
      return new Response(null, {status: 200})
    }) as unknown as typeof fetch
    const urls = [
      'https://a.test/1',
      'https://a.test/2',
      'https://a.test/3',
      'https://a.test/4',
      'https://a.test/1',
    ]
    const results = await checkUrls(urls, {fetchImpl: impl, concurrency: 2})
    expect(results.map((r) => r.url)).toEqual(urls)
    expect(impl).toHaveBeenCalledTimes(4)
    expect(peak).toBe(2)
  })
})

describe('isPrivateAddress', () => {
  it.each([
    '127.0.0.1',
    '10.1.2.3',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.1.1',
    '169.254.169.254',
    '100.64.0.1',
    '0.0.0.0',
    '224.0.0.1',
    '255.255.255.255',
    '::1',
    '::',
    '[::1]',
    'fe80::1',
    'fd00::1',
    'ff02::1',
    '::ffff:127.0.0.1',
    '::ffff:7f00:1',
    '64:ff9b::a9fe:a9fe',
    'not-an-ip',
  ])('%s is private', (ip) => {
    expect(isPrivateAddress(ip)).toBe(true)
  })

  it.each(['8.8.8.8', '1.1.1.1', '172.32.0.1', '2606:4700:4700::1111', '::ffff:8.8.8.8'])(
    '%s is public',
    (ip) => {
      expect(isPrivateAddress(ip)).toBe(false)
    },
  )
})

describe('assertPublicUrl', () => {
  const resolveHost = jest.fn(async (host: string) =>
    host === 'internal.example.com' ? ['10.0.0.5'] : ['93.184.216.34'],
  )

  it.each([
    'file:///etc/passwd',
    'gopher://a.test/',
    'http://user:pass@a.test/',
    'http://localhost:3000/',
    'http://app.localhost/',
    'http://metadata.google.internal/',
    'http://127.0.0.1/',
    'http://2130706433/', // decimal 127.0.0.1 — normalised by the URL parser
    'http://0x7f.0.0.1/',
    'http://[::1]/',
    'http://internal.example.com/',
  ])('blocks %s', async (url) => {
    await expect(assertPublicUrl(url, {resolveHost})).rejects.toBeInstanceOf(BlockedUrlError)
  })

  it('allows public hosts', async () => {
    await expect(
      assertPublicUrl('https://example.com/page', {resolveHost}),
    ).resolves.toBeUndefined()
    await expect(assertPublicUrl('https://8.8.8.8/', {resolveHost})).resolves.toBeUndefined()
  })
})

describe('link-check server handler', () => {
  const resolveHost = async (host: string) =>
    host === 'evil.test' ? ['127.0.0.1'] : ['93.184.216.34']

  it('checks URLs and skips private destinations without requesting them', async () => {
    const {impl, calls} = fakeFetch({'https://ok.test/': {status: 200}})
    const handle = createSeoLinkCheckHandler({fetchImpl: impl, resolveHost})
    const {results} = await handle({
      urls: ['https://ok.test/', 'http://evil.test/', 'http://10.0.0.1/'],
    })
    expect(results.map((r) => r.status)).toEqual(['ok', 'skipped', 'skipped'])
    expect(calls.map((c) => c.url)).toEqual(['https://ok.test/'])
  })

  it('rejects invalid bodies and too many URLs', async () => {
    const handle = createSeoLinkCheckHandler({maxUrls: 2})
    await expect(handle({urls: 'x'} as never)).rejects.toThrow('"urls" must be an array')
    await expect(handle({urls: ['a', 'b', 'c']})).rejects.toThrow('at most 2')
  })

  describe('fetch adapter', () => {
    const post = (body: unknown) =>
      new Request('https://site.test/api/seo-links', {method: 'POST', body: JSON.stringify(body)})

    it('returns results for a valid POST', async () => {
      const {impl} = fakeFetch({'https://ok.test/': {status: 200}})
      const handler = createLinkCheckFetchHandler({fetchImpl: impl, resolveHost})
      const res = await handler(post({urls: ['https://ok.test/']}))
      expect(res.status).toBe(200)
      expect((await res.json()).results[0]).toMatchObject({status: 'ok', httpStatus: 200})
    })

    it('maps request errors to 400 and other methods to 405', async () => {
      const handler = createLinkCheckFetchHandler({resolveHost})
      expect((await handler(post({nope: true}))).status).toBe(400)
      expect((await handler(new Request('https://site.test/', {method: 'GET'}))).status).toBe(405)
    })

    it('enforces authorize()', async () => {
      const handler = createLinkCheckFetchHandler(
        {resolveHost},
        {authorize: (req) => req.headers.get('x-token') === 'secret'},
      )
      expect((await handler(post({urls: []}))).status).toBe(401)
    })

    it('answers CORS preflight', async () => {
      const handler = createLinkCheckFetchHandler({}, {cors: 'https://studio.test'})
      const res = await handler(new Request('https://site.test/', {method: 'OPTIONS'}))
      expect(res.status).toBe(204)
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://studio.test')
    })
  })
})
