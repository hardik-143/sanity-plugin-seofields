import {defineConfig} from 'tsup'

import pkg from './package.json'

// CLI build: bundle all CLI deps (commander, picocolors, ora, @clack/prompts, @sanity/client)
// directly into cli.js so the binary is self-contained when run via `npx seofields`.
// Only keep Studio/React packages external since they are never used by the CLI.
const CLI_EXTERNALS = [
  // Studio / React (not used in CLI)
  'sanity',
  'react',
  'react-dom',
  '@sanity/ui',
  '@sanity/icons',
  '@sanity/incompatible-plugin',
  'styled-components',
  // seofields-pro is optional/pro; keep external
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
