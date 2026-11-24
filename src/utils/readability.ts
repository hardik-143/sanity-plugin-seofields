/**
 * Readability heuristics.
 *
 * - `analyzeReadability(text)` — Flesch reading ease + Flesch-Kincaid grade for a short piece of text
 *   (used by the meta description input and the AI refinement passes).
 * - `analyzeContentReadability(blocks)` — document-level analysis of the main body content: the same
 *   Flesch metrics plus Yoast-style checks (long sentences, long paragraphs, passive voice,
 *   consecutive sentences with the same opening word, subheading distribution).
 *
 * All heuristics are tuned for **English** text. Syllable counting, sentence splitting and the passive
 * voice detector are approximations and will be noticeably less accurate for other languages.
 */

export interface ReadabilityResult {
  score: number
  gradeLevel: number
  avgWordsPerSentence: number
  words: number
  sentences: number
  label: string
  color: 'green' | 'orange' | 'red'
}

/**
 * Count vowel groups in a single word (improved — no regex stripping hacks).
 * - Lowercase, strip non-alpha
 * - If <= 3 chars -> 1 syllable
 * - Count consecutive vowel groups ([aeiouy]+ matches)
 * - Special case: silent trailing 'e' after consonant -> subtract 1 syllable, min 1
 */
function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (w.length <= 3) return 1

  // Count consecutive vowel groups
  const groups = w.match(/[aeiouy]+/g) ?? []
  let count = groups.length

  // Special case: silent trailing 'e' after consonant -> subtract 1 syllable, min 1
  if (w.endsWith('e') && w.length > 1 && !/[aeiouy]/.test(w[w.length - 2])) {
    count = Math.max(1, count - 1)
  }

  return Math.max(1, count)
}

/**
 * Split text on sentence boundaries (., !, ?)
 */
function countSentences(text: string): number {
  const matches = text.match(/[.!?]+/g)
  return matches ? matches.length : 1
}

const round1 = (n: number): number => Math.round(n * 10) / 10

/**
 * Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
 * FK Grade Level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
 */
function fleschFromCounts(words: number, sentences: number, syllables: number): ReadabilityResult {
  const rawScore = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  const score = round1(rawScore)

  const rawGrade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
  const gradeLevel = round1(rawGrade)

  const avgWordsPerSentence = round1(words / sentences)

  let label: string
  let color: 'green' | 'orange' | 'red'

  if (score >= 70) {
    label = 'Easy to read'
    color = 'green'
  } else if (score >= 50) {
    label = 'Fairly easy'
    color = 'green'
  } else if (score >= 30) {
    label = 'Moderately difficult'
    color = 'orange'
  } else {
    label = 'Difficult to read'
    color = 'red'
  }

  return {
    score,
    gradeLevel,
    avgWordsPerSentence,
    words,
    sentences,
    label,
    color,
  }
}

/**
 * Compute Flesch Reading Ease and Flesch-Kincaid Grade Level.
 * Returns null if text has fewer than 10 words.
 */
export function analyzeReadability(text: string): ReadabilityResult | null {
  const wordList = text.trim().split(/\s+/).filter(Boolean)
  const words = wordList.length
  if (words < 10) return null

  const sentences = countSentences(text)
  const syllables = wordList.reduce((acc, word) => acc + countSyllables(word), 0)

  return fleschFromCounts(words, sentences, syllables)
}

// ---------------------------------------------------------------------------
// Document-level content readability
// ---------------------------------------------------------------------------

/** A structural unit of body content, as produced by `extractDocBlocks`. */
export interface ContentBlock {
  kind: 'heading' | 'paragraph' | 'listItem'
  text: string
  /** Heading level (1–6) for `kind: 'heading'`. */
  level?: number
}

export type ReadabilityCheckId =
  | 'flesch'
  | 'sentenceLength'
  | 'paragraphLength'
  | 'passiveVoice'
  | 'consecutiveSentences'
  | 'subheadingDistribution'

export type ReadabilityCheckStatus = 'good' | 'ok' | 'problem'

export interface ReadabilityCheck {
  id: ReadabilityCheckId
  label: string
  status: ReadabilityCheckStatus
  /** Short, human-readable measurement, e.g. "32% of sentences have more than 20 words". */
  value: string
  /** Actionable advice. Present for every check; UIs usually only show it when status !== 'good'. */
  hint: string
}

