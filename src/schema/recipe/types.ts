// ─── Recipe Schema Types ──────────────────────────────────────────────────────

import type {SchemaOrgAggregateRating, SchemaOrgCreativeWorkData} from '../_types'

/** Nutrition info nested within the Recipe schema */
export interface RecipeNutrition {
  /** Calorie count, e.g. "250 calories" */
  calories?: string
}

/** A single instruction step */
export interface RecipeInstruction {
  /** Step name */
  name?: string
  /** Step text */
  text?: string
}

/** Video info nested within the Recipe schema */
export interface RecipeVideo {
  /** Video name */
  name?: string
  /** Video description */
  description?: string
  /** URL of the video thumbnail */
  thumbnailUrl?: string
  /** URL of the video file */
  contentUrl?: string
  /** Date the video was uploaded */
  uploadDate?: string
}

/** Schema.org Recipe — data shape returned from a Sanity GROQ query */
export interface SchemaOrgRecipeData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgRecipe'
  /** Prep time (ISO 8601 duration) */
  prepTime?: string
  /** Cook time (ISO 8601 duration) */
  cookTime?: string
  /** Total time (ISO 8601 duration) */
  totalTime?: string
  /** Category, e.g. Dessert */
  recipeCategory?: string
  /** Cuisine, e.g. Italian */
  recipeCuisine?: string
  /** Yield, e.g. "4 servings" */
  recipeYield?: string
  /** Nutrition information */
  nutrition?: RecipeNutrition
  /** List of ingredients */
  recipeIngredient?: string[]
  /** Step-by-step instructions */
  recipeInstructions?: RecipeInstruction[]
  /** Override with typed shape */
  aggregateRating?: SchemaOrgAggregateRating
  /** Recipe video */
  video?: RecipeVideo
}

// ─── Plugin Configuration Types ───────────────────────────────────────────────

/** Configuration for `schemaOrgRecipe()` */
export interface SchemaOrgRecipeConfig {
  /** Custom validation messages */
  validation?: {
    /** Custom error message when recipe name is missing */
    nameRequired?: string
  }
}
