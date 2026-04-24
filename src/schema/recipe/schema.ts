import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField, polymorphicAuthor, polymorphicImage} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgRecipeConfig, SchemaOrgRecipeData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const recipeFields: SchemaFieldDef[] = [
  nameField({
    title: 'Recipe Name',
    description: 'The name of the recipe.',
    required: {key: 'nameRequired', message: 'Recipe name is required for Schema.org.'},
  }),
  descriptionField({
    title: 'Description',
    description: 'A description of the recipe.',
  }),
  polymorphicImage({description: 'Image of the finished recipe.'}),
  polymorphicAuthor({description: 'The author of the recipe.'}),
  {
    name: 'totalTime',
    title: 'Total Time',
    type: 'string',
    description: 'e.g. PT45M for 45 minutes',
  },
  {
    name: 'recipeCategory',
    title: 'Recipe Category',
    type: 'string',
    description: 'e.g. Dessert',
    options: [
      {title: 'Appetizer', value: 'Appetizer'},
      {title: 'Main Course', value: 'Main Course'},
      {title: 'Dessert', value: 'Dessert'},
      {title: 'Side Dish', value: 'Side Dish'},
      {title: 'Snack', value: 'Snack'},
      {title: 'Breakfast', value: 'Breakfast'},
      {title: 'Beverage', value: 'Beverage'},
    ],
  },
  {
    name: 'recipeIngredient',
    title: 'Ingredients',
    type: 'array',
    description: 'List of ingredients.',
    of: [{type: 'string'}],
  },
  {
    name: 'recipeInstructions',
    title: 'Instructions',
    type: 'array',
    description: 'Step-by-step instructions.',
    jsonLdType: 'HowToStep',
    fields: [
      {
        name: 'name',
        title: 'Step Name',
        type: 'string',
        description: 'Name of this step.',
      },
      {
        name: 'text',
        title: 'Step Text',
        type: 'text',
        rows: 2,
        description: 'Detailed instruction for this step.',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org Recipe — Sanity object type.
 */
export default function schemaOrgRecipe(config: SchemaOrgRecipeConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgRecipe',
      title: 'Recipe',
      icon: SchemaOrgIcons.recipe,
      fields: recipeFields,
      customPrepareSubtitle: (document: SchemaOrgRecipeData) => {
        const name = document.name || 'Untitled'
        const category = document.recipeCategory ? ` · ${document.recipeCategory}` : ''
        return `${name}${category}`
      },
    },
    config as SchemaOrgConfig,
  )
}
