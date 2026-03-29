/**
 * Configuration helper for `seofields` CLI.
 *
 * Create a `seofields.cli.ts` (or `.js`) file in your project root and
 * use `defineSeoCli()` to configure the CLI without passing flags every time.
 *
 * @example
 * ```ts
 * // seofields.cli.ts
 * import { defineSeoCli } from 'sanity-plugin-seofields/define-cli'
 *
 * export default defineSeoCli({
 *   projectId: 'my-project-id',
 *   dataset: 'production',
 *   token: process.env.SANITY_TOKEN,
 *   types: ['post', 'page', 'article'],
 * })
 * ```
 */

export interface SeoFieldsCliConfig {
  /** Sanity project ID */
  projectId?: string
  /** Sanity dataset name (default: "production") */
  dataset?: string
  /** Sanity API token (read access at minimum) */
  token?: string
  /** Default document types for `report` and `export` commands */
  types?: string[]
  /**
   * Show connection info (project ID, dataset, token source) at the end of
   * `report` and `export` output. Useful for debugging which credentials
   * are being used. Defaults to `false`.
   */
  showConnectionInfo?: boolean
}

/**
 * Define CLI configuration for sanity-plugin-seofields commands.
 * Acts as an identity function — provides type safety for the config object.
 */
export function defineSeoCli(config: SeoFieldsCliConfig): SeoFieldsCliConfig {
  return config
}
