import type {SchemaTypeDefinition} from 'sanity'

import {nameField, polymorphicAuthor, polymorphicImage, polymorphicPublisher} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgBookConfig, SchemaOrgBookData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const bookFields: SchemaFieldDef[] = [
  nameField({
    title: 'Book Title',
    description: 'The title of the book.',
    required: {key: 'nameRequired', message: 'Book title is required.'},
  }),
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 4,
    description: 'A description or summary of the book.',
  },
  polymorphicImage({description: 'Cover image of the book.'}),
  polymorphicAuthor({description: 'The author of the book.'}),
  polymorphicPublisher({description: 'The publisher of the book.'}),
  {
    name: 'isbn',
    title: 'ISBN',
    type: 'string',
    description: 'International Standard Book Number.',
  },
  {
    name: 'bookFormat',
    title: 'Book Format',
    type: 'string',
    description: 'The format of the book.',
    options: [
      {title: 'Hardcover', value: 'https://schema.org/Hardcover'},
      {title: 'Paperback', value: 'https://schema.org/Paperback'},
      {title: 'EBook', value: 'https://schema.org/EBook'},
      {title: 'AudiobookFormat', value: 'https://schema.org/AudiobookFormat'},
      {title: 'GraphicNovel', value: 'https://schema.org/GraphicNovel'},
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgBook(config: SchemaOrgBookConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgBook',
      title: 'Book',
      icon: SchemaOrgIcons.book,
      fields: bookFields,
      customPrepareSubtitle: (document: SchemaOrgBookData) => {
        const name = document.name || 'Untitled'
        const isbn = document.isbn ? ` · ISBN: ${document.isbn}` : ''
        return `${name}${isbn}`
      },
    },
    config as SchemaOrgConfig,
  )
}
