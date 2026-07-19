import {buildLlmsTxt, docsToLlmsSection} from '../helpers/llmsTxt'

describe('buildLlmsTxt', () => {
  it('renders title, summary, and a section with links', () => {
    const out = buildLlmsTxt({
      title: 'Acme',
      summary: 'A great site.',
      sections: [
        {
          title: 'Docs',
          links: [
            {title: 'Intro', url: 'https://acme.com/intro', description: 'Start here'},
            {title: 'API', url: 'https://acme.com/api'},
          ],
        },
      ],
    })
    expect(out).toBe(
      [
        '# Acme',
        '',
        '> A great site.',
        '',
        '## Docs',
        '',
        '- [Intro](https://acme.com/intro): Start here',
        '- [API](https://acme.com/api)',
        '',
      ].join('\n'),
    )
  })

  it('renders a leading version/updated line', () => {
    const out = buildLlmsTxt({title: 'Acme', version: '1.2.0', updated: 'July 2026'})
    expect(out.startsWith('> Version: 1.2.0 | Updated: July 2026\n\n# Acme')).toBe(true)
  })

  it('includes details prose after the summary', () => {
    const out = buildLlmsTxt({title: 'Acme', summary: 'S', details: 'Long form text.'})
    expect(out).toContain('> S\n\nLong form text.')
  })

  it('omits empty sections and links missing title/url', () => {
    const out = buildLlmsTxt({
      title: 'Acme',
      sections: [
        {title: 'Empty', links: []},
        {
          title: 'Partial',
          links: [
            {title: 'Ok', url: 'https://a.com'},
            {title: '', url: 'https://b.com'},
          ],
        },
      ],
    })
    expect(out).not.toContain('## Empty')
    expect(out).toContain('## Partial')
    expect(out).toContain('- [Ok](https://a.com)')
    expect(out).not.toContain('https://b.com')
  })

  it('prefixes relative link urls with baseUrl but leaves absolute ones', () => {
    const out = buildLlmsTxt({
      title: 'Acme',
      baseUrl: 'https://acme.com',
      sections: [
        {
          title: 'Mix',
          links: [
            {title: 'Rel', url: '/blog'},
            {title: 'Abs', url: 'https://other.com/x'},
          ],
        },
      ],
    })
    expect(out).toContain('- [Rel](https://acme.com/blog)')
    expect(out).toContain('- [Abs](https://other.com/x)')
  })

  it('ends with a single trailing newline', () => {
    const out = buildLlmsTxt({title: 'Acme'})
    expect(out).toBe('# Acme\n')
  })
})

describe('docsToLlmsSection', () => {
  it('maps documents to a section using slug + title + description', () => {
    const section = docsToLlmsSection(
      [
        {title: 'First Post', slug: {current: 'first'}, description: 'Hello'},
        {title: 'Second', slug: 'second'},
      ],
      {title: 'Blog', baseUrl: 'https://acme.com'},
    )
    expect(section).toEqual({
      title: 'Blog',
      links: [
        {title: 'First Post', url: 'https://acme.com/first', description: 'Hello'},
        {title: 'Second', url: 'https://acme.com/second'},
      ],
    })
  })

  it('skips docs missing a title or a resolvable path', () => {
    const section = docsToLlmsSection([{title: 'No slug'}, {slug: 'no-title'}, null as never], {
      title: 'X',
    })
    expect(section.links).toEqual([])
  })

  it('honors custom resolvers', () => {
    const section = docsToLlmsSection([{title: 'T', slug: 'p', description: 'D'}], {
      title: 'X',
      resolvePath: (d) => `/custom/${(d.slug as string) ?? ''}`,
      resolveTitle: () => 'Overridden',
      resolveDescription: () => undefined,
    })
    expect(section.links).toEqual([{title: 'Overridden', url: '/custom/p'}])
  })
})
