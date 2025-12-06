import {AllFieldKeys, SeoFieldsPluginConfig, ValidHiddenFieldKeys} from '../plugin'

const DEFAULT_FIELD_INFO: Record<AllFieldKeys, {title: string; description: string}> = {
  title: {
    title: 'Meta Title',
    description:
      'The meta title is displayed in search engine results as the clickable headline for a given result. It should be concise and accurately reflect the content of the page.',
  },
  description: {
    title: 'Meta Description',
    description:
      'Provide a concise summary of the page content. This description may be used by search engines in search results.',
  },
  metaImage: {
    title: 'Meta Image',
    description:
      'Upload an image that represents the content of the page. This image may be used in social media previews and search engine results.',
  },
  keywords: {
    title: 'Keywords',
    description:
      'Add relevant keywords for this page. These keywords will be used for SEO purposes.',
  },
  canonicalUrl: {
    title: 'Canonical URL',
    description:
      'Specify the canonical URL for this page. This helps prevent duplicate content issues by indicating the preferred version of a page.',
  },
  robots: {
    title: 'Robots Settings',
    description: 'Configure how search engine crawlers should index and follow links on this page.',
  },
  metaAttributes: {
    title: 'Additional Meta Attributes',
    description:
      'Add custom meta attributes to the head of the document for additional SEO and social media integration.',
  },
  openGraphTitle: {
    title: 'Open Graph Title',
    description: '',
  },
  openGraphUrl: {
    title: 'Open Graph URL',
    description:
      'The canonical URL of the page. This should be the full URL including protocol (https://).',
  },
  openGraphDescription: {
    title: 'Open Graph Description',
    description: '',
  },
  openGraphSiteName: {
    title: 'Open Graph Site Name',
    description: 'The name of your website. This is often the site title.',
  },
  openGraphType: {
    title: 'Open Graph Type',
    description: 'Select the type of content for Open Graph.',
  },
  openGraphImageType: {
    title: 'Image Type',
    description: 'Choose whether to upload an image or provide an image URL for Open Graph.',
  },
  openGraphImage: {
    title: 'Open Graph Image',
    description:
      'Recommended size: 1200x630px (minimum 600x315px). Max file size: 5MB. Aspect ratio 1.91:1.',
  },
  openGraphImageUrl: {
    title: 'Open Graph Image URL',
    description:
      'Enter the full URL of the image. Ensure the image is accessible and meets the recommended size of 1200x630px (minimum 600x315px).',
  },
  twitterCard: {
    title: 'X Card Type',
    description: '',
  },
  twitterSite: {
    title: 'Site X Handle',
    description: 'The X (formerly Twitter) handle of the website (e.g., @example)',
  },
  twitterCreator: {
    title: 'X Creator Handle',
    description: 'The X (formerly Twitter) handle of the content creator (e.g., @creator)',
  },
  twitterTitle: {
    title: 'X Title',
    description: 'The title of the content as it should appear on X (formerly Twitter).',
  },
  twitterDescription: {
    title: 'X Description',
    description: 'A brief description of the content for X (formerly Twitter).',
  },
  twitterImageType: {
    title: 'X Image Type',
    description:
      'Choose whether to upload an image or provide an image URL for X (formerly Twitter).',
  },
  twitterImage: {
    title: 'X Image',
    description:
      'An image URL which should be at least 120x120px for "summary" card and 280x150px for "summary_large_image" card.',
  },
  twitterImageUrl: {
    title: 'X Image URL',
    description:
      'Enter the full URL of the image for X (formerly Twitter). Ensure the image is accessible and meets the recommended size.',
  },
}

export const getFieldInfo = (
  fieldName: string,
  fieldOverrides: SeoFieldsPluginConfig['fieldOverrides'],
): {title: string; description: string} => {
  const fieldInfo =
    (fieldOverrides && fieldOverrides[fieldName as keyof typeof fieldOverrides]) ||
    DEFAULT_FIELD_INFO[fieldName as keyof typeof DEFAULT_FIELD_INFO]
  return fieldInfo
    ? {title: fieldInfo.title || '', description: fieldInfo.description || ''}
    : {title: '', description: ''}
}

/**
 * Check if a field should be hidden based on the current document type
 */
export const isFieldHidden = (
  fieldName: ValidHiddenFieldKeys,
  config: SeoFieldsPluginConfig,
  documentType?: string,
): boolean => {
  // Check if field is in default hidden fields
  if (config.defaultHiddenFields?.includes(fieldName)) {
    return true
  }

  // Check if field is hidden for specific post type
  if (documentType && config.fieldVisibility?.[documentType]?.hiddenFields?.includes(fieldName)) {
    return true
  }

  return false
}

/**
 * Get the hidden function for any field
 */
export const getFieldHiddenFunction = (
  fieldName: ValidHiddenFieldKeys,
  config: SeoFieldsPluginConfig,
) => {
  return ({
    document,
  }: {
    document?: {
      _type?: string
    }
  }): boolean => {
    const documentType = document?._type
    return isFieldHidden(fieldName, config, documentType)
  }
}
