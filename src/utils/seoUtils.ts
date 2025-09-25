import {PathSegment, useFormValue} from 'sanity'

export const stopWords = ['the', 'a', 'an', 'and', 'or', 'but']

export const hasMatchingKeyword = (title: string, keywordList: string[]): boolean => {
  if (!title || keywordList.length === 0) return false
  const lowerTitle = title.toLowerCase()
  return keywordList.some((keyword) => keyword && lowerTitle.includes(keyword.toLowerCase()))
}

export const hasKeywordOveruse = (
  title: string,
  keywordList: string[],
  maxOccurrences = 3,
): boolean => {
  if (!title || keywordList.length === 0) return false
  const lowerTitle = title.toLowerCase()
  return keywordList.some((keyword) => {
    if (!keyword) return false
    const matches = lowerTitle.match(new RegExp(keyword.toLowerCase(), 'g'))
    return matches ? matches.length > maxOccurrences : false
  })
}

export const startsWithStopWord = (title: string): boolean => {
  if (!title) return false
  const firstWord = title.trim().split(' ')[0].toLowerCase()
  return stopWords.includes(firstWord)
}

export const primaryKeywordAtStart = (title: string, keywords: string[]): boolean => {
  if (!title || keywords.length === 0) return true
  return title.toLowerCase().startsWith(keywords[0].toLowerCase())
}

export const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + '…' : text

