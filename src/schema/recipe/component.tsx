import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {recipeFields} from './schema'
import type {SchemaOrgRecipeData} from './types'

export interface RecipeSchemaProps {
  data?: SchemaOrgRecipeData | null
}

export function buildRecipeJsonLd(
  data?: SchemaOrgRecipeData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'Recipe',
    data as Record<string, unknown> | null | undefined,
    recipeFields,
    ['name'],
  )
}

export function RecipeSchema({data}: RecipeSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildRecipeJsonLd(data)} />
}

export default RecipeSchema
