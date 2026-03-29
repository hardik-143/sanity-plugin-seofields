/* eslint-disable no-console */
import {program} from 'commander'
import pc from 'picocolors'

import {configCommand} from './commands/config.js'
import {createConfigCommand} from './commands/create-config.js'
import {doctorCommand} from './commands/doctor.js'
import {exportCommand} from './commands/export.js'
import {initCommand} from './commands/init.js'
import {reportCommand} from './commands/report.js'
import {loadDotEnv} from './utils/loadDotEnv.js'

// Load .env / .env.local before any command runs
loadDotEnv()

declare const __CLI_VERSION__: string
const VERSION: string = __CLI_VERSION__

// Colour themes from COLOR_THEMES in website/src/components/ColorThemePicker.tsx
// Mapped to the nearest picocolors function available in a terminal
type ColorFn = (s: string) => string
const COLOR_THEMES: ColorFn[] = [
  pc.cyan, // teal   #0d9488
  (s) => pc.bold(pc.blue(s)), // sky    #0284c7
  pc.blue, // indigo #4f46e5
  pc.magenta, // violet #7c3aed
  pc.red, // rose   #e11d48
  pc.yellow, // amber  #d97706
]

// Seeded per-process so the same color persists within one CLI run
const theme: ColorFn = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)]

const TIPS = [
  'Run `seofields doctor` first to verify your setup is correct.',
  'Use `seofields report --format summary` for a quick overview.',
  'Export your SEO data before making bulk changes: `seofields export -o backup.json`.',
  'Add `seoFields` type to every document schema to track SEO health.',
  'A meta title between 50–60 characters gets the best click-through rate.',
  'Meta descriptions should be 140–160 characters for optimal display.',
  'Open Graph images should be 1200×630px for best social sharing.',
  'Use `seofields config --baseUrl=https://yoursite.com` to enable canonical URLs.',
  'Twitter Card images require a separate `twitterImage` field for best results.',
  'Schema.org markup helps search engines understand your content structure.',
  'Use `seofields report --types post,page` to filter by document type.',
  'The `healthDashboard` tool gives a live view of SEO scores inside Sanity Studio.',
  'Keywords should appear naturally — avoid keyword stuffing.',
  'Every page needs a unique meta title. Duplicates hurt rankings.',
  'Use `seofields export --format csv` to open SEO data in a spreadsheet.',
  'Set `noIndex: true` on internal or draft pages to prevent indexing.',
  'OG title and meta title can differ — OG is optimised for social, meta for search.',
  'Run `seofields report` after content migrations to catch regressions.',
  'Use `seofields init --schema-org` to add structured data support.',
  'Structured data (Schema.org) can unlock rich results in Google Search.',
  'A score of 80+ is excellent. Aim to get all key pages there.',
  'The `seoPreview` option shows a live Google-style preview inside the editor.',
  'Use `seofields report` in CI to catch SEO regressions before they ship.',
  'Use `--dataset staging` to run reports against your staging dataset.',
  'Keep your license key private — never commit it to version control.',
  'Use `seofields config --healthDashboard.showDocumentId=true` for easier debugging.',
  'Use `seofields export --format json --output report.json` to save SEO data to a file.',
  'Alt text on images improves both accessibility and image search ranking.',
  'Canonical URLs prevent duplicate content penalties from search engines.',
  'A missing OG image means social shares show a blank card — always add one.',
  'Use descriptive slugs: `/blog/seo-tips` ranks better than `/blog/post-123`.',
  'Re-run `seofields report` monthly to track your SEO health over time.',
  'The `types` filter helps you focus reports on high-priority content.',
  'Use `seofields export` to back up SEO data before schema migrations.',
  'Short meta titles (under 30 chars) waste valuable search result space.',
  'Long meta descriptions get truncated — stay under 160 characters.',
  'Twitter Cards need `twitter:card`, `twitter:title`, and `twitter:image` at minimum.',
  'Use `seofields doctor` after upgrading the plugin to catch breaking changes.',
  'JSON export includes health scores — pipe it into your analytics pipeline.',
  'Set a `defaultHiddenFields` list to keep the SEO panel focused.',
  'Internal links pass authority — make sure important pages are well-linked.',
  'Page speed is a ranking factor — optimise images referenced in SEO fields.',
  'Use consistent brand phrasing in meta titles across your site.',
  'Structured data errors can be tested at schema.org/validator.',
  'Focus first on pages with the most traffic, not just the lowest scores.',
  'Add SEO review to your content publishing checklist.',
  'Use `seofields config --healthDashboard.licenseKey=KEY` to unlock premium features.',
  'The CSV export makes it easy to share SEO audits with non-technical stakeholders.',
  'Every image on your page should have descriptive alt text.',
  'Avoid duplicate meta descriptions — each page needs its own.',
]

function randomTip(): string {
  return TIPS[Math.floor(Math.random() * TIPS.length)]
}

// Box inner width = bar width minus left padding "  " and right padding " "
const BOX_W = 62 // total visible width including both │ borders
const BAR_W = BOX_W - 2 // dashes between ╭ and ╮

