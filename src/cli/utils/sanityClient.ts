/**
 * Create a Sanity client for CLI usage.
 *
 * Resolution order:
 * 1. Explicit --project-id / --dataset flags
 * 2. seofields.cli.ts / seofields.cli.js config file
 * 3. SANITY_PROJECT_ID / SANITY_DATASET env vars
 * 4. Auto-detect from sanity.config.ts/js/mjs in CWD
 */
import fs from 'node:fs'
import path from 'node:path'

import {createClient, type SanityClient} from '@sanity/client'

import {loadCliConfig} from './loadCliConfig.js'

export interface SanityConnectionOptions {
  projectId?: string
  dataset?: string
  apiVersion?: string
  token?: string
}

const CONFIG_FILES = [
  'sanity.config.ts',
  'sanity.config.js',
  'sanity.config.mjs',
  'sanity.config.tsx',
]

/**
 * Attempt to extract projectId and dataset from a sanity.config file
 * using regex (no eval / import required).
 */
function extractFromConfig(cwd: string): {projectId?: string; dataset?: string} {
  for (const name of CONFIG_FILES) {
    const filePath = path.join(cwd, name)
    if (!fs.existsSync(filePath)) continue

    const content = fs.readFileSync(filePath, 'utf-8')

    const projectIdMatch = content.match(/projectId\s*:\s*['"`]([a-z0-9-]+)['"`]/)
    const datasetMatch = content.match(/dataset\s*:\s*['"`]([a-z0-9_-]+)['"`]/)

    return {
      projectId: projectIdMatch?.[1],
      dataset: datasetMatch?.[1],
    }
  }

  return {}
}

export function findSanityConfig(cwd: string = process.cwd()): string | null {
  for (const name of CONFIG_FILES) {
    const filePath = path.join(cwd, name)
    if (fs.existsSync(filePath)) return filePath
  }
  return null
}

export interface ResolvedConnection {
  projectId: string
  dataset: string
  token?: string
  /** Human-readable source labels for display */
  sources: {
    projectId: string
    dataset: string
    token: string
  }
}

export async function resolveSanityConnection(
  opts: SanityConnectionOptions = {},
  cwd: string = process.cwd(),
): Promise<ResolvedConnection> {
  let projectId = opts.projectId
  let dataset = opts.dataset
  let token = opts.token

  const sources = {projectId: '', dataset: '', token: ''}

  // 1. Explicit CLI flags
  if (projectId) sources.projectId = '--project-id flag'
  if (dataset) sources.dataset = '--dataset flag'
  if (token) sources.token = '--token flag'

  // 2. seofields.cli.* config file
  const cliConfig = await loadCliConfig(cwd)
  const cliConfigFiles = ['seofields.cli.ts', 'seofields.cli.js', 'seofields.cli.mjs']
  const foundCliFile = cliConfigFiles.find((f) => {
    const fp = path.join(cwd, f)
    return fs.existsSync(fp)
  })
  const cliLabel = foundCliFile ? foundCliFile : 'seofields.cli.*'

  if (!projectId && cliConfig.projectId) {
    projectId = cliConfig.projectId
    sources.projectId = cliLabel
  }
  if (!dataset && cliConfig.dataset) {
    dataset = cliConfig.dataset
    sources.dataset = cliLabel
  }
  if (!token && cliConfig.token) {
    token = cliConfig.token
    sources.token = cliLabel
  }

  // 3. Environment variables
  const envProjectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
  const envDataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET
  if (!projectId && envProjectId) {
    projectId = envProjectId
    const envKey = process.env.SANITY_PROJECT_ID ? 'SANITY_PROJECT_ID' : 'SANITY_STUDIO_PROJECT_ID'
    sources.projectId = `.env → ${envKey}`
  }
  if (!dataset && envDataset) {
    dataset = envDataset
    const envKey = process.env.SANITY_DATASET ? 'SANITY_DATASET' : 'SANITY_STUDIO_DATASET'
    sources.dataset = `.env → ${envKey}`
  }

  // 4. Auto-detect from sanity.config.*
  if (!projectId || !dataset) {
    const configValues = extractFromConfig(cwd)
    const configFile = findSanityConfig(cwd)
    const configLabel = configFile ? path.basename(configFile) : 'sanity.config.*'
    if (!projectId && configValues.projectId) {
      projectId = configValues.projectId
      sources.projectId = configLabel
    }
    if (!dataset && configValues.dataset) {
      dataset = configValues.dataset
      sources.dataset = configLabel
    }
  }

  if (!projectId) {
    throw new Error(
      'Could not determine Sanity project ID.\n' +
        'Options:\n' +
        '  1. Create a seofields.cli.ts file with defineSeoCli({ projectId: "..." })\n' +
        '  2. Pass --project-id flag\n' +
        '  3. Set SANITY_PROJECT_ID env var',
    )
  }

  if (!dataset) {
    dataset = 'production'
    sources.dataset = 'default'
  }

  const envToken = process.env.SANITY_TOKEN || process.env.SANITY_AUTH_TOKEN
  if (!token && envToken) {
    token = envToken
    sources.token = process.env.SANITY_TOKEN ? '.env → SANITY_TOKEN' : '.env → SANITY_AUTH_TOKEN'
  }
  if (!sources.token) sources.token = 'none (unauthenticated)'

  return {projectId, dataset, token, sources}
}

export async function createSanityClient(
  opts: SanityConnectionOptions = {},
): Promise<{client: SanityClient; resolved: ResolvedConnection}> {
  const resolved = await resolveSanityConnection(opts)

  const client = createClient({
    projectId: resolved.projectId,
    dataset: resolved.dataset,
    apiVersion: opts.apiVersion || '2024-01-01',
    useCdn: false,
    ...(resolved.token ? {token: resolved.token} : {}),
  })

  return {client, resolved}
}
