/**
 * Dynamic Sanity schema generator for Schema.org types.
 *
 * Each Schema.org type declares its fields as a plain `SchemaFieldDef[]` array.
 * The generator converts them into Sanity `defineType` / `defineField` calls,
 * wiring up validation, initial values, options, and nested objects/arrays
 * automatically.
 *
 * It also provides a generic JSON-LD builder and React component factory so
 * adding a new Schema.org type requires only a field definition array.
 */
import React from 'react'
import {defineField, defineType, FieldDefinition, SchemaTypeDefinition} from 'sanity'

// ─── Field Definition Types ───────────────────────────────────────────────────

export interface SchemaFieldOption {
  title: string
  value: string
}

export interface SchemaFieldDef {
  /** Sanity field name */
  name: string
  /** Human-readable title shown in Studio */
  title: string
  /** Sanity field type */
  type: 'string' | 'url' | 'text' | 'array' | 'object' | 'image' | 'number' | 'date' | 'datetime'
  /** Help text shown below the field */
  description?: string
  /** If set, field is required — key is the validation config key, message is the default */
  required?: {key: string; message: string}
  /** Initial value for the field */
  initialValue?: unknown
  /** Dropdown / radio options for string fields */
  options?: SchemaFieldOption[]
  /** Number of rows for text fields */
  rows?: number
  /** Array member types, e.g. [{type: 'string'}] */
  of?: {type: string}[]
  /** Nested fields for object type */
  fields?: SchemaFieldDef[]
  /** Schema.org @type for this nested object or array items in JSON-LD output */
  jsonLdType?: string
  /** JSON-LD key if different from the Sanity field name */
  jsonLdKey?: string
}

// ─── Schema Type Definition ───────────────────────────────────────────────────

export interface SchemaTypeDef {
  /** Sanity type name, e.g. "schemaOrgWebsite" */
  name: string
  /** Title shown in Studio, e.g. "Schema.org — Website" */
  title: string
  /** Icon component shown in Studio and the array grid picker */
  icon?: React.ComponentType
  /** Field definitions */
  fields: SchemaFieldDef[]
}

// ─── Shared Config Shape ──────────────────────────────────────────────────────

export interface SchemaOrgConfig {
  /** Custom validation error messages keyed by field config key */
  validation?: Record<string, string>
}

// ─── Sanity Schema Generator ─────────────────────────────────────────────────

/** Recursively converts a `SchemaFieldDef` into a Sanity `FieldDefinition`. */
function buildField(
  fieldDef: SchemaFieldDef,
  validation?: Record<string, string>,
): FieldDefinition {
  const base: Record<string, unknown> = {
    name: fieldDef.name,
    title: fieldDef.title,
    type: fieldDef.type,
  }

  if (fieldDef.description) base.description = fieldDef.description
  if (fieldDef.initialValue !== undefined) base.initialValue = fieldDef.initialValue
  if (fieldDef.rows) base.rows = fieldDef.rows

  if (fieldDef.options) {
    base.options = {list: fieldDef.options}
  }

  // Array of objects: auto-generate `of: [{ type: 'object', fields }]`
  if (fieldDef.type === 'array' && fieldDef.fields?.length && !fieldDef.of) {
    base.of = [
      {
        type: 'object',
        fields: fieldDef.fields.map((child) => buildField(child, validation)),
      },
    ]
  } else if (fieldDef.of) {
    base.of = fieldDef.of
  }

  // Nested object fields — recurse (only for non-array types)
  if (fieldDef.type !== 'array' && fieldDef.fields?.length) {
    base.fields = fieldDef.fields.map((child) => buildField(child, validation))
  }

  // Required validation with configurable message
  if (fieldDef.required) {
    const msg = validation?.[fieldDef.required.key] ?? fieldDef.required.message
    base.validation = (Rule: {required: () => {error: (m: string) => unknown}}) =>
      Rule.required().error(msg)
  }

  return defineField(base as unknown as FieldDefinition)
}

/**
 * Generates a complete Sanity `SchemaTypeDefinition` from a declarative
 * `SchemaTypeDef` and optional user config.
 */
export function generateSchemaType(
  def: SchemaTypeDef,
  config: SchemaOrgConfig = {},
): SchemaTypeDefinition {
  return defineType({
    name: def.name,
    title: def.title,
    type: 'object',
    ...(def.icon && {icon: def.icon}),
    fields: def.fields.map((f) => buildField(f, config.validation)),
    preview: {
      select: {
        title: 'name',
      },
      prepare(selection) {
        return {
          title: selection.title || def.title,
          subtitle: `@type: ${def.title.split('—')[1]?.trim() || def.title}`,
          ...(def.icon && {media: def.icon}),
        }
      },
    },
  })
}

// ─── Generic JSON-LD Builder ──────────────────────────────────────────────────

/** Sanity-internal keys that should never appear in JSON-LD output. */
const SANITY_INTERNAL_KEYS = new Set([
  '_key',
  '_type',
  '_ref',
  '_id',
  '_rev',
  '_createdAt',
  '_updatedAt',
])

/**
 * Recursively builds a JSON-LD fragment from Sanity data using field defs.
 * Handles nested objects with `@type` and arrays of typed objects.
 */
function buildNestedJsonLd(
  data: Record<string, unknown>,
  fieldDefs: SchemaFieldDef[],
  jsonLdType?: string,
): Record<string, unknown> {
  const result: Record<string, unknown> = jsonLdType ? {'@type': jsonLdType} : {}

  for (const field of fieldDefs) {
    const value = data[field.name]
    if (value === undefined || value === null || value === '') continue

    const key = field.jsonLdKey ?? field.name

    if (
      field.type === 'object' &&
      field.fields &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      const nested = buildNestedJsonLd(
        value as Record<string, unknown>,
        field.fields,
        field.jsonLdType,
      )
      const minKeys = field.jsonLdType ? 1 : 0
      if (Object.keys(nested).length > minKeys) {
        result[key] = nested
      }
    } else if (field.type === 'array' && Array.isArray(value)) {
      if (field.fields && field.jsonLdType) {
        // Array of typed objects
        const items = value
          .filter(
            (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
          )
          .map((item) => buildNestedJsonLd(item, field.fields!, field.jsonLdType))
        if (items.length) result[key] = items
      } else if (value.length) {
        // Simple array (strings, urls, etc.)
        result[key] = value.filter((v) => v !== undefined && v !== null && v !== '')
      }
    } else if (!SANITY_INTERNAL_KEYS.has(field.name)) {
      result[key] = value
    }
  }

  return result
}

/**
 * Builds a complete Schema.org JSON-LD object from Sanity data using field defs.
 * Returns `null` if any of the `requiredFields` are missing.
 *
 * @param schemaType  The Schema.org `@type` (e.g. "Person", "Article")
 * @param data        Raw data from a Sanity GROQ query
 * @param fieldDefs   The field definitions for this schema type
 * @param requiredFields  Field names that must be present (returns null if missing)
 */
export function buildGenericJsonLd(
  schemaType: string,
  data: Record<string, unknown> | null | undefined,
  fieldDefs: SchemaFieldDef[],
  requiredFields: string[] = [],
): Record<string, unknown> | null {
  if (!data) return null
  for (const req of requiredFields) {
    if (!data[req]) return null
  }

  const body = buildNestedJsonLd(data, fieldDefs)
  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    ...body,
  }
}
