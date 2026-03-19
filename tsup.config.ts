import {defineConfig} from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    next: 'src/next.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'sanity',
    'react',
    'react-dom',
    '@sanity/ui',
    '@sanity/incompatible-plugin',
    'styled-components',
    'next',
    'next/server',
  ],
})
