import {buildHreflangs} from '../helpers/hreflang'

describe('buildHreflangs', () => {
  it('returns [] for empty / nullish input', () => {
    expect(buildHreflangs(null)).toEqual([])
    expect(buildHreflangs(undefined)).toEqual([])
    expect(buildHreflangs([])).toEqual([])
  })

  it('builds entries from baseUrl + slug (string or {current})', () => {
    const result = buildHreflangs(
      [
        {language: 'en', slug: 'about'},
        {language: 'fr', slug: {current: 'a-propos'}},
      ],
      {baseUrl: 'https://example.com'},
    )
    expect(result).toEqual([
      {locale: 'en', url: 'https://example.com/about'},
      {locale: 'fr', url: 'https://example.com/a-propos'},
    ])
  })

  it('lets an explicit url win over baseUrl + slug', () => {
    const result = buildHreflangs(
      [{language: 'en', slug: 'about', url: 'https://cdn.example.com/en'}],
      {
        baseUrl: 'https://example.com',
      },
    )
    expect(result).toEqual([{locale: 'en', url: 'https://cdn.example.com/en'}])
  })

  it('uses path over slug, and a custom resolvePath over both', () => {
    expect(
      buildHreflangs([{language: 'en', slug: 'x', path: '/custom'}], {baseUrl: 'https://e.com'}),
    ).toEqual([{locale: 'en', url: 'https://e.com/custom'}])
    expect(
      buildHreflangs([{language: 'fr', slug: 'about'}], {
        baseUrl: 'https://e.com',
        resolvePath: (t) => `/${t.language}/${(t.slug as string) ?? ''}`,
      }),
    ).toEqual([{locale: 'fr', url: 'https://e.com/fr/about'}])
  })

  it('skips translations with no language or no resolvable url', () => {
    const result = buildHreflangs(
      [{slug: 'no-lang'}, {language: 'en'}, {language: 'de', slug: 'de-page'}],
      {baseUrl: 'https://e.com'},
    )
    expect(result).toEqual([{locale: 'de', url: 'https://e.com/de-page'}])
  })

  it('dedupes by locale, first entry wins', () => {
    const result = buildHreflangs(
      [
        {language: 'en', slug: 'first'},
        {language: 'en', slug: 'second'},
      ],
      {baseUrl: 'https://e.com'},
    )
    expect(result).toEqual([{locale: 'en', url: 'https://e.com/first'}])
  })

  it('includes the current document', () => {
    const result = buildHreflangs([{language: 'fr', slug: 'fr'}], {
      baseUrl: 'https://e.com',
      current: {language: 'en', slug: 'en'},
    })
    expect(result).toEqual([
      {locale: 'en', url: 'https://e.com/en'},
      {locale: 'fr', url: 'https://e.com/fr'},
    ])
  })

  it('emits an x-default entry pointing at the matching language url', () => {
    const result = buildHreflangs(
      [
        {language: 'en', slug: 'en'},
        {language: 'fr', slug: 'fr'},
      ],
      {baseUrl: 'https://e.com', xDefault: 'en'},
    )
    expect(result).toContainEqual({locale: 'x-default', url: 'https://e.com/en'})
  })

  it('keeps a relative path when no baseUrl is set', () => {
    expect(buildHreflangs([{language: 'en', path: '/about'}])).toEqual([
      {locale: 'en', url: '/about'},
    ])
  })
})
