/* eslint-disable no-console */
/**
 * `seofields config` — Update seofields() configuration in sanity.config
 *
 * Supports dotted key notation for nested config:
 *   seofields config --baseUrl=https://example.com
 *   seofields config --healthDashboard.licenseKey=SEOF-1234-5678-ABCD
 *   seofields config --healthDashboard.showDocumentId=false --healthDashboard.showTypeColumn=true
 *   seofields config --healthDashboard.query.types=post,page
 */
import fs from 'node:fs'

import pc from 'picocolors'

import {log} from '../utils/logger.js'
import {findSanityConfig} from '../utils/sanityClient.js'

// ─── Arg parsing ─────────────────────────────────────────────────────────────

/** Fields that should be treated as string arrays when comma-separated. */
const ARRAY_FIELDS = new Set(['types', 'defaultHiddenFields'])

/** Parse --key=value or --key value pairs. Supports dotted keys. */
function parseRawArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg.startsWith('--')) continue
    const stripped = arg.slice(2)
    if (stripped.includes('=')) {
      const eqIdx = stripped.indexOf('=')
      result[stripped.slice(0, eqIdx)] = stripped.slice(eqIdx + 1)
    } else if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
      result[stripped] = args[++i]
    } else {
      result[stripped] = 'true'
    }
  }
  return result
}

function coerceValue(raw: string, leafKey: string): unknown {
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (/^\d+$/.test(raw)) return parseInt(raw, 10)
  if (/^\d+\.\d+$/.test(raw)) return parseFloat(raw)
  // Known array fields: comma-separated → string[]
  if (ARRAY_FIELDS.has(leafKey) && raw.includes(',')) {
    return raw.split(',').map((s) => s.trim())
  }
  return raw
}

/** Convert flat dotted keys to a nested config object. */
function buildNestedConfig(flat: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, rawValue] of Object.entries(flat)) {
    const parts = key.split('.')
    let current: Record<string, unknown> = result
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (typeof current[part] !== 'object' || Array.isArray(current[part])) {
        current[part] = {}
      }
      current = current[part] as Record<string, unknown>
    }
    const leaf = parts[parts.length - 1]
    current[leaf] = coerceValue(rawValue, leaf)
  }
  return result
}

// ─── Value serializer ─────────────────────────────────────────────────────────

function serializeValue(value: unknown, indent: number): string {
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) {
    return `[${value.map((v) => serializeValue(v, indent)).join(', ')}]`
  }
  if (typeof value === 'object' && value !== null) {
    return serializeObject(value as Record<string, unknown>, indent)
  }
  return String(value)
}

function serializeObject(obj: Record<string, unknown>, indent: number): string {
  const entries = Object.entries(obj)
  if (entries.length === 0) return '{}'
  const spaces = ' '.repeat(indent)
  const outerSpaces = ' '.repeat(Math.max(0, indent - 2))
  const lines = entries.map(([k, v]) => `${spaces}${k}: ${serializeValue(v, indent + 2)},`)
  return `{\n${lines.join('\n')}\n${outerSpaces}}`
}

// ─── Bracket matcher ──────────────────────────────────────────────────────────

function extractBracketContent(
  text: string,
  openPos: number,
  openChar: string,
  closeChar: string,
): {inner: string; outerStart: number; outerEnd: number} | null {
  if (text[openPos] !== openChar) return null
  let depth = 0
  let i = openPos
  while (i < text.length) {
    const ch = text[i]
    if (ch === openChar) {
      depth++
    } else if (ch === closeChar) {
      depth--
      if (depth === 0) {
        return {
          inner: text.slice(openPos + 1, i),
          outerStart: openPos,
          outerEnd: i + 1,
        }
      }
    } else if (ch === '"' || ch === "'" || ch === '`') {
      // Skip string literals so brackets inside don't confuse the counter
      const quote = ch
      i++
      while (i < text.length) {
        if (text[i] === '\\') {
          i += 2
          continue
        }
        if (text[i] === quote) break
        i++
      }
    }
    i++
  }
  return null
}

// ─── Config text merger ───────────────────────────────────────────────────────

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Insert or replace a single leaf key inside an object text block.
 * Works on the raw text between `{` and `}`.
 */
