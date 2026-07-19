// Mocks the pro package's remote license check + licensed prompt pool so tests control validity
// deterministically, instead of depending on the real (and possibly stale) installed
// `seofields-pro` version. The full 10-angle text lives entirely in that package now — this
// package only ever ships the 4 free angles per field, licensed or not.
const UNLOCKED_PROMPT: () => string = () => 'UNLOCKED PRO PROMPT'
// Mirrors seofields-pro's real resolveLicensedPromptPool contract (cap 5 each + merge) so these tests
// pin the boundary behavior the pro package must uphold. Kept in lockstep with npm-pro/src/utils/seoPrompts.ts.
type WrappedCustom = {
  genericPrompts?: Array<() => string>
  industryPrompts?: Array<() => string>
  merge?: boolean
}
jest.mock('seofields-pro', () => ({
  resolveLicensedPromptPool: jest.fn(
    async ({
      licenseKey,
      publicPrompts,
      custom,
    }: {
      licenseKey?: string
      publicPrompts: Array<() => string>
      custom?: WrappedCustom
    }) => {
      const valid = licenseKey === 'SEOF-VALID'
      if (!valid) {
        if (custom) {
          const single = custom.industryPrompts?.[0] ?? custom.genericPrompts?.[0]
          if (single) return custom.merge ? [...publicPrompts, single] : [single]
        }
        return publicPrompts
      }
      const proPool = [UNLOCKED_PROMPT]
      if (custom) {
        const customs = [
          ...(custom.industryPrompts?.slice(0, 5) ?? []),
          ...(custom.genericPrompts?.slice(0, 5) ?? []),
        ]
        if (customs.length) return custom.merge ? [...proPool, ...customs] : customs
      }
      return proPool
    },
  ),
}))

import {
  type CustomPromptConfig,
  DEFAULT_PROMPTS,
  FREE_INDUSTRIES,
  INDUSTRY_PROMPTS,
  normalizeCustomPrompts,
  pickPrompt,
  PRO_INDUSTRIES,
} from '../utils/seoPrompts'
import type {SeoGenField} from '../utils/seoPrompts'
import type {CustomPromptValues} from '../plugin'

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
  custom?: WrappedCustom
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
    const prompt = await pickPrompt('title', params, {industry: 'blog'})

    expect(prompt).toContain('Write for a blog or editorial publication')
  })

  it('falls back to generic context for pro-only industries', async () => {
    const prompt = await pickPrompt('title', params, {industry: PRO_INDUSTRIES[0]})

    expect(prompt).toContain('Write for a general web audience')
    expect(prompt).not.toContain('healthcare provider')
  })

  it('unlocks the full pool for a free industry once the license validates', async () => {
    const prompt = await pickPrompt('title', params, {
      industry: 'blog',
      licenseKey: 'SEOF-VALID',
      projectId: 'project123',
    })

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
    const prompt = await pickPrompt('title', params, {
      industry: PRO_INDUSTRIES[0],
      licenseKey: 'SEOF-VALID',
      projectId: 'project123',
    })

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
    const prompt = await pickPrompt('title', params, {
      industry: 'blog',
      licenseKey: 'SEOF-FAKE-OR-UNVERIFIED',
    })

    expect(prompt).not.toBe('UNLOCKED PRO PROMPT')
    expect(INDUSTRY_PROMPTS.blog.title.some((fn) => fn(params) === prompt)).toBe(true)
  })

  it('stays on the generic 4-angle pool for a pro industry when the license fails validation', async () => {
    const prompt = await pickPrompt('title', params, {
      industry: PRO_INDUSTRIES[0],
      licenseKey: 'SEOF-FAKE-OR-UNVERIFIED',
    })

    expect(prompt).not.toBe('UNLOCKED PRO PROMPT')
    expect(DEFAULT_PROMPTS.title.some((fn) => fn(params) === prompt)).toBe(true)
  })

  it('stays on the free 4-angle pool when no license key is set at all', async () => {
    for (let i = 0; i < 20; i++) {
      const prompt = await pickPrompt('title', params, {industry: 'blog'})
      expect(INDUSTRY_PROMPTS.blog.title.some((fn) => fn(params) === prompt)).toBe(true)
    }

    expect(mockedResolveLicensedPromptPool).not.toHaveBeenCalled()
  })
})

