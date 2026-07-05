import type {AiIndustry} from '../plugin'

export const FREE_INDUSTRIES = [
  'blog',
  'restaurant',
  'travel',
  'ecommerce',
  'education',
  'fitness',
  'hospitality',
  'nonprofit',
] as const
export const PRO_INDUSTRIES = [
  'healthcare',
  'pharmacy',
  'finance',
  'realestate',
  'saas',
  'legal',
  'insurance',
  'automotive',
  'homeServices',
] as const
const PUBLIC_ANGLE_COUNT = 4

export type SeoGenField =
  | 'title'
  | 'description'
  | 'focusKeyword'
  | 'keywords'
  | 'ogTitle'
  | 'ogDescription'
  | 'twitterTitle'
  | 'twitterDescription'

export type MetaContext = {title?: string; description?: string; slug?: string}

type PromptParams = {content: string; keyword: string; keywords: string[]; meta?: MetaContext}
type PromptFn = (p: PromptParams) => string
type AngleFn = (params: PromptParams & {ctx: string}) => string
type FieldAngles = Record<SeoGenField, AngleFn[]>
type PublicIndustry = (typeof FREE_INDUSTRIES)[number]
type LicensedPromptPoolResolver = (options: {
  licenseKey?: string
  projectId?: string
  field: SeoGenField
  industry?: AiIndustry
  /** Free-tier pool — returned as-is when the license fails validation or the pro package is unavailable. */
  publicPrompts: PromptFn[]
}) => Promise<PromptFn[]>

const GENERIC_CTX = 'Write for a general web audience.'

function buildKeywordLine(
  keyword: string,
  keywords: string[],
  keywordRequirement: string,
  fallback: string,
): string {
  if (keywords.length > 0) {
    return `- At least one of these keywords MUST appear verbatim: ${keywords.join(', ')}`
  }

  if (keyword) {
    return `- The keyword "${keyword}" MUST appear ${keywordRequirement}`
  }

  return fallback
}

const PUBLIC_INDUSTRY_CONTEXTS = {
  blog: 'Write for a blog or editorial publication. Use engaging, informative language. Appeal to curious readers seeking knowledge.',
  ecommerce:
    'Write for an e-commerce store. Use action-oriented language that drives purchases. Highlight value, deals, and product benefits.',
  education:
    'Write for an educational platform or course provider. Use encouraging, growth-focused language. Emphasize skills, outcomes, and career impact.',
  restaurant:
    'Write for a restaurant, cafe, or food business. Use sensory, appetizing language. Evoke taste, ambiance, and memorable dining experience.',
  travel:
    'Write for a travel agency or tourism brand. Use evocative, inspiring language. Paint vivid pictures of destinations and unforgettable experiences.',
  fitness:
    'Write for a gym, studio, or personal training brand. Use motivating, energetic language. Emphasize results, transformation, and community.',
  hospitality:
    'Write for a hotel, resort, or short-term rental brand. Use welcoming, sensory language. Evoke comfort, amenities, and a memorable stay.',
  nonprofit:
    'Write for a nonprofit or charitable organization. Use sincere, mission-driven language. Emphasize impact, community, and the cause over sales language.',
} satisfies Record<PublicIndustry, string>

// ─── Title angles ────────────────────────────────────────────────────────────

// Only the 4 free-tier angles live here — the remaining 6 per field live in `seofields-pro`
// and are never shipped in this package's bundle. See resolvePromptPool below.
const TITLE_ANGLES = [
  'Lead with a strong action verb',
  'Lead with the key benefit to the reader',
  'Use a how-to format (How to …)',
  'Use a question format that the reader wants answered',
]

const titleFns: AngleFn[] = TITLE_ANGLES.map((angle) => ({content, keyword, keywords, ctx}) => {
  const kwLine = buildKeywordLine(
    keyword,
    keywords,
    'verbatim in the title',
    '- Make it compelling and clear without a specific keyword',
  )
  return `You are an SEO expert. ${ctx}
Generate one SEO-optimized meta title using this angle: ${angle}.
Requirements:
- Strictly 50–60 characters including spaces and punctuation
${kwLine}
- Apply the angle — do not deviate
- Return ONLY the title text. No quotes, no explanation.

Page content:
${content}`
})

// ─── Description angles ───────────────────────────────────────────────────────

