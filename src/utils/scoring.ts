import type {SeoHealthMetrics, SeoHealthStatus} from '../types'
import {extractDocBlocks, resolveContentFields} from './extractDocText'
import {analyzeContentReadability, type ReadabilityThresholds} from './readability'
import {getFocusKeywordPlacement, hasKeywordOveruse, hasMatchingKeyword} from './seoUtils'

const getStatusCategory = (score: number): SeoHealthStatus => {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'fair'
  if (score > 0) return 'poor'
  return 'missing'
}

const scoreMetaTitle = (title?: string): {score: number; issues: string[]} => {
  const issues: string[] = []
  let score = 0

  if (title && title.length >= 50 && title.length <= 60) {
    score = 15
  } else if (title && title.length > 0) {
    score = 10
    if (title.length < 50) issues.push('Meta title too short (< 50 chars)')
    if (title.length > 60) issues.push('Meta title too long (> 60 chars)')
  } else {
    issues.push('Missing meta title')
  }

  return {score, issues}
}

const scoreMetaDescription = (description?: string): {score: number; issues: string[]} => {
  const issues: string[] = []
  let score = 0

  if (description && description.length >= 120 && description.length <= 160) {
    score = 15
  } else if (description && description.length > 0) {
    score = 10
    if (description.length < 120) issues.push('Meta description too short (< 120 chars)')
    if (description.length > 160) issues.push('Meta description too long (> 160 chars)')
  } else {
    issues.push('Missing meta description')
  }

  return {score, issues}
}

const scoreOpenGraph = (openGraph?: Record<string, unknown>): {score: number; issues: string[]} => {
  const issues: string[] = []
  let score = 0

  if (openGraph) {
    if (openGraph.title) score += 6
    else issues.push('Missing OG title')

    if (openGraph.description) score += 6
    else issues.push('Missing OG description')

    if (openGraph.image) score += 6
    else issues.push('Missing OG image')

    if (openGraph.type) score += 7
    else issues.push('Missing OG type')
  } else {
    issues.push('Open Graph not configured')
  }

  return {score, issues}
}

const scoreTwitterCard = (twitter?: Record<string, unknown>): {score: number; issues: string[]} => {
  const issues: string[] = []
  let score = 0

  if (twitter) {
    if (twitter.title) score += 5
    else issues.push('Missing Twitter title')

    if (twitter.description) score += 5
    else issues.push('Missing Twitter description')

    if (twitter.image) score += 5
    else issues.push('Missing Twitter image')
  } else {
    issues.push('Twitter Card not configured')
  }

  return {score, issues}
}

interface KeywordScoreResult {
  score: number
  issues: string[]
  stuffed: boolean
}

// Rewards keywords that are actually used in title/description, not just declared.
const scoreKeywordArray = (
  keywords: string[] | undefined,
  title: string | undefined,
  description: string | undefined,
): KeywordScoreResult => {
  if (!keywords || keywords.length === 0) {
    return {score: 0, issues: ['No keywords defined'], stuffed: false}
  }

  const issues: string[] = []
  let score = 2
  if (
    hasMatchingKeyword(title || '', keywords) ||
    hasMatchingKeyword(description || '', keywords)
  ) {
    score += 3
  } else {
    issues.push('Keywords defined but not used in title or description')
  }

  const stuffed =
    hasKeywordOveruse(title || '', keywords) || hasKeywordOveruse(description || '', keywords)
  if (stuffed) issues.push('Keyword stuffing detected — reduce repeated keyword usage')

  return {score, issues, stuffed}
}

const scoreFocusKeyword = (
  focusKeyword: string | undefined,
  title: string | undefined,
  description: string | undefined,
): KeywordScoreResult => {
  const placement = getFocusKeywordPlacement(focusKeyword, title, description)
  if (!placement.hasFocusKeyword) {
    return {score: 0, issues: ['No focus keyword defined'], stuffed: false}
  }

  const issues: string[] = []
  let score = 1
  if (placement.atStartOfTitle) {
    score += 4
  } else if (placement.inTitle) {
    score += 2
    issues.push('Focus keyword is in the title but not at the start')
  } else if (placement.inDescription) {
    score += 1
    issues.push('Focus keyword missing from meta title')
  } else {
    issues.push('Focus keyword missing from meta title and description')
  }

  if (placement.isStuffed)
    issues.push('Focus keyword appears too many times in title — avoid stuffing')

  return {score, issues, stuffed: placement.isStuffed}
}

// Combined budget stays within the 10 points historically allotted to "keywords" so the 100-point total is unchanged.
const scoreKeywordOptimization = (
  keywords: string[] | undefined,
  focusKeyword: string | undefined,
  title: string | undefined,
  description: string | undefined,
): {score: number; issues: string[]} => {
  const arrayResult = scoreKeywordArray(keywords, title, description)
  const focusResult = scoreFocusKeyword(focusKeyword, title, description)

  let score = arrayResult.score + focusResult.score
  if (arrayResult.stuffed || focusResult.stuffed) score = Math.max(0, score - 2)

  return {score: Math.min(score, 10), issues: [...arrayResult.issues, ...focusResult.issues]}
}

