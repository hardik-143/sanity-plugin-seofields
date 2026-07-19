import {createSeoAiHandler} from '../../server/aiHandler'

describe('createSeoAiHandler', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        choices: [{message: {content: 'Generated meta title here'}}],
      }),
    })) as jest.Mock
  })

  it('runs the generation pipeline server-side and returns { result }', async () => {
    const handle = createSeoAiHandler({provider: 'openai', apiKey: 'server-side-key'})

    const response = await handle({
      field: 'keywords',
      content: 'Page content about hiking boots',
      focusKeyword: 'hiking boots',
      keywords: ['hiking boots'],
    })

    expect(response).toEqual({result: 'Generated meta title here'})
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({Authorization: 'Bearer server-side-key'}),
      }),
    )
  })

  it('rejects a request body missing required fields', async () => {
    const handle = createSeoAiHandler({provider: 'openai', apiKey: 'server-side-key'})

    await expect(handle({field: 'keywords'} as never)).rejects.toThrow('Invalid request body')
  })

  it('applies a custom prompt set on the server handler config', async () => {
    const handle = createSeoAiHandler({
      provider: 'openai',
      apiKey: 'server-side-key',
      customPrompt: (v) => `CUSTOM_PROMPT_FOR_${v.field}_${v.content}`,
    })

    await handle({field: 'keywords', content: 'hiking boots page'})

    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    expect(body.messages[0].content).toBe('CUSTOM_PROMPT_FOR_keywords_hiking boots page')
  })
})
