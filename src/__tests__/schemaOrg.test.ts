/* eslint-disable no-undef */
import {buildArticleJsonLd} from '../schema/article/component'
import {buildSocialMediaPostingJsonLd} from '../schema/socialMediaPosting/component'

describe('buildSocialMediaPostingJsonLd', () => {
  it('returns null when headline is missing', () => {
    const result = buildSocialMediaPostingJsonLd({description: 'A post'})
    expect(result).toBeNull()
  })

  it('returns null when called with no data', () => {
    expect(buildSocialMediaPostingJsonLd()).toBeNull()
    expect(buildSocialMediaPostingJsonLd(null)).toBeNull()
  })

  it('returns correct @type and headline when required field is present', () => {
    const result = buildSocialMediaPostingJsonLd({headline: 'Hello World'})
    expect(result).not.toBeNull()
    expect(result?.['@type']).toBe('SocialMediaPosting')
    expect(result?.['@context']).toBe('https://schema.org')
    expect(result?.headline).toBe('Hello World')
  })

  it('includes optional description when provided', () => {
    const result = buildSocialMediaPostingJsonLd({
      headline: 'Test Post',
      description: 'Post body text',
    })
    expect(result?.description).toBe('Post body text')
  })

  it('includes datePublished when provided', () => {
    const result = buildSocialMediaPostingJsonLd({
      headline: 'Dated Post',
      datePublished: '2025-01-15T10:00:00Z',
    })
    expect(result?.datePublished).toBe('2025-01-15T10:00:00Z')
  })
})

describe('buildArticleJsonLd (regression)', () => {
  it('returns null when headline is missing', () => {
    const result = buildArticleJsonLd({description: 'No headline here'})
    expect(result).toBeNull()
  })

  it('returns correct @type when headline is present', () => {
    const result = buildArticleJsonLd({headline: 'My Article'})
    expect(result).not.toBeNull()
    expect(result?.['@type']).toBe('Article')
    expect(result?.['@context']).toBe('https://schema.org')
    expect(result?.headline).toBe('My Article')
  })
})
