import {calculateHealthScore} from '../utils/scoring'

const seo = {
  title: `Widget ${'x'.repeat(48)}`,
  description: 'B'.repeat(140),
  metaImage: {asset: {_ref: 'image-1'}},
  keywords: ['widget'],
  focusKeyword: 'widget',
  robots: {},
  openGraph: {title: 'OG', description: 'OG', image: {asset: {_ref: 'image-2'}}, type: 'website'},
  twitter: {title: 'X', description: 'X', image: {asset: {_ref: 'image-3'}}},
}

const block = (text: string, style = 'normal') => ({
  _type: 'block',
  style,
  children: [{_type: 'span', text}],
})

const easyBody = [
  block('Getting started', 'h2'),
  block(
    'Our widget is easy to set up. You plug it in and it works. Most people finish in five minutes. Then you can enjoy it every day.',
  ),
]

const hardBody = [
  block(
    'The implementation was undertaken by the organisation in collaboration with numerous international stakeholders, notwithstanding considerable methodological complications that were encountered throughout the extraordinarily protracted evaluation. The documentation was subsequently reorganised by administrators who were responsible for institutional communication and comprehensive standardisation across departments. The methodology was criticised by independent commentators representing multidisciplinary perspectives on organisational effectiveness.',
  ),
]

describe('calculateHealthScore — readability (opt-in)', () => {
  it('leaves the score unchanged when the option is not passed', () => {
    const base = calculateHealthScore({seo})
    expect(calculateHealthScore({seo, body: hardBody})).toEqual(base)
    expect(calculateHealthScore({seo, body: hardBody}, {})).toEqual(base)
  })

  it('keeps the original score for documents without enough body text', () => {
    const base = calculateHealthScore({seo})
    expect(calculateHealthScore({seo}, {readability: true})).toEqual(base)
  })

  it('blends readability into the score and lists failing checks as issues', () => {
    const base = calculateHealthScore({seo}).score
    const easy = calculateHealthScore({seo, body: easyBody}, {readability: true})
    const hard = calculateHealthScore({seo, body: hardBody}, {readability: true})

    expect(easy.score).toBeLessThanOrEqual(100)
    expect(easy.score).toBeGreaterThan(hard.score)
    expect(hard.score).toBeLessThan(base)
    expect(hard.issues.some((i) => i.startsWith('Readability — Flesch reading ease'))).toBe(true)
    expect(easy.issues.some((i) => i.startsWith('Readability'))).toBe(false)
  })

  it('reads the configured content field and honours weight', () => {
    const doc = {_type: 'post', seo, content: hardBody}
    const base = calculateHealthScore({seo}).score
    expect(calculateHealthScore(doc, {readability: {content: 'content', weight: 0}}).score).toBe(
      base,
    )
    const weighted = calculateHealthScore(doc, {
      readability: {content: {post: 'content', default: 'body'}, weight: 30},
    })
    expect(weighted.score).toBeLessThan(
      calculateHealthScore(doc, {readability: {content: 'content', weight: 10}}).score,
    )
  })

  it('does not apply readability when seo is missing', () => {
    expect(calculateHealthScore({seo: undefined, body: easyBody}, {readability: true}).status).toBe(
      'missing',
    )
  })
})
