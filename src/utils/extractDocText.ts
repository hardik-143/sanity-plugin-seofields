import type {ContentBlock} from './readability'

type PortableTextSpan = {_type?: string; text?: string}
type AnyBlock = {_type?: string; children?: PortableTextSpan[]; [key: string]: unknown}

function extractBlockText(block: AnyBlock): string {
  // Standard Portable Text block
  if (block._type === 'block' && Array.isArray(block.children)) {
    return (block.children as PortableTextSpan[]).map((s) => s.text ?? '').join('')
  }
  // Wrapper object — recurse into any string or array fields
  const parts: string[] = []
  for (const key of Object.keys(block)) {
    if (key === '_type' || key === '_key') continue
    const val = block[key]
    if (typeof val === 'string' && val.trim()) parts.push(val.trim())
    else if (Array.isArray(val)) parts.push(extractArrayText(val as AnyBlock[]))
  }
  return parts.filter(Boolean).join(' ')
}

function extractArrayText(arr: AnyBlock[]): string {
  return arr
    .map((b) => extractBlockText(b))
    .filter(Boolean)
    .join('\n')
}

export function extractFieldText(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return extractArrayText(value as AnyBlock[])
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function extractDocText(doc: Record<string, unknown>, bodyField: string | string[]): string {
  const fields = [bodyField].flat()
  const text = fields
    .map((f) => extractFieldText(doc[f]))
    .filter(Boolean)
    .join('\n\n')
  return text.slice(0, 4000)
}

export function resolveContentFields(
  content: string | string[] | Record<string, string | string[]> | undefined,
  docType: string | undefined,
): string | string[] {
  if (!content || typeof content === 'string' || Array.isArray(content)) return content ?? 'body'
  const key = docType && docType in content ? docType : 'default'
  return content[key] ?? 'body'
}

// ---------------------------------------------------------------------------
// Structured extraction (headings / paragraphs / list items) for readability analysis
// ---------------------------------------------------------------------------

/** Object types whose text is not prose (code samples, media) and is skipped. */
const NON_PROSE_TYPES = new Set(['code', 'image', 'file', 'reference', 'slug', 'geopoint'])

const HEADING_STYLE = /^h([1-6])$/

function spanText(block: AnyBlock): string {
  return Array.isArray(block.children)
    ? (block.children as PortableTextSpan[]).map((s) => s.text ?? '').join('')
    : ''
}

function stringToBlocks(value: string): ContentBlock[] {
  return value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p): ContentBlock => {
      const heading = /^(#{1,6})\s+(.+)$/.exec(p)
      if (heading && !p.includes('\n')) {
        return {kind: 'heading', level: heading[1].length, text: heading[2].trim()}
      }
      return {kind: 'paragraph', text: p.replace(/\s*\n\s*/g, ' ')}
    })
}

function collectBlocks(value: unknown, out: ContentBlock[], depth: number): void {
  if (depth > 12 || value === null || value === undefined) return
  if (typeof value === 'string') {
    out.push(...stringToBlocks(value))
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectBlocks(item, out, depth + 1)
    return
  }
  if (typeof value !== 'object') return

  const block = value as AnyBlock
  if (block._type === 'block' && Array.isArray(block.children)) {
    const text = spanText(block).replace(/\s+/g, ' ').trim()
    if (!text) return
    const style = typeof block.style === 'string' ? block.style : 'normal'
    const heading = HEADING_STYLE.exec(style)
    if (heading) out.push({kind: 'heading', level: Number(heading[1]), text})
    else if (block.listItem) out.push({kind: 'listItem', text})
    else out.push({kind: 'paragraph', text})
    return
  }
  if (block._type && NON_PROSE_TYPES.has(block._type)) return

  // Wrapper object (section, column, callout…) — recurse into its fields in order.
  for (const key of Object.keys(block)) {
    if (key.startsWith('_') || key === 'markDefs') continue
    collectBlocks(block[key], out, depth + 1)
  }
}

/** Extract headings / paragraphs / list items from a field value (Portable Text, string, or nested objects). */
export function extractFieldBlocks(value: unknown): ContentBlock[] {
  const out: ContentBlock[] = []
  collectBlocks(value, out, 0)
  return out
}

/**
 * Structured counterpart of `extractDocText`: returns the document's body content as headings,
 * paragraphs and list items (no truncation), for `analyzeContentReadability`.
 */
export function extractDocBlocks(
  doc: Record<string, unknown> | null | undefined,
  bodyField: string | string[],
): ContentBlock[] {
  if (!doc) return []
  return [bodyField].flat().flatMap((f) => extractFieldBlocks(doc[f]))
}
