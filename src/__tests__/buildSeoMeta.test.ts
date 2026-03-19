import {buildSeoMeta, sanitizeOGType, sanitizeTwitterCard} from '../helpers/seoMeta'
import type {SeoFieldsInput} from '../helpers/seoMeta'

describe('buildSeoMeta', () => {
  describe('with valid input', () => {
    it('should build complete SEO metadata from valid input', () => {
      const seo: SeoFieldsInput = {
        title: 'My Page Title',
        description: 'This is a comprehensive meta description for the page.',
        keywords: ['seo', 'metadata', 'testing'],
        canonicalUrl: 'https://example.com/page',
        robots: {
          noIndex: false,
          noFollow: false,
        },
        openGraph: {
          title: 'OG Title',
          description: 'OG Description',
          type: 'article',
          siteName: 'My Site',
          url: 'https://example.com/page',
        },
        twitter: {
          card: 'summary_large_image',
          site: '@mysite',
          creator: '@author',
          title: 'Twitter Title',
          description: 'Twitter Description',
        },
      }

      const result = buildSeoMeta({
        seo,
        baseUrl: 'https://example.com',
        path: '/page',
        defaults: {
          title: 'Default Title',
          description: 'Default Description',
          siteName: 'Default Site',
        },
      })

      expect(result.title).toBe('My Page Title')
      expect(result.description).toBe('This is a comprehensive meta description for the page.')
      expect(result.keywords).toEqual(['seo', 'metadata', 'testing'])
      expect(result.robots?.index).toBe(true)
      expect(result.robots?.follow).toBe(true)
      expect(result.openGraph?.type).toBe('article')
      expect(result.openGraph?.title).toBe('OG Title')
      expect(result.twitter?.card).toBe('summary_large_image')
      expect(result.twitter?.site).toBe('@mysite')
    })

    it('should include custom meta attributes in "other" field', () => {
      const seo: SeoFieldsInput = {
        title: 'Test',
        description: 'Test description',
        metaAttributes: [
          {key: 'og:locale', value: 'en_US'},
          {key: 'article:author', value: 'John Doe'},
        ],
      }

      const result = buildSeoMeta({seo})

      expect(result.other).toBeDefined()
      expect(result.other?.['og:locale']).toBe('en_US')
      expect(result.other?.['article:author']).toBe('John Doe')
    })
  })

  describe('with null/undefined SEO', () => {
    it('should fall back to defaults when seo is null', () => {
      const result = buildSeoMeta({
        seo: null,
        defaults: {
          title: 'Default Title',
          description: 'Default Description',
          siteName: 'Default Site',
        },
      })

      expect(result.title).toBe('Default Title')
      expect(result.description).toBe('Default Description')
      expect(result.openGraph?.siteName).toBe('Default Site')
    })

    it('should fall back to defaults when seo is undefined', () => {
      const result = buildSeoMeta({
        defaults: {
          title: 'Default Title',
          description: 'Default Description',
        },
      })

      expect(result.title).toBe('Default Title')
      expect(result.description).toBe('Default Description')
    })

    it('should return empty metadata when no seo and no defaults', () => {
      const result = buildSeoMeta({})

      expect(result.title).toBeNull()
      expect(result.description).toBeNull()
      expect(result.openGraph?.siteName).toBeUndefined()
    })
  })

  describe('with defaults', () => {
    it('should use defaults when SEO fields are empty', () => {
      const seo: SeoFieldsInput = {
        title: undefined,
        description: undefined,
      }

      const result = buildSeoMeta({
        seo,
        defaults: {
          title: 'Fallback Title',
          description: 'Fallback Description',
        },
      })

      expect(result.title).toBe('Fallback Title')
      expect(result.description).toBe('Fallback Description')
    })

    it('should override defaults with explicit SEO values', () => {
      const seo: SeoFieldsInput = {
        title: 'Explicit Title',
        description: 'Explicit Description',
      }

      const result = buildSeoMeta({
        seo,
        defaults: {
          title: 'Default Title',
          description: 'Default Description',
        },
      })

      expect(result.title).toBe('Explicit Title')
      expect(result.description).toBe('Explicit Description')
    })
  })

  describe('return type structure', () => {
    it('should have correct robots structure', () => {
      const result = buildSeoMeta({
        seo: {
          robots: {
            noIndex: true,
            noFollow: true,
          },
        },
      })

      expect(result.robots).toBeDefined()
      expect(result.robots?.index).toBe(false)
      expect(result.robots?.follow).toBe(false)
      expect(result.robots?.googleBot).toBeDefined()
      expect(result.robots?.googleBot?.index).toBe(false)
      expect(result.robots?.googleBot?.follow).toBe(false)
    })

    it('should have correct openGraph structure', () => {
      const result = buildSeoMeta({
        seo: {
          openGraph: {
            title: 'OG Title',
            description: 'OG Desc',
            type: 'website',
            url: 'https://example.com',
            siteName: 'My Site',
            image: undefined,
          },
        },
      })

      expect(result.openGraph).toBeDefined()
      expect(result.openGraph?.type).toBe('website')
      expect(result.openGraph?.title).toBe('OG Title')
      expect(result.openGraph?.description).toBe('OG Desc')
      expect(result.openGraph?.url).toBe('https://example.com')
      expect(result.openGraph?.siteName).toBe('My Site')
      expect(Array.isArray(result.openGraph?.images)).toBe(true)
    })

    it('should have correct twitter structure', () => {
      const result = buildSeoMeta({
        seo: {
          twitter: {
            card: 'summary',
            site: '@twitter',
            creator: '@user',
            title: 'Tweet Title',
            description: 'Tweet Desc',
          },
        },
      })

      expect(result.twitter).toBeDefined()
      expect(result.twitter?.card).toBe('summary')
      expect(result.twitter?.site).toBe('@twitter')
      expect(result.twitter?.creator).toBe('@user')
      expect(result.twitter?.title).toBe('Tweet Title')
      expect(result.twitter?.description).toBe('Tweet Desc')
      expect(Array.isArray(result.twitter?.images)).toBe(true)
    })

    it('should have alternates with canonical URL', () => {
      const result = buildSeoMeta({
        baseUrl: 'https://example.com',
        path: '/about',
      })

      expect(result.alternates).toBeDefined()
      expect(result.alternates?.canonical).toBe('https://example.com/about')
    })

    it('should construct canonical URL from baseUrl and path', () => {
      const result = buildSeoMeta({
        baseUrl: 'https://example.com/',
        path: '/page',
      })

      expect(result.alternates?.canonical).toBe('https://example.com/page')
    })
  })

  describe('URL handling', () => {
    it('should normalize baseUrl by removing trailing slashes', () => {
      const result = buildSeoMeta({
        baseUrl: 'https://example.com///',
        path: 'page',
      })

      expect(result.alternates?.canonical).toBe('https://example.com/page')
    })

    it('should normalize path by removing leading slashes', () => {
      const result = buildSeoMeta({
        baseUrl: 'https://example.com',
        path: '///page',
      })

      expect(result.alternates?.canonical).toBe('https://example.com/page')
    })

    it('should prioritize explicit openGraph.url over constructed URL', () => {
      const result = buildSeoMeta({
        seo: {
          openGraph: {
            url: 'https://override.com/custom',
          },
        },
        baseUrl: 'https://example.com',
        path: '/page',
      })

      expect(result.openGraph?.url).toBe('https://override.com/custom')
    })
  })

  describe('image handling', () => {
    it('should use ogImage default when no images provided', () => {
      const result = buildSeoMeta({
        seo: {title: 'Test'},
        defaults: {
          ogImage: 'https://example.com/default.jpg',
        },
      })

      expect(result.openGraph?.images).toEqual([{url: 'https://example.com/default.jpg'}])
      expect(result.twitter?.images).toEqual(['https://example.com/default.jpg'])
    })

    it('should use imageUrlResolver for asset-based images', () => {
      const mockResolver = jest.fn().mockReturnValue('https://example.com/resolved.jpg')

      const result = buildSeoMeta({
        seo: {
          openGraph: {
            image: {
              _type: 'image',
              asset: {_ref: 'image-123', _type: 'reference'},
            } as any,
          },
        },
        imageUrlResolver: mockResolver,
      })

      expect(mockResolver).toHaveBeenCalled()
      expect(result.openGraph?.images?.[0]?.url).toBe('https://example.com/resolved.jpg')
    })

    it('should prioritize URL-based OG image over asset image', () => {
      const result = buildSeoMeta({
        seo: {
          openGraph: {
            imageType: 'url',
            imageUrl: 'https://example.com/direct.jpg',
            image: {_type: 'image', asset: {_ref: 'ignored', _type: 'reference'}} as any,
          },
        },
        imageUrlResolver: () => 'https://example.com/asset.jpg',
      })

      expect(result.openGraph?.images?.[0]?.url).toBe('https://example.com/direct.jpg')
    })
  })

  describe('sanitization helpers', () => {
    it('sanitizeOGType should accept valid types', () => {
      expect(sanitizeOGType('website')).toBe('website')
      expect(sanitizeOGType('article')).toBe('article')
      expect(sanitizeOGType('profile')).toBe('profile')
      expect(sanitizeOGType('product')).toBe('product')
    })

    it('sanitizeOGType should default to website for invalid types', () => {
      expect(sanitizeOGType('invalid')).toBe('website')
      expect(sanitizeOGType('')).toBe('website')
      expect(sanitizeOGType(undefined)).toBe('website')
    })

    it('sanitizeTwitterCard should accept valid card types', () => {
      expect(sanitizeTwitterCard('summary')).toBe('summary')
      expect(sanitizeTwitterCard('summary_large_image')).toBe('summary_large_image')
      expect(sanitizeTwitterCard('app')).toBe('app')
      expect(sanitizeTwitterCard('player')).toBe('player')
    })

    it('sanitizeTwitterCard should default to summary_large_image for invalid types', () => {
      expect(sanitizeTwitterCard('invalid')).toBe('summary_large_image')
      expect(sanitizeTwitterCard('')).toBe('summary_large_image')
      expect(sanitizeTwitterCard(undefined)).toBe('summary_large_image')
    })
  })

  describe('edge cases', () => {
    it('should handle empty keywords array', () => {
      const result = buildSeoMeta({
        seo: {
          title: 'Test',
          keywords: [],
        },
      })

      expect(result.keywords).toBeUndefined()
    })

    it('should skip empty meta attributes', () => {
      const result = buildSeoMeta({
        seo: {
          metaAttributes: [
            {key: 'valid', value: 'value'},
            {key: '', value: 'empty-key'},
            {key: 'empty-value', value: ''},
            {key: undefined, value: 'undefined-key'},
          ],
        },
      })

      expect(result.other?.['valid']).toBe('value')
      expect(Object.keys(result.other || {}).length).toBe(1)
    })

    it('should not include "other" field when no custom attributes', () => {
      const result = buildSeoMeta({
        seo: {
          title: 'Test',
          metaAttributes: [],
        },
      })

      expect(result.other).toBeUndefined()
    })

    it('should handle null twitter image resolution gracefully', () => {
      const mockResolver = jest.fn().mockReturnValue(null)

      const result = buildSeoMeta({
        seo: {
          twitter: {
            image: {_type: 'image', asset: {_ref: 'test', _type: 'reference'}} as any,
          },
        },
        imageUrlResolver: mockResolver,
      })

      expect(result.twitter?.images).toEqual([])
    })
  })
})