const DESC_ANGLES = [
  "Open with a direct answer to the reader's likely question, then add a clear call to action",
  'Open with the pain point the reader has, then offer the solution this page provides',
  'Open with a bold claim, then briefly back it up',
  'Open with who this is for, then state what they will get',
]

const descFns: AngleFn[] = DESC_ANGLES.map((angle) => ({content, keyword, keywords, ctx}) => {
  const kwLine = buildKeywordLine(
    keyword,
    keywords,
    'naturally in the description',
    '- Include a clear call to action',
  )
  return `You are an SEO expert. ${ctx}
Generate one SEO-optimized meta description using this angle: ${angle}.
Requirements:
- Strictly 120–160 characters including spaces and punctuation
${kwLine}
- Short sentences (under 15 words each), plain everyday words, no jargon — aim for high readability
- Apply the angle — do not deviate
- Return ONLY the description text. No quotes, no explanation.

Page content:
${content}`
})

// ─── OG Title angles ──────────────────────────────────────────────────────────

const OG_TITLE_ANGLES = [
  'Curiosity hook — make the reader need to click to find out',
  'FOMO angle — what they will miss if they do not read this',
  'Social proof angle — imply consensus, popularity, or trust',
  'Question angle — pose the exact question the audience is thinking',
]

const ogTitleFns: AngleFn[] = OG_TITLE_ANGLES.map(
  (angle) =>
    ({content, keyword, ctx}) =>
      `You are a social media and SEO expert. ${ctx}
Generate one Open Graph title for social sharing using this angle: ${angle}.
Requirements:
- Strictly 40–60 characters
- Optimized for social sharing engagement, not just search
- Include the core topic clearly${keyword ? ` (topic: "${keyword}")` : ''}
- Apply the angle above — do not deviate from it
- Return ONLY the OG title text. No quotes, no explanation.

Page content:
${content}`,
)

// ─── OG Description angles ────────────────────────────────────────────────────

const OG_DESC_ANGLES = [
  'Focus on what the reader gets — concrete takeaways or outcomes',
  'Transformation promise — describe the before/after state',
  'Bold claim backed by a brief piece of evidence or context',
  'Pain relief framing — identify the problem and promise relief',
]

const ogDescFns: AngleFn[] = OG_DESC_ANGLES.map(
  (angle) =>
    ({content, keyword, ctx}) =>
      `You are a social media and SEO expert. ${ctx}
Generate one Open Graph description for social sharing using this angle: ${angle}.
Requirements:
- Strictly 90–120 characters
- Compelling enough to drive clicks from social feeds
- Include the core topic naturally${keyword ? ` (topic: "${keyword}")` : ''}
- Apply the angle above — do not deviate from it
- Return ONLY the OG description text. No quotes, no explanation.

Page content:
${content}`,
)

// ─── Twitter Title angles ─────────────────────────────────────────────────────

const TW_TITLE_ANGLES = [
  'Punchy curiosity hook — make the reader need to click',
  'Direct FOMO — what they miss by scrolling past',
  'Conversational question the audience is silently asking',
  'Bold, scroll-stopping claim in plain language',
]

const twTitleFns: AngleFn[] = TW_TITLE_ANGLES.map(
  (angle) =>
    ({content, keyword, ctx}) =>
      `You are a social media copywriter. ${ctx}
Generate one X (Twitter) card title using this angle: ${angle}.
Requirements:
- Strictly 30–70 characters
- Punchy and direct — Twitter audiences scroll fast
- Include the core topic naturally${keyword ? ` (topic: "${keyword}")` : ''}
- Apply the angle above — do not deviate from it
- Return ONLY the title text. No quotes, no explanation.

Page content:
${content}`,
)

// ─── Twitter Description angles ───────────────────────────────────────────────

const TW_DESC_ANGLES = [
  'Conversational direct answer — what the page gives you',
  'Pain-point opener followed by relief in one sentence',
  'Bold hook followed by the core benefit',
  'Short-form transformation promise',
]

const twDescFns: AngleFn[] = TW_DESC_ANGLES.map(
  (angle) =>
    ({content, keyword, ctx}) =>
      `You are a social media copywriter. ${ctx}
Generate one X (Twitter) card description using this angle: ${angle}.
Requirements:
- Strictly 50–200 characters
- Conversational and punchy — casual Twitter tone
- Include the core topic naturally${keyword ? ` (topic: "${keyword}")` : ''}
- Apply the angle above — do not deviate from it
- Return ONLY the description text. No quotes, no explanation.

Page content:
${content}`,
)

