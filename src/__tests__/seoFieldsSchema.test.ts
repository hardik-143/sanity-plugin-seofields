// Studio input components pull in ESM-only Studio packages; the schema wiring is what's under test.
jest.mock('seofields-pro', () => ({}))
jest.mock('../components/geo/GEOChecklist', () => () => null)
jest.mock('../components/meta/FocusKeywordInput', () => () => null)
jest.mock('../components/meta/HreflangInput', () => () => null)
jest.mock('../components/meta/KeywordsInput', () => () => null)
jest.mock('../components/meta/MetaDescription', () => () => null)
jest.mock('../components/meta/MetaImage', () => () => null)
jest.mock('../components/meta/MetaTagsPreview', () => () => null)
jest.mock('../components/meta/MetaTitle', () => () => null)
jest.mock('../performanceStub', () => ({SeoPerformanceUpgradeCard: () => null}))
jest.mock('../schemas/types/openGraph', () => () => ({name: 'openGraph'}))
jest.mock('../schemas/types/twitter', () => () => ({name: 'twitter'}))

import seoFieldsSchema, {resolveLinkCheckerConfig, resolveReadabilityConfig} from '../schemas'

type Field = {name: string; options?: Record<string, unknown>}
const fieldNames = (config = {}) =>
  ((seoFieldsSchema(config) as unknown as {fields: Field[]}).fields ?? []).map((f) => f.name)

describe('seoFields schema — readability & link checker panels', () => {
  it('adds both panels by default', () => {
    const names = fieldNames()
    expect(names).toContain('readability')
    expect(names).toContain('linkChecker')
    expect(names.indexOf('readability')).toBe(names.indexOf('geoChecklist') + 1)
  })

  it('can disable each panel', () => {
    expect(fieldNames({readability: false})).not.toContain('readability')
    expect(fieldNames({linkChecker: {enabled: false}})).not.toContain('linkChecker')
  })

  it('resolves readability content from its own option, then ai.content', () => {
    expect(resolveReadabilityConfig({})).toEqual({content: undefined})
    expect(resolveReadabilityConfig({ai: {content: 'text'}})).toEqual({content: 'text'})
    expect(
      resolveReadabilityConfig({readability: {content: ['a', 'b']}, ai: {content: 'text'}}),
    ).toEqual({content: ['a', 'b']})
  })

  it('resolves link checker options with the root baseUrl as fallback', () => {
    expect(resolveLinkCheckerConfig({baseUrl: 'https://site.test'})).toEqual({
      baseUrl: 'https://site.test',
      checkReferences: true,
    })
    expect(
      resolveLinkCheckerConfig({
        baseUrl: 'https://site.test',
        linkChecker: {
          endpoint: '/api/links',
          baseUrl: 'https://www.site.test',
          checkReferences: false,
        },
      }),
    ).toEqual({endpoint: '/api/links', baseUrl: 'https://www.site.test', checkReferences: false})
  })
})
