import {defineConfig} from 'tsup'

import pkg from './package.json'

// All packages that ship with the npm package and should NOT be bundled
const CLI_EXTERNALS = [
  // Node built-ins handled automatically
  // CLI runtime deps — present in node_modules, no need to inline
  'commander',
  'picocolors',
  'ora',
  '@clack/prompts',
  '@sanity/client',
  // Studio / React (not used in CLI but kept for safety)
  'sanity',
  'react',
  'react-dom',
  '@sanity/ui',
  '@sanity/icons',
  '@sanity/incompatible-plugin',
  'styled-components',
  'next',
  'next/server',
]

const LIB_EXTERNALS = [
  'sanity',
  'react',
  'react-dom',
  '@sanity/ui',
  '@sanity/icons',
  '@sanity/incompatible-plugin',
  'styled-components',
  'next',
  'next/server',
]

export default defineConfig([
  // Library builds (ESM + CJS)
  {
    entry: {
      index: 'src/index.ts',
      next: 'src/next.ts',
      schema: 'src/schema/index.ts',
      'schema/next': 'src/schema/next.ts',
      'define-cli': 'src/define-cli.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    external: LIB_EXTERNALS,
  },
  // CLI build (ESM only, minified executable)
  {
    entry: {
      cli: 'src/cli/index.ts',
    },
    format: ['esm'],
    dts: false,
    splitting: false,
    sourcemap: false,
    minify: true,
    treeshake: true,
    clean: false,
    define: {
      __CLI_VERSION__: JSON.stringify(pkg.version),
    },
    banner: {
      js: '#!/usr/bin/env node',
    },
    external: CLI_EXTERNALS,
  },
])
