import {defineField, defineType} from 'sanity'
import TwitterTitle from '../../../components/twitter/twitterTitle'
import TwitterDescription from '../../../components/twitter/twitterDescription'
import {SeoFieldsPluginConfig} from '../../../plugin'
import {getFieldHiddenFunction} from '../../../utils/fieldsUtils'

export default function twitter(config: SeoFieldsPluginConfig = {}) {
  return defineType({
    name: 'twitter',
    title: 'X (Formerly Twitter)',
    type: 'object',
    fields: [
    defineField({
      name: 'card',
      title: 'Card Type',
      type: 'string',
      options: {
        list: [
          {title: 'Summary', value: 'summary'},
          {title: 'Summary with Large Image', value: 'summary_large_image'},
          {title: 'App', value: 'app'},
          {title: 'Player', value: 'player'},
        ],
      },
      initialValue: 'summary_large_image', // good default
    }),
    defineField({
      name: 'site',
      title: 'Site X Handle',
      type: 'string',
      description: 'The X (formerly Twitter) handle of the website (e.g., @example)',
      hidden: getFieldHiddenFunction('twitterSite', config),
    }),
    defineField({
      name: 'creator',
      title: 'Twitter Creator Handle',
      type: 'string',
      description: 'The Twitter handle of the content creator (e.g., @creator)',
    }),
    defineField({
      name: 'title',
      title: 'X Title',
      type: 'string',
      description: 'The title of the content as it should appear on X (formerly Twitter).',
      components: {
        input: TwitterTitle,
      },
    }),
    defineField({
      name: 'description',
      title: 'X Description',
      type: 'text',
      rows: 3,
      description: 'A brief description of the content for X (formerly Twitter).',
      components: {
        input: TwitterDescription,
      },
    }),
    defineField({
      name: 'image',
      title: 'X Image',
      type: 'image',
      description:
        'An image URL which should be at least 120x120px for "summary" card and 280x150px for "summary_large_image" card.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Image Alt Text',
          type: 'string',
          description: 'Short alt text describing the image',
        }),
      ],
    }),
  ],
  })
}
