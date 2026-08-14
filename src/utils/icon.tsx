import {Icon, type IconSymbol} from '@sanity/icons'
import type {ComponentType, SVGProps} from 'react'

/**
 * Builds a Sanity-compatible icon component from an @sanity/icons symbol name.
 *
 * The root `Icon` API is the only icon entry point shared by @sanity/icons v3, v4 and v5:
 * v5 removed the named barrel exports (`ApiIcon`, …) and v3 has no per-icon subpaths.
 * Symbol names follow the kebab-case catalog at https://icons.sanity.dev.
 *
 * Call at module scope — a component created during render gets a new identity each pass
 * and would remount the icon.
 */
export function defineIcon(symbol: IconSymbol): ComponentType<SVGProps<SVGSVGElement>> {
  const SeoFieldsIcon = (props: SVGProps<SVGSVGElement>) => <Icon symbol={symbol} {...props} />
  SeoFieldsIcon.displayName = `SeoFieldsIcon(${symbol})`
  return SeoFieldsIcon
}
