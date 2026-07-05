import {defineConfig} from 'tsup'

import pkg from './package.json'

// Runtime dependencies are kept external so they stay as separate packages in node_modules.
// This does not require manual installs: regular `dependencies` are installed automatically
// when users install `sanity-plugin-seofields`.
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
  // Auto-installed via dependencies; do not inline the pro code into the public bundle.
  'seofields-pro',
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
  // Auto-installed via dependencies; do not inline the pro code into the public bundle.
  'seofields-pro',
  'next',
  'next/server',
]

export default defineConfig([
  // Library builds (ESM + CJS)
  {
    entry: {
      index: 'src/index.ts',
      head: 'src/head.ts',
      next: 'src/next.ts',
      server: 'src/server.ts',
      schema: 'src/schema/index.ts',
      'schema/next': 'src/schema/next.ts',
      'define-cli': 'src/define-cli.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
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
