/**
 * `seofields report` — Generate an SEO health report for all documents
 */
import ora from 'ora'
import pc from 'picocolors'

import {loadCliConfig} from '../utils/loadCliConfig.js'
import {log, STATUS_ICONS} from '../utils/logger.js'
import {createSanityClient, type ResolvedConnection} from '../utils/sanityClient.js'
import {calculateHealthScore} from '../utils/scoring.js'

interface ReportOptions {
  projectId?: string
  dataset?: string
  token?: string
  types?: string
  format: string
}

interface SeoDocument {
  _id: string
  _type: string
  _updatedAt?: string
  title?: string
  slug?: {current: string}
  seo?: Record<string, unknown>
}

interface HealthScore {
  score: number
  status: string
  issues: string[]
}

export async function reportCommand(options: ReportOptions): Promise<void> {
  log.heading('seofields report')

  // Load seofields.cli.* config for defaults
  const cliConfig = await loadCliConfig()
  if (!options.types && cliConfig.types?.length) {
    options.types = cliConfig.types.join(',')
  }
  const showConnectionInfo = cliConfig.showConnectionInfo === true

  const spinner = ora('Connecting to Sanity...').start()

  let client
  let resolved
  try {
    ;({client, resolved} = await createSanityClient({
      projectId: options.projectId,
      dataset: options.dataset,
      token: options.token,
    }))
  } catch (err) {
    spinner.fail((err as Error).message)
    process.exit(1)
  }

  const typeFilter = options.types
    ? `_type in [${options.types
        .split(',')
        .map((t) => `"${t.trim()}"`)
        .join(', ')}] && `
    : ''

  const query = `*[${typeFilter}defined(seo)]{
    _id,
    _type,
    _updatedAt,
    title,
    slug,
    seo
  } | order(_updatedAt desc)`

  spinner.text = 'Fetching documents...'

  let docs: SeoDocument[]
  try {
    docs = await client.fetch(query)
  } catch (err) {
    spinner.fail(`Failed to fetch: ${(err as Error).message}`)
    process.exit(1)
  }

  spinner.succeed(`Analysed ${docs.length} document(s)`)

  if (docs.length === 0) {
    log.warn('No documents with SEO fields found.')
    if (showConnectionInfo) printConnectionInfo(resolved)
    return
  }

  const scored = docs.map((doc) => ({
    doc,
    health: calculateHealthScore(doc) as HealthScore,
  }))

  await outputTextReport(scored, docs, options)
  if (showConnectionInfo) printConnectionInfo(resolved)
}

async function outputTextReport(
  scored: Array<{doc: SeoDocument; health: HealthScore}>,
  docs: SeoDocument[],
  options: ReportOptions,
): Promise<void> {
  // --- Summary stats ---
  const counts: Record<string, number> = {excellent: 0, good: 0, fair: 0, poor: 0, missing: 0}
  let totalScore = 0

  for (const {health} of scored) {
    counts[health.status] = (counts[health.status] || 0) + 1
    totalScore += health.score
  }

  const avgScore = Math.round(totalScore / scored.length)

  printSummary(docs, avgScore, counts)

  if (options.format === 'summary') return

  if (options.format !== 'table') {
    log.info('')
    log.warn(`Unknown format "${options.format}", defaulting to table output.`)
  }

  printDocumentTable(scored)

  // --- Top issues ---
  const issueCounts: Record<string, number> = {}
  for (const {health} of scored) {
    for (const issue of health.issues) {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1
    }
  }

  const topIssues = Object.entries(issueCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  if (topIssues.length > 0) {
    printTopIssues(topIssues, docs.length)
  }

  log.info('')
}

function printSummary(docs: SeoDocument[], avgScore: number, counts: Record<string, number>): void {
  log.heading('📊 Summary')
  log.info('')
  log.info(`  Total documents:  ${pc.bold(String(docs.length))}`)
  log.info(`  Average score:    ${pc.bold(colorScore(avgScore))}%`)
  log.info('')
  log.info(`  ${STATUS_ICONS.excellent} Excellent (80+):  ${counts.excellent}`)
  log.info(`  ${STATUS_ICONS.good} Good (60-79):      ${counts.good}`)
  log.info(`  ${STATUS_ICONS.fair} Fair (40-59):      ${counts.fair}`)
  log.info(`  ${STATUS_ICONS.poor} Poor (1-39):       ${counts.poor}`)
  log.info(`  ${STATUS_ICONS.missing} Missing (0):       ${counts.missing}`)
}

// Raw label widths (for padding before colorizing — ANSI codes break padEnd)
const STATUS_RAW: Record<string, string> = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  missing: 'Missing',
}

