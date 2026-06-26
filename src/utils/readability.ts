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

/**
 * Compute Flesch Reading Ease and Flesch-Kincaid Grade Level.
 * Returns null if text has fewer than 10 words.
 *
 * Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
 * FK Grade Level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
 */
export function analyzeReadability(text: string): ReadabilityResult | null {
  const wordList = text.trim().split(/\s+/).filter(Boolean)
  const words = wordList.length
  if (words < 10) return null

  const sentences = countSentences(text)
  const syllables = wordList.reduce((acc, word) => acc + countSyllables(word), 0)

  const rawScore = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  const score = Math.round(rawScore * 10) / 10

  const rawGrade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
  const gradeLevel = Math.round(rawGrade * 10) / 10

  const avgWordsPerSentence = Math.round((words / sentences) * 10) / 10

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