export const hasExcessivePunctuation = (title: string): boolean => /[!@#$%^&*]{2,}/.test(title)

export const getMetaTitleValidationMessages = (
  title: string,
  keywords: string[],
  isParentseoField: boolean,
) => {
  const feedback: {text: string; color: 'green' | 'orange' | 'red'}[] = []

  const minChar = 50
  const maxChar = 60
  const charCount = title?.length || 0

  // Empty check
  if (!title?.trim()) {
    feedback.push({text: 'Meta Title is empty. Add content to improve SEO.', color: 'red'})
    return feedback
  }

  // Length check
  if (charCount < minChar)
    feedback.push({
      text: `Title is ${charCount} characters — below recommended ${minChar}.`,
      color: 'orange',
    })
  else if (charCount > maxChar)
    feedback.push({
      text: `Title is ${charCount} characters — exceeds recommended ${maxChar}.`,
      color: 'red',
    })
  else feedback.push({text: `Title length (${charCount}) looks good for SEO.`, color: 'green'})

  // Keyword checks
  if (isParentseoField) {
    if (keywords.length > 0) {
      const hasKeyword = hasMatchingKeyword(title, keywords)
      feedback.push({
        text: hasKeyword
          ? 'Keyword found in title — good job!'
          : 'Keywords defined but missing in title.',
        color: hasKeyword ? 'green' : 'red',
      })

      if (hasKeywordOveruse(title, keywords)) {
        feedback.push({
          text: 'Keyword appears too many times — avoid keyword stuffing.',
          color: 'orange',
        })
      }
    } else {
      feedback.push({
        text: 'No keywords defined. Consider adding relevant keywords.',
        color: 'orange',
      })
    }
  }

  // Stop word check
  if (startsWithStopWord(title))
    feedback.push({text: 'Title starts with a stop word — consider rephrasing.', color: 'orange'})

  // Punctuation check
  if (hasExcessivePunctuation(title))
    feedback.push({text: 'Title contains excessive punctuation — simplify it.', color: 'orange'})

  return feedback
}

export const getMetaDescriptionValidationMessages = (
  description: string,
  keywords: string[],
  isParentseoField: boolean,
) => {
  const feedback: {text: string; color: 'green' | 'orange' | 'red'}[] = []

  const minChar = 150
  const maxChar = 160
  const charCount = description?.length || 0

  if (!description?.trim()) {
    feedback.push({text: 'Meta description is empty. Add content to improve SEO.', color: 'red'})
    return feedback
  }

  // Length check
  if (charCount < minChar)
    feedback.push({
      text: `Description is ${charCount} chars — below recommended ${minChar}.`,
      color: 'orange',
    })
  else if (charCount > maxChar)
    feedback.push({
      text: `Description is ${charCount} chars — exceeds recommended ${maxChar}.`,
      color: 'red',
    })
  else
    feedback.push({text: `Description length (${charCount}) looks good for SEO.`, color: 'green'})

  // Keyword checks
  if (isParentseoField) {
    if (keywords.length > 0) {
      const hasKeyword = hasMatchingKeyword(description, keywords)
      feedback.push({
        text: hasKeyword
          ? 'Keyword found in description — good job!'
          : 'Keywords defined but missing in description.',
        color: hasKeyword ? 'green' : 'red',
      })

      if (hasKeywordOveruse(description, keywords)) {
        feedback.push({
          text: 'Keyword appears too many times — avoid keyword stuffing.',
          color: 'orange',
        })
      }
    } else {
      feedback.push({
        text: 'No keywords defined. Consider adding relevant keywords.',
        color: 'orange',
      })
    }
  }

  // Stop word / filler check
  if (startsWithStopWord(description))
    feedback.push({
      text: 'Description starts with a stop word — consider rephrasing.',
      color: 'orange',
    })

  // Punctuation / special characters
  if (hasExcessivePunctuation(description))
    feedback.push({
      text: 'Description contains excessive punctuation — simplify it.',
      color: 'orange',
    })

  return feedback
}

export const getOgTitleValidation = (
  title: string,
  keywords: string[] = [],
  isParentseoField: boolean,
) => {
  const feedback: {text: string; color: 'green' | 'orange' | 'red'}[] = []
  const min = 40
  const max = 60
  const count = title?.length || 0

  // Empty check
  if (!title?.trim()) {
    feedback.push({text: 'OG Title is empty. Add content for better social preview.', color: 'red'})
    return feedback
  }

  // Length check
  if (count < min)
    feedback.push({
      text: `OG Title is ${count} chars — shorter than recommended ${min}.`,
      color: 'orange',
    })
  else if (count > max)
    feedback.push({text: `OG Title is ${count} chars — exceeds recommended ${max}.`, color: 'red'})
  else feedback.push({text: `OG Title length (${count}) looks good.`, color: 'green'})

  if (isParentseoField) {
    // Keyword checks
    if (keywords.length > 0) {
      const hasKeyword = hasMatchingKeyword(title, keywords)
      feedback.push({
        text: hasKeyword
          ? 'Keyword found in OG title — good job!'
          : 'Keywords defined but missing in OG title.',
        color: hasKeyword ? 'green' : 'red',
      })

      if (hasKeywordOveruse(title, keywords)) {
        feedback.push({
          text: 'Keyword appears too many times in OG title — avoid keyword stuffing.',
          color: 'orange',
        })
      }
    } else {
      feedback.push({
        text: 'No keywords defined. Consider adding relevant keywords.',
        color: 'orange',
      })
    }
  }

  // Additional OG-specific checks
  if (startsWithStopWord(title))
    feedback.push({
      text: 'OG Title starts with a stop word — consider rephrasing.',
      color: 'orange',
    })

  if (hasExcessivePunctuation(title))
    feedback.push({text: 'OG Title contains excessive punctuation — simplify it.', color: 'orange'})

  return feedback
}

export const getOgDescriptionValidation = (
  desc: string,
  keywords: string[] = [],
  isParentseoField: boolean,
) => {
  const feedback: {text: string; color: 'green' | 'orange' | 'red'}[] = []
  const min = 90
  const max = 120
  const count = desc?.length || 0

  // Empty check
  if (!desc?.trim()) {
    feedback.push({
      text: 'OG Description is empty. Add content for better social preview.',
      color: 'red',
    })
    return feedback
  }

  // Length check
  if (count < min)
    feedback.push({
      text: `OG Description is ${count} chars — shorter than recommended ${min}.`,
      color: 'orange',
    })
  else if (count > max)
    feedback.push({
      text: `OG Description is ${count} chars — exceeds recommended ${max}.`,
      color: 'red',
    })
  else feedback.push({text: `OG Description length (${count}) looks good.`, color: 'green'})

  // Keyword checks
  if (isParentseoField) {
    if (keywords.length > 0) {
      const hasKeyword = hasMatchingKeyword(desc, keywords)
      feedback.push({
        text: hasKeyword
          ? 'Keyword found in OG description — good job!'
          : 'Keywords defined but missing in OG description.',
        color: hasKeyword ? 'green' : 'red',
      })

      if (hasKeywordOveruse(desc, keywords)) {
        feedback.push({
          text: 'Keyword appears too many times in OG description — avoid keyword stuffing.',
          color: 'orange',
        })
      }
    } else {
      feedback.push({
        text: 'No keywords defined. Consider adding relevant keywords.',
        color: 'orange',
      })
    }
  }

  // Additional OG-specific checks
  if (startsWithStopWord(desc))
    feedback.push({
      text: 'OG Description starts with a stop word — consider rephrasing.',
      color: 'orange',
    })

  if (hasExcessivePunctuation(desc))
    feedback.push({
      text: 'OG Description contains excessive punctuation — simplify it.',
      color: 'orange',
    })

  return feedback
}

export const getTwitterTitleValidation = (
  title: string,
  keywords: string[] = [],
  isParentseoField: boolean,
) => {
  const feedback: {text: string; color: 'green' | 'orange' | 'red'}[] = []
  const min = 30
  const max = 70
  const count = title?.length || 0

  if (!title?.trim()) {
    feedback.push({text: 'X Title is empty. Add content for better SEO.', color: 'red'})
    return feedback
  }

  // Length check
  if (count < min)
    feedback.push({
      text: `X Title is ${count} chars — shorter than recommended ${min}.`,
      color: 'orange',
    })
  else if (count > max)
    feedback.push({
      text: `X Title is ${count} chars — exceeds recommended ${max}.`,
      color: 'red',
    })
  else feedback.push({text: `X Title length (${count}) looks good.`, color: 'green'})

  if (isParentseoField) {
    // Keyword checks
    if (keywords.length > 0) {
      const hasKeyword = hasMatchingKeyword(title, keywords)
      feedback.push({
        text: hasKeyword
          ? 'Keyword found in X title — good job!'
          : 'Keywords defined but missing in X title.',
        color: hasKeyword ? 'green' : 'red',
      })
    } else {
      feedback.push({
        text: 'No keywords defined. Consider adding relevant keywords.',
        color: 'orange',
      })
    }
  }

  // Punctuation check
  if (/[!@#$%^&*]{2,}/.test(title))
    feedback.push({text: 'X Title has excessive punctuation — simplify it.', color: 'orange'})

  return feedback
}

export const getTwitterDescriptionValidation = (
  desc: string,
  keywords: string[] = [],
  isParentseoField: boolean,
) => {
  const feedback: {text: string; color: 'green' | 'orange' | 'red'}[] = []
  const min = 50
  const max = 200
  const count = desc?.length || 0

  if (!desc?.trim()) {
    feedback.push({text: 'X Description is empty. Add content for better SEO.', color: 'red'})
    return feedback
  }

  // Length check
  if (count < min)
    feedback.push({
      text: `X Description is ${count} chars — shorter than recommended ${min}.`,
      color: 'orange',
    })
  else if (count > max)
    feedback.push({
      text: `X Description is ${count} chars — exceeds recommended ${max}.`,
      color: 'red',
    })
  else feedback.push({text: `X Description length (${count}) looks good.`, color: 'green'})

  if (isParentseoField) {
    // Keyword checks
    if (keywords.length > 0) {
      const hasKeyword = hasMatchingKeyword(desc, keywords)
      feedback.push({
        text: hasKeyword
          ? 'Keyword found in X description — good job!'
          : 'Keywords defined but missing in X description.',
        color: hasKeyword ? 'green' : 'red',
      })
    } else {
      feedback.push({
        text: 'No keywords defined. Consider adding relevant keywords.',
        color: 'orange',
      })
    }
  }

  // Punctuation check
  if (/[!@#$%^&*]{2,}/.test(desc))
    feedback.push({
      text: 'X Description has excessive punctuation — simplify it.',
      color: 'orange',
    })

  return feedback
}
