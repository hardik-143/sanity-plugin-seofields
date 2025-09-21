import {definePlugin} from 'sanity'
import types from './schemas/types'
interface MyPluginConfig {
  /* nothing here yet */
}

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {myPlugin} from 'sanity-plugin-seofields'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [seofields()],
 * })
 * ```
 */
const seofields = definePlugin<MyPluginConfig | void>((config = {}) => {
  // eslint-disable-next-line no-console
  return {
    name: 'sanity-plugin-seofields',
    schema: {types},
  }
})

export default seofields
