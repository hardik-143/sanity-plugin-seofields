/**
 * Guards against re-introducing named barrel imports from `@sanity/icons`.
 *
 * @sanity/icons v5 (used by Sanity Studio 6) removed the named icon exports from its root
 * entry, so `import {ApiIcon} from '@sanity/icons'` fails at bundle time. TypeScript will
 * not catch a relapse — v5 still *type*-exports those names, declared as `never` — so the
 * check has to run against the source text. See issue #15.
 */
import {render} from '@testing-library/react'
import {readdirSync, readFileSync} from 'fs'
import {join, relative} from 'path'

import {defineIcon} from '../utils/icon'

const SRC_DIR = join(__dirname, '..')

/** Bindings that still exist on the @sanity/icons root entry in v3, v4 and v5 alike. */
const ALLOWED_BINDINGS = new Set(['Icon', 'icons', 'IconSymbol', 'IconMap', 'IconComponent'])

const IMPORT_RE = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"]@sanity\/icons['"]/g

function sourceFiles(dir: string): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '__mocks__') continue
      found.push(...sourceFiles(full))
    } else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      found.push(full)
    }
  }
  return found
}

describe('@sanity/icons imports', () => {
  it('only imports bindings that exist on the v5 root entry', () => {
    const offenders: string[] = []

    for (const file of sourceFiles(SRC_DIR)) {
      // Skip this file — its doc comment quotes the very import shape it forbids.
      if (file === __filename) continue

      const source = readFileSync(file, 'utf8')
      for (const match of source.matchAll(IMPORT_RE)) {
        const bindings = match[2]
          .split(',')
          .map((binding) => binding.replace(/^\s*type\s+/, '').trim())
          .filter(Boolean)
          .map((binding) => binding.split(/\s+as\s+/)[0].trim())

        for (const binding of bindings) {
          if (!ALLOWED_BINDINGS.has(binding)) {
            offenders.push(`${relative(SRC_DIR, file)}: ${binding}`)
          }
        }
      }
    }

    expect(offenders).toEqual([])
  })

  it('renders an icon for a symbol', () => {
    const ApiIcon = defineIcon('api')
    const {container} = render(<ApiIcon />)

    expect(container.querySelector('svg[data-sanity-icon]')).not.toBeNull()
  })

  it('labels the component with its symbol', () => {
    expect(defineIcon('sparkles').displayName).toBe('SeoFieldsIcon(sparkles)')
  })
})
