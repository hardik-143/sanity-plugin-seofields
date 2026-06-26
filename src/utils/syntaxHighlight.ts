export type SyntaxToken = {text: string; color: string}

// High-contrast token colors
const LIGHT = {
  default: '#24292f',
  punctuation: '#57606a',
  tag: '#1a7f37', // HTML tag names — vivid green
  attr: '#8250df', // HTML attribute names / JSON keys — vivid purple
  string: '#cf222e', // Attribute values / JSON string values — vivid red
  number: '#953800', // Numbers — orange-brown
  keyword: '#0969da', // true / false / null — vivid blue
}

const DARK = {
  default: '#cdd9e5',
  punctuation: '#768390',
  tag: '#57ab5a', // vivid green
  attr: '#dcbdfb', // vivid purple
  string: '#ff9492', // vivid red/pink
  number: '#ffa657', // orange
  keyword: '#6cb6ff', // vivid blue
}

export function getColors(scheme: 'light' | 'dark'): typeof LIGHT {
  return scheme === 'dark' ? DARK : LIGHT
}

// Merge adjacent tokens of the same color to reduce DOM node count
function merge(tokens: SyntaxToken[]): SyntaxToken[] {
  const out: SyntaxToken[] = []
  for (const t of tokens) {
    const last = out[out.length - 1]
    if (last && last.color === t.color) {
      last.text += t.text
    } else {
      out.push({text: t.text, color: t.color})
    }
  }
  return out
}

type Colors = ReturnType<typeof getColors>

function parseAttrToken(code: string, pos: number, tokens: SyntaxToken[], C: Colors): number {
  const ch = code[pos]
  if (ch === ' ' || ch === '\t') {
    tokens.push({text: ch, color: C.default})
    return pos + 1
  }
  if (ch === '/' || ch === '=') {
    tokens.push({text: ch, color: C.punctuation})
    return pos + 1
  }
  if (ch === '"' || ch === "'") {
    const end = ch
    let i = pos + 1
    while (i < code.length && code[i] !== end) i++
    if (i < code.length) i++
    tokens.push({text: code.slice(pos, i), color: C.string})
    return i
  }
  // Attribute name
  let i = pos
  while (
    i < code.length &&
    code[i] !== '=' &&
    code[i] !== ' ' &&
    code[i] !== '>' &&
    code[i] !== '/' &&
    code[i] !== '\t'
  )
    i++
  if (i > pos) tokens.push({text: code.slice(pos, i), color: C.attr})
  return i
}

function parseTag(code: string, pos: number, tokens: SyntaxToken[], C: Colors): number {
  tokens.push({text: '<', color: C.punctuation})
  let i = pos + 1
  if (i < code.length && code[i] === '/') {
    tokens.push({text: '/', color: C.punctuation})
    i++
  }
  const nameStart = i
  while (i < code.length && code[i] !== ' ' && code[i] !== '>' && code[i] !== '/') i++
  if (i > nameStart) tokens.push({text: code.slice(nameStart, i), color: C.tag})
  while (i < code.length && code[i] !== '>') {
    i = parseAttrToken(code, i, tokens, C)
  }
  if (i < code.length && code[i] === '>') {
    tokens.push({text: '>', color: C.punctuation})
    i++
  }
  return i
}

export function tokenizeHtml(code: string, scheme: 'light' | 'dark' = 'light'): SyntaxToken[] {
  const C = getColors(scheme)
  const tokens: SyntaxToken[] = []
  let i = 0

  while (i < code.length) {
    if (code[i] === '<') {
      i = parseTag(code, i, tokens, C)
    } else if (code[i] === '\n') {
      tokens.push({text: '\n', color: C.default})
      i++
    } else {
      const start = i
      while (i < code.length && code[i] !== '<' && code[i] !== '\n') i++
      if (i > start) tokens.push({text: code.slice(start, i), color: C.default})
    }
  }

  return merge(tokens)
}

export function tokenizeJson(code: string, scheme: 'light' | 'dark' = 'light'): SyntaxToken[] {
  const C = getColors(scheme)
  const tokens: SyntaxToken[] = []
  let i = 0

  while (i < code.length) {
    const ch = code[i]

    if (ch === '\n') {
      tokens.push({text: '\n', color: C.default})
      i++
    } else if (ch === ' ' || ch === '\t') {
      tokens.push({text: ch, color: C.default})
      i++
    } else if ('{}[]:,'.includes(ch)) {
      tokens.push({text: ch, color: C.punctuation})
      i++
    } else if (ch === '"') {
      const start = i++
      // Walk string, respecting escape sequences
      while (i < code.length) {
        if (code[i] === '\\') {
          i += 2
          continue
        }
        if (code[i] === '"') {
          i++
          break
        }
        i++
      }
      const str = code.slice(start, i)
      // Peek past whitespace for ':' to detect key vs value
      let j = i
      while (j < code.length && (code[j] === ' ' || code[j] === '\t')) j++
      tokens.push({text: str, color: j < code.length && code[j] === ':' ? C.attr : C.string})
    } else if (code.slice(i, i + 4) === 'null') {
      tokens.push({text: 'null', color: C.keyword})
      i += 4
    } else if (code.slice(i, i + 4) === 'true') {
      tokens.push({text: 'true', color: C.keyword})
      i += 4
    } else if (code.slice(i, i + 5) === 'false') {
      tokens.push({text: 'false', color: C.keyword})
      i += 5
    } else if (ch === '-' || (ch >= '0' && ch <= '9')) {
      const start = i
      if (ch === '-') i++
      while (i < code.length && /[\d.eE+-]/.test(code[i])) i++
      tokens.push({text: code.slice(start, i), color: C.number})
    } else {
      tokens.push({text: ch, color: C.default})
      i++
    }
  }

  return merge(tokens)
}
