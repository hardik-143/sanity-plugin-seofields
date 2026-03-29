/**
 * `seofields init` — Add seofields() to sanity.config.ts/js
 *
 * Detects the config file, adds the import statement and plugin registration.
 */
import fs from 'node:fs'

import {log} from '../utils/logger.js'
import {findSanityConfig} from '../utils/sanityClient.js'

interface InitOptions {
  preview?: boolean
  dashboard?: boolean
  schemaOrg?: boolean
}

function validateFlags(): void {
  if (process.argv.includes('--dashboard') && process.argv.includes('--no-dashboard')) {
    log.error('Conflicting flags: --dashboard and --no-dashboard cannot be used together.')
    process.exit(1)
  }
}

function buildPluginCall(options: InitOptions): string {
  const opts: string[] = []
  if (options.preview) opts.push('seoPreview: true')
  if (options.dashboard === true) opts.push('healthDashboard: true')
  if (options.dashboard === false) opts.push('healthDashboard: false')
  return opts.length > 0 ? `seofields({ ${opts.join(', ')} })` : 'seofields()'
}

function injectImports(
  content: string,
  isMainImported: boolean,
  isSchemaImported: boolean,
  withSchemaOrg: boolean,
): string {
  const toAdd = [
    isMainImported ? '' : `import seofields from 'sanity-plugin-seofields'`,
    withSchemaOrg && !isSchemaImported
      ? `import {schemaOrg} from 'sanity-plugin-seofields/schema'`
      : '',
  ]
    .filter(Boolean)
    .join('\n')

  if (!toAdd) return content

  const lastImport = [...content.matchAll(/^import\s.+$/gm)].at(-1)
  const insertAt = lastImport ? lastImport.index! + lastImport[0].length : 0
  return insertAt > 0
    ? `${content.slice(0, insertAt)}\n${toAdd}${content.slice(insertAt)}`
    : `${toAdd}\n\n${content}`
}

function printSummary(
  configPath: string,
  pluginCall: string,
  schemaOrgCall: string,
  withSchemaOrg: boolean,
): void {
  log.success(`Updated ${configPath}`)
  log.dim('')
  log.dim('  What was added:')
  log.dim(`    import seofields from 'sanity-plugin-seofields'`)
  if (withSchemaOrg) log.dim(`    import {schemaOrg} from 'sanity-plugin-seofields/schema'`)
  log.dim(`    plugins: [${pluginCall}${schemaOrgCall}, ...]`)
  log.dim('')
  log.dim('  Next steps:')
  log.dim('    1. Add the seo field to your document schemas:')
  log.dim("       defineField({ name: 'seo', title: 'SEO', type: 'seoFields' })")
  log.dim('    2. Restart Sanity Studio')
}

export async function initCommand(options: InitOptions): Promise<void> {
  log.heading('seofields init')
  validateFlags()

  const configPath = findSanityConfig(process.cwd())
  if (!configPath) {
    log.error(
      'No sanity.config.ts/js found in current directory.\n  Run this command from your Sanity project root.',
    )
    process.exit(1)
  }

  log.info(`Found config: ${configPath}`)
  let content = fs.readFileSync(configPath, 'utf-8')

  const isMainImported = /from\s+['"]sanity-plugin-seofields['"]/.test(content)
  const isSchemaImported = /from\s+['"]sanity-plugin-seofields\/schema['"]/.test(content)
  const isRegistered = /plugins\s*:\s*\[[\s\S]*?\bseofields\s*\(/.test(content)
  const isSchemaOrgRegistered = /plugins\s*:\s*\[[\s\S]*?\bschemaOrg\s*\(/.test(content)

  // seofields() already in plugins — never add it again, only handle missing pieces
  if (isRegistered) {
    const needsSchemaOrg = options.schemaOrg && (!isSchemaImported || !isSchemaOrgRegistered)
    const needsMainImport = !isMainImported

    if (!needsSchemaOrg && !needsMainImport) {
      log.warn('seofields() is already registered in your config.')
      log.dim('  No changes made.')
      return
    }

    // Fix missing main import
    content = injectImports(content, isMainImported, isSchemaImported, !!options.schemaOrg)

    // Add schemaOrg() to plugins if missing
    if (options.schemaOrg && !isSchemaOrgRegistered) {
      const pluginsMatch = /plugins\s*:\s*\[/.exec(content)
      if (pluginsMatch) {
        const insertPos = pluginsMatch.index + pluginsMatch[0].length
        content = `${content.slice(0, insertPos)}\n    schemaOrg(),${content.slice(insertPos)}`
        log.success('Added schemaOrg() to plugins array')
      }
    }

    fs.writeFileSync(configPath, content, 'utf-8')
    if (needsMainImport) log.success(`Added missing import for seofields`)
    if (options.schemaOrg && !isSchemaImported)
      log.dim(`  Added: import {schemaOrg} from 'sanity-plugin-seofields/schema'`)
    log.success(`Updated ${configPath}`)
    return
  }

  const pluginCall = buildPluginCall(options)
  // Only append schemaOrg() to the call if it's not already in plugins
  const schemaOrgCall = options.schemaOrg && !isSchemaOrgRegistered ? ', schemaOrg()' : ''

  content = injectImports(content, isMainImported, isSchemaImported, !!options.schemaOrg)

  const pluginsMatch = /plugins\s*:\s*\[/.exec(content)
  if (pluginsMatch) {
    const insertPos = pluginsMatch.index + pluginsMatch[0].length
    content = `${content.slice(0, insertPos)}\n    ${pluginCall}${schemaOrgCall},${content.slice(insertPos)}`
    log.success('Added seofields() to plugins array')
    if (schemaOrgCall) log.success('Added schemaOrg() to plugins array')
    if (options.schemaOrg && isSchemaOrgRegistered)
      log.dim('  schemaOrg() already in plugins — import added only')
  } else {
    log.warn(
      `Could not find \`plugins: [...]\` in your config.\n  Please add manually:\n  plugins: [${pluginCall}${schemaOrgCall}]`,
    )
  }

  fs.writeFileSync(configPath, content, 'utf-8')
  printSummary(configPath, pluginCall, schemaOrgCall, !!options.schemaOrg)
}
