
export type MetaAttribute = {
  _type: 'metaAttribute'
  key?: string
  type?: 'string' | 'image'
  value?: string
  image?: {
    asset?: {
      _ref: string
      _type: 'reference'
      _weak?: boolean
      [internalGroqTypeReferenceTo]?: 'sanity.imageAsset'
    }
    media?: unknown
    hotspot?: SanityImageHotspot
    crop?: SanityImageCrop
    _type: 'image'
  }
}

export type MetaTag = {
  _type: 'metaTag'
  metaAttributes?: Array<
    {
      _key: string
    } & MetaAttribute
  >
}

export type SeoFields = {
  _type: 'seoFields'
  robots?: Robots
  preview?: string
  metaTitle?: string
  metaDescription?: string
  metaImage?: {
    asset?: {
      _ref: string
      _type: 'reference'
      _weak?: boolean
      [internalGroqTypeReferenceTo]?: 'sanity.imageAsset'
    }
    media?: unknown
    hotspot?: SanityImageHotspot
    crop?: SanityImageCrop
    _type: 'image'
  }
  metaAttributes?: Array<MetaAttribute>
  keywords?: Array<string>
  canonicalUrl?: string
  openGraph?: OpenGraph
  twitter?: Twitter
}

export type Twitter = {
  _type: 'twitter'
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  title?: string
  description?: string
  image?: {
    asset?: {
      _ref: string
      _type: 'reference'
      _weak?: boolean
      [internalGroqTypeReferenceTo]?: 'sanity.imageAsset'
    }
    media?: unknown
    hotspot?: SanityImageHotspot
    crop?: SanityImageCrop
    alt?: string
    _type: 'image'
  }
}

export type OpenGraph = {
  _type: 'openGraph'
  title?: string
  description?: string
  siteName?: string
  type?: 'website' | 'article' | 'profile' | 'book' | 'music' | 'video' | 'product'
  imageType?: 'upload' | 'url'
  image?: {
    asset?: {
      _ref: string
      _type: 'reference'
      _weak?: boolean
      [internalGroqTypeReferenceTo]?: 'sanity.imageAsset'
    }
    media?: unknown
    hotspot?: SanityImageHotspot
    crop?: SanityImageCrop
    _type: 'image'
  }
  imageUrl?: string
}

export type Robots = {
  _type: 'robots'
  noIndex?: boolean
  noFollow?: boolean
}

export type SanityImagePaletteSwatch = {
  _type: 'sanity.imagePaletteSwatch'
  background?: string
  foreground?: string
  population?: number
  title?: string
}

export type SanityImagePalette = {
  _type: 'sanity.imagePalette'
  darkMuted?: SanityImagePaletteSwatch
  lightVibrant?: SanityImagePaletteSwatch
  darkVibrant?: SanityImagePaletteSwatch
  vibrant?: SanityImagePaletteSwatch
  dominant?: SanityImagePaletteSwatch
  lightMuted?: SanityImagePaletteSwatch
  muted?: SanityImagePaletteSwatch
}

export type SanityImageDimensions = {
  _type: 'sanity.imageDimensions'
  height: number
  width: number
  aspectRatio: number
}

export type SanityImageHotspot = {
  _type: 'sanity.imageHotspot'
  x: number
  y: number
  height: number
  width: number
}

export type SanityImageCrop = {
  _type: 'sanity.imageCrop'
  top: number
  bottom: number
  left: number
  right: number
}

export type SanityFileAsset = {
  _id: string
  _type: 'sanity.fileAsset'
  _createdAt: string
  _updatedAt: string
  _rev: string
  originalFilename?: string
  label?: string
  title?: string
  description?: string
  altText?: string
  sha1hash?: string
  extension?: string
  mimeType?: string
  size?: number
  assetId?: string
  uploadId?: string
  path?: string
  url?: string
  source?: SanityAssetSourceData
}

export type SanityImageAsset = {
  _id: string
  _type: 'sanity.imageAsset'
  _createdAt: string
  _updatedAt: string
  _rev: string
  originalFilename?: string
  label?: string
  title?: string
  description?: string
  altText?: string
  sha1hash?: string
  extension?: string
  mimeType?: string
  size?: number
  assetId?: string
  uploadId?: string
  path?: string
  url?: string
  metadata?: SanityImageMetadata
  source?: SanityAssetSourceData
}

export type SanityImageMetadata = {
  _type: 'sanity.imageMetadata'
  location?: Geopoint
  dimensions?: SanityImageDimensions
  palette?: SanityImagePalette
  lqip?: string
  blurHash?: string
  hasAlpha?: boolean
  isOpaque?: boolean
}

export type Geopoint = {
  _type: 'geopoint'
  lat?: number
  lng?: number
  alt?: number
}

export type Slug = {
  _type: 'slug'
  current: string
  source?: string
}

export type SanityAssetSourceData = {
  _type: 'sanity.assetSourceData'
  name?: string
  id?: string
  url?: string
}

export type AllSanitySchemaTypes =
  | MetaAttribute
  | MetaTag
  | SeoFields
  | Twitter
  | OpenGraph
  | Robots
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | SanityImageHotspot
  | SanityImageCrop
  | SanityFileAsset
  | SanityImageAsset
  | SanityImageMetadata
  | Geopoint
  | Slug
  | SanityAssetSourceData
export declare const internalGroqTypeReferenceTo: unique symbol
