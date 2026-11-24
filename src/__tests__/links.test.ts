import {buildLinksQuery, collectFindings} from '../cli/utils/linkFindings'
import {checkReferences} from '../utils/linkCheck'
import {classifyHref, extractDocumentLinks, getPublishedId} from '../utils/links'

const doc = {
  _id: 'drafts.post-1',
  _type: 'post',
  title: 'Hello',
  body: [
    {
      _type: 'block',
      _key: 'b1',
      markDefs: [
        {_type: 'link', _key: 'm1', href: 'https://example.com/a'},
        {_type: 'internalLink', _key: 'm2', reference: {_type: 'reference', _ref: 'page-2'}},
        {_type: 'link', _key: 'm3', href: '/pricing'},
        {_type: 'link', _key: 'm4', href: 'mailto:hi@example.com'},
        {_type: 'link', _key: 'm5', href: 'javascript:alert(1)'},
      ],
      children: [
        {_type: 'span', text: 'Read ', marks: []},
        {_type: 'span', text: 'this', marks: ['m1']},
        {_type: 'span', text: ' and ', marks: []},
        {_type: 'span', text: 'that page', marks: ['m2']},
        {_type: 'span', text: 'Pricing', marks: ['m3']},
      ],
    },
    {_type: 'image', asset: {_type: 'reference', _ref: 'image-abc-100x100-png'}},
    {
      _type: 'cta',
      label: 'Buy',
      buttonUrl: 'https://shop.example.com',
      note: 'https://not-a-link-field.com',
    },
  ],
  author: {_type: 'reference', _ref: 'drafts.author-1'},
  related: [{_type: 'reference', _ref: 'post-9', _weak: true, _key: 'r1'}],
  crossDataset: {_type: 'crossDatasetReference', _ref: 'x', _dataset: 'other'},
  seo: {
    _type: 'seoFields',
    canonicalUrl: 'https://example.com/hello',
    metaImage: {asset: {_ref: 'image-xyz-10x10-jpg'}},
    openGraph: {url: 'https://example.com/hello', imageUrl: 'https://cdn.example.com/og.png'},
    twitter: {imageUrl: 'not a url'},
    hreflangs: [{locale: 'de', url: 'https://example.com/de/hello'}],
  },
}

describe('classifyHref', () => {
  it.each([
    ['https://example.com/x', 'external', 'https://example.com/x'],
    ['//cdn.example.com/x', 'external', 'https://cdn.example.com/x'],
    ['#top', 'anchor', undefined],
    ['mailto:a@b.c', 'mailto', undefined],
    ['tel:+123', 'tel', undefined],
    ['javascript:void(0)', 'unsupported', undefined],
    ['https://', 'invalid', undefined],
    ['/about', 'relative', undefined],
  ])('%s → %s', (href, kind, url) => {
    expect(classifyHref(href)).toEqual(url ? {kind, url} : {kind})
  })

  it('resolves relative links against a base URL', () => {
    expect(classifyHref('/about', 'https://example.com/blog')).toEqual({
      kind: 'relative',
      url: 'https://example.com/about',
    })
    expect(classifyHref('next', 'https://example.com/blog')).toEqual({
      kind: 'relative',
      url: 'https://example.com/blog/next',
    })
  })
})

describe('getPublishedId', () => {
  it('strips draft and version prefixes', () => {
    expect(getPublishedId('drafts.abc')).toBe('abc')
    expect(getPublishedId('versions.r1.abc')).toBe('abc')
    expect(getPublishedId('abc')).toBe('abc')
  })
})

