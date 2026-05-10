/* eslint-disable no-undef */
import {buildArticleJsonLd} from '../schema/article/component'
import {buildLegalServiceJsonLd} from '../schema/legalService/component'
import {legalServiceFields} from '../schema/legalService/schema'
import {buildLocalBusinessJsonLd} from '../schema/localBusiness/component'
import {localBusinessFields} from '../schema/localBusiness/schema'
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

describe('LocalBusiness and LegalService schema regression', () => {
  it('uses distinct field names for image and logo', () => {
    expect(localBusinessFields.filter((field) => field.name === 'image')).toHaveLength(1)
    expect(localBusinessFields.filter((field) => field.name === 'logo')).toHaveLength(1)
    expect(legalServiceFields.filter((field) => field.name === 'image')).toHaveLength(1)
    expect(legalServiceFields.filter((field) => field.name === 'logo')).toHaveLength(1)
  })

  it('emits separate image and logo values for LocalBusiness', () => {
    const result = buildLocalBusinessJsonLd({
      name: 'Acme Cafe',
      image: {variant: 'url', url: 'https://example.com/business.jpg'},
      logo: {variant: 'url', url: 'https://example.com/logo.png'},
    })

    expect(result?.image).toBe('https://example.com/business.jpg')
    expect(result?.logo).toBe('https://example.com/logo.png')
  })

  it('emits separate image and logo values for LegalService', () => {
    const result = buildLegalServiceJsonLd({
      name: 'Acme Law',
      image: {variant: 'url', url: 'https://example.com/office.jpg'},
      logo: {variant: 'url', url: 'https://example.com/logo.png'},
    })

    expect(result?.image).toBe('https://example.com/office.jpg')
    expect(result?.logo).toBe('https://example.com/logo.png')
  })
})