function setLeafInObjectText(text: string, key: string, value: unknown, indent: number): string {
  const valueStr = serializeValue(value, indent + 2)
  // Match: optional leading newline/spaces, then key: oldValue,
  const keyPattern = new RegExp(
    `((?:^|\\n)([ \\t]*))(${escapeRegex(key)})(\\s*:\\s*)([^\\n{[]+?)(,?)(?=\\s*(?:\\n|$|[,}]))`,
  )
  if (keyPattern.test(text)) {
    return text.replace(keyPattern, (_, pre, existingIndent, k, colon) => {
      return `${pre}${k}${colon}${valueStr},`
    })
  }
  // Key not found — infer indent from the first existing key in the block
  const firstKeyMatch = /\n([ \t]+)\w/.exec(text)
  const spaces = firstKeyMatch ? firstKeyMatch[1] : ' '.repeat(indent)
  return `${text.trimEnd()}\n${spaces}${key}: ${valueStr},\n`
}

/**
 * Recursively merge `newConfig` values into `objectText` (the raw text
 * between outer `{` and `}` of the existing seofields() config).
 */
function mergeConfigValues(
  objectText: string,
  newConfig: Record<string, unknown>,
  indent: number = 2,
): string {
  let result = objectText

  for (const [key, value] of Object.entries(newConfig)) {
    const isNestedObject = typeof value === 'object' && value !== null && !Array.isArray(value)
    if (!isNestedObject) {
      result = setLeafInObjectText(result, key, value, indent)
      continue
    }

    const keyRegex = new RegExp(`\\b${escapeRegex(key)}\\s*:`)
    const keyMatch = keyRegex.exec(result)

    if (!keyMatch) {
      // Key doesn't exist — add entire nested object
      result = setLeafInObjectText(result, key, value, indent)
      continue
    }

    // Find what comes after "key:"
    const afterColon = keyMatch.index + keyMatch[0].length
    const skipWs = result.slice(afterColon).search(/\S/)
    const valueStart = afterColon + (skipWs >= 0 ? skipWs : 0)

    if (result[valueStart] !== '{') {
      // Existing value is not an object (e.g. healthDashboard: false) — replace
      result = setLeafInObjectText(result, key, value, indent)
      continue
    }

    // Existing object — recurse
    const block = extractBracketContent(result, valueStart, '{', '}')
    if (!block) continue

    const updatedInner = mergeConfigValues(
      block.inner,
      value as Record<string, unknown>,
      indent + 2,
    )
    // Infer the closing brace indent from the key's line indent
    const keyLineMatch = result.slice(0, keyMatch.index).match(/\n([ \t]*)$/)
    const closingIndent = keyLineMatch ? keyLineMatch[1] : ' '.repeat(indent)
    result =
      result.slice(0, block.outerStart + 1) +
      updatedInner +
      closingIndent +
      result.slice(block.outerEnd - 1)
  }

  return result
}

// ─── Main command ─────────────────────────────────────────────────────────────

function logApplyingConfig(flat: Record<string, string>): void {
  log.info('Applying config:')
  for (const [key, val] of Object.entries(flat)) {
    log.dim(`  ${pc.cyan(key)}: ${pc.yellow(String(val))}`)
  }
}