export interface ReadabilityThresholds {
  /** A sentence with more than this many words is "long". Default 20. */
  longSentenceWords: number
  /** Max share (%) of long sentences before the check fails. Default 25. */
  longSentencePercent: number
  /** A paragraph with more than this many words is "long". Default 150. */
  longParagraphWords: number
  /** Max share (%) of sentences in passive voice before the check fails. Default 10. */
  passiveVoicePercent: number
  /** This many sentences in a row starting with the same word is flagged. Default 3. */
  consecutiveSentences: number
  /** Max words of text between subheadings. Default 300. */
  subheadingWords: number
}

export const DEFAULT_READABILITY_THRESHOLDS: ReadabilityThresholds = {
  longSentenceWords: 20,
  longSentencePercent: 25,
  longParagraphWords: 150,
  passiveVoicePercent: 10,
  consecutiveSentences: 3,
  subheadingWords: 300,
}

export interface ContentReadabilityResult extends ReadabilityResult {
  paragraphs: number
  headings: number
  checks: ReadabilityCheck[]
  /** Number of checks with status 'good'. */
  passed: number
}

export interface ContentReadabilityOptions {
  thresholds?: Partial<ReadabilityThresholds>
  /** Minimum number of words before an analysis is returned. Default 25. */
  minWords?: number
}

const SENTENCE_END = /[.!?…]+["'”’)\]]*(?=\s|$)/g

// Tokens ending with a period that usually do NOT end a sentence.
const ABBREVIATIONS = new Set([
  'mr.',
  'mrs.',
  'ms.',
  'dr.',
  'prof.',
  'sr.',
  'jr.',
  'st.',
  'vs.',
  'e.g.',
  'i.e.',
  'approx.',
  'no.',
  'fig.',
  'inc.',
  'ltd.',
  'co.',
])

function isAbbreviation(piece: string): boolean {
  const lastToken = piece.trim().split(/\s+/).pop()?.toLowerCase() ?? ''
  if (ABBREVIATIONS.has(lastToken)) return true
  // Single-letter initials such as "J." in "J. R. R. Tolkien"
  return /^[a-z]\.$/.test(lastToken)
}

/** Split a paragraph into sentences. English-oriented heuristic. */
export function splitSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return []

  const sentences: string[] = []
  let start = 0
  let pending = ''
  SENTENCE_END.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = SENTENCE_END.exec(clean)) !== null) {
    const end = match.index + match[0].length
    const piece = pending + clean.slice(start, end)
    start = end
    if (isAbbreviation(piece)) {
      pending = piece
      continue
    }
    pending = ''
    if (piece.trim()) sentences.push(piece.trim())
  }
  const rest = (pending + clean.slice(start)).trim()
  if (rest) sentences.push(rest)
  return sentences
}

/** Word tokens — anything containing at least one letter or digit. */
export function tokenizeWords(text: string): string[] {
  return text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t))
}

const BE_VERBS = 'am|is|are|was|were|be|been|being|get|gets|got|gotten|getting'

const IRREGULAR_PARTICIPLES = [
  'arisen',
  'awoken',
  'beaten',
  'become',
  'begun',
  'bent',
  'bitten',
  'blown',
  'born',
  'borne',
  'bought',
  'bound',
  'broken',
  'brought',
  'built',
  'burnt',
  'caught',
  'chosen',
  'cut',
  'dealt',
  'done',
  'drawn',
  'driven',
  'eaten',
  'fallen',
  'fed',
  'felt',
  'fought',
  'found',
  'forbidden',
  'forgiven',
  'forgotten',
  'frozen',
  'given',
  'grown',
  'held',
  'hidden',
  'hit',
  'hung',
  'hurt',
  'kept',
  'known',
  'laid',
  'led',
  'left',
  'lent',
  'lost',
  'made',
  'meant',
  'met',
  'paid',
  'put',
  'read',
  'ridden',
  'run',
  'said',
  'seen',
  'sent',
  'set',
  'shaken',
  'shot',
  'shown',
  'shut',
  'sold',
  'sought',
  'spent',
  'spoken',
  'spread',
  'stolen',
  'struck',
  'sung',
  'sunk',
  'swept',
  'sworn',
  'taken',
  'taught',
  'thrown',
  'thought',
  'told',
  'torn',
  'understood',
  'undone',
  'upset',
  'woken',
  'won',
  'worn',
  'woven',
  'written',
]

const PASSIVE_RE = new RegExp(
  `\\b(?:${BE_VERBS})\\s+(?:(?:not|never|also|often|always|usually|being)\\s+)?(?:\\w+ly\\s+)?(\\w+ed|${IRREGULAR_PARTICIPLES.join('|')})\\b`,
  'i',
)