const STATUS_COLOR: Record<string, (s: string) => string> = {
  excellent: pc.green,
  good: pc.blue,
  fair: pc.yellow,
  poor: pc.red,
  missing: pc.dim,
}

function colorStatus(status: string, width = 11): string {
  const raw = (STATUS_RAW[status] ?? status).padEnd(width)
  const colorFn = STATUS_COLOR[status] ?? ((s: string) => s)
  return colorFn(raw)
}

function printDocumentTable(scored: Array<{doc: SeoDocument; health: HealthScore}>): void {
  log.heading('📋 Documents')
  log.info('')

  const maxTitleLen = Math.min(
    44,
    Math.max(5, ...scored.map(({doc}) => (doc.title || doc._id).length)),
  )

  const STATUS_W = 11 // "Excellent" = 9 chars + 2 padding
  const TYPE_W = 14
  const SCORE_W = 5 // "  100"
  const divider = pc.dim('─'.repeat(SCORE_W + 2 + STATUS_W + 2 + TYPE_W + 2 + maxTitleLen))

  // Header — pad raw strings so columns align
  log.info(
    `  ${pc.dim('Score'.padEnd(SCORE_W))}  ${pc.dim('Status'.padEnd(STATUS_W))}  ${pc.dim('Type'.padEnd(TYPE_W))}  ${pc.dim('Title')}`,
  )
  log.info(`  ${divider}`)

  for (const {doc, health} of scored) {
    const title = truncate(doc.title || doc._id, maxTitleLen)
    const scoreStr = String(health.score).padStart(SCORE_W)
    const statusStr = colorStatus(health.status, STATUS_W)
    const typeStr = pc.dim(truncate(doc._type, TYPE_W).padEnd(TYPE_W))

    log.info(`  ${colorScore(health.score, scoreStr)}  ${statusStr}  ${typeStr}  ${title}`)
  }
}

function printTopIssues(topIssues: Array<[string, number]>, docsLength: number): void {
  log.heading('🔍 Top Issues')
  log.info('')
  for (const [issue, count] of topIssues) {
    const pct = Math.round((count / docsLength) * 100)
    log.info(`  ${pc.red(String(count).padStart(4))} docs (${pct}%)  ${issue}`)
  }
}

function printConnectionInfo(resolved: ResolvedConnection): void {
  log.info('')
  log.info(`  ${pc.dim('─'.repeat(52))}`)
  log.info(`  ${pc.dim('Connection info')}`)
  log.info(
    `  ${pc.dim('Project ID:')}  ${pc.white(resolved.projectId)}  ${pc.dim(`← ${resolved.sources.projectId}`)}`,
  )
  log.info(
    `  ${pc.dim('Dataset:   ')}  ${pc.white(resolved.dataset)}  ${pc.dim(`← ${resolved.sources.dataset}`)}`,
  )
  log.info(`  ${pc.dim('Token:     ')}  ${pc.dim(resolved.sources.token)}`)
  log.info('')
}

function colorScore(score: number, text?: string): string {
  const s = text ?? String(score)
  if (score >= 80) return pc.green(s)
  if (score >= 60) return pc.blue(s)
  if (score >= 40) return pc.yellow(s)
  if (score > 0) return pc.red(s)
  return pc.dim(s)
}

function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max - 1)}…` : str
}
