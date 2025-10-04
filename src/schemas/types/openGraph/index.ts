import {defineField, defineType} from 'sanity'
import OgTitle from '../../../components/openGraph/OgTitle'
import OgDescription from '../../../components/openGraph/OgDescription'

export default defineType({
  name: 'openGraph',
  title: 'Open Graph Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Open Graph URL',
      type: 'url',
      description:
        'The canonical URL of the page. This should be the full URL including protocol (https://).',
    }),
    defineField({
      name: 'title',
      title: 'Open Graph Title',
      type: 'string',
      components: {
        input: OgTitle, // Can also wrap with a string input + preview
      },
    }),
    defineField({
      name: 'description',
      title: 'Open Graph Description',
      type: 'text',
      rows: 3,
      components: {
        input: OgDescription, // Can also wrap with a text area + preview
      },
    }),
    defineField({
      name: 'siteName',
      title: 'Open Graph Site Name',
      type: 'string',
      description: 'The name of your website. This is often the site title.',
    }),
    defineField({
      name: 'type',
      title: 'Open Graph Type',
      type: 'string',
      options: {
        list: [
          {title: 'Website', value: 'website'},
          {title: 'Article', value: 'article'},
          {title: 'Profile', value: 'profile'},
          {title: 'Book', value: 'book'},
          {title: 'Music', value: 'music'},
          {title: 'Video', value: 'video'},
          {title: 'Product', value: 'product'},
        ],
        // layout: 'radio', // Display as radio buttons
      },
      initialValue: 'website',
      description: 'Select the type of content for Open Graph.',
    }),

    // upload image or ask for url
    defineField({
      name: 'imageType',
      title: 'Image Type',
      type: 'string',
      options: {
        list: [
          {title: 'Upload Image', value: 'upload'},
          {title: 'Image URL', value: 'url'},
        ],
      },
      initialValue: 'upload',
    }),
    defineField({
      name: 'image',
      title: 'Open Graph Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({parent}) => parent?.imageType !== 'upload',
      description:
        'Recommended size: 1200x630px (minimum 600x315px). Max file size: 5MB. Aspect ratio 1.91:1.',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Open Graph Image URL',
      type: 'url',
      hidden: ({parent}) => parent?.imageType !== 'url',
      description:
        'Enter the full URL of the image. Ensure the image is accessible and meets the recommended size of 1200x630px (minimum 600x315px).',
    }),
  ],
})
