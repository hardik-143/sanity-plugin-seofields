// TypeScript interfaces for SEO Fields Plugin

// Base Sanity types
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
}

export interface SanityImageWithAlt extends SanityImage {
  alt: string
}

// Robots settings
export interface RobotsSettings {
  noIndex?: boolean
  noFollow?: boolean
}

// Meta Attribute
export interface MetaAttribute {
  _type: 'metaAttribute'
  key: string
  type: 'string' | 'image'
  value?: string
  image?: SanityImage
}

// Open Graph settings
export interface OpenGraphSettings {
  _type: 'openGraph'
  title?: string
  description?: string
  siteName?: string
  type?: 'website' | 'article' | 'profile' | 'book' | 'music' | 'video' | 'product'
  imageType?: 'upload' | 'url'
  image?: SanityImageWithAlt
  imageUrl?: string
}

// X (Formerly Twitter) Card settings
export interface TwitterCardSettings {
  _type: 'twitter'
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  title?: string
  description?: string
  imageType?: 'upload' | 'url'
  image?: SanityImageWithAlt
  imageUrl?: string
}

// Main SEO Fields interface
export interface SeoFields {
  _type: 'seoFields'
  robots?: RobotsSettings
  preview?: string
  title?: string
  description?: string
  metaImage?: SanityImage
  keywords?: string[]
  canonicalUrl?: string
  openGraph?: OpenGraphSettings
  twitter?: TwitterCardSettings
}

// Type guards
export const isSeoFields = (obj: {_type: string}): obj is SeoFields => {
  return obj && obj._type === 'seoFields'
}

export const isOpenGraphSettings = (obj: {_type: string}): obj is OpenGraphSettings => {
  return obj && obj._type === 'openGraph'
}

export const isTwitterCardSettings = (obj: {_type: string}): obj is TwitterCardSettings => {
  return obj && obj._type === 'twitter'
}

export const isMetaAttribute = (obj: {_type: string}): obj is MetaAttribute => {
  return obj && obj._type === 'metaAttribute'
}

// Utility types for form validation
export interface SeoValidationRules {
  title: {
    maxLength: number
    warningLength: number
  }
  description: {
    maxLength: number
    warningLength: number
  }
  openGraphTitle: {
    maxLength: number
  }
  openGraphDescription: {
    maxLength: number
  }
  twitterTitle: {
    maxLength: number
  }
  twitterDescription: {
    maxLength: number
  }
}

export const defaultSeoValidationRules: SeoValidationRules = {
  title: {
    maxLength: 70,
    warningLength: 60,
  },
  description: {
    maxLength: 160,
    warningLength: 150,
  },
  openGraphTitle: {
    maxLength: 95,
  },
  openGraphDescription: {
    maxLength: 200,
  },
  twitterTitle: {
    maxLength: 70,
  },
  twitterDescription: {
    maxLength: 200,
  },
}

// text: string; color: 'green' | 'orange' | 'red'}[]
export type FeedbackTypeColors = 'green' | 'orange' | 'red'
export type FeedbackType = {
  text: string
  color: FeedbackTypeColors
}
