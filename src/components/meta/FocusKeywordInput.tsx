import {Stack, Text} from '@sanity/ui'
import {type ReactElement, useMemo} from 'react'
import {PatchEvent, set, StringInputProps, useFormValue} from 'sanity'

import type {AiConfig} from '../../plugin'
import {FeedbackType} from '../../types'
import {getFocusKeywordPlacement} from '../../utils/seoUtils'
import SeoGenButton from '../ai/SeoGenButton'

const FocusKeywordInput = (props: StringInputProps): ReactElement => {
  const {value, renderDefault, path, schemaType, onChange} = props
  const {options} = schemaType as {options?: {ai?: AiConfig}}

  const parent = useFormValue([path[0]]) as {
    title?: string
    description?: string
  } | null

  const rootDoc = useFormValue([]) as {
    slug?: {current?: string}
  } | null

  const feedbackItems = useMemo((): FeedbackType[] => {
    if (!value) return []

    const title = parent?.title || ''
    const description = parent?.description || ''
    const slug = rootDoc?.slug?.current || ''
    const placement = getFocusKeywordPlacement(value, title, description)

    const items: FeedbackType[] = []

    // 1. Title prominence
    if (title) {
      if (placement.atStartOfTitle) {
        items.push({text: 'Keyword at start of title — excellent', color: 'green'})
      } else if (placement.inTitle) {
        items.push({
          text: 'Keyword in title — move it to the start for more prominence',
          color: 'orange',
        })
      } else {
        items.push({text: 'Keyword missing from meta title', color: 'red'})
      }
    }

    // 2. Description
    if (description) {
      if (placement.inDescription) {
        items.push({text: 'Keyword in meta description', color: 'green'})
      } else {
        items.push({text: 'Not in description — include it naturally', color: 'orange'})
      }
    }

    // 3. Slug (only if slug exists) — needs rootDoc, not shared with scoring
    if (slug) {
      const kwSlug = value.toLowerCase().replace(/\s+/g, '-')
      if (slug.includes(kwSlug)) {
        items.push({text: 'Keyword in URL slug', color: 'green'})
      } else {
        items.push({
          text: 'Keyword not in URL slug — consider it for new pages',
          color: 'orange',
        })
      }
    }

    // 4. Stuffing guard
    if (placement.isStuffed) {
      items.push({
        text: 'Keyword appears too many times in title — avoid stuffing',
        color: 'red',
      })
    }

    return items
  }, [value, parent?.title, parent?.description, rootDoc?.slug?.current])

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <SeoGenButton
        field="focusKeyword"
        ai={options?.ai}
        seoFieldPath={String(path[0])}
        onGenerate={(v) => onChange(PatchEvent.from(set(v)))}
      />
      <Stack space={2}>
        {feedbackItems.map((item: FeedbackType) => (
          <div key={item.text} style={{display: 'flex', alignItems: 'center', gap: 7}}>
            <div
              style={{
                minWidth: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: item.color,
              }}
            />
            <Text weight="bold" muted size={14}>
              {item.text}
            </Text>
          </div>
        ))}
      </Stack>
    </Stack>
  )
}

export default FocusKeywordInput