function wrapText(text: string, maxLen: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if (current.length + (current ? 1 : 0) + word.length > maxLen) {
      if (current) lines.push(current)
      current = word
    } else {
      current = current ? `${current} ${word}` : word
    }
  }
  if (current) lines.push(current)
  return lines
}

function row(content: string, visibleLen: number): string {
  const innerW = BAR_W - 3 // "  " prefix + " " before right │
  const pad = ' '.repeat(Math.max(0, innerW - visibleLen))
  return ` ${theme('│')}  ${content}${pad} ${theme('│')}`
}

function emptyRow(): string {
  return row('', 0)
}

function showBanner() {
  const bar = '─'.repeat(BAR_W)
  const tip = randomTip()
  const tipInnerW = BAR_W - 3 - 5 // minus "Tip: " prefix (5 chars)
  const tipLines = wrapText(tip, tipInnerW)

  console.log()
  console.log(` ${theme(`╭${bar}╮`)}`)
  console.log(emptyRow())
  console.log(
    row(
      `${pc.bold(pc.green('seofields'))}${pc.dim(` v${VERSION}`)}`,
      `seofields v${VERSION}`.length,
    ),
  )
  console.log(
    row(
      pc.dim('SEO tooling for Sanity CMS — manage from your terminal'),
      'SEO tooling for Sanity CMS — manage from your terminal'.length,
    ),
  )
  console.log(emptyRow())
  for (let i = 0; i < tipLines.length; i++) {
    const prefix =
      i === 0 ? `${pc.dim('Tip: ')}${pc.white(tipLines[i])}` : `     ${pc.white(tipLines[i])}`
    const prefixLen = i === 0 ? 5 + tipLines[i].length : 5 + tipLines[i].length
    console.log(row(prefix, prefixLen))
  }
  console.log(emptyRow())
  console.log(` ${theme(`╰${bar}╯`)}`)

  console.log()
  console.log(`  ${pc.bold('Commands')}`)
  console.log()

  const cmds: [string, string][] = [
    ['init          ', 'Add seofields() to sanity.config'],
    ['config        ', 'Update plugin configuration options'],
    ['create-config ', 'Create seofields.cli.ts / .js interactively'],
    ['report        ', 'SEO health report across all documents'],
    ['export        ', 'Export SEO fields as JSON or CSV'],
    ['doctor        ', 'Check setup, deps & config'],
  ]

  for (const [cmd, desc] of cmds) {
    console.log(`  ${theme(cmd)}  ${pc.dim(desc)}`)
  }

  console.log()
  console.log(
    `  ${pc.dim('Run ')}${pc.white('seofields <command> --help')}${pc.dim(' for details')}`,
  )
  console.log()
}

function commandBanner(name: string, description: string): string {
  const bar = '─'.repeat(BAR_W)
  const titleLine = `seofields › ${name}`
  return [
    '',
    ` ${theme(`╭${bar}╮`)}`,
    emptyRow(),
    row(
      `${pc.bold(pc.green('seofields'))}${theme(' › ')}${pc.bold(theme(name))}`,
      titleLine.length,
    ),
    row(pc.dim(description), description.length),
    emptyRow(),
    ` ${theme(`╰${bar}╯`)}`,
  ].join('\n')
}

program
  .name('seofields')
  .description('CLI for sanity-plugin-seofields — manage SEO from your terminal')
  .version(VERSION)
  .action(showBanner)

