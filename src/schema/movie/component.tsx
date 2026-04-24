import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {movieFields} from './schema'
import type {SchemaOrgMovieData} from './types'

export interface MovieSchemaProps {
  data?: SchemaOrgMovieData | null
}

export function buildMovieJsonLd(data?: SchemaOrgMovieData | null): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Movie',
    data as Record<string, unknown> | null | undefined,
    movieFields,
    ['name'],
  )
}

export function MovieSchema({data}: MovieSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildMovieJsonLd(data)} />
}

export default MovieSchema
