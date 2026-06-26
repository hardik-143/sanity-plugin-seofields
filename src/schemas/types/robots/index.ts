import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'robots',
  title: 'Robots Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
      description:
        'Enable this to prevent search engines from indexing this page. The page will not appear in search results.',
    }),
    defineField({
      name: 'noFollow',
      title: 'No Follow',
      type: 'boolean',
      initialValue: false,
      description:
        'Enable this to prevent search engines from following links on this page. Links will not pass SEO value.',
    }),
    defineField({
      name: 'noTranslate',
      title: 'No Translate',
      type: 'boolean',
      initialValue: false,
      description:
        'Enable this to prevent search engines from offering a translated version of this page in search results.',
    }),
    defineField({
      name: 'noImageIndex',
      title: 'No Image Index',
      type: 'boolean',
      initialValue: false,
      description:
        'Enable this to prevent images on this page from appearing in image search results.',
    }),
  ],
  description:
    'Select how search engines should index, follow links, translate content, and index images on this page.',
})
