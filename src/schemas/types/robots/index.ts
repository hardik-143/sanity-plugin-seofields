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
  ],
  description: 'Select how search engines should index and follow links on this page.',
})
