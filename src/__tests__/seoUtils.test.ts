import {getFocusKeywordPlacement, hasKeywordOveruse} from '../utils/seoUtils'

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
