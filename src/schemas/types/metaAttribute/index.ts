import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'metaAttribute',
  title: 'Meta Attribute',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      title: 'Attribute Name',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Attribute Value Type',
      type: 'string',
      options: {
        list: [
          {title: 'String', value: 'string'},
          {title: 'Image', value: 'image'},
        ],
      },
      initialValue: 'string',
    }),
    defineField({
      name: 'value',
      title: 'Attribute Value',
      type: 'string',
      hidden: ({parent}) => parent?.type === 'image',
    }),
    defineField({
      name: 'image',
      title: 'Attribute Image Value',
      type: 'image',
      hidden: ({parent}) => parent?.type === 'string',
    }),
  ],
  preview: {
    select: {
      attributeName: 'key',
      attributeValueString: 'value',
      attributeValueImage: 'image',
    },
    prepare({
      attributeName,
      attributeValueString,
      attributeValueImage,
    }: {
      attributeName: string
      attributeValueString: string
      attributeValueImage: any
    }) {
      return {
        title: attributeName || 'No Attribute Name',
        subtitle: attributeValueString
          ? `Value: ${attributeValueString}`
          : attributeValueImage
            ? 'Value: [Image]'
            : 'No Attribute Value',
        media: attributeValueImage,
      }
    },
  },
})
