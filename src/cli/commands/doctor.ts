/**
 * `seofields doctor` — Check plugin configuration, dependencies, and setup
 */
import fs from 'node:fs'
import path from 'node:path'

import pc from 'picocolors'

import {log} from '../utils/logger.js'

interface DoctorOptions {
  cwd: string
}

interface CheckResult {
  name: string
  ok: boolean
  message: string
}

async function performChecks(cwd: string): Promise<CheckResult[]> {
  const results: CheckResult[] = []

  // 1. Check sanity.config exists
  const configFiles = [
    'sanity.config.ts',
    'sanity.config.js',
    'sanity.config.mjs',
    'sanity.config.tsx',
  ]
  const foundConfig = configFiles.find((f) => fs.existsSync(path.join(cwd, f)))
  results.push({
    name: 'Sanity config file',
    ok: !!foundConfig,
    message: foundConfig ? `Found ${foundConfig}` : `No sanity.config.ts/js found in ${cwd}`,
  })

  // 2. Check package.json exists and is valid JSON
  const pkgPath = path.join(cwd, 'package.json')
  let pkg: Record<string, unknown> | null = null
  if (fs.existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      results.push({name: 'package.json', ok: true, message: 'Found package.json'})
    } catch {
      results.push({
        name: 'package.json',
        ok: false,
        message: 'package.json exists but contains invalid JSON — fix syntax and retry',
      })
      return results
    }
  } else {
    results.push({name: 'package.json', ok: false, message: 'No package.json found'})
  }

  // 3. Check sanity-plugin-seofields installed
  const allDeps = {
    ...(pkg?.dependencies as Record<string, string> | undefined),
    ...(pkg?.devDependencies as Record<string, string> | undefined),
  }
  const pluginInstalled = !!allDeps?.['sanity-plugin-seofields']
  const pluginVersion = allDeps?.['sanity-plugin-seofields']
  results.push({
    name: 'Plugin installed',
    ok: pluginInstalled,
    message: pluginInstalled
      ? `sanity-plugin-seofields@${pluginVersion}`
      : 'sanity-plugin-seofields not found in dependencies',
  })

  // 4. Check peer dependencies
  const peerChecks: {name: string; dep: string; minMajor: number}[] = [
    {name: 'sanity', dep: 'sanity', minMajor: 3},
    {name: 'react', dep: 'react', minMajor: 18},
  ]
  for (const peer of peerChecks) {
    const version = allDeps?.[peer.dep]
    const installed = !!version
    results.push({
      name: `Peer dep: ${peer.name}`,
      ok: installed,
      message: installed ? `${peer.dep}@${version}` : `${peer.dep} not found in dependencies`,
    })
  }

  // 5. Check node_modules actually has the plugin
  const nodeModulesPath = path.join(cwd, 'node_modules', 'sanity-plugin-seofields')
  const nodeModulesInstalled = fs.existsSync(nodeModulesPath)
  results.push({
    name: 'Plugin in node_modules',
    ok: nodeModulesInstalled,
    message: nodeModulesInstalled
      ? 'Plugin is installed in node_modules'
      : 'Plugin not found in node_modules — run npm install',
  })

  // 6-8. Config-specific checks
  if (foundConfig) {
    performConfigChecks(cwd, foundConfig, results)
  }

  // 9. Check for .env or environment variables
  performEnvChecks(cwd, foundConfig, results)

  // 10. Check for seofields.cli.* config file
  const cliConfigFiles = ['seofields.cli.ts', 'seofields.cli.js', 'seofields.cli.mjs']
  const foundCliConfig = cliConfigFiles.find((f) => fs.existsSync(path.join(cwd, f)))
  results.push({
    name: 'seofields.cli config',
    ok: !!foundCliConfig,
    message: foundCliConfig
      ? `Found ${foundCliConfig} — project/dataset loaded automatically`
      : 'No seofields.cli.ts found — create one with defineSeoCli() to skip --project-id flag',
  })

  return results
}

