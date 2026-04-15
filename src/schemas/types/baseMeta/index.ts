import {defineField, defineType, SchemaTypeDefinition} from 'sanity'

import MetaDescription from '../../../components/meta/MetaDescription'
import MetaImage from '../../../components/meta/MetaImage'
import MetaTitle from '../../../components/meta/MetaTitle'
import {SeoFieldsPluginConfig} from '../../../plugin'
import {getFieldHiddenFunction, getFieldInfo} from '../../../utils/fieldsUtils'

export default function baseMeta(config: SeoFieldsPluginConfig = {}): SchemaTypeDefinition {
  return defineType({
    name: 'baseMeta',
    title: 'Basic Meta Settings',
    type: 'object',
    fields: [
      defineField({
        name: 'title',
        ...getFieldInfo('title', config.fieldOverrides),
        type: 'string',
        components: {
          input: MetaTitle,
        },
        hidden: getFieldHiddenFunction('title', config),
      }),
      defineField({
        name: 'description',
        ...getFieldInfo('description', config.fieldOverrides),
        type: 'text',
        rows: 3,
        components: {
          input: MetaDescription,
        },
        hidden: getFieldHiddenFunction('description', config),
      }),
      defineField({
        name: 'metaImage',
        ...getFieldInfo('metaImage', config.fieldOverrides),
        type: 'image',
        options: {
          hotspot: true,
        },
        components: {
          input: MetaImage,
        },
        hidden: getFieldHiddenFunction('metaImage', config),
      }),
      defineField({
        name: 'keywords',
        ...getFieldInfo('keywords', config.fieldOverrides),
        title: 'Keywords',
        type: 'array',
        of: [{type: 'string'}],
        description:
          'Add relevant keywords for this page. These keywords will be used for SEO purposes.',
        hidden: getFieldHiddenFunction('keywords', config),
      }),
      defineField({
        name: 'canonicalUrl',
        ...getFieldInfo('canonicalUrl', config.fieldOverrides),
        title: 'Canonical URL',
        type: 'url',
        description:
          'Specify the canonical URL for this page. This helps prevent duplicate content issues by indicating the preferred version of a page.',
        hidden: getFieldHiddenFunction('canonicalUrl', config),
      }),
      defineField({
        name: 'metaAttributes',
        ...getFieldInfo('metaAttributes', config.fieldOverrides),
        type: 'array',
        of: [{type: 'metaAttribute'}],
        hidden: getFieldHiddenFunction('metaAttributes', config),
      }),
    ],
  })
}