// ─── Focus Keyword angles ─────────────────────────────────────────────────────

const FK_ANGLES = [
  'Identify the single keyword phrase a user would most likely search to find this page',
  'Identify the primary search intent keyword — what the reader types when looking for this content',
  'Extract the most commercially or informationally valuable keyword from this content',
  'Identify the exact phrase that best captures the core topic of this page',
]

const fkFns: AngleFn[] = FK_ANGLES.map((angle) => ({content, meta, ctx}) => {
  const hasTitle = Boolean(meta?.title)
  const hasDescription = Boolean(meta?.description)
  const hasSlug = Boolean(meta?.slug)

  const metaBlock =
    hasTitle || hasDescription || hasSlug
      ? `\nExisting page fields:
${hasTitle ? `Meta title: "${meta!.title}"` : ''}
${hasDescription ? `Meta description: "${meta!.description}"` : ''}
${hasSlug ? `URL slug: "${meta!.slug}"` : ''}

CRITICAL: The keyword you return MUST appear verbatim (exact match, case-insensitive) inside the meta title${hasDescription ? ' and meta description' : ''} above.
Do NOT invent a new keyword — extract one that already exists in those fields.
${hasSlug ? 'Prefer a phrase that also appears in the URL slug.' : ''}
`
      : ''

  return `You are an SEO expert. ${ctx}
Task: ${angle}.
${metaBlock}
Requirements:
- Return ONLY the keyword or keyword phrase (1–4 words typically)
- It MUST appear verbatim in the meta title${hasDescription ? ' and description' : ''} provided above
- No explanation, no quotes, no punctuation, no extra words
- Single line response

Page content:
${content}`
})

// ─── Keywords angles ──────────────────────────────────────────────────────────

const KW_ANGLES = [
  'Generate 8 keywords mixing high-volume short-tail and specific long-tail phrases',
  'Generate 8 keywords that cover both the main topic and closely related subtopics',
  'Generate 8 keywords targeting both informational and commercial search intent',
  'Generate 8 keywords including question-based phrases people would search',
]

const kwFns: AngleFn[] = KW_ANGLES.map(
  (angle) =>
    ({content, keyword, ctx}) =>
      `You are an SEO expert. ${ctx}
${angle}${keyword ? ` Include "${keyword}" as one of the keywords.` : ''}
Requirements:
- Return exactly 8 keywords as a comma-separated list
- No numbering, no explanation, no quotes around individual keywords
- Mix short-tail (1–2 words) and long-tail (3–5 words) phrases
- All keywords must be directly relevant to the page content

Page content:
${content}`,
)

// ─── Angle map ────────────────────────────────────────────────────────────────

const BASE_ANGLES: FieldAngles = {
  title: titleFns,
  description: descFns,
  focusKeyword: fkFns,
  keywords: kwFns,
  ogTitle: ogTitleFns,
  ogDescription: ogDescFns,
  twitterTitle: twTitleFns,
  twitterDescription: twDescFns,
}

function buildFieldPrompts(ctx: string, count: number): Record<SeoGenField, PromptFn[]> {
  const out = {} as Record<SeoGenField, PromptFn[]>
  for (const field of Object.keys(BASE_ANGLES) as SeoGenField[]) {
    out[field] = BASE_ANGLES[field]
      .slice(0, count)
      .map((fn) => (p: PromptParams) => fn({...p, ctx}))
  }
  return out
}

export const INDUSTRY_PROMPTS = Object.fromEntries(
  (Object.keys(PUBLIC_INDUSTRY_CONTEXTS) as PublicIndustry[]).map((industry) => [
    industry,
    buildFieldPrompts(PUBLIC_INDUSTRY_CONTEXTS[industry], PUBLIC_ANGLE_COUNT),
  ]),
) as Record<PublicIndustry, Record<SeoGenField, PromptFn[]>>

export const DEFAULT_PROMPTS = buildFieldPrompts(GENERIC_CTX, PUBLIC_ANGLE_COUNT)