function performConfigChecks(cwd: string, foundConfig: string, results: CheckResult[]): void {
  const configContent = fs.readFileSync(path.join(cwd, foundConfig), 'utf-8')
  const pluginRegistered =
    configContent.includes('seofields(') || configContent.includes('seofields (')
  results.push({
    name: 'Plugin registered',
    ok: pluginRegistered,
    message: pluginRegistered
      ? 'seofields() found in plugins array'
      : 'seofields() not found in config — run `seofields init`',
  })

  // 7. Check if import statement exists
  const hasImport =
    configContent.includes("from 'sanity-plugin-seofields'") ||
    configContent.includes('from "sanity-plugin-seofields"')
  results.push({
    name: 'Import statement',
    ok: hasImport,
    message: hasImport
      ? "import from 'sanity-plugin-seofields' found"
      : 'Missing import statement for sanity-plugin-seofields',
  })

  // 8. Check for seoFields type usage in schema files
  const hasSeoFieldType = checkSeoFieldsUsage(cwd)
  results.push({
    name: 'seoFields type usage',
    ok: hasSeoFieldType,
    message: hasSeoFieldType
      ? "Found type: 'seoFields' in schema definitions"
      : "No schema using type: 'seoFields' found — add it to a document type",
  })
}

function checkSeoFieldsUsage(cwd: string): boolean {
  const schemaDir = path.join(cwd, 'schemas')
  const sanitySchemaDir = path.join(cwd, 'sanity', 'schemas')
  const srcSchemaDir = path.join(cwd, 'src', 'sanity', 'schemas')
  const schemaDirs = [schemaDir, sanitySchemaDir, srcSchemaDir]

  for (const dir of schemaDirs) {
    if (!fs.existsSync(dir)) continue
    const files = walkDir(dir)
    for (const file of files) {
      if (!/\.(ts|tsx|js|jsx|mjs)$/.test(file)) continue
      const content = fs.readFileSync(file, 'utf-8')
      if (content.includes("type: 'seoFields'") || content.includes('type: "seoFields"')) {
        return true
      }
    }
  }
  return false
}

function performEnvChecks(
  cwd: string,
  foundConfig: string | undefined,
  results: CheckResult[],
): void {
  const hasEnvFile =
    fs.existsSync(path.join(cwd, '.env')) ||
    fs.existsSync(path.join(cwd, '.env.local')) ||
    fs.existsSync(path.join(cwd, '.env.development'))
  const hasProjectEnv = !!(process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID)

  const message = getEnvMessage(hasProjectEnv, hasEnvFile, !!foundConfig)
  results.push({
    name: 'Sanity env config',
    ok: hasEnvFile || hasProjectEnv || !!foundConfig,
    message,
  })
}

function getEnvMessage(hasProjectEnv: boolean, hasEnvFile: boolean, hasConfig: boolean): string {
  if (hasProjectEnv) {
    return 'SANITY_PROJECT_ID env var detected'
  }
  if (hasEnvFile) {
    return '.env file found'
  }
  if (hasConfig) {
    return 'Project config available from sanity.config'
  }
  return 'No .env file or SANITY_PROJECT_ID env var found'
}

function printResults(results: CheckResult[]): void {
  log.heading('')
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length

  for (const result of results) {
    const icon = result.ok ? pc.green('✔') : pc.red('✖')
    const label = result.ok ? result.name : pc.red(result.name)
    log.info(`  ${icon} ${label}`)
    log.dim(`    ${result.message}`)
  }

  log.heading('')
  const resultText =
    failed > 0
      ? `${pc.green(`${passed} passed`)}, ${pc.red(`${failed} failed`)}`
      : `${pc.green(`${passed} passed`)}, ${pc.dim('0 failed')}`
  log.info(`  ${pc.bold('Result:')} ${resultText}`)
}

export async function doctorCommand(options: DoctorOptions): Promise<void> {
  log.heading('seofields doctor')
  log.heading('')

  const cwd = path.resolve(options.cwd)
  const results = await performChecks(cwd)

  // --- Print results ---
  printResults(results)

  const failed = results.filter((r) => !r.ok).length

  if (failed > 0) {
    log.heading('')
    log.dim('  Fix the issues above and run `seofields doctor` again.')
    process.exit(1)
  } else {
    log.heading('')
    log.success('Everything looks good! 🎉')
  }
}

function walkDir(dir: string): string[] {
  const files: string[] = []
  try {
    const entries = fs.readdirSync(dir, {withFileTypes: true})
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.name === 'node_modules' || entry.name === '.git') continue
      if (entry.isDirectory()) {
        files.push(...walkDir(fullPath))
      } else {
        files.push(fullPath)
      }
    }
  } catch {
    /* permission error, skip */
  }
  return files
}
