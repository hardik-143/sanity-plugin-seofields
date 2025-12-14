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
export type FeedbackTypeColors = 'green' | 'orange' | 'red'
export type FeedbackType = {
  text: string
  color: FeedbackTypeColors
}
