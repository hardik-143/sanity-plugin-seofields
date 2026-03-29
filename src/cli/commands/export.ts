/* eslint-disable no-console */
/**
 * `seofields export` — Export all documents with SEO fields as JSON or CSV
 */
import fs from 'node:fs'

import ora from 'ora'

import {loadCliConfig} from '../utils/loadCliConfig.js'
import {log} from '../utils/logger.js'
import {createSanityClient} from '../utils/sanityClient.js'
import {calculateHealthScore} from '../utils/scoring.js'

interface ExportOptions {
  projectId?: string
  dataset?: string
  token?: string
  types?: string
  format: string
  output?: string
}

interface SeoDocument {
  _id: string
  _type: string
  _updatedAt?: string
  title?: string
  slug?: {current: string}
  seo: Record<string, unknown>
}

export async function exportCommand(options: ExportOptions): Promise<void> {
  log.heading('seofields export')

  // Load seofields.cli.* config for defaults
  const cliConfig = await loadCliConfig()
  if (!options.types && cliConfig.types?.length) {
    options.types = cliConfig.types.join(',')
  }

  const spinner = ora('Connecting to Sanity...').start()

  let client
  try {
    ;({client} = await createSanityClient({
      projectId: options.projectId,
      dataset: options.dataset,
      token: options.token,
    }))
  } catch (err) {
    spinner.fail((err as Error).message)
    process.exit(1)
  }

  // Build GROQ query
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
    spinner.fail(`Failed to fetch documents: ${(err as Error).message}`)
    process.exit(1)
  }

  spinner.succeed(`Found ${docs.length} document(s) with SEO fields`)

  if (docs.length === 0) {
    log.warn('No documents found. Check your project ID, dataset, and API token permissions.')
    return
  }

  // Calculate health scores
  const exportData = docs.map((doc) => {
    const health = calculateHealthScore(doc)
    return {
      _id: doc._id,
      _type: doc._type,
      title: doc.title || '',
      slug: doc.slug?.current || '',
      seoScore: health.score,
      seoStatus: health.status,
      issues: health.issues,
      seoTitle: (doc.seo?.title as string) || '',
      seoDescription: (doc.seo?.description as string) || '',
      hasKeywords: Array.isArray(doc.seo?.keywords) && (doc.seo.keywords as unknown[]).length > 0,
      hasOpenGraph: !!doc.seo?.openGraph,
      hasTwitter: !!doc.seo?.twitter,
      hasMetaImage: !!doc.seo?.metaImage,
      _updatedAt: doc._updatedAt || '',
    }
  })

  let output: string

  if (options.format === 'csv') {
    const headers = [
      '_id',
      '_type',
      'title',
      'slug',
      'seoScore',
      'seoStatus',
      'issues',
      'seoTitle',
      'seoDescription',
      'hasKeywords',
      'hasOpenGraph',
      'hasTwitter',
      'hasMetaImage',
      '_updatedAt',
    ]
    const csvRows = [headers.join(',')]
    for (const row of exportData) {
      csvRows.push(
        headers
          .map((h) => {
            const val = row[h as keyof typeof row]
            if (Array.isArray(val)) return `"${val.join('; ').replace(/"/g, '""')}"`
            if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`
            return String(val)
          })
          .join(','),
      )
    }
    output = csvRows.join('\n')
  } else {
    output = JSON.stringify(exportData, null, 2)
  }

  if (options.output) {
    fs.writeFileSync(options.output, output, 'utf-8')
    log.success(`Exported to ${options.output}`)
  } else {
    console.log(output)
  }
}
