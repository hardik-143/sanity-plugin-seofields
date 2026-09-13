import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {type ComponentType, createElement, lazy, type ReactElement, Suspense} from 'react'

import {defineIcon} from './utils/icon'

/**
 * Public shim for the hosted Search Console + GA4 analytics feature.
 *
 * The implementation is a paid feature and lives entirely in `seofields-pro`:
 * this package ships no analytics client, no metric formatting and no chart
 * math. What stays here is the type surface the plugin config needs plus a
 * lazily-resolved mount point, so the documented import path keeps working:
 *
 * ```ts
 * import {createSeoPerformanceView} from 'sanity-plugin-seofields'
 * ```
 *
 * Studios without a resolvable `seofields-pro` get the upgrade card below
 * rather than a broken import.
 */

/**
 * Deliberately the site root, not `/get-license`: that page sells the one-time
 * licence and says so ("no subscription, ever"), while document analytics is a
 * separate recurring add-on. Sending people there would contradict itself.
 */
const LEARN_MORE_URL = 'https://sanity-plugin-seofields.thehardik.in'

const TrendUpIcon = defineIcon('chart-upward')

export interface SeoPerformanceContext {
  documentId: string
  schemaType: string
  projectId: string
  dataset: string
}

export interface SeoPerformanceConfig {
  /** Hosted analytics service. Defaults to the official seofields endpoint. */
  endpoint?: string
  /** Enable the compact summary and document view integration. */
  enabled?: boolean
  /** Show a compact summary inside the seoFields object. Defaults to true. */
  summary?: boolean
  /** Restrict analytics to these document schema types. */
  documentTypes?: string[]
  /** Resolve a production URL from the currently displayed document. */
  resolveUrl: (
    document: Record<string, unknown>,
    context: SeoPerformanceContext,
  ) => string | null | Promise<string | null>
  /** Preserve the URL query string when requesting metrics. Defaults to false. */
  preserveQueryString?: boolean
}

export type SeoPerformanceViewComponent = ComponentType<{
  document?: {
    displayed?: Record<string, unknown> | null
    published?: Record<string, unknown> | null
    draft?: Record<string, unknown> | null
  }
  documentId: string
  schemaType: unknown
}>

/**
 * Shown when `seofields-pro` cannot be resolved at all. A Studio that has the
 * pro package but no active subscription never reaches this — the analytics
 * API answers `ENTITLEMENT_REQUIRED` and pro renders its own locked state.
 */
export function SeoPerformanceUpgradeCard(): ReactElement {
  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Flex align="flex-start" gap={3}>
        <Box paddingTop={1}>
          <Text size={2}>
            <TrendUpIcon />
          </Text>
        </Box>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Search performance is a Pro feature
          </Text>
          <Text muted size={1}>
            Connect Google Search Console and GA4 to see clicks, impressions and engagement for this
            exact page, without leaving the Studio.
          </Text>
          <Text size={1}>
            <a href={LEARN_MORE_URL} rel="noreferrer" target="_blank">
              Learn more
            </a>
          </Text>
        </Stack>
      </Flex>
    </Card>
  )
}

type ProModule = {
  createSeoPerformanceView?: (config: SeoPerformanceConfig) => SeoPerformanceViewComponent
}

/**
 * Resolves the pro view, degrading to the upgrade card when `seofields-pro` is
 * absent (never installed, install failed) or too old to export the factory.
 * Exported for tests; not part of the package's public API.
 *
 * @internal
 */
export async function resolvePerformanceView(
  config: SeoPerformanceConfig,
): Promise<{default: ComponentType<Record<string, unknown>>}> {
  try {
    const mod = (await import('seofields-pro')) as ProModule
    // An unresolvable or stale pro package must degrade, never throw.
    if (typeof mod.createSeoPerformanceView !== 'function') {
      return {default: SeoPerformanceUpgradeCard as ComponentType<Record<string, unknown>>}
    }
    return {
      default: mod.createSeoPerformanceView(config) as ComponentType<Record<string, unknown>>,
    }
  } catch {
    return {default: SeoPerformanceUpgradeCard as ComponentType<Record<string, unknown>>}
  }
}

/**
 * Returns the document view component synchronously — Structure Builder calls
 * this at config-build time, so the factory itself must never be async. Only
 * the resolution of the pro implementation is deferred, to the first render.
 */
export function createSeoPerformanceView(
  config: SeoPerformanceConfig,
): SeoPerformanceViewComponent {
  const LazyView = lazy(() => resolvePerformanceView(config))

  function BoundSeoPerformanceView(props: Record<string, unknown>) {
    return createElement(
      Suspense,
      {fallback: null},
      createElement(LazyView as ComponentType<Record<string, unknown>>, props),
    )
  }
  BoundSeoPerformanceView.displayName = 'SeoPerformanceView'
  return BoundSeoPerformanceView as SeoPerformanceViewComponent
}
