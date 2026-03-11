import React from 'react'
import type {ComponentBuilder, StructureBuilder} from 'sanity/structure'

import SeoHealthDashboard, {SeoHealthDashboardProps} from './SeoHealthDashboard'

/**
 * Options accepted by `createSeoHealthPane`.
 * All props from `SeoHealthDashboardProps` are supported.
 *
 * `licenseKey` is **required** — the dashboard will not render without it.
 */
export interface SeoHealthPaneOptions extends Omit<SeoHealthDashboardProps, 'customQuery'> {
  /** Required license key (format: `SEOF-XXXX-XXXX-XXXX`). */
  licenseKey: string
  /**
   * A fully custom GROQ query used to fetch documents for the dashboard.
   * The query must return documents with at least: `_id`, `_type`, `title`, `seo`, `_updatedAt`.
   *
   * Takes precedence over `queryTypes` when both are provided.
   *
   * @example
   * query: `*[_type in ["post","page"] && defined(seo)]{ _id, _type, title, slug, seo, _updatedAt }`
   */
  query?: string
}

// function isStructureBuilder(arg: unknown): arg is StructureBuilder {
//   return (
//     arg !== null &&
//     typeof arg === 'object' &&
//     typeof (arg as StructureBuilder).component === 'function' &&
//     typeof (arg as StructureBuilder).document === 'function'
//   )
// }

/**
 * Creates a desk-structure pane for the SEO Health Dashboard.
 *
 * Returns a **`ComponentBuilder`** with a built-in `.child()` resolver so that
 * clicking any document row opens the document editor as a split pane to the right.
 *
 * Use it **directly** as the `.child()` value — do **not** wrap it in `S.component()`.
 *
 * ```ts
 * // sanity.config.ts
 * structure: (S) =>
 *   S.list().items([
 *     S.listItem()
 *       .title('SEO Health')
 *       .child(
 *         createSeoHealthPane(S, {
 *           licenseKey: 'SEOF-XXXX-XXXX-XXXX',
 *           query: `*[_type == "post" && defined(seo)]{ _id, _type, title, slug, seo, _updatedAt }`,
 *         })
 *       ),
 *   ])
 * ```
 */
export function createSeoHealthPane(
  optionsOrS: StructureBuilder,
  optionsWhenS: SeoHealthPaneOptions,
): ComponentBuilder {
  // ── Two-arg form: structure builder passed as first arg ──────────────────
  const S = optionsOrS
  const {query, openInPane = true, title: paneTitle, ...rest} = optionsWhenS ?? {}

  const SeoHealthPane: React.FC = () => (
    <SeoHealthDashboard customQuery={query} openInPane={openInPane} title={paneTitle} {...rest} />
  )
  SeoHealthPane.displayName = 'SeoHealthPane'

  // Wire up the child resolver so ChildLink URLs resolve to the document editor
  return (S.component(SeoHealthPane) as ComponentBuilder)
    .title(paneTitle ?? 'SEO Health')
    .child((docId: string, {params}: {params: Record<string, string | undefined>}) => {
      const builder = S.document().documentId(docId)
      return params?.type ? builder.schemaType(params.type) : builder
    })
}

export default createSeoHealthPane
