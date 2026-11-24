import {extractDocBlocks} from '../utils/extractDocText'
import {
  analyzeContentReadability,
  analyzeReadability,
  type ContentBlock,
  isPassiveSentence,
  type ReadabilityCheck,
  splitSentences,
} from '../utils/readability'

const p = (text: string): ContentBlock => ({kind: 'paragraph', text})
const h = (text: string, level = 2): ContentBlock => ({kind: 'heading', text, level})

const check = (blocks: ContentBlock[] | string, id: ReadabilityCheck['id']) => {
  const result = analyzeContentReadability(blocks)
  if (!result) throw new Error('expected a result')
  const found = result.checks.find((c) => c.id === id)
  if (!found) throw new Error(`missing check ${id}`)
  return found
}

const shortSentence = 'The cat sat on the warm mat today.' // 8 words
const longSentence =
  'The quick brown fox jumped over the lazy dog while the farmer watched from the porch and wondered why it kept happening every single morning.' // 25 words

describe('analyzeReadability (meta description helper)', () => {
  it('keeps its original behaviour and output shape', () => {
    const text =
      'Learn how to bake bread at home. Simple steps, plain flour, and a hot oven are all you need.'
    expect(analyzeReadability(text)).toEqual({
      score: expect.any(Number),
      gradeLevel: expect.any(Number),
      avgWordsPerSentence: 9.5,
      words: 19,
      sentences: 2,
      label: expect.any(String),
      color: expect.stringMatching(/green|orange|red/),
    })
  })

  it('returns null for fewer than 10 words', () => {
    expect(analyzeReadability('Too short to score.')).toBeNull()
  })
})

describe('splitSentences', () => {
  it('splits on terminal punctuation', () => {
    expect(splitSentences('One here. Two here! Three here? Four')).toEqual([
      'One here.',
      'Two here!',
      'Three here?',
      'Four',
    ])
  })

  it('does not split on decimals or common abbreviations', () => {
    expect(splitSentences('Version 2.5 is out, e.g. for Dr. Smith. It works.')).toEqual([
      'Version 2.5 is out, e.g. for Dr. Smith.',
      'It works.',
    ])
  })
})

describe('isPassiveSentence', () => {
  it.each([
    'The report was written by the team.',
    'Mistakes were made.',
    'The page is updated every week.',
    'It has been carefully reviewed.',
  ])('detects passive voice: %s', (s) => {
    expect(isPassiveSentence(s)).toBe(true)
  })

  it.each(['The team wrote the report.', 'We need more speed.', 'She is red.'])(
    'ignores active voice: %s',
    (s) => {
      expect(isPassiveSentence(s)).toBe(false)
    },
  )
})