async function resolvePromptPool(
  field: SeoGenField,
  industry?: AiIndustry,
  licenseKey?: string,
  projectId?: string,
): Promise<PromptFn[]> {
  const isFreeIndustry = Boolean(
    industry && (FREE_INDUSTRIES as readonly string[]).includes(industry),
  )
  const publicPrompts = isFreeIndustry
    ? INDUSTRY_PROMPTS[industry as PublicIndustry][field]
    : DEFAULT_PROMPTS[field]

  if (!licenseKey) return publicPrompts

  // The remaining angles (up to 10 total) live entirely in `seofields-pro` — never shipped in
  // this package's bundle — and are only returned once the license actually validates.
  try {
    const mod = (await import('seofields-pro')) as {
      resolveLicensedPromptPool?: LicensedPromptPoolResolver
    }
    // Pro package unavailable — an unverified licenseKey alone must never unlock the pool.
    if (typeof mod.resolveLicensedPromptPool !== 'function') return publicPrompts

    return mod.resolveLicensedPromptPool({
      licenseKey,
      projectId,
      field,
      industry,
      publicPrompts,
    })
  } catch {
    return publicPrompts
  }
}

export async function pickPrompt(
  field: SeoGenField,
  params: PromptParams,
  industry?: AiIndustry,
  licenseKey?: string,
  projectId?: string,
): Promise<string> {
  const pool = await resolvePromptPool(field, industry, licenseKey, projectId)
  const fn = pool[Math.floor(Math.random() * pool.length)]
  return fn(params)
}

// ─── Test mode static outputs ─────────────────────────────────────────────────

export const TEST_MODE_OUTPUTS: Record<SeoGenField, string[]> = {
  title: [
    'Boost Your SEO Rankings With These Proven Tips',
    'How to Write Meta Titles That Drive More Clicks',
    '10 Strategies to Improve Your Search Visibility',
    'Why Your Meta Title Is Killing Your Click-Through Rate',
  ],
  description: [
    'Learn how to write SEO-optimized meta titles that rank higher and earn more clicks. Discover the exact techniques used by top SEO professionals.',
    'Struggling with low organic traffic? Our complete guide covers everything you need to fix your meta tags and climb the search rankings fast.',
    'Meta titles under 60 characters get the best click-through rates. Find out how to craft compelling titles that rank and convert visitors.',
    'This guide is for content creators and marketers who want to improve search rankings without technical expertise. Start seeing results today.',
  ],
  focusKeyword: [
    'seo meta title',
    'on-page seo',
    'meta tag optimization',
    'organic traffic growth',
  ],
  keywords: [
    'seo tips, meta title optimization, on-page seo, search rankings, click-through rate, seo guide, organic traffic, meta description, keyword placement, seo best practices',
    'meta tags, title tag optimization, serp optimization, seo ranking factors, page title seo, seo for beginners, improve search rankings, seo checklist, meta title length, seo tools',
    'on-page optimization, meta tag guide, seo title tips, increase organic traffic, search visibility, seo writing, title tag examples, meta description length, content seo, seo strategy',
    'seo optimization guide, meta title examples, serp click-through rate, google ranking tips, seo content writing, page title best practices, keyword in title, seo traffic, rank higher google, search engine results',
  ],
  ogTitle: [
    'The SEO Secret That Tripled Our Organic Traffic',
    'Are You Making These 5 Common Meta Title Mistakes?',
    'This One Change Can Double Your Search Click-Through Rate',
    'Why 90% of Meta Titles Fail to Drive Clicks',
  ],
  ogDescription: [
    'Get the exact framework top SEO teams use to write meta titles that rank higher and earn more clicks from search results.',
    'Before: low CTR and invisible search rankings. After: consistent page-one results. Here is how to make that shift with your meta tags.',
    'Research shows properly optimized meta titles get 30% more clicks. We show you exactly how to achieve that in under 10 minutes.',
    'If your page is not getting clicks from search results, your meta title is likely the problem. Here is how to diagnose and fix it.',
  ],
  twitterTitle: [
    'The Meta Title Trick That Tripled Our Traffic',
    "You're Probably Writing Meta Titles Wrong",
    'One Change That Doubles Your Click-Through Rate',
    'Why Most Meta Titles Fail (And How to Fix Yours)',
  ],
  twitterDescription: [
    "Most pages leave clicks on the table because of weak meta titles. Here's the fix — in under 10 minutes.",
    "Low search CTR? Your meta title is probably the culprit. Here's how to diagnose and fix it today.",
    'Optimized meta titles get 30% more clicks. This guide shows you exactly how to write one that works.',
    'Stop writing generic meta titles. This thread-worthy guide gives you templates that rank and convert.',
  ],
}

export function pickTestOutput(field: SeoGenField): string {
  const arr = TEST_MODE_OUTPUTS[field]
  return arr[Math.floor(Math.random() * arr.length)]
}
