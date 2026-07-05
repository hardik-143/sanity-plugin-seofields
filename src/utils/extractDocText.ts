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