describe('analyzeContentReadability', () => {
  it('returns null when there is too little text', () => {
    expect(analyzeContentReadability([p('Hello there.')])).toBeNull()
  })

  it('computes Flesch metrics and runs all six checks', () => {
    const blocks = [h('Intro'), p(Array(6).fill(shortSentence).join(' '))]
    const result = analyzeContentReadability(blocks)
    expect(result).not.toBeNull()
    expect(result!.words).toBe(48)
    expect(result!.sentences).toBe(6)
    expect(result!.avgWordsPerSentence).toBe(8)
    expect(result!.headings).toBe(1)
    expect(result!.checks.map((c) => c.id)).toEqual([
      'flesch',
      'sentenceLength',
      'paragraphLength',
      'passiveVoice',
      'consecutiveSentences',
      'subheadingDistribution',
    ])
  })

  it('excludes headings from the sentence metrics', () => {
    const body = Array(4).fill(shortSentence).join(' ')
    const withHeading = analyzeContentReadability([
      h('A very long heading without a period'),
      p(body),
    ])
    const without = analyzeContentReadability([p(body)])
    expect(withHeading!.words).toBe(without!.words)
    expect(withHeading!.sentences).toBe(without!.sentences)
  })

  it('accepts a plain string (paragraphs split on blank lines)', () => {
    const text = `${shortSentence} ${shortSentence}\n\n${shortSentence} ${shortSentence}`
    expect(analyzeContentReadability(text)?.paragraphs).toBe(2)
  })

  describe('sentence length', () => {
    it('passes when few sentences are long', () => {
      const text = [longSentence, ...Array(5).fill(shortSentence)].join(' ')
      expect(check([p(text)], 'sentenceLength').status).toBe('good')
    })

    it('fails when more than 30% of sentences are long', () => {
      const text = [longSentence, longSentence, shortSentence].join(' ')
      const c = check([p(text)], 'sentenceLength')
      expect(c.status).toBe('problem')
      expect(c.value).toBe('67% of sentences have more than 20 words')
    })

    it('respects custom thresholds', () => {
      const text = [longSentence, longSentence, shortSentence].join(' ')
      const result = analyzeContentReadability([p(text)], {
        thresholds: {longSentenceWords: 30},
      })
      expect(result!.checks.find((c) => c.id === 'sentenceLength')!.status).toBe('good')
    })
  })

  describe('paragraph length', () => {
    it('flags paragraphs over 150 words', () => {
      const para = Array(20).fill(shortSentence).join(' ') // 160 words
      const c = check([p(para)], 'paragraphLength')
      expect(c.status).toBe('ok')
      expect(c.value).toContain('longest: 160')
    })

    it('is a problem when a paragraph exceeds 200 words', () => {
      const para = Array(30).fill(shortSentence).join(' ') // 240 words
      expect(check([p(para)], 'paragraphLength').status).toBe('problem')
    })

    it('does not count list items as paragraphs', () => {
      const item: ContentBlock = {kind: 'listItem', text: Array(30).fill(shortSentence).join(' ')}
      expect(check([item], 'paragraphLength').status).toBe('good')
    })
  })

  describe('passive voice', () => {
    it('flags heavy passive usage', () => {
      const text =
        'The report was written by the team. The data was collected by interns. The results were checked by a manager. Then everyone went home happy.'
      const c = check([p(text)], 'passiveVoice')
      expect(c.status).toBe('problem')
      expect(c.value).toBe('75% of sentences look passive')
    })
  })

  describe('consecutive sentences', () => {
    it('flags three sentences in a row starting with the same word', () => {
      const text =
        'The page loads fast. The page looks good. The page ranks well. Readers enjoy every part of it, and they keep coming back for more.'
      const c = check([p(text)], 'consecutiveSentences')
      expect(c.status).toBe('ok')
      expect(c.value).toContain('3× "the"')
    })

    it('passes when openings are varied', () => {
      const text =
        'Our page loads fast. It looks good too. Search engines rank it well. Readers enjoy every part of it, and they keep coming back for more.'
      expect(check([p(text)], 'consecutiveSentences').status).toBe('good')
    })
  })

  describe('subheading distribution', () => {
    const words = (n: number) => p(`${Array(n).fill('word').join(' ')}.`)

    it('does not require subheadings for short text', () => {
      expect(check([words(120)], 'subheadingDistribution').status).toBe('good')
    })

    it('fails long text without any subheading', () => {
      const c = check([words(200), words(200)], 'subheadingDistribution')
      expect(c.status).toBe('problem')
      expect(c.value).toBe('No subheadings in 400 words of text')
    })

    it('flags sections longer than 300 words between headings', () => {
      const c = check([h('One'), words(200), h('Two'), words(320)], 'subheadingDistribution')
      expect(c.status).toBe('ok')
      expect(c.value).toContain('longest: 320')
    })

    it('passes well-structured text', () => {
      const c = check([h('One'), words(250), h('Two'), words(250)], 'subheadingDistribution')
      expect(c.status).toBe('good')
    })
  })
})

describe('extractDocBlocks', () => {
  it('maps Portable Text styles to headings, paragraphs and list items', () => {
    const doc = {
      body: [
        {_type: 'block', style: 'h2', children: [{_type: 'span', text: 'Heading'}]},
        {
          _type: 'block',
          style: 'normal',
          children: [{_type: 'span', text: 'Para '}, {text: 'one'}],
        },
        {_type: 'block', listItem: 'bullet', children: [{_type: 'span', text: 'Item'}]},
        {_type: 'image', alt: 'ignored alt text'},
        {_type: 'code', code: 'const x = 1'},
      ],
    }
    expect(extractDocBlocks(doc, 'body')).toEqual([
      {kind: 'heading', level: 2, text: 'Heading'},
      {kind: 'paragraph', text: 'Para one'},
      {kind: 'listItem', text: 'Item'},
    ])
  })

  it('recurses into wrapper objects and reads multiple fields in order', () => {
    const doc = {
      intro: 'Plain intro paragraph.\n\nSecond paragraph.',
      sections: [
        {
          _type: 'section',
          content: [{_type: 'block', children: [{_type: 'span', text: 'Nested'}]}],
        },
      ],
    }
    expect(extractDocBlocks(doc, ['intro', 'sections']).map((b) => b.text)).toEqual([
      'Plain intro paragraph.',
      'Second paragraph.',
      'Nested',
    ])
  })

  it('treats markdown-style headings in strings as headings', () => {
    expect(extractDocBlocks({body: '## Title\n\nText.'}, 'body')).toEqual([
      {kind: 'heading', level: 2, text: 'Title'},
      {kind: 'paragraph', text: 'Text.'},
    ])
  })

  it('handles missing documents and fields', () => {
    expect(extractDocBlocks(undefined, 'body')).toEqual([])
    expect(extractDocBlocks({}, 'body')).toEqual([])
  })
})