describe('custom prompts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Tags its output so tests can identify which custom fn was picked, and exposes the values it received.
  const tag = (id: string) => (v: CustomPromptValues) =>
    `CUSTOM:${id}:${v.field}:${v.industry ?? 'none'}:${v.focusKeyword}`

  describe('normalizeCustomPrompts', () => {
    it('collapses a single free customPrompt into generic[fn]', () => {
      const fn = tag('a')
      expect(normalizeCustomPrompts(fn, undefined)).toEqual({generic: [fn]})
    })

    it('prefers structured customPrompts when both are provided', () => {
      const cfg: CustomPromptConfig = {generic: [tag('a')]}
      expect(normalizeCustomPrompts(tag('b'), cfg)).toBe(cfg)
    })

    it('returns undefined when nothing is configured', () => {
      expect(normalizeCustomPrompts(undefined, undefined)).toBeUndefined()
    })
  })

  describe('free / unlicensed path', () => {
    it('replaces the built-in pool with the single custom prompt', async () => {
      const custom: CustomPromptConfig = {generic: [tag('brand')]}
      for (let i = 0; i < 10; i++) {
        const prompt = await pickPrompt('title', params, {industry: 'blog', custom})
        expect(prompt).toBe('CUSTOM:brand:title:blog:seo metadata')
      }
      expect(mockedResolveLicensedPromptPool).not.toHaveBeenCalled()
    })

    it('passes all generic document values to the custom fn', async () => {
      const received: CustomPromptValues[] = []
      const custom: CustomPromptConfig = {
        generic: [
          (v) => {
            received.push(v)
            return 'x'
          },
        ],
      }
      const meta = {title: 'T', description: 'D', slug: 's'}
      await pickPrompt(
        'focusKeyword',
        {content: 'BODY', keyword: 'kw', keywords: ['kw', 'kw2'], meta},
        {industry: 'saas', custom},
      )
      expect(received[0]).toEqual({
        field: 'focusKeyword',
        content: 'BODY',
        focusKeyword: 'kw',
        keywords: ['kw', 'kw2'],
        meta,
        industry: 'saas',
      })
    })

    it('caps structured custom prompts to a single prompt (industry-first)', async () => {
      const custom: CustomPromptConfig = {
        generic: [tag('g0'), tag('g1')],
        byIndustry: {blog: [tag('i0'), tag('i1')]},
      }
      const seen = new Set<string>()
      for (let i = 0; i < 30; i++) {
        seen.add(await pickPrompt('title', params, {industry: 'blog', custom}))
      }
      expect([...seen]).toEqual(['CUSTOM:i0:title:blog:seo metadata'])
    })

    it('merges the single custom prompt into the built-in pool when merge is true', async () => {
      const custom: CustomPromptConfig = {generic: [tag('brand')], merge: true}
      const seen = new Set<string>()
      for (let i = 0; i < 60; i++) {
        seen.add(await pickPrompt('title', params, {industry: 'blog', custom}))
      }
      expect(seen.has('CUSTOM:brand:title:blog:seo metadata')).toBe(true)
      // at least one built-in blog title angle also shows up
      expect(
        [...seen].some((p) => INDUSTRY_PROMPTS.blog.title.some((fn) => fn(params) === p)),
      ).toBe(true)
    })
  })

  describe('licensed path', () => {
    it('forwards pre-wrapped custom prompts to the pro resolver', async () => {
      const custom: CustomPromptConfig = {
        generic: [tag('g0')],
        byIndustry: {saas: [tag('i0')]},
        merge: true,
      }
      await pickPrompt('title', params, {
        industry: 'saas',
        licenseKey: 'SEOF-VALID',
        projectId: 'project123',
        custom,
      })
      const call = mockedResolveLicensedPromptPool.mock.calls[0][0]
      expect(call.custom).toEqual({
        genericPrompts: [expect.any(Function)],
        industryPrompts: [expect.any(Function)],
        merge: true,
      })
    })

    it('replaces the pro pool with custom prompts (no built-in leakage) when merge is false', async () => {
      const custom: CustomPromptConfig = {
        generic: [tag('g0')],
        byIndustry: {saas: [tag('i0')]},
      }
      const seen = new Set<string>()
      for (let i = 0; i < 40; i++) {
        seen.add(
          await pickPrompt('title', params, {
            industry: 'saas',
            licenseKey: 'SEOF-VALID',
            projectId: 'project123',
            custom,
          }),
        )
      }
      expect(seen.has('UNLOCKED PRO PROMPT')).toBe(false)
      expect(seen).toEqual(
        new Set(['CUSTOM:i0:title:saas:seo metadata', 'CUSTOM:g0:title:saas:seo metadata']),
      )
    })

    it('mixes the pro pool with custom prompts when merge is true', async () => {
      const custom: CustomPromptConfig = {generic: [tag('g0')], merge: true}
      const seen = new Set<string>()
      for (let i = 0; i < 60; i++) {
        seen.add(
          await pickPrompt('title', params, {
            industry: 'saas',
            licenseKey: 'SEOF-VALID',
            projectId: 'project123',
            custom,
          }),
        )
      }
      expect(seen.has('UNLOCKED PRO PROMPT')).toBe(true)
      expect(seen.has('CUSTOM:g0:title:saas:seo metadata')).toBe(true)
    })

    it('caps generic custom prompts to five behind a valid license', async () => {
      const custom: CustomPromptConfig = {
        generic: Array.from({length: 6}, (_, i) => tag(`g${i}`)),
      }
      const seen = new Set<string>()
      for (let i = 0; i < 80; i++) {
        seen.add(
          await pickPrompt('title', params, {
            industry: 'saas',
            licenseKey: 'SEOF-VALID',
            projectId: 'project123',
            custom,
          }),
        )
      }
      expect(seen.has('CUSTOM:g5:title:saas:seo metadata')).toBe(false)
      expect(seen.size).toBe(5)
    })
  })
})