// "-ed" words that are not past participles.
const NOT_PARTICIPLES = new Set([
  'bed',
  'red',
  'shed',
  'need',
  'feed',
  'seed',
  'speed',
  'weed',
  'bleed',
  'breed',
  'greed',
  'indeed',
  'proceed',
  'succeed',
  'exceed',
  'naked',
  'wicked',
  'sacred',
  'hundred',
  'kindred',
])

/** Rough passive-voice detector: a form of "to be"/"to get" followed by a past participle. */
export function isPassiveSentence(sentence: string): boolean {
  const match = PASSIVE_RE.exec(sentence)
  if (!match) return false
  return !NOT_PARTICIPLES.has(match[1].toLowerCase())
}

function firstWord(sentence: string): string {
  const token = tokenizeWords(sentence)[0] ?? ''
  return token.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '')
}

const pct = (part: number, whole: number): number =>
  whole > 0 ? Math.round((part / whole) * 100) : 0

const plural = (n: number, one: string, many = `${one}s`): string => (n === 1 ? one : many)

interface SentenceInfo {
  text: string
  words: number
  blockIndex: number
}

function checkFlesch(base: ReadabilityResult): ReadabilityCheck {
  let status: ReadabilityCheckStatus = 'problem'
  if (base.score >= 50) status = 'good'
  else if (base.score >= 30) status = 'ok'
  return {
    id: 'flesch',
    label: 'Flesch reading ease',
    status,
    value: `${base.score} — ${base.label} (grade ${base.gradeLevel})`,
    hint: 'Use shorter sentences and simpler, more common words to make the text easier to read.',
  }
}

function checkSentenceLength(
  sentences: SentenceInfo[],
  t: ReadabilityThresholds,
): ReadabilityCheck {
  const long = sentences.filter((s) => s.words > t.longSentenceWords).length
  const share = pct(long, sentences.length)
  let status: ReadabilityCheckStatus = 'problem'
  if (share <= t.longSentencePercent) status = 'good'
  else if (share <= t.longSentencePercent + 5) status = 'ok'
  return {
    id: 'sentenceLength',
    label: 'Sentence length',
    status,
    value: `${share}% of sentences have more than ${t.longSentenceWords} words`,
    hint: `Keep at most ${t.longSentencePercent}% of sentences above ${t.longSentenceWords} words — split long sentences in two.`,
  }
}

function checkParagraphLength(blocks: ContentBlock[], t: ReadabilityThresholds): ReadabilityCheck {
  const lengths = blocks
    .filter((b) => b.kind === 'paragraph')
    .map((b) => tokenizeWords(b.text).length)
  const long = lengths.filter((n) => n > t.longParagraphWords)
  const longest = long.length ? Math.max(...long) : 0
  let status: ReadabilityCheckStatus = 'good'
  if (long.length > 0) {
    status = longest > t.longParagraphWords + 50 ? 'problem' : 'ok'
  }
  return {
    id: 'paragraphLength',
    label: 'Paragraph length',
    status,
    value:
      long.length === 0
        ? `No paragraphs longer than ${t.longParagraphWords} words`
        : `${long.length} ${plural(long.length, 'paragraph')} longer than ${t.longParagraphWords} words (longest: ${longest})`,
    hint: `Break paragraphs longer than ${t.longParagraphWords} words into smaller chunks.`,
  }
}

function checkPassiveVoice(sentences: SentenceInfo[], t: ReadabilityThresholds): ReadabilityCheck {
  const passive = sentences.filter((s) => isPassiveSentence(s.text)).length
  const share = pct(passive, sentences.length)
  let status: ReadabilityCheckStatus = 'problem'
  if (share <= t.passiveVoicePercent) status = 'good'
  else if (share <= t.passiveVoicePercent + 5) status = 'ok'
  return {
    id: 'passiveVoice',
    label: 'Passive voice (estimate)',
    status,
    value: `${share}% of sentences look passive`,
    hint: `Aim for at most ${t.passiveVoicePercent}% passive sentences — say who does what ("The team built it" rather than "It was built").`,
  }
}

