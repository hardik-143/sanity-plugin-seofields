import {defineField, defineType} from 'sanity'
import OgTitle from '../../../components/openGraph/OgTitle'
import OgDescription from '../../../components/openGraph/OgDescription'
import {SeoFieldsPluginConfig} from '../../../plugin'
import {getFieldHiddenFunction, getFieldInfo} from '../../../utils/fieldsUtils'

export default function openGraph(config: SeoFieldsPluginConfig = {}) {
  return defineType({
    name: 'openGraph',
    title: 'Open Graph Settings',
    type: 'object',
    fields: [
      defineField({
        name: 'url',
        type: 'url',
        ...getFieldInfo('openGraphUrl', config.fieldOverrides),
        hidden: getFieldHiddenFunction('openGraphUrl', config),
        description:
          'The canonical URL of the page. This should be the full URL including protocol (https://).',
      }),
      defineField({
        name: 'title',
        ...getFieldInfo('openGraphTitle', config.fieldOverrides),
        type: 'string',
        hidden: getFieldHiddenFunction('openGraphTitle', config),
        components: {
          input: OgTitle, // Can also wrap with a string input + preview
        },
      }),
      defineField({
        name: 'description',
        ...getFieldInfo('openGraphDescription', config.fieldOverrides),
        type: 'text',
        rows: 3,
        hidden: getFieldHiddenFunction('openGraphDescription', config),
        components: {
          input: OgDescription, // Can also wrap with a text area + preview
        },
      }),
      defineField({
        name: 'siteName',
        ...getFieldInfo('openGraphSiteName', config.fieldOverrides),
        type: 'string',
        hidden: getFieldHiddenFunction('openGraphSiteName', config),
      }),
      defineField({
        name: 'type',
        ...getFieldInfo('openGraphType', config.fieldOverrides),
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
        hidden: getFieldHiddenFunction('openGraphType', config),
        initialValue: 'website',
      }),
      defineField({
        name: 'imageType',
        ...getFieldInfo('openGraphImageType', config.fieldOverrides),
        type: 'string',
        options: {
          list: [
            {title: 'Upload Image', value: 'upload'},
            {title: 'Image URL', value: 'url'},
          ],
        },
        hidden: getFieldHiddenFunction('openGraphImage', config),
        initialValue: 'upload',
      }),
      defineField({
        name: 'image',
        ...getFieldInfo('openGraphImage', config.fieldOverrides),
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          defineField({
            name: 'alt',
            title: 'Image Alt Text',
            type: 'string',
            description: 'A description of the image for accessibility purposes.',
          }),
        ],
        hidden: ({parent}) => parent?.imageType !== 'upload',
      }),
      defineField({
        name: 'imageUrl',
        ...getFieldInfo('openGraphImageUrl', config.fieldOverrides),
        type: 'url',
        hidden: ({parent}) => parent?.imageType !== 'url',
      }),
    ],
  })
}
