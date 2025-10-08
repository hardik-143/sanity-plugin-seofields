import {SchemaTypeDefinition} from 'sanity'
// Import all schema definitions
import allSchemas from '../schemas/types'

interface JsonSchemaProperty {
  type?: string | string[]
  items?: JsonSchemaProperty
  properties?: Record<string, JsonSchemaProperty>
  required?: string[]
  enum?: string[]
  const?: any
  default?: any
  description?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  format?: string
  $ref?: string
  allOf?: JsonSchemaProperty[]
  additionalProperties?: boolean
}

interface JsonSchema {
  $schema: string
  title: string
  description: string
  type: string
  definitions: Record<string, JsonSchemaProperty>
  properties: Record<string, JsonSchemaProperty>
  additionalProperties: boolean
}

/**
 * Converts Sanity field type to JSON Schema type
 */
function mapSanityTypeToJsonSchema(sanityType: string): string | string[] {
  const typeMap: Record<string, string | string[]> = {
    string: 'string',
    text: 'string',
    number: 'number',
    boolean: 'boolean',
    array: 'array',
    object: 'object',
    image: 'object',
    url: 'string',
    date: 'string',
    datetime: 'string',
    reference: 'object',
  }

  return typeMap[sanityType] || 'string'
}

/**
 * Converts Sanity field definition to JSON Schema property
 */
function convertSanityFieldToJsonSchema(field: any): JsonSchemaProperty {
  const jsonSchemaProperty: JsonSchemaProperty = {
    type: mapSanityTypeToJsonSchema(field.type),
  }

  // Add description
  if (field.description) {
    jsonSchemaProperty.description = field.description
  }

  // Handle validation rules
  if (field.validation) {
    // This would need to be expanded based on your validation rules
    // For now, we'll handle common cases
  }

  // Handle different field types
  switch (field.type) {
    case 'string':
      if (field.options?.list) {
        jsonSchemaProperty.enum = field.options.list.map((item: any) =>
          typeof item === 'string' ? item : item.value,
        )
      }
      if (field.validation) {
        // Add length constraints if available
      }
      break

    case 'text':
      jsonSchemaProperty.type = 'string'
      break

    case 'url':
      jsonSchemaProperty.type = 'string'
      jsonSchemaProperty.format = 'uri'
      break

    case 'array':
      jsonSchemaProperty.type = 'array'
      if (field.of && field.of[0]) {
        if (typeof field.of[0] === 'string') {
          jsonSchemaProperty.items = {type: 'string'}
        } else if (field.of[0].type) {
          jsonSchemaProperty.items = convertSanityFieldToJsonSchema(field.of[0])
        }
      }
      break

    case 'object':
      jsonSchemaProperty.type = 'object'
      if (field.fields) {
        jsonSchemaProperty.properties = {}
        const required: string[] = []

        field.fields.forEach((subField: any) => {
          if (subField.name) {
            jsonSchemaProperty.properties![subField.name] = convertSanityFieldToJsonSchema(subField)
            if (subField.required) {
              required.push(subField.name)
            }
          }
        })

        if (required.length > 0) {
          jsonSchemaProperty.required = required
        }
      }
      jsonSchemaProperty.additionalProperties = false
      break

    case 'image':
      jsonSchemaProperty.$ref = '#/definitions/SanityImage'
      break

    case 'reference':
      jsonSchemaProperty.type = 'object'
      jsonSchemaProperty.properties = {
        _ref: {type: 'string'},
        _type: {type: 'string', const: 'reference'},
      }
      jsonSchemaProperty.required = ['_ref', '_type']
      break
  }

  // Handle initial values as defaults
  if (field.initialValue !== undefined) {
    jsonSchemaProperty.default = field.initialValue
  }

  // Handle hidden fields (not really applicable to JSON Schema but we can note it)
  if (field.hidden) {
    jsonSchemaProperty.description = (jsonSchemaProperty.description || '') + ' (Hidden field)'
  }

  // Handle read-only fields
  if (field.readOnly) {
    jsonSchemaProperty.description = (jsonSchemaProperty.description || '') + ' (Read-only)'
  }

  return jsonSchemaProperty
}

/**
 * Converts a Sanity schema definition to JSON Schema definition
 */
function convertSanitySchemaToJsonSchema(schemaDefinition: any): JsonSchemaProperty {
  const jsonSchemaDefinition: JsonSchemaProperty = {
    type: 'object',
    properties: {},
    additionalProperties: false,
  }

  // Add _type property
  if (schemaDefinition.name) {
    jsonSchemaDefinition.properties!._type = {
      type: 'string',
      const: schemaDefinition.name,
    }
  }

  // Add title and description
  if (schemaDefinition.title) {
    jsonSchemaDefinition.description = schemaDefinition.title
  }

  // Convert fields
  if ('fields' in schemaDefinition && schemaDefinition.fields) {
    const required: string[] = ['_type']

    schemaDefinition.fields.forEach((field: any) => {
      if (field.name) {
        jsonSchemaDefinition.properties![field.name] = convertSanityFieldToJsonSchema(field)
        if (field.required) {
          required.push(field.name)
        }
      }
    })

    if (required.length > 1) {
      // More than just _type
      jsonSchemaDefinition.required = required
    } else {
      jsonSchemaDefinition.required = ['_type']
    }
  }

  return jsonSchemaDefinition
}

/**
 * Generates a complete JSON Schema from Sanity schema definitions
 */
function generateSchemaJson(): JsonSchema {
  const schemas = allSchemas

  const jsonSchema: JsonSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Sanity SEO Fields Plugin Schema',
    description:
      'Schema definitions for SEO fields including meta tags, Open Graph, and X (Formerly Twitter) Card settings',
    type: 'object',
    definitions: {},
    properties: {},
    additionalProperties: false,
  }

  // Add SanityImage definition
  jsonSchema.definitions.SanityImage = {
    type: 'object',
    properties: {
      _type: {type: 'string', const: 'image'},
      asset: {
        type: 'object',
        properties: {
          _ref: {type: 'string'},
          _type: {type: 'string', const: 'reference'},
        },
        required: ['_ref', '_type'],
      },
      hotspot: {
        type: 'object',
        properties: {
          x: {type: 'number'},
          y: {type: 'number'},
          height: {type: 'number'},
          width: {type: 'number'},
        },
      },
      crop: {
        type: 'object',
        properties: {
          top: {type: 'number'},
          bottom: {type: 'number'},
          left: {type: 'number'},
          right: {type: 'number'},
        },
      },
      alt: {type: 'string'},
    },
    required: ['_type', 'asset'],
  }

  // Convert each schema
  schemas().forEach((schema) => {
    if (schema.name) {
      const jsonSchemaDefinition = convertSanitySchemaToJsonSchema(schema)
      jsonSchema.definitions[schema.name] = jsonSchemaDefinition
      jsonSchema.properties[schema.name] = {$ref: `#/definitions/${schema.name}`}
    }
  })

  return jsonSchema
}

/**
 * Writes the generated schema to a file
 */
export function writeSchemaJson(outputPath: string = './schema.json'): void {
  const schema = generateSchemaJson()
  const fs = require('fs')

  try {
    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2))
    console.log(`✅ Schema.json generated successfully at: ${outputPath}`)
  } catch (error) {
    console.error('❌ Error writing schema.json:', error)
    throw error
  }
}

/**
 * Returns the generated schema as an object
 */
export function getSchemaJson(): JsonSchema {
  return generateSchemaJson()
}

export default generateSchemaJson
