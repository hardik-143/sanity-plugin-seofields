/**
 * Lightweight .env file loader for the CLI.
 * Loads .env, .env.local, .env.development.local in order (later files win).
 * Does NOT override variables already set in the process environment.
 */
import fs from 'node:fs'
import path from 'node:path'

const ENV_FILES = ['.env', '.env.local', '.env.development.local', '.env.development']

function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx < 0) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    result[key] = value
  }
  return result
}

let _loaded = false

export function loadDotEnv(cwd: string = process.cwd()): void {
  if (_loaded) return
  _loaded = true

  for (const name of ENV_FILES) {
    const filePath = path.join(cwd, name)
    if (!fs.existsSync(filePath)) continue
    try {
      const parsed = parseEnvFile(fs.readFileSync(filePath, 'utf-8'))
      for (const [k, v] of Object.entries(parsed)) {
        // Don't override vars already in the environment
        if (process.env[k] === undefined) {
          process.env[k] = v
        }
      }
    } catch {
      // ignore unreadable files
    }
  }
}