interface SeoDocument {
  _type?: string
  seo?: Record<string, unknown>
}

/** Opt-in readability component for `calculateHealthScore`. */
export interface HealthScoreReadabilityOptions {
  /**
   * Root document field(s) holding the body content — same shape as `ai.content` /
   * `readability.content`. Defaults to `'body'`.
   */
  content?: string | string[] | Record<string, string | string[]>
  /**
   * Share of the 100-point score given to readability (0–50). Defaults to 10: the existing
   * score is scaled to 90 points and readability contributes up to 10.
   */
  weight?: number
  thresholds?: Partial<ReadabilityThresholds>
}

export interface HealthScoreOptions {
  /**
   * Include body-content readability in the score. **Off by default** so existing scores are
   * unchanged. Documents with too little body text to analyse keep their original score.
   */
  readability?: boolean | HealthScoreReadabilityOptions
}

const applyReadability = (
  doc: SeoDocument,
  base: {score: number; issues: string[]},
  option: boolean | HealthScoreReadabilityOptions,
): {score: number; issues: string[]} => {
  const opts = typeof option === 'object' ? option : {}
  const weight = Math.min(50, Math.max(0, opts.weight ?? 10))
  const fields = resolveContentFields(opts.content, doc._type)
  const result = analyzeContentReadability(
    extractDocBlocks(doc as Record<string, unknown>, fields),
    {
      thresholds: opts.thresholds,
    },
  )
  if (!result || weight === 0) return base

  const points = result.checks.reduce((acc, c) => {
    if (c.status === 'good') return acc + 1
    if (c.status === 'ok') return acc + 0.5
    return acc
  }, 0)
  const ratio = points / result.checks.length
  const score = Math.round((base.score * (100 - weight)) / 100 + weight * ratio)
  const issues = [
    ...base.issues,
    ...result.checks
      .filter((c) => c.status !== 'good')
      .map((c) => `Readability — ${c.label}: ${c.value}`),
  ]
  return {score, issues}
}

/**
 * Calculate the SEO health score (0–100) for a document.
 *
 * Pass `{readability: true}` (or an options object) to blend body-content readability into the
 * score. Without options the score is exactly the same as in previous versions.
 */
export const calculateHealthScore = <T extends SeoDocument>(
  doc: T,
  options: HealthScoreOptions = {},
): SeoHealthMetrics => {
  if (!doc.seo) {
    return {score: 0, status: 'missing', issues: ['SEO fields not configured']}
  }

  const seo = doc.seo
  const title = seo.title as string | undefined
  const description = seo.description as string | undefined
  const keywords = seo.keywords as string[] | undefined
  const focusKeyword = seo.focusKeyword as string | undefined
  const robots = seo.robots as
    | {noIndex?: boolean; noFollow?: boolean; noTranslate?: boolean; noImageIndex?: boolean}
    | undefined
  const openGraph = seo.openGraph as Record<string, unknown> | undefined
  const twitter = seo.twitter as Record<string, unknown> | undefined
  let score = 0
  const issues: string[] = []

  const titleResult = scoreMetaTitle(title)
  score += titleResult.score
  issues.push(...titleResult.issues)

  const descResult = scoreMetaDescription(description)
  score += descResult.score
  issues.push(...descResult.issues)

  if (seo.metaImage) score += 10
  else issues.push('Missing meta image')

  const keywordResult = scoreKeywordOptimization(keywords, focusKeyword, title, description)
  score += keywordResult.score
  issues.push(...keywordResult.issues)

  if (robots && !robots.noIndex) score += 5
  else if (!robots) score += 5

  const ogResult = scoreOpenGraph(openGraph)
  score += ogResult.score
  issues.push(...ogResult.issues)

  const twResult = scoreTwitterCard(twitter)
  score += twResult.score
  issues.push(...twResult.issues)

  const hasMetaImage = !!seo.metaImage
  const hasOgImage = !!(openGraph && openGraph.image)
  const hasTwitterImage = !!(twitter && twitter.image)
  if (hasMetaImage && hasOgImage && hasTwitterImage) {
    score += 5
  } else {
    const missingImages: string[] = []
    if (!hasMetaImage) missingImages.push('meta image')
    if (!hasOgImage) missingImages.push('OG image')
    if (!hasTwitterImage) missingImages.push('Twitter image')
    issues.push(`Missing images for full score: ${missingImages.join(', ')}`)
  }

  if (options.readability) {
    const blended = applyReadability(doc, {score, issues}, options.readability)
    return {score: blended.score, status: getStatusCategory(blended.score), issues: blended.issues}
  }

  const status = getStatusCategory(score)
  return {score, status, issues}
}
