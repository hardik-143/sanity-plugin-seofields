// Mocks the pro package's remote license check + licensed prompt pool so tests control validity
// deterministically, instead of depending on the real (and possibly stale) installed
// `seofields-pro` version. The full 10-angle text lives entirely in that package now — this
// package only ever ships the 4 free angles per field, licensed or not.
const UNLOCKED_PROMPT: () => string = () => 'UNLOCKED PRO PROMPT'
jest.mock('seofields-pro', () => ({
  resolveLicensedPromptPool: jest.fn(
    async ({licenseKey, publicPrompts}: {licenseKey?: string; publicPrompts: unknown[]}) =>
      licenseKey === 'SEOF-VALID' ? [UNLOCKED_PROMPT] : publicPrompts,
  ),
}))

import {
  DEFAULT_PROMPTS,
  FREE_INDUSTRIES,
  INDUSTRY_PROMPTS,
  pickPrompt,
  PRO_INDUSTRIES,
} from '../utils/seoPrompts'
import type {SeoGenField} from '../utils/seoPrompts'

const fields: SeoGenField[] = [
  'title',
  'description',
  'focusKeyword',
  'keywords',
  'ogTitle',
  'ogDescription',
  'twitterTitle',
  'twitterDescription',
]

const params = {
  content: 'This page explains SEO metadata for Sanity Studio content teams.',
  keyword: 'seo metadata',
  keywords: ['seo metadata'],
}

type MockedPromptPoolResolver = (options: {
  licenseKey?: string
  projectId?: string
  field: SeoGenField
  industry?: string
  publicPrompts: unknown[]
}) => Promise<unknown[]>

const mockedResolveLicensedPromptPool = jest.requireMock('seofields-pro')
  .resolveLicensedPromptPool as jest.MockedFunction<MockedPromptPoolResolver>

describe('public SEO prompt bank', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('keeps exactly four free prompt variations per field', () => {
    for (const field of fields) {
      expect(DEFAULT_PROMPTS[field]).toHaveLength(4)
    }
  })

  it('keeps exactly four free prompt variations per field for every free industry', () => {
    expect(Object.keys(INDUSTRY_PROMPTS).sort()).toEqual([...FREE_INDUSTRIES].sort())

    for (const industry of FREE_INDUSTRIES) {
      for (const field of fields) {
        expect(INDUSTRY_PROMPTS[industry][field]).toHaveLength(4)
      }
    }
  })

  it('uses public industry context for public industries', async () => {
    const prompt = await pickPrompt('title', params, 'blog')

    expect(prompt).toContain('Write for a blog or editorial publication')
  })

  it('falls back to generic context for pro-only industries', async () => {
    const prompt = await pickPrompt('title', params, PRO_INDUSTRIES[0])

    expect(prompt).toContain('Write for a general web audience')
    expect(prompt).not.toContain('healthcare provider')
  })

  it('unlocks the full pool for a free industry once the license validates', async () => {
    const prompt = await pickPrompt('title', params, 'blog', 'SEOF-VALID', 'project123')

    expect(prompt).toBe('UNLOCKED PRO PROMPT')
    expect(mockedResolveLicensedPromptPool).toHaveBeenCalledWith({
      licenseKey: 'SEOF-VALID',
      projectId: 'project123',
      field: 'title',
      industry: 'blog',
      publicPrompts: INDUSTRY_PROMPTS.blog.title,
    })
  })

  it('unlocks the pro-industry-specific pool once the license validates', async () => {
    const prompt = await pickPrompt('title', params, PRO_INDUSTRIES[0], 'SEOF-VALID', 'project123')

    expect(prompt).toBe('UNLOCKED PRO PROMPT')
    expect(mockedResolveLicensedPromptPool).toHaveBeenCalledWith({
      licenseKey: 'SEOF-VALID',
      projectId: 'project123',
      field: 'title',
      industry: PRO_INDUSTRIES[0],
      publicPrompts: DEFAULT_PROMPTS.title,
    })
  })

  it('stays on the free 4-angle pool for a free industry when the license fails validation', async () => {
    const prompt = await pickPrompt('title', params, 'blog', 'SEOF-FAKE-OR-UNVERIFIED')

    expect(prompt).not.toBe('UNLOCKED PRO PROMPT')
    expect(INDUSTRY_PROMPTS.blog.title.some((fn) => fn(params) === prompt)).toBe(true)
  })

  it('stays on the generic 4-angle pool for a pro industry when the license fails validation', async () => {
    const prompt = await pickPrompt('title', params, PRO_INDUSTRIES[0], 'SEOF-FAKE-OR-UNVERIFIED')

    expect(prompt).not.toBe('UNLOCKED PRO PROMPT')
    expect(DEFAULT_PROMPTS.title.some((fn) => fn(params) === prompt)).toBe(true)
  })

  it('stays on the free 4-angle pool when no license key is set at all', async () => {
    for (let i = 0; i < 20; i++) {
      const prompt = await pickPrompt('title', params, 'blog')
      expect(INDUSTRY_PROMPTS.blog.title.some((fn) => fn(params) === prompt)).toBe(true)
    }

    expect(mockedResolveLicensedPromptPool).not.toHaveBeenCalled()
  })
})
