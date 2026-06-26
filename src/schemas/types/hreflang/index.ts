import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'hreflangEntry',
  title: 'Hreflang Entry',
  type: 'object',
  fields: [
    defineField({
      name: 'locale',
      title: 'Language / Region',
      type: 'string',
      description: 'BCP 47 tag — e.g. en, fr-FR, x-default',
      validation: (Rule) =>
        Rule.required().custom((value: string | undefined) => {
          if (!value) return 'Required'
          if (!/^(x-default|[a-z]{2,3}(-[A-Z]{2,3})?)$/.test(value)) {
            return 'Must be a valid BCP 47 tag (e.g. en, fr-FR, x-default)'
          }
          return true
        }),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'locale',
      subtitle: 'url',
    },
  },
})
