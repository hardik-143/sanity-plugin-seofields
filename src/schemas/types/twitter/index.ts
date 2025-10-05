import {defineField, defineType} from 'sanity'
import TwitterTitle from '../../../components/twitter/twitterTitle'
import TwitterDescription from '../../../components/twitter/twitterDescription'

export default defineType({
  name: 'twitter',
  title: 'Twitter',
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
      title: 'Site Twitter Handle',
      type: 'string',
      description: 'The Twitter handle of the website (e.g., @example)',
    }),
    defineField({
      name: 'creator',
      title: 'Twitter Creator Handle',
      type: 'string',
      description: 'The Twitter handle of the content creator (e.g., @creator)',
    }),
    defineField({
      name: 'title',
      title: 'Twitter Title',
      type: 'string',
      description: 'The title of the content as it should appear on Twitter.',
      components: {
        input: TwitterTitle,
      },
    }),
    defineField({
      name: 'description',
      title: 'Twitter Description',
      type: 'text',
      rows: 3,
      description: 'A brief description of the content for Twitter.',
      components: {
        input: TwitterDescription,
      },
    }),
    defineField({
      name: 'image',
      title: 'Twitter Image',
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
