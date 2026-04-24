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

export interface SchemaFieldVariant {
  /** Discriminator value, e.g. "url", "imageObject", "person" */
  value: string
  /** Human-readable title for the radio option */
  title: string
  /** Schema.org @type emitted in JSON-LD when this variant is active */
  jsonLdType?: string
  /**
   * Fields shown when this variant is selected. If a single field with the
   * variant's `value` as its name is provided, the variant collapses to that
   * inline value in JSON-LD (e.g. plain url string).
   */
  // eslint-disable-next-line no-use-before-define
  fields: SchemaFieldDef[]
}

export interface SchemaFieldDef {
  /** Sanity field name */
  name: string
  /** Human-readable title shown in Studio */
  title: string
  /** Sanity field type */
  type:
    | 'string'
    | 'url'
    | 'text'
    | 'array'
    | 'object'
    | 'image'
    | 'number'
    | 'date'
    | 'datetime'
    | 'boolean'
    | 'select'
    | 'copyrightYear'
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
  /** For url field: validation options */
  urlValidation?: {
    /** Allowed URL schemes. Defaults to ['http', 'https']. */
    schemes?: string[]
    /** If true, allow relative URLs. Defaults to false. */
    allowRelative?: boolean
  }
  /** For select type: discriminated union variants */
  variants?: SchemaFieldVariant[]
  /** For select type: default variant value (defaults to first variant) */
  defaultVariant?: string
  /** For string fields with options: Sanity layout ('radio' | 'dropdown') */
  layout?: 'radio' | 'dropdown'
}

// ─── Schema Type Definition ───────────────────────────────────────────────────

export interface SchemaTypeDef {
  /** Sanity type name, e.g. "schemaOrgWebsite" */
  name: string
  /** Title shown in Studio, e.g. "Website" */
  title: string
  /** Icon component shown in Studio and the array grid picker */
  icon?: React.ComponentType
  /** Field definitions */
  fields: SchemaFieldDef[]
  /** Optional custom subtitle generator for the Studio preview */
  customPrepareSubtitle?: (document: Record<string, unknown>) => string
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
  // ─── Polymorphic select (variant discriminator + per-variant nested objects) ─
  if (fieldDef.type === 'select' && fieldDef.variants?.length) {
    const variants = fieldDef.variants
    const defaultVariant = fieldDef.defaultVariant ?? variants[0].value
    const innerFields: SchemaFieldDef[] = [
      {
        name: 'variant',
        title: 'Type',
        type: 'string',
        description: 'Choose how to provide this value.',
        initialValue: defaultVariant,
        options: variants.map((v) => ({title: v.title, value: v.value})),
        layout: 'radio',
      },
      ...variants.map<SchemaFieldDef>((v) => {
        // Single-field variant collapses to that field directly (e.g. plain url)
        if (v.fields.length === 1 && v.fields[0].name === v.value) {
          return v.fields[0]
        }
        return {
          name: v.value,
          title: v.title,
          type: 'object',
          jsonLdType: v.jsonLdType,
          fields: v.fields,
        }
      }),
    ]
    const base: Record<string, unknown> = {
      name: fieldDef.name,
      title: fieldDef.title,
      type: 'object',
      fields: innerFields.map((child) => {
        const built = buildField(child, validation) as unknown as Record<string, unknown>
        if (child.name !== 'variant') {
          const dv = defaultVariant
          built.hidden = ({parent}: {parent?: {variant?: string}}) =>
            (parent?.variant ?? dv) !== child.name
        }
        return built as unknown as FieldDefinition
      }),
    }
    if (fieldDef.description) base.description = fieldDef.description
    return defineField(base as unknown as FieldDefinition)
  }

  // ─── copyrightYear: { useDynamicYear: bool, year: number } ───────────────────
  if (fieldDef.type === 'copyrightYear') {
    const base: Record<string, unknown> = {
      name: fieldDef.name,
      title: fieldDef.title,
      type: 'object',
      description:
        fieldDef.description ??
        'Copyright year. Toggle "Use current year" to emit the current year dynamically.',
      fields: [
        defineField({
          name: 'useDynamicYear',
          title: 'Use current year (dynamic)',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'year',
          title: 'Static year',
          type: 'number',
          hidden: ({parent}: {parent?: {useDynamicYear?: boolean}}) =>
            parent?.useDynamicYear === true,
        }),
      ],
    }
    return defineField(base as unknown as FieldDefinition)
  }

