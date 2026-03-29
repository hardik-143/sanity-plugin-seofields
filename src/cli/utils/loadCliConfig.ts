/**
 * Loads the optional `seofields.cli.{ts,js,mjs,cjs}` config file from CWD.
 *
 * Resolution order for each value:
 *   1. CLI flags
 *   2. seofields.cli.* config file   ← this module
 *   3. Environment variables
 *   4. Auto-detect from sanity.config.*
 */
import fs from 'node:fs'
import path from 'node:path'
import {pathToFileURL} from 'node:url'

import {loadDotEnv} from './loadDotEnv.js'

export interface SeoFieldsCliConfig {
  projectId?: string
  dataset?: string
  token?: string
  /** Default document types used by `report` and `export` commands */
  types?: string[]
  /**
   * Show connection info (project ID, dataset, token source) after report output.
   * Defaults to `false`.
   */
  showConnectionInfo?: boolean
}

const CLI_CONFIG_FILES = [
  'seofields.cli.js',
  'seofields.cli.mjs',
  'seofields.cli.cjs',
  // TS files are loaded via regex extraction (no runtime transpiler required)
  'seofields.cli.ts',
  'seofields.cli.tsx',
]

/**
 * Extract a field value from TS/JS source.
 * Handles both string literals AND process.env.VAR_NAME expressions.
 */
function extractField(content: string, field: string): string | undefined {
  // 1. String literal: field: 'value' or field: "value"
  const literalMatch = content.match(new RegExp(`${field}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`))
  if (literalMatch) return literalMatch[1]

  // 2. process.env expression: field: process.env.VAR_NAME or process.env.VAR_NAME!
  const envMatch = content.match(new RegExp(`${field}\\s*:\\s*process\\.env\\.([A-Z_a-z0-9]+)`))
  if (envMatch) return process.env[envMatch[1]]

  return undefined
}

/** Strip single-line comments before extracting so `// key: value` is ignored */
function stripLineComments(source: string): string {
  return source
    .split('\n')
    .filter((line) => !/^\s*\/\//.test(line))
    .join('\n')
}

/** Load a JS/MJS/CJS file at runtime via dynamic import */
async function loadJsConfig(filePath: string): Promise<SeoFieldsCliConfig | null> {
  try {
    const fileUrl = pathToFileURL(filePath).href
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import(fileUrl)
    const config = mod?.default ?? mod
    if (config && typeof config === 'object') {
      return config as SeoFieldsCliConfig
    }
    return null
  } catch {
    return null
  }
}

/** Extract fields from a TS source file without transpiling */
function loadTsConfig(filePath: string): SeoFieldsCliConfig | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    // Strip commented lines before parsing config values

    const content = stripLineComments(raw)

    const projectId = extractField(content, 'projectId')
    const dataset = extractField(content, 'dataset')
    const token = extractField(content, 'token')

    // Extract types array: types: ['post', 'page']
    const typesMatch = content.match(/types\s*:\s*\[([^\]]+)\]/)
    let types: string[] | undefined
    if (typesMatch) {
      types = typesMatch[1]
        .split(',')
        .map((t) => t.trim().replace(/['"`]/g, ''))
        .filter(Boolean)
    }

    // Extract boolean: showConnectionInfo: true / false
    const boolMatch = content.match(/showConnectionInfo\s*:\s*(true|false)/)
    const showConnectionInfo = boolMatch ? boolMatch[1] === 'true' : undefined

    if (!projectId && !dataset && !token && !types && showConnectionInfo === undefined) return null
    return {projectId, dataset, token, types, showConnectionInfo}
  } catch {
    return null
  }
}

let _cached: SeoFieldsCliConfig | null | undefined

export async function loadCliConfig(cwd: string = process.cwd()): Promise<SeoFieldsCliConfig> {
  if (_cached !== undefined) return _cached ?? {}

  // Load .env files first so process.env.VAR references resolve correctly
  loadDotEnv(cwd)

  for (const name of CLI_CONFIG_FILES) {
    const filePath = path.join(cwd, name)
    if (!fs.existsSync(filePath)) continue

    const isTs = name.endsWith('.ts') || name.endsWith('.tsx')
    const config = isTs ? loadTsConfig(filePath) : await loadJsConfig(filePath)

    if (config) {
      _cached = config
      return config
    }
  }

  _cached = null
  return {}
}