function findSeofieldsCallOrExit(content: string): {
  callIndex: number
  parenBlock: {inner: string; outerStart: number; outerEnd: number}
} {
  const callMatch = /seofields\s*\(/.exec(content)
  if (!callMatch || callMatch.index === undefined) {
    log.error('`seofields()` not found in config. Run `seofields init` first.')
    process.exit(1)
  }

  const openParenPos = callMatch.index + callMatch[0].length - 1
  const parenBlock = extractBracketContent(content, openParenPos, '(', ')')
  if (!parenBlock) {
    log.error('Could not parse the seofields() call — please check your config file syntax.')
    process.exit(1)
  }

  return {callIndex: callMatch.index, parenBlock}
}

function buildUpdatedSeofieldsInner(
  content: string,
  callIndex: number,
  parenBlock: {inner: string; outerStart: number; outerEnd: number},
  newConfig: Record<string, unknown>,
): string | null {
  const innerTrimmed = parenBlock.inner.trim()

  if (!innerTrimmed) {
    // seofields() → seofields({ ...newConfig })
    // Detect the indentation of the seofields( call itself to align the object
    const lineStart = content.lastIndexOf('\n', callIndex) + 1
    const callIndent = callIndex - lineStart
    const baseIndent = callIndent + 2
    log.dim('  (Injecting fresh config into empty seofields())')
    return `\n${' '.repeat(baseIndent)}${serializeObject(newConfig, baseIndent + 2)},\n${' '.repeat(callIndent)}`
  }

  if (innerTrimmed.startsWith('{')) {
    // seofields({...}) → merge
    const braceSearchStart = parenBlock.inner.indexOf('{')
    const braceBlock = extractBracketContent(parenBlock.inner, braceSearchStart, '{', '}')
    if (!braceBlock) {
      log.error('Could not parse the existing config object — check syntax.')
      process.exit(1)
    }

    const mergedInner = mergeConfigValues(braceBlock.inner, newConfig, 2)
    const leading = parenBlock.inner.slice(0, braceBlock.outerStart)
    const trailing = parenBlock.inner.slice(braceBlock.outerEnd)
    log.dim('  (Merging into existing config object)')
    return `${leading}{${mergedInner}}${trailing}`
  }

  // Variable reference like seofields(myConfig) — can't safely edit
  log.warn(
    `Config uses a variable reference (\`${innerTrimmed.slice(0, 30)}…\`) — cannot auto-update.`,
  )
  log.dim('  Add the following manually to your config object:')
  log.dim(serializeObject(newConfig, 2))
  return null
}

export async function configCommand(rawArgs: string[]): Promise<void> {
  log.heading('seofields config')

  if (rawArgs.length === 0) {
    printUsage()
    return
  }

  const flat = parseRawArgs(rawArgs)
  if (Object.keys(flat).length === 0) {
    log.error('No valid --key=value options found.')
    printUsage()
    process.exit(1)
  }

  const newConfig = buildNestedConfig(flat)

  logApplyingConfig(flat)

  const configPath = findSanityConfig(process.cwd())
  if (!configPath) {
    log.error('No sanity.config.ts/js found. Run from your Sanity project root.')
    process.exit(1)
  }

  log.info(`Updating ${configPath}`)

  const content = fs.readFileSync(configPath, 'utf-8')
  const {callIndex, parenBlock} = findSeofieldsCallOrExit(content)
  const newInner = buildUpdatedSeofieldsInner(content, callIndex, parenBlock, newConfig)
  if (newInner === null) return

  const newContent =
    content.slice(0, parenBlock.outerStart + 1) + newInner + content.slice(parenBlock.outerEnd - 1)

  fs.writeFileSync(configPath, newContent, 'utf-8')
  log.success(`Config updated in ${configPath}`)
}

function printUsage(): void {
  console.log('')
  console.log(`  ${pc.bold('Usage:')} seofields config [--option=value ...]`)
  console.log('')
  console.log(`  ${pc.bold('Top-level options:')}`)
  console.log(`    ${pc.cyan('--baseUrl')}=<url>                            Base URL of your site`)
  console.log(
    `    ${pc.cyan('--seoPreview')}=true|false                    Enable SERP preview in Studio`,
  )
  console.log(
    `    ${pc.cyan('--defaultHiddenFields')}=field1,field2        Fields hidden by default`,
  )
  console.log('')
  console.log(`  ${pc.bold('Health Dashboard options:')}`)
  console.log(
    `    ${pc.cyan('--healthDashboard')}=true|false               Enable/disable dashboard`,
  )
  console.log(`    ${pc.cyan('--healthDashboard.licenseKey')}=SEOF-XXXX-… License key`)
  console.log(`    ${pc.cyan('--healthDashboard.toolTitle')}=<title>        Studio nav tab label`)
  console.log(`    ${pc.cyan('--healthDashboard.showTypeColumn')}=true|false`)
  console.log(`    ${pc.cyan('--healthDashboard.showDocumentId')}=true|false`)
  console.log(`    ${pc.cyan('--healthDashboard.previewMode')}=true|false   Show demo data`)
  console.log(`    ${pc.cyan('--healthDashboard.apiVersion')}=2024-01-01`)
  console.log(`    ${pc.cyan('--healthDashboard.typeColumnMode')}=badge|text`)
  console.log(`    ${pc.cyan('--healthDashboard.structureTool')}=<name>`)
  console.log('')
  console.log(`  ${pc.bold('Query options:')}`)
  console.log(`    ${pc.cyan('--healthDashboard.query.types')}=post,page    Limit to doc types`)
  console.log(`    ${pc.cyan('--healthDashboard.query.requireSeo')}=true|false`)
  console.log(`    ${pc.cyan('--healthDashboard.query.groq')}=<query>       Custom GROQ query`)
  console.log('')
  console.log(`  ${pc.bold('Examples:')}`)
  console.log(pc.dim(`    seofields config --baseUrl=https://example.com`))
  console.log(
    pc.dim(
      `    seofields config --healthDashboard.licenseKey=SEOF-777F-4C32-B154 --healthDashboard.showDocumentId=false`,
    ),
  )
  console.log(
    pc.dim(`    seofields config --healthDashboard.query.types=post,page --seoPreview=true`),
  )
  console.log('')
}
