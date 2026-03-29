/**
 * `seofields create-config` — Interactively create a seofields.cli.ts / .js config file
 */
import fs from 'node:fs'
import path from 'node:path'

import * as p from '@clack/prompts'
import pc from 'picocolors'

import {findSanityConfig} from '../utils/sanityClient.js'

const TS_TEMPLATE = (projectId: string, dataset: string) => `\
import { defineSeoCli } from 'sanity-plugin-seofields/define-cli'

export default defineSeoCli({
  projectId: '${projectId}',
  dataset: '${dataset}',
  token: process.env.SANITY_TOKEN,

  // Document types that have SEO fields — used by \`report\` and \`export\`
  // types: ['post', 'page'],
})
`

const JS_TEMPLATE = (projectId: string, dataset: string) => `\
import { defineSeoCli } from 'sanity-plugin-seofields/define-cli'

export default defineSeoCli({
  projectId: '${projectId}',
  dataset: '${dataset}',
  token: process.env.SANITY_TOKEN,

  // Document types that have SEO fields — used by \`report\` and \`export\`
  // types: ['post', 'page'],
})
`

/** Try to read projectId/dataset from sanity.config.* in cwd */
function detectDefaults(cwd: string): {projectId?: string; dataset?: string} {
  const configPath = findSanityConfig(cwd)
  if (!configPath) return {}
  try {
    const content = fs.readFileSync(configPath, 'utf-8')
    const projectId = content.match(/projectId\s*:\s*['"`]([a-z0-9-]+)['"`]/)?.[1]
    const dataset = content.match(/dataset\s*:\s*['"`]([a-z0-9_-]+)['"`]/)?.[1]
    return {projectId, dataset}
  } catch {
    return {}
  }
}

export async function createConfigCommand(): Promise<void> {
  const cwd = process.cwd()

  p.intro(pc.bold('seofields › create-config'))

  // --- Check if config already exists ---
  const existing = ['seofields.cli.ts', 'seofields.cli.js', 'seofields.cli.mjs'].find((f) =>
    fs.existsSync(path.join(cwd, f)),
  )
  if (existing) {
    const overwrite = await p.confirm({
      message: `${pc.yellow(existing)} already exists. Overwrite?`,
      initialValue: false,
    })
    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel('Aborted — existing config left untouched.')
      process.exit(0)
    }
  }

  // --- Detect defaults from sanity.config ---
  const detected = detectDefaults(cwd)

  // --- File type ---
  const fileType = await p.select<'ts' | 'js'>({
    message: 'Which file format?',
    options: [
      {value: 'ts', label: 'TypeScript  seofields.cli.ts  (recommended)'},
      {value: 'js', label: 'JavaScript  seofields.cli.js'},
    ],
    initialValue: 'ts',
  })
  if (p.isCancel(fileType)) {
    p.cancel('Cancelled.')
    process.exit(0)
  }

  // --- Project ID ---
  const projectId = await p.text({
    message: 'Sanity Project ID',
    placeholder: detected.projectId ?? 'abc123xyz',
    initialValue: detected.projectId ?? '',
    validate: (v) => (v.trim() ? undefined : 'Project ID is required'),
  })
  if (p.isCancel(projectId)) {
    p.cancel('Cancelled.')
    process.exit(0)
  }

  // --- Dataset ---
  const dataset = await p.text({
    message: 'Dataset name',
    placeholder: detected.dataset ?? 'production',
    initialValue: detected.dataset ?? 'production',
    validate: (v) => (v.trim() ? undefined : 'Dataset is required'),
  })
  if (p.isCancel(dataset)) {
    p.cancel('Cancelled.')
    process.exit(0)
  }

  // --- Token source ---
  const tokenSource = await p.select<'env' | 'none'>({
    message: 'How will you provide the API token?',
    options: [
      {
        value: 'env',
        label: `Environment variable  ${pc.dim('process.env.SANITY_TOKEN')}  (recommended)`,
      },
      {value: 'none', label: 'Skip — add manually later'},
    ],
    initialValue: 'env',
  })
  if (p.isCancel(tokenSource)) {
    p.cancel('Cancelled.')
    process.exit(0)
  }

  // --- Write file ---
  const fileName = `seofields.cli.${fileType}`
  const filePath = path.join(cwd, fileName)

  const template = fileType === 'ts' ? TS_TEMPLATE : JS_TEMPLATE
  let content = template(projectId as string, dataset as string)

  if (tokenSource === 'none') {
    content = content.replace(`  token: process.env.SANITY_TOKEN,\n`, '')
  }

  fs.writeFileSync(filePath, content, 'utf-8')

  p.outro(
    [
      pc.green(`✔ Created ${fileName}`),
      '',
      pc.dim('  Next steps:'),
      `  ${pc.dim('1.')} Add ${pc.white('SANITY_TOKEN')} to your ${pc.dim('.env')} file`,
      `  ${pc.dim('2.')} Run ${pc.white('seofields report')} — no flags needed!`,
      `  ${pc.dim('3.')} Run ${pc.white('seofields doctor')} to verify your setup`,
    ].join('\n'),
  )
}