  const base: Record<string, unknown> = {
    name: fieldDef.name,
    title: fieldDef.title,
    type: fieldDef.type,
  }

  if (fieldDef.description) base.description = fieldDef.description
  if (fieldDef.initialValue !== undefined) base.initialValue = fieldDef.initialValue
  if (fieldDef.rows) base.rows = fieldDef.rows

  if (fieldDef.options) {
    base.options = {list: fieldDef.options, ...(fieldDef.layout && {layout: fieldDef.layout})}
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

  // URL-specific validation
  if (fieldDef.type === 'url' && (fieldDef.required || fieldDef.urlValidation)) {
    const required = fieldDef.required
    const requiredMsg = required ? (validation?.[required.key] ?? required.message) : undefined
    const schemes = fieldDef.urlValidation?.schemes ?? ['http', 'https']
    const allowRelative = fieldDef.urlValidation?.allowRelative ?? false
    base.validation = (Rule: {
      required: () => {error: (m: string) => unknown}
      uri: (opts: {scheme: string[]; allowRelative: boolean}) => {error: (m: string) => unknown}
    }) => {
      const checks: unknown[] = []
      if (requiredMsg) checks.push(Rule.required().error(requiredMsg))
      checks.push(
        Rule.uri({scheme: schemes, allowRelative}).error(
          `Must be a valid URL (${schemes.join(', ')}).`,
        ),
      )
      return checks
    }
  } else if (fieldDef.required) {
    const msg = validation?.[fieldDef.required.key] ?? fieldDef.required.message
    base.validation = (Rule: {required: () => {error: (m: string) => unknown}}) =>
      Rule.required().error(msg)
  }

  return defineField(base as unknown as FieldDefinition)
}

export function mapNameToSameValue(...items: {name: string}[]): Record<string, string> {
  return items.reduce(
    (acc, item) => {
      acc[item.name] = item.name
      return acc
    },
    {} as Record<string, string>,
  )
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
      select: mapNameToSameValue(...def.fields),
      prepare(selection) {
        return {
          title: def.title,
          subtitle: def?.customPrepareSubtitle
            ? def.customPrepareSubtitle(selection)
            : `@type: ${def.title}`,
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
 * Handles polymorphic select field serialization to JSON-LD.
 */
function handleSelectVariant(
  field: SchemaFieldDef,
  value: unknown,
  result: Record<string, unknown>,
  key: string,
): boolean {
  if (field.type !== 'select' || !field.variants?.length) return false
  if (typeof value !== 'object' || Array.isArray(value)) return false

  const obj = value as Record<string, unknown>
  if (typeof obj.variant !== 'string') return false

  const active = field.variants.find((v) => v.value === obj.variant)
  if (!active) return false

  // Inline single-field variant (e.g. plain url): emit the value directly
  if (active.fields.length === 1 && active.fields[0].name === active.value) {
    const inlineVal = obj[active.value]
    if (inlineVal !== undefined && inlineVal !== null && inlineVal !== '') {
      result[key] = inlineVal
    }
    return true
  }

  const nestedSrc = obj[active.value]
  if (typeof nestedSrc !== 'object' || nestedSrc === null) return false

  const nested = buildNestedJsonLd(
    nestedSrc as Record<string, unknown>,
    active.fields,
    active.jsonLdType,
  )
  if (Object.keys(nested).length > (active.jsonLdType ? 1 : 0)) {
    result[key] = nested
  }
  return true
}

/**
 * Handles copyrightYear field serialization to JSON-LD.
 */
function handleCopyrightYear(
  field: SchemaFieldDef,
  value: unknown,
  result: Record<string, unknown>,
  key: string,
): boolean {
  if (field.type !== 'copyrightYear') return false

  if (typeof value === 'number') {
    result[key] = value
    return true
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as {useDynamicYear?: boolean; year?: number}
    if (obj.useDynamicYear) {
      result[key] = new Date().getFullYear()
    } else if (typeof obj.year === 'number') {
      result[key] = obj.year
    }
    return true
  }

  return false
}

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

    if (handleSelectVariant(field, value, result, key)) continue
    if (handleCopyrightYear(field, value, result, key)) continue

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