program
  .command('config', {isDefault: false})
  .description('Update seofields() configuration in your sanity.config file')
  .addHelpText(
    'before',
    commandBanner('config', 'Update seofields() configuration in your sanity.config file'),
  )
  .allowUnknownOption()
  .allowExcessArguments()
  .helpOption('-h, --help', 'Show help and all available options')
  .addHelpText(
    'after',
    [
      '',
      `  ${pc.bold('Usage')}`,
      `  ${pc.dim('Pass any option as')} ${pc.white('--key=value')}${pc.dim('. Nested keys use dot notation.')}`,
      '',
      `  ${pc.bold('Top-level options')}`,
      `  ${theme('--baseUrl')}${pc.dim('=<url>').padEnd(38)}  ${pc.dim('Canonical base URL')}`,
      `  ${theme('--seoPreview')}${pc.dim('=<bool>').padEnd(36)}  ${pc.dim('Enable live Google-style preview')}`,
      `  ${theme('--defaultHiddenFields')}${pc.dim('=<f1,f2>').padEnd(28)}  ${pc.dim('Comma-separated fields to hide')}`,
      `  ${theme('--types')}${pc.dim('=<t1,t2>').padEnd(40)}  ${pc.dim('Document types that have SEO fields')}`,
      '',
      `  ${pc.bold('healthDashboard options')}  ${pc.dim('(prefix: --healthDashboard.<key>)')}`,
      `  ${theme('--healthDashboard.licenseKey')}${pc.dim('=<key>').padEnd(22)}  ${pc.dim('License key for premium features')}`,
      `  ${theme('--healthDashboard.toolTitle')}${pc.dim('=<str>').padEnd(23)}  ${pc.dim('Custom title shown in Studio')}`,
      `  ${theme('--healthDashboard.showDocumentId')}${pc.dim('=<bool>').padEnd(17)}  ${pc.dim('Show document _id in dashboard')}`,
      `  ${theme('--healthDashboard.showHealthScore')}${pc.dim('=<bool>').padEnd(16)}  ${pc.dim('Show score badge per document')}`,
      `  ${theme('--healthDashboard.query.types')}${pc.dim('=<t1,t2>').padEnd(21)}  ${pc.dim('Filter dashboard by document types')}`,
      '',
      `  ${pc.bold('Examples')}`,
      `  ${pc.white('seofields config --baseUrl=https://mysite.com')}`,
      `  ${pc.white('seofields config --healthDashboard.licenseKey=SEOF-1234')}`,
      `  ${pc.white('seofields config --healthDashboard.showDocumentId=true --seoPreview=true')}`,
      `  ${pc.white('seofields config --healthDashboard.query.types=post,page')}`,
      `  ${pc.white('seofields config --defaultHiddenFields=metaImage,openGraphUrl')}`,
      '',
    ].join('\n'),
  )
  .action(() => {
    // Grab everything after "seofields config" so dotted keys like
    // --healthDashboard.licenseKey work without Commander pre-declaring each option
    const rawIdx = process.argv.indexOf('config')
    const rawArgs = rawIdx >= 0 ? process.argv.slice(rawIdx + 1) : []
    configCommand(rawArgs)
  })

program
  .command('create-config')
  .description('Interactively create a seofields.cli.ts / .js config file')
  .addHelpText(
    'before',
    commandBanner('create-config', 'Interactively create a seofields.cli.ts / .js config file'),
  )
  .action(createConfigCommand)

program
  .command('init')
  .description('Add seofields() plugin to your sanity.config file')
  .addHelpText('before', commandBanner('init', 'Add seofields() plugin to your sanity.config file'))
  .option('--preview', 'Enable SEO preview in the plugin config')
  .option('--dashboard', 'Explicitly enable the SEO Health Dashboard')
  .option('--no-dashboard', 'Disable the SEO Health Dashboard')
  .option('--schema-org', 'Also add schemaOrg() plugin registration')
  .addHelpText(
    'after',
    [
      '',
      `  ${pc.dim('Note: ')}${pc.yellow('--preview')}${pc.dim(', ')}${pc.yellow('--dashboard')}${pc.dim(', and ')}${pc.yellow('--no-dashboard')}${pc.dim(' only apply during initial setup.')}`,
      `  ${pc.dim('      If seofields() is already in your config, use:')}`,
      '',
      `  ${pc.dim('      ')}${pc.white('seofields config --healthDashboard=true --seoPreview=true')}`,
      '',
    ].join('\n'),
  )
  .action(initCommand)

program
  .command('export')
  .description('Export all documents with SEO fields as JSON or CSV')
  .addHelpText(
    'before',
    commandBanner('export', 'Export all documents with SEO fields as JSON or CSV'),
  )
  .option('-p, --project-id <id>', 'Sanity project ID')
  .option('-d, --dataset <name>', 'Sanity dataset name')
  .option('-t, --token <token>', 'Sanity API token')
  .option('--types <types>', 'Comma-separated document types to export (e.g. post,page)')
  .option('-f, --format <format>', 'Output format: json or csv', 'json')
  .option('-o, --output <path>', 'Output file path (defaults to stdout)')
  .action(exportCommand)

program
  .command('report')
  .description('Generate an SEO health report for all documents')
  .addHelpText('before', commandBanner('report', 'Generate an SEO health report for all documents'))
  .option('-p, --project-id <id>', 'Sanity project ID')
  .option('-d, --dataset <name>', 'Sanity dataset name')
  .option('-t, --token <token>', 'Sanity API token')
  .option('--types <types>', 'Comma-separated document types to include')
  .option('--format <format>', 'Output format: table or summary (default: "table")', 'table')
  .action(reportCommand)

program
  .command('doctor')
  .description('Check plugin configuration, dependencies, and setup')
  .addHelpText(
    'before',
    commandBanner('doctor', 'Check plugin configuration, dependencies, and setup'),
  )
  .option('--cwd <path>', 'Working directory to check', process.cwd())
  .action(doctorCommand)

const cliArgs = process.argv.slice(2)

// Root --help / -h → show our custom banner instead of Commander's plain text
if (cliArgs.length === 1 && (cliArgs[0] === '--help' || cliArgs[0] === '-h')) {
  showBanner()
  process.exit(0)
}

// `seofields <cmd> help` → forward to that command's --help
if (cliArgs.length >= 2 && cliArgs[cliArgs.length - 1] === 'help') {
  const matched = program.commands.find((c) => c.name() === cliArgs[0])
  if (matched) {
    matched.help()
    process.exit(0)
  }
}

program.parse()
