import {defineField, defineType, SchemaTypeDefinition} from 'sanity'

import TwitterDescription from '../../../components/twitter/twitterDescription'
import TwitterTitle from '../../../components/twitter/twitterTitle'
import {SeoFieldsPluginConfig} from '../../../plugin'
import {getFieldHiddenFunction, getFieldInfo} from '../../../utils/fieldsUtils'

export default function twitter(config: SeoFieldsPluginConfig = {}): SchemaTypeDefinition {
  return defineType({
    name: 'twitter',
    title: 'X (Formerly Twitter)',
    type: 'object',
    fields: [
      defineField({
        name: 'card',
        ...getFieldInfo('twitterCard', config.fieldOverrides),
        type: 'string',
        options: {
          list: [
            {title: 'Summary', value: 'summary'},
            {title: 'Summary with Large Image', value: 'summary_large_image'},
            {title: 'App', value: 'app'},
            {title: 'Player', value: 'player'},
          ],
        },
        hidden: getFieldHiddenFunction('twitterCard', config),
        initialValue: 'summary_large_image', // good default
      }),
      defineField({
        name: 'site',
        ...getFieldInfo('twitterSite', config.fieldOverrides),
        type: 'string',
        hidden: getFieldHiddenFunction('twitterSite', config),
      }),
      defineField({
        name: 'creator',
        type: 'string',
        ...getFieldInfo('twitterCreator', config.fieldOverrides),
        hidden: getFieldHiddenFunction('twitterCreator', config),
      }),
      defineField({
        name: 'title',
        type: 'string',
        ...getFieldInfo('twitterTitle', config.fieldOverrides),
        hidden: getFieldHiddenFunction('twitterTitle', config),
        components: {
          input: TwitterTitle,
        },
      }),
      defineField({
        name: 'description',
        type: 'text',
        rows: 3,
        ...getFieldInfo('twitterDescription', config.fieldOverrides),
        hidden: getFieldHiddenFunction('twitterDescription', config),
        components: {
          input: TwitterDescription,
        },
      }),
      defineField({
        name: 'imageType',
        ...getFieldInfo('twitterImageType', config.fieldOverrides),
        type: 'string',
        options: {
          list: [
            {title: 'Upload Image', value: 'upload'},
            {title: 'Image URL', value: 'url'},
          ],
        },
        hidden: getFieldHiddenFunction('twitterImage', config),
        initialValue: 'upload',
      }),
      defineField({
        name: 'image',
        ...getFieldInfo('twitterImage', config.fieldOverrides),
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
        hidden: (context) => {
          const {parent} = context
          if (parent?.imageType !== 'upload') return true
          const hiddenFn = getFieldHiddenFunction('twitterImage', config)
          return typeof hiddenFn === 'function' ? hiddenFn(context) : hiddenFn
        },
      }),
      defineField({
        name: 'imageUrl',
        ...getFieldInfo('twitterImageUrl', config.fieldOverrides),
        type: 'url',
        hidden: (context) => {
          const {parent} = context
          if (parent?.imageType !== 'url') return true
          const hiddenFn = getFieldHiddenFunction('twitterImage', config)
          return typeof hiddenFn === 'function' ? hiddenFn(context) : hiddenFn
        },
      }),
    ],
  })
}
