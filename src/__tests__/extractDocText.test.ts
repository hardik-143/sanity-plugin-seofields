import {extractDocText, resolveContentFields} from '../utils/extractDocText'

describe('extractDocText', () => {
  it('extracts a plain string field', () => {
    expect(extractDocText({body: 'Hello world'}, 'body')).toBe('Hello world')
  })

  it('extracts and joins multiple fields in order', () => {
    const doc = {title: 'My Title', body: 'Body text'}
    expect(extractDocText(doc, ['title', 'body'])).toBe('My Title\n\nBody text')
  })

  it('silently skips missing fields', () => {
    const doc = {body: 'Only body'}
    expect(extractDocText(doc, ['title', 'body', 'contentExtended'])).toBe('Only body')
  })

  it('extracts text from nested Portable Text inside wrapper objects', () => {
    const doc = {
      sections: [
        {
          _type: 'section',
          columns: [
            {
              _type: 'column',
              content: [{_type: 'block', children: [{_type: 'span', text: 'Nested paragraph'}]}],
            },
          ],
        },
      ],
    }
    expect(extractDocText(doc, 'sections')).toBe('Nested paragraph')
  })

  it('truncates to 4000 characters', () => {
    const doc = {body: 'a'.repeat(5000)}
    expect(extractDocText(doc, 'body')).toHaveLength(4000)
  })
})

describe('resolveContentFields', () => {
  it('passes through a plain string', () => {
    expect(resolveContentFields('body', 'page')).toBe('body')
  })

  it('passes through an array', () => {
    expect(resolveContentFields(['title', 'body'], 'page')).toEqual(['title', 'body'])
  })

  it('falls back to "body" when content is undefined', () => {
    expect(resolveContentFields(undefined, 'page')).toBe('body')
  })

  it('resolves the field(s) for a matching document type', () => {
    const content = {page: ['sections'], news: 'content'}
    expect(resolveContentFields(content, 'news')).toBe('content')
    expect(resolveContentFields(content, 'page')).toEqual(['sections'])
  })

  it('falls back to the "default" key for an unlisted document type', () => {
    const content = {page: ['sections'], default: 'body'}
    expect(resolveContentFields(content, 'author')).toBe('body')
  })

  it('falls back to "body" when unlisted and no "default" key is present', () => {
    const content = {page: ['sections']}
    expect(resolveContentFields(content, 'author')).toBe('body')
  })

  it('falls back to the "default" key when docType is undefined', () => {
    const content = {page: ['sections'], default: 'excerpt'}
    expect(resolveContentFields(content, undefined)).toBe('excerpt')
  })
})
