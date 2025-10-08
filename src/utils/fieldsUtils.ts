// import {defineField, defineType} from 'sanity'
// import OgTitle from '../../../components/openGraph/OgTitle'
// import OgDescription from '../../../components/openGraph/OgDescription'

import {SeoFieldsPluginConfig, AllFieldKeys} from '../plugin'

// export default defineType({
//   name: 'openGraph',
//   title: 'Open Graph Settings',
//   type: 'object',
//   fields: [
//     defineField({
//       name: 'title',
//       title: 'Open Graph Title',
//       type: 'string',
//       components: {
//         input: OgTitle, // Can also wrap with a string input + preview
//       },
//     }),
//     defineField({
//       name: 'description',
//       title: 'Open Graph Description',
//       type: 'text',
//       rows: 3,
//       components: {
//         input: OgDescription, // Can also wrap with a text area + preview
//       },
//     }),
//     defineField({
//       name: 'siteName',
//       title: 'Open Graph Site Name',
//       type: 'string',
//       description: 'The name of your website. This is often the site title.',
//     }),
//     defineField({
//       name: 'type',
//       title: 'Open Graph Type',
//       type: 'string',
//       options: {
//         list: [
//           {title: 'Website', value: 'website'},
//           {title: 'Article', value: 'article'},
//           {title: 'Profile', value: 'profile'},
//           {title: 'Book', value: 'book'},
//           {title: 'Music', value: 'music'},
//           {title: 'Video', value: 'video'},
//           {title: 'Product', value: 'product'},
//         ],
//         // layout: 'radio', // Display as radio buttons
//       },
//       initialValue: 'website',
//       description: 'Select the type of content for Open Graph.',
//     }),

//     // upload image or ask for url
//     defineField({
//       name: 'imageType',
//       title: 'Image Type',
//       type: 'string',
//       options: {
//         list: [
//           {title: 'Upload Image', value: 'upload'},
//           {title: 'Image URL', value: 'url'},
//         ],
//       },
//       initialValue: 'upload',
//     }),
//     defineField({
//       name: 'image',
//       title: 'Open Graph Image',
//       type: 'image',
//       options: {
//         hotspot: true,
//       },
//       hidden: ({parent}) => parent?.imageType !== 'upload',
//       description:
//         'Recommended size: 1200x630px (minimum 600x315px). Max file size: 5MB. Aspect ratio 1.91:1.',
//     }),
//     defineField({
//       name: 'imageUrl',
//       title: 'Open Graph Image URL',
//       type: 'url',
//       hidden: ({parent}) => parent?.imageType !== 'url',
//       description:
//         'Enter the full URL of the image. Ensure the image is accessible and meets the recommended size of 1200x630px (minimum 600x315px).',
//     }),
//   ],
// })

const DEFAULT_FIELD_INFO = {
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
}

export const getFieldInfo = (
  fieldName: string,
  fieldOverrides: SeoFieldsPluginConfig['fieldOverrides'],
) => {
  const fieldInfo =
    (fieldOverrides && fieldOverrides[fieldName as keyof typeof fieldOverrides]) ||
    DEFAULT_FIELD_INFO[fieldName as keyof typeof DEFAULT_FIELD_INFO]
  return fieldInfo
    ? {title: fieldInfo.title, description: fieldInfo.description}
    : {title: '', description: ''}
}

/**
 * Check if a field should be hidden based on the current document type
 */
export const isFieldHidden = (
  fieldName: AllFieldKeys,
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
  fieldName: AllFieldKeys,
  config: SeoFieldsPluginConfig,
) => {
  return ({document}: {document?: any}) => {
    const documentType = document?._type
    return isFieldHidden(fieldName, config, documentType)
  }
}
