import {defineField, defineType} from 'sanity'
import MetaTitle from '../components/meta/MetaTitle'
import MetaDescription from '../components/meta/MetaDescription'
import SeoPreview from '../components/SeoPreview'

export default defineType({
  name: 'seoFields',
  title: 'SEO Fields',
  type: 'object',
  fields: [
    defineField({
      name: 'robots',
      title: 'Robots Settings',
      type: 'robots', // Use the separate robots type here
    }),
    defineField({
      name: 'preview',
      title: 'SEO Preview',
      type: 'string',
      components: {
        input: SeoPreview, // custom React component
      },
      // you can mark it read-only if you don't want editors to change it
      readOnly: true,
    }),
    defineField({
      name: 'title',
      title: 'Meta Title',
      type: 'string',
      description:
        'The meta title is displayed in search engine results as the clickable headline for a given result. It should be concise and accurately reflect the content of the page.',
      components: {
        input: MetaTitle,
      },
      // validation: (Rule) => Rule.max(60).warning('Meta title should be under 60 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description:
        'Provide a concise summary of the page content. This description may be used by search engines in search results.',
      components: {
        input: MetaDescription,
      },
      // validation: (Rule) => Rule.max(160).warning('Meta description should be under 160 characters.'),
    }),
    defineField({
      name: 'metaImage',
      title: 'Meta Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description:
        'Upload an image that represents the content of the page. This image may be used in social media previews and search engine results.',
    }),
    defineField({
      name: 'metaAttributes',
      title: 'Additional Meta Attributes',
      type: 'array',
      of: [{type: 'metaAttribute'}],
      description:
        'Add custom meta attributes to the head of the document for additional SEO and social media integration.',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Add relevant keywords for this page. These keywords will be used for SEO purposes.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description:
        'Specify the canonical URL for this page. This helps prevent duplicate content issues by indicating the preferred version of a page.',
    }),
    defineField({
      name: 'openGraph',
      title: 'Open Graph Settings',
      type: 'openGraph',
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter Card Settings',
      type: 'twitter',
    }),
  ],
})
