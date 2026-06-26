import type {SchemaFieldDef} from './generator'

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
  // Return true (consumed) even when nestedSrc is null/empty so the raw
  // { variant: '...' } object is never passed to the generic emitter and
  // leaked into the JSON-LD output as an unrecognised schema.org property.
  if (typeof nestedSrc !== 'object' || nestedSrc === null) return true

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
