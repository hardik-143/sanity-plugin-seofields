import type {SeoFieldsPluginConfig} from '../plugin'

export function resolveLicenseKey(config: SeoFieldsPluginConfig): string | undefined {
  const rootKey = config.licenseKey
  const dashKey =
    typeof config.healthDashboard === 'object' ? config.healthDashboard?.licenseKey : undefined
  if (dashKey && !rootKey) {
    console.warn(
      '[sanity-plugin-seofields] "healthDashboard.licenseKey" is deprecated. ' +
        'Move it to the root "licenseKey" option instead.',
    )
  }
  return rootKey ?? dashKey
}
