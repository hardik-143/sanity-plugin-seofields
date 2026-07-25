import {
  getFocusKeywordPlacement,
  getMetaDescriptionValidationMessages,
  getMetaTitleValidationMessages,
  getOgDescriptionValidation,
  getOgTitleValidation,
  getTwitterDescriptionValidation,
  getTwitterTitleValidation,
  hasKeywordOveruse,
} from '../utils/seoUtils'

describe('getFocusKeywordPlacement', () => {
  it('returns all-false facts when no focus keyword is set', () => {
    const result = getFocusKeywordPlacement('', 'Some title', 'Some description')
    expect(result).toEqual({
      hasFocusKeyword: false,
      inTitle: false,
      atStartOfTitle: false,
      inDescription: false,
      isStuffed: false,
    })
  })

  it('detects the keyword at the start of the title', () => {
    const result = getFocusKeywordPlacement('widget', 'Widget guide for beginners', '')
    expect(result.hasFocusKeyword).toBe(true)
    expect(result.atStartOfTitle).toBe(true)
    expect(result.inTitle).toBe(true)
  })

  it('detects the keyword present in the title but not at the start', () => {
    const result = getFocusKeywordPlacement('widget', 'Buy a widget today', '')
    expect(result.inTitle).toBe(true)
    expect(result.atStartOfTitle).toBe(false)
  })

  it('detects the keyword present only in the description', () => {
    const result = getFocusKeywordPlacement('widget', 'Best gadgets', 'This widget rocks')
    expect(result.inTitle).toBe(false)
    expect(result.inDescription).toBe(true)
  })

  it('flags stuffing when the keyword repeats more than twice in the title', () => {
    const result = getFocusKeywordPlacement('widget', 'widget widget widget', '')
    expect(result.isStuffed).toBe(true)
  })

  it('does not flag stuffing for two or fewer occurrences', () => {
    const result = getFocusKeywordPlacement('widget', 'widget guide to widget care', '')
    expect(result.isStuffed).toBe(false)
  })
})

describe('keywordsVisible gate for empty-keyword feedback', () => {
  const NO_KEYWORDS_MSG = 'No keywords defined. Consider adding relevant keywords.'
  const title = 'A perfectly reasonable title that is long enough for the recommended range'
  const description =
    'A perfectly reasonable description that sits comfortably within the recommended length range for meta descriptions.'

  it('getMetaTitleValidationMessages shows the message by default (keywordsVisible defaults true)', () => {
    const messages = getMetaTitleValidationMessages(title, [], true)
    expect(messages.some((m) => m.text === NO_KEYWORDS_MSG)).toBe(true)
  })

  it('getMetaTitleValidationMessages suppresses the message when keywords are hidden', () => {
    const messages = getMetaTitleValidationMessages(title, [], true, 0, false)
    expect(messages.some((m) => m.text === NO_KEYWORDS_MSG)).toBe(false)
  })

  it('getMetaDescriptionValidationMessages suppresses the message when keywords are hidden', () => {
    const messages = getMetaDescriptionValidationMessages(description, [], true, false)
    expect(messages.some((m) => m.text === NO_KEYWORDS_MSG)).toBe(false)
  })

  it('getOgTitleValidation suppresses the message when keywords are hidden', () => {
    const messages = getOgTitleValidation(
      'A good enough OG title for length checks',
      [],
      true,
      false,
    )
    expect(messages.some((m) => m.text === NO_KEYWORDS_MSG)).toBe(false)
  })

  it('getOgDescriptionValidation suppresses the message when keywords are hidden', () => {
    const messages = getOgDescriptionValidation(
      'A good enough OG description that comfortably meets the recommended length',
      [],
      true,
      false,
    )
    expect(messages.some((m) => m.text === NO_KEYWORDS_MSG)).toBe(false)
  })

  it('getTwitterTitleValidation suppresses the message when keywords are hidden', () => {
    const messages = getTwitterTitleValidation(
      'A good enough X title for length checks',
      [],
      true,
      false,
    )
    expect(messages.some((m) => m.text === NO_KEYWORDS_MSG)).toBe(false)
  })

  it('getTwitterDescriptionValidation suppresses the message when keywords are hidden', () => {
    const messages = getTwitterDescriptionValidation(
      'A good enough X description that comfortably meets the recommended length',
      [],
      true,
      false,
    )
    expect(messages.some((m) => m.text === NO_KEYWORDS_MSG)).toBe(false)
  })
})

describe('hasKeywordOveruse regex-escape fix', () => {
  it('does not throw for keywords containing regex metacharacters', () => {
    expect(() =>
      hasKeywordOveruse('c++ is great, c++ rocks, c++ wins, c++ forever', ['c++']),
    ).not.toThrow()
  })

  it('still correctly detects overuse for regex-metacharacter keywords', () => {
    expect(hasKeywordOveruse('c++ is great, c++ rocks, c++ wins, c++ forever', ['c++'])).toBe(true)
  })

  it('does not flag normal usage of regex-metacharacter keywords', () => {
    expect(hasKeywordOveruse('c++ is a great language', ['c++'])).toBe(false)
  })
})