describe('extractDocumentLinks', () => {
  const links = extractDocumentLinks(doc, {baseUrl: 'https://example.com'})

  it('extracts Portable Text link annotations with their text', () => {
    expect(links).toContainEqual({
      kind: 'external',
      source: 'annotation',
      href: 'https://example.com/a',
      url: 'https://example.com/a',
      path: 'body[0].markDefs[0]',
      label: 'this',
    })
    expect(links).toContainEqual(
      expect.objectContaining({
        kind: 'relative',
        url: 'https://example.com/pricing',
        label: 'Pricing',
      }),
    )
    expect(links).toContainEqual(expect.objectContaining({kind: 'mailto'}))
    expect(links).toContainEqual(expect.objectContaining({kind: 'unsupported'}))
  })

  it('extracts internal link annotations and document references', () => {
    expect(links).toContainEqual({
      kind: 'internal',
      source: 'annotation',
      refId: 'page-2',
      path: 'body[0].markDefs[1]',
      label: 'that page',
    })
    expect(links).toContainEqual(
      expect.objectContaining({kind: 'internal', source: 'reference', refId: 'author-1'}),
    )
    expect(links).toContainEqual(
      expect.objectContaining({kind: 'internal', refId: 'post-9', weak: true}),
    )
  })

  it('ignores asset and cross-dataset references', () => {
    const refIds = links.filter((l) => l.kind === 'internal').map((l) => l.refId)
    expect(refIds.sort()).toEqual(['author-1', 'page-2', 'post-9'])
  })

  it('extracts SEO URL fields with labels', () => {
    const seo = links.filter((l) => l.source === 'seo')
    expect(seo.map((l) => [l.label, l.kind])).toEqual([
      ['Canonical URL', 'external'],
      ['Open Graph URL', 'external'],
      ['Open Graph image URL', 'external'],
      ['X image URL', 'relative'],
      ['Hreflang (de)', 'external'],
    ])
    expect(seo[0].path).toBe('seo.canonicalUrl')
  })

  it('picks up URL-named fields elsewhere in the document', () => {
    const field = links.filter((l) => l.source === 'field')
    expect(field).toEqual([
      expect.objectContaining({href: 'https://shop.example.com', path: 'body[2].buttonUrl'}),
    ])
  })

  it('can skip references', () => {
    const noRefs = extractDocumentLinks(doc, {includeReferences: false})
    expect(noRefs.some((l) => l.kind === 'internal')).toBe(false)
  })

  it('handles empty input', () => {
    expect(extractDocumentLinks(null)).toEqual([])
  })
})

describe('checkReferences', () => {
  it('classifies published, draft-only and missing documents', async () => {
    const query = jest.fn(async (_q: string, {ids}: {ids: string[]}) =>
      ids.filter((id) => ['a', 'drafts.b'].includes(id)),
    )
    const result = await checkReferences(['a', 'b', 'c', 'a'], query)
    expect(Object.fromEntries(result)).toEqual({a: 'ok', b: 'unpublished', c: 'missing'})
    expect(query).toHaveBeenCalledWith('*[_id in $ids]._id', {
      ids: ['a', 'drafts.a', 'b', 'drafts.b', 'c', 'drafts.c'],
    })
  })

  it('queries in chunks', async () => {
    const query = jest.fn(async () => [] as string[])
    await checkReferences(['a', 'b', 'c'], query, 2)
    expect(query).toHaveBeenCalledTimes(2)
  })
})

describe('CLI link findings', () => {
  it('reports only problems', () => {
    const links = extractDocumentLinks(doc, {baseUrl: 'https://example.com'})
    const findings = collectFindings(
      doc,
      links,
      new Map([
        ['page-2', 'missing'],
        ['author-1', 'unpublished'],
        ['post-9', 'missing'],
      ] as const),
      new Map([
        [
          'https://example.com/a',
          {
            url: 'https://example.com/a',
            status: 'broken',
            httpStatus: 404,
            redirects: 0,
            message: 'Not found',
          },
        ],
        [
          'https://example.com/pricing',
          {url: 'https://example.com/pricing', status: 'ok', httpStatus: 200, redirects: 0},
        ],
        [
          'https://cdn.example.com/og.png',
          {url: 'https://cdn.example.com/og.png', status: 'skipped', redirects: 0},
        ],
      ] as const),
    )
    expect(findings.map((f) => [f.status, f.target])).toEqual([
      ['broken', 'https://example.com/a'],
      ['broken', 'page-2'],
      ['warning', 'author-1'],
      ['warning', 'post-9'],
    ])
    expect(findings[0]).toMatchObject({documentId: 'drafts.post-1', httpStatus: 404, label: 'this'})
  })

  it('builds a parameterised query', () => {
    expect(buildLinksQuery([], [], 0)).toBe(
      '*[defined(seo) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(_updatedAt desc)',
    )
    expect(buildLinksQuery(['a'], ['post'], 10)).toContain('_id in $ids')
    expect(buildLinksQuery([], ['post'], 10)).toMatch(/_type in \$types.*\[0\.\.\.10\]$/)
  })
})
