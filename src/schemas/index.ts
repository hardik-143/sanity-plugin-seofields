import {defineField, defineType} from 'sanity'
import MetaTitle from '../components/meta/MetaTitle'
import MetaDescription from '../components/meta/MetaDescription'
import SeoPreview from '../components/SeoPreview'
import {SeoFieldsPluginConfig} from '../plugin'
import {getFieldInfo} from '../utils/fieldsUtils'

export default function seoFieldsSchema(config: SeoFieldsPluginConfig = {}) {
  return defineType({
    name: 'seoFields',
    title: 'SEO Fields',
    type: 'object',
    fields: [
      defineField({
        name: 'robots',
        title: 'Robots Settings',
        type: 'robots', // Use the separate robots type here
      }),
      // 👇 conditionally spread preview field
      ...(config.seoPreview
        ? []
        : [
            defineField({
              name: 'preview',
              title: 'SEO Preview',
              type: 'string',
              components: {input: SeoPreview},
              readOnly: true,
            }),
          ]),

      defineField({
        name: 'title',
        ...getFieldInfo('title', config.fieldOverrides),
        // title: 'Meta Title',
        type: 'string',
        // description:
        // 'The meta title is displayed in search engine results as the clickable headline for a given result. It should be concise and accurately reflect the content of the page.',
        components: {
          input: MetaTitle,
        },
        // validation: (Rule) => Rule.max(60).warning('Meta title should be under 60 characters.'),
      }),
      defineField({
        name: 'description',
        ...getFieldInfo('description', config.fieldOverrides),
        // title: 'Meta Description',
        // description:
        //   'Provide a concise summary of the page content. This description may be used by search engines in search results.',
        type: 'text',
        rows: 3,
        components: {
          input: MetaDescription,
        },
        // validation: (Rule) => Rule.max(160).warning('Meta description should be under 160 characters.'),
      }),
      defineField({
        name: 'metaImage',
        ...getFieldInfo('metaImage', config.fieldOverrides),
        // title: 'Meta Image',
        // description:
        // 'Upload an image that represents the content of the page. This image may be used in social media previews and search engine results.',
        type: 'image',
        options: {
          hotspot: true,
        },
      }),
      defineField({
        name: 'metaAttributes',
        // title: 'Additional Meta Attributes',
        ...getFieldInfo('metaAttributes', config.fieldOverrides),
        type: 'array',
        of: [{type: 'metaAttribute'}],
        // description:
        //   'Add custom meta attributes to the head of the document for additional SEO and social media integration.',
      }),
      defineField({
        name: 'keywords',
        ...getFieldInfo('keywords', config.fieldOverrides),
        title: 'Keywords',
        type: 'array',
        of: [{type: 'string'}],
        description:
          'Add relevant keywords for this page. These keywords will be used for SEO purposes.',
      }),
      defineField({
        name: 'canonicalUrl',
        ...getFieldInfo('canonicalUrl', config.fieldOverrides),
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
}
