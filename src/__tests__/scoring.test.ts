import {calculateHealthScore} from '../utils/scoring'

const fullDoc = {
  seo: {
    title: `Widget ${'x'.repeat(48)}`,
    description: 'B'.repeat(140),
    metaImage: {asset: {_ref: 'image-1'}},
    keywords: ['widget'],
    focusKeyword: 'widget',
    robots: {},
    openGraph: {
      title: 'OG title',
      description: 'OG description',
      image: {asset: {_ref: 'image-2'}},
      type: 'website',
    },
    twitter: {
      title: 'Twitter title',
      description: 'Twitter description',
      image: {asset: {_ref: 'image-3'}},
    },
  },
}

describe('calculateHealthScore', () => {
  it('returns 0/missing when seo is not configured', () => {
    const result = calculateHealthScore({})
    expect(result.score).toBe(0)
    expect(result.status).toBe('missing')
  })

  it('contributes 0 to the keyword bucket when neither keywords nor focusKeyword are defined', () => {
    const withoutKeywords = calculateHealthScore({
      seo: {...fullDoc.seo, keywords: undefined, focusKeyword: undefined},
    })
    const withKeywords = calculateHealthScore(fullDoc)
    expect(withKeywords.score - withoutKeywords.score).toBe(10)
    expect(withoutKeywords.issues).toContain('No keywords defined')
    expect(withoutKeywords.issues).toContain('No focus keyword defined')
  })

  it('gives partial credit when keywords are declared but unused in title/description', () => {
    const doc = {
      seo: {...fullDoc.seo, keywords: ['unrelated-term'], focusKeyword: undefined},
    }
    const result = calculateHealthScore(doc)
    expect(result.issues).toContain('Keywords defined but not used in title or description')
    expect(result.issues).toContain('No focus keyword defined')
  })

  it('awards full keyword-array credit when a keyword appears in the title', () => {
    const doc = {
      seo: {...fullDoc.seo, title: 'Widget guide', keywords: ['widget'], focusKeyword: undefined},
    }
    const result = calculateHealthScore(doc)
    expect(result.issues).not.toContain('Keywords defined but not used in title or description')
  })

  it('awards full focus keyword credit when it is at the start of the title', () => {
    const doc = {
      seo: {
        ...fullDoc.seo,
        title: 'Widget guide for beginners',
        focusKeyword: 'widget',
        keywords: undefined,
      },
    }
    const result = calculateHealthScore(doc)
    expect(result.issues).not.toContain('Focus keyword missing from meta title and description')
    expect(result.issues).not.toContain('Focus keyword is in the title but not at the start')
  })

  it('flags focus keyword present in title but not at the start', () => {
    const doc = {
      seo: {
        ...fullDoc.seo,
        title: 'Buy a widget today',
        focusKeyword: 'widget',
        keywords: undefined,
      },
    }
    const result = calculateHealthScore(doc)
    expect(result.issues).toContain('Focus keyword is in the title but not at the start')
  })

  it('flags focus keyword only present in description', () => {
    const doc = {
      seo: {
        ...fullDoc.seo,
        title: 'Best gadgets',
        description: 'This widget rocks and everyone should get one for the home office setup.',
        focusKeyword: 'widget',
        keywords: undefined,
      },
    }
    const result = calculateHealthScore(doc)
    expect(result.issues).toContain('Focus keyword missing from meta title')
  })

  it('flags focus keyword absent from both title and description', () => {
    const doc = {
      seo: {
        ...fullDoc.seo,
        title: 'Best gadgets',
        description: 'Nothing relevant here at all for this description text.',
        focusKeyword: 'widget',
        keywords: undefined,
      },
    }
    const result = calculateHealthScore(doc)
    expect(result.issues).toContain('Focus keyword missing from meta title and description')
  })

  it('caps the keyword bucket at 10 and hits 100 total when everything is maxed', () => {
    const result = calculateHealthScore(fullDoc)
    expect(result.score).toBe(100)
    expect(result.status).toBe('excellent')
  })

  it('penalizes keyword stuffing in the array once', () => {
    const doc = {
      seo: {
        ...fullDoc.seo,
        title: 'widget widget widget widget widget',
        keywords: ['widget'],
        focusKeyword: undefined,
      },
    }
    const result = calculateHealthScore(doc)
    expect(result.issues).toContain('Keyword stuffing detected — reduce repeated keyword usage')
  })

  it('penalizes focus keyword stuffing', () => {
    const doc = {
      seo: {
        ...fullDoc.seo,
        title: 'widget widget widget widget',
        focusKeyword: 'widget',
        keywords: undefined,
      },
    }
    const result = calculateHealthScore(doc)
    expect(result.issues).toContain(
      'Focus keyword appears too many times in title — avoid stuffing',
    )
  })

  it('applies the stuffing penalty only once when both array and focus keyword are stuffed', () => {
    const doc = {
      seo: {
        ...fullDoc.seo,
        title: 'widget widget widget widget widget',
        keywords: ['widget'],
        focusKeyword: 'widget',
      },
    }
    const withStuffing = calculateHealthScore(doc)
    const withoutStuffing = calculateHealthScore({
      seo: {...doc.seo, title: 'Widget guide for the home'},
    })
    // Only a single -2 penalty should separate the two scenarios, not -4.
    expect(withoutStuffing.score - withStuffing.score).toBe(2)
  })

  it('never lets the keyword bucket go below 0', () => {
    const doc = {seo: {...fullDoc.seo, keywords: undefined, focusKeyword: undefined}}
    const result = calculateHealthScore(doc)
    expect(result.score).toBeGreaterThanOrEqual(0)
  })
})