function checkConsecutiveSentences(
  sentences: SentenceInfo[],
  t: ReadabilityThresholds,
): ReadabilityCheck {
  const runs: Array<{word: string; count: number}> = []
  let i = 0
  const openings = sentences.map((s) => firstWord(s.text))
  while (i < openings.length) {
    const word = openings[i]
    let j = i + 1
    if (word) {
      while (j < openings.length && openings[j] === word) j++
    }
    const count = j - i
    if (word && count >= t.consecutiveSentences) runs.push({word, count})
    i = j
  }

  let status: ReadabilityCheckStatus = 'good'
  if (runs.length === 1) status = 'ok'
  else if (runs.length > 1) status = 'problem'

  const worst = runs.reduce<{word: string; count: number} | null>(
    (acc, r) => (!acc || r.count > acc.count ? r : acc),
    null,
  )
  return {
    id: 'consecutiveSentences',
    label: 'Consecutive sentences',
    status,
    value: worst
      ? `${runs.length} ${plural(runs.length, 'run')} of ${t.consecutiveSentences}+ sentences starting with the same word (e.g. ${worst.count}× "${worst.word}")`
      : 'Sentence openings are varied',
    hint: 'Vary how sentences begin — repeated openings make text feel monotonous.',
  }
}

function checkSubheadings(
  blocks: ContentBlock[],
  totalWords: number,
  t: ReadabilityThresholds,
): ReadabilityCheck {
  const sections: number[] = []
  let current = 0
  let headings = 0
  for (const b of blocks) {
    if (b.kind === 'heading') {
      headings++
      sections.push(current)
      current = 0
    } else {
      current += tokenizeWords(b.text).length
    }
  }
  sections.push(current)

  const base = {
    id: 'subheadingDistribution' as const,
    label: 'Subheading distribution',
    hint: `Add a subheading at least every ${t.subheadingWords} words so readers can scan the page.`,
  }

  if (headings === 0) {
    if (totalWords <= t.subheadingWords) {
      return {...base, status: 'good', value: 'Short text — subheadings are optional'}
    }
    return {...base, status: 'problem', value: `No subheadings in ${totalWords} words of text`}
  }

  const tooLong = sections.filter((n) => n > t.subheadingWords)
  const longest = tooLong.length ? Math.max(...tooLong) : 0
  let status: ReadabilityCheckStatus = 'good'
  if (tooLong.length > 0) status = longest > t.subheadingWords + 50 ? 'problem' : 'ok'
  return {
    ...base,
    status,
    value:
      tooLong.length === 0
        ? `Every section is under ${t.subheadingWords} words`
        : `${tooLong.length} ${plural(tooLong.length, 'section')} run longer than ${t.subheadingWords} words without a subheading (longest: ${longest})`,
  }
}

/**
 * Document-level readability for body content.
 *
 * Accepts structured blocks (see `extractDocBlocks`) or a plain string; a string is split into
 * paragraphs on blank lines (so it has no headings). Headings are excluded from the Flesch and
 * sentence-level metrics and only used for the subheading-distribution check.
 *
 * Returns null when there are fewer than `minWords` (default 25) words of body text.
 */
export function analyzeContentReadability(
  input: string | ContentBlock[],
  options: ContentReadabilityOptions = {},
): ContentReadabilityResult | null {
  const t: ReadabilityThresholds = {...DEFAULT_READABILITY_THRESHOLDS, ...options.thresholds}
  const minWords = options.minWords ?? 25

  const blocks: ContentBlock[] =
    typeof input === 'string'
      ? input
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((text) => ({kind: 'paragraph' as const, text}))
      : input.filter((b) => b && typeof b.text === 'string' && b.text.trim())

  const sentences: SentenceInfo[] = []
  let words = 0
  let syllables = 0
  blocks.forEach((block, blockIndex) => {
    if (block.kind === 'heading') return
    for (const s of splitSentences(block.text)) {
      const tokens = tokenizeWords(s)
      if (tokens.length === 0) continue
      words += tokens.length
      syllables += tokens.reduce((acc, w) => acc + countSyllables(w), 0)
      sentences.push({text: s, words: tokens.length, blockIndex})
    }
  })

  if (words < minWords || sentences.length === 0) return null

  const base = fleschFromCounts(words, sentences.length, syllables)
  const checks: ReadabilityCheck[] = [
    checkFlesch(base),
    checkSentenceLength(sentences, t),
    checkParagraphLength(blocks, t),
    checkPassiveVoice(sentences, t),
    checkConsecutiveSentences(sentences, t),
    checkSubheadings(blocks, words, t),
  ]

  return {
    ...base,
    paragraphs: blocks.filter((b) => b.kind !== 'heading').length,
    headings: blocks.filter((b) => b.kind === 'heading').length,
    checks,
    passed: checks.filter((c) => c.status === 'good').length,
  }
}
