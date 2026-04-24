import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField, polymorphicAuthor, polymorphicImage} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgMovieConfig, SchemaOrgMovieData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const movieFields: SchemaFieldDef[] = [
  nameField({
    title: 'Movie Title',
    description: 'The title of the movie.',
    required: {key: 'nameRequired', message: 'Movie title is required.'},
  }),
  descriptionField({
    title: 'Plot Summary',
    description: 'A plot summary or synopsis of the movie.',
    required: {
      key: 'descriptionRequired',
      message: 'Description is required for Schema.org Movie.',
    },
  }),
  polymorphicImage({description: 'Poster or still from the movie.'}),
  {
    name: 'dateCreated',
    title: 'Date Created',
    type: 'date',
    description: 'The date the movie was released or created.',
  },
  polymorphicAuthor({
    name: 'director',
    title: 'Director',
    description: 'The director of the movie.',
  }),
  {
    name: 'duration',
    title: 'Duration',
    type: 'string',
    description: 'ISO 8601 duration, e.g. "PT2H30M" for 2h 30m.',
  },
  {
    name: 'contentRating',
    title: 'Content Rating',
    type: 'string',
    description: 'e.g. "PG-13", "R", "U/A".',
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

export default function schemaOrgMovie(config: SchemaOrgMovieConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgMovie',
      title: 'Movie',
      icon: SchemaOrgIcons.movie,
      fields: movieFields,
      customPrepareSubtitle: (document: SchemaOrgMovieData) => {
        const name = document.name || 'Untitled'
        const year = document.dateCreated ? ` (${document.dateCreated.slice(0, 4)})` : ''
        return `${name}${year}`
      },
    },
    config as SchemaOrgConfig,
  )
}
