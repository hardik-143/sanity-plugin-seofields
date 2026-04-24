import type {SchemaTypeDefinition} from 'sanity'

import {descriptionField, nameField, polymorphicImage} from '../_shared'
import {generateSchemaType, SchemaFieldDef, SchemaOrgConfig} from '../generator'
import {SchemaOrgIcons} from '../icons'
import type {SchemaOrgHowToConfig, SchemaOrgHowToData} from './types'

// ─── Field Definitions ────────────────────────────────────────────────────────

export const howToFields: SchemaFieldDef[] = [
  nameField({
    title: 'HowTo Name',
    description: 'The name of the how-to guide.',
    required: {key: 'nameRequired', message: 'Name is required for Schema.org HowTo.'},
  }),
  descriptionField({
    required: {
      key: 'descriptionRequired',
      message: 'Description is required for Schema.org HowTo.',
    },
  }),
  polymorphicImage({description: 'Image for this how-to guide.'}),
  {
    name: 'totalTime',
    title: 'Total Time',
    type: 'string',
    description: 'Total time to complete, in ISO 8601 duration format (e.g. "PT30M" for 30 min).',
  },
  {
    name: 'estimatedCost',
    title: 'Estimated Cost',
    type: 'object',
    description: 'The estimated cost to complete this how-to.',
    jsonLdType: 'MonetaryAmount',
    fields: [
      {
        name: 'currency',
        title: 'Currency',
        type: 'string',
        description: 'ISO 4217 currency code, e.g. "USD".',
        initialValue: 'USD',
      },
      {
        name: 'value',
        title: 'Value',
        type: 'string',
        description: 'The cost amount, e.g. "25.00".',
      },
    ],
  },
  {
    name: 'supply',
    title: 'Supplies',
    type: 'array',
    description: 'Supplies needed for this how-to.',
    jsonLdType: 'HowToSupply',
    fields: [
      {
        name: 'name',
        title: 'Supply Name',
        type: 'string',
      },
    ],
  },
  {
    name: 'tool',
    title: 'Tools',
    type: 'array',
    description: 'Tools needed for this how-to.',
    jsonLdType: 'HowToTool',
    fields: [
      {
        name: 'name',
        title: 'Tool Name',
        type: 'string',
      },
    ],
  },
  {
    name: 'step',
    title: 'Steps',
    type: 'array',
    jsonLdType: 'HowToStep',
    fields: [
      {
        name: 'name',
        title: 'Step Name',
        type: 'string',
        required: {key: 'stepNameRequired', message: 'Step name is required.'},
      },
      {
        name: 'text',
        title: 'Step Description',
        type: 'text',
        rows: 2,
      },
      {
        name: 'url',
        title: 'Step URL',
        type: 'url',
        description: 'URL for this specific step (if applicable).',
      },
      {
        name: 'image',
        title: 'Step Image URL',
        type: 'url',
        description: 'URL of an image for this step.',
      },
    ],
  },
]

// ─── Schema Factory ───────────────────────────────────────────────────────────

/**
 * Schema.org HowTo — Sanity object type.
 */
export default function schemaOrgHowTo(config: SchemaOrgHowToConfig = {}): SchemaTypeDefinition {
  return generateSchemaType(
    {
      name: 'schemaOrgHowTo',
      title: 'HowTo',
      icon: SchemaOrgIcons.howTo,
      fields: howToFields,
      customPrepareSubtitle: (document: SchemaOrgHowToData) => {
        const name = document.name || 'Untitled how-to'
        const steps = Array.isArray(document.step) ? ` · ${document.step.length} steps` : ''
        return `${name}${steps}`
      },
    },
    config as SchemaOrgConfig,
  )
}
