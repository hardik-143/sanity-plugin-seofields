// Import the plugin
import seofields from './plugin'

// Default export the plugin
export default seofields

// Re-export everything from plugin.ts
export * from './plugin'

// Export schema types for external use
export {default as seoFieldsSchema} from './schemas'
export {default as allSchemas} from './schemas/types'
export {default as baseMetaSchema} from './schemas/types/baseMeta'
export {default as metaAttributeSchema} from './schemas/types/metaAttribute'
export {default as metaTagSchema} from './schemas/types/metaTag'
export {default as openGraphSchema} from './schemas/types/openGraph'
export {default as robotsSchema} from './schemas/types/robots'
export {default as twitterSchema} from './schemas/types/twitter'

// Export dashboard factory (lazy — avoids styled-components at import time)
export type {SeoHealthPaneOptions} from './components/SeoHealthPane'
export {createSeoHealthPane} from './components/SeoHealthPane'

// Export Schema.org Studio preview components
export type {
  SchemaOrgJsonLdPreviewOptions,
  SchemaOrgJsonLdPreviewProps,
} from './schema/components/SchemaOrgJsonLdPreview'
export {
  SchemaOrgJsonLdPreview as SchemaOrgDocumentJsonLdPreview,
  SchemaOrgJsonLdPreview,
} from './schema/components/SchemaOrgJsonLdPreview'

// Export types
export type {DocumentWithSeoHealth, SeoHealthMetrics, SeoHealthStatus} from './types'

// Export shared scoring utility
export type {HealthScoreOptions, HealthScoreReadabilityOptions} from './utils/scoring'
export {calculateHealthScore} from './utils/scoring'

// Readability analysis (English heuristics)
export {extractDocBlocks} from './utils/extractDocText'
export type {
  ContentBlock,
  ContentReadabilityOptions,
  ContentReadabilityResult,
  ReadabilityCheck,
  ReadabilityCheckId,
  ReadabilityCheckStatus,
  ReadabilityResult,
  ReadabilityThresholds,
} from './utils/readability'
export {
  analyzeContentReadability,
  analyzeReadability,
  DEFAULT_READABILITY_THRESHOLDS,
} from './utils/readability'

// Broken-link checker (link extraction + reference checks; external checks live in /server)
export type {IdQueryFn, LinkStatus, ReferenceStatus, UrlCheckResult} from './utils/linkCheck'
export {checkReferences} from './utils/linkCheck'
export type {ExtractedLink, ExtractLinksOptions, LinkKind, LinkSource} from './utils/links'
export {classifyHref, extractDocumentLinks} from './utils/links'

// Export the hosted Search Console + GA4 document analytics mount point.
// The implementation itself is a paid feature and lives in `seofields-pro`.
export {
  createSeoPerformanceView,
  type SeoPerformanceConfig,
  type SeoPerformanceContext,
  SeoPerformanceUpgradeCard,
  type SeoPerformanceViewComponent,
} from './performanceStub'
