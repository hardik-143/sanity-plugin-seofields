/**
 * Standalone SEO health scoring — extracted from SeoHealthDashboard.tsx
 * for use in CLI commands without React/styled-components dependencies.
 */

export type SeoHealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'missing'

export interface SeoHealthMetrics {
  score: number
  status: SeoHealthStatus
  issues: string[]
}

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

interface SeoDocument {
  seo?: Record<string, unknown>
}

export const calculateHealthScore = (doc: SeoDocument): SeoHealthMetrics => {
  if (!doc.seo) {
    return {score: 0, status: 'missing', issues: ['SEO fields not configured']}
  }

  const seo = doc.seo
  const title = seo.title as string | undefined
  const description = seo.description as string | undefined
  const keywords = seo.keywords as string[] | undefined
  const robots = seo.robots as {noIndex?: boolean; noFollow?: boolean} | undefined
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

  // Image
  if (seo.metaImage) score += 10
  else issues.push('Missing meta image')

  // Keywords
  if (keywords && keywords.length > 0) score += 10
  else issues.push('No keywords defined')

  // Robots
  if (robots && !robots.noIndex) score += 5
  else if (!robots) score += 5

  const ogResult = scoreOpenGraph(openGraph)
  score += ogResult.score
  issues.push(...ogResult.issues)

  const twResult = scoreTwitterCard(twitter)
  score += twResult.score
  issues.push(...twResult.issues)

  // Image completeness bonus
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

  const status = getStatusCategory(score)
  return {score, status, issues}
}
