import {generateSeoText} from '../utils/seoContentGen'

jest.mock('seofields-pro', () => ({
  resolveLicensedPromptPool: jest.fn(async () => [() => 'PRO PROMPT']),
}))

describe('generateSeoText', () => {
  beforeEach(() => {
    const {resolveLicensedPromptPool} = jest.requireMock('seofields-pro') as {
      resolveLicensedPromptPool: jest.Mock
    }
    ;(resolveLicensedPromptPool as jest.Mock).mockClear()
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        choices: [{message: {content: 'pro keyword, public keyword'}}],
      }),
    })) as jest.Mock
  })

  it('uses the pro prompt pool callback when license and project are present', async () => {
    const result = await generateSeoText('keywords', 'Page content', 'focus keyword', ['keyword'], {
      config: {
        provider: 'openai',
        apiKey: 'test-key',
        industry: 'finance',
        _licenseKey: 'SEOF-TEST',
        _projectId: 'project123',
      },
      meta: {title: 'Existing title'},
    })

    const {resolveLicensedPromptPool} = jest.requireMock('seofields-pro') as {
      resolveLicensedPromptPool: jest.Mock
    }
    expect(result).toBe('pro keyword, public keyword')
    expect(resolveLicensedPromptPool).toHaveBeenCalledWith(
      expect.objectContaining({
        licenseKey: 'SEOF-TEST',
        projectId: 'project123',
        field: 'keywords',
        industry: 'finance',
        publicPrompts: expect.arrayContaining([expect.any(Function)]),
      }),
    )
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('PRO PROMPT'),
      }),
    )
  })

  it('forwards keywords and meta to a configured proxy endpoint', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(async () => ({
      ok: true,
      json: async () => ({result: 'Proxied result'}),
    }))

    const result = await generateSeoText('title', 'Page content', 'focus keyword', ['kw1', 'kw2'], {
      config: {endpoint: '/api/seo-ai'},
      meta: {title: 'Existing title', slug: 'my-slug'},
    })

    expect(result).toBe('Proxied result')
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/seo-ai',
      expect.objectContaining({
        body: JSON.stringify({
          field: 'title',
          content: 'Page content',
          focusKeyword: 'focus keyword',
          keywords: ['kw1', 'kw2'],
          meta: {title: 'Existing title', slug: 'my-slug'},
        }),
      }),
    )
  })
})
