import {Stack, Text} from '@sanity/ui'
import {type ReactElement, useMemo} from 'react'
import {PatchEvent, set, StringInputProps, useFormValue} from 'sanity'

import type {AiConfig} from '../../plugin'
import {FeedbackType} from '../../types'
import {analyzeReadability} from '../../utils/readability'
import {getMetaDescriptionValidationMessages} from '../../utils/seoUtils'
import SeoGenButton from '../ai/SeoGenButton'

const MetaDescription = (props: StringInputProps): ReactElement => {
  const {value, renderDefault, path, schemaType, onChange} = props
  const {options} = schemaType as {
    options?: {ai?: AiConfig; isKeywordsVisible?: (documentType?: string) => boolean}
  }

  const parent = useFormValue([path[0]]) as {keywords?: string[]; _type?: string}
  const isParentseoField = parent && parent?._type === 'seoFields'
  const keywords = useMemo(() => parent?.keywords || [], [parent?.keywords])
  const rootDoc = useFormValue([]) as {_type?: string} | null

  const keywordsVisible = options?.isKeywordsVisible?.(rootDoc?._type) ?? true

  const feedbackItems = useMemo(
    () =>
      getMetaDescriptionValidationMessages(
        value || '',
        keywords,
        isParentseoField,
        keywordsVisible,
      ),
    [value, keywords, isParentseoField, keywordsVisible],
  )

  const readability = useMemo(() => analyzeReadability(value || ''), [value])

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <SeoGenButton
        field="description"
        ai={options?.ai}
        seoFieldPath={String(path[0])}
        onGenerate={(v) => onChange(PatchEvent.from(set(v)))}
      />
      <Stack space={2}>
        {feedbackItems.map((item: FeedbackType) => (
          <div key={item.text} style={{display: 'flex', alignItems: 'center', gap: 7}}>
            <div
              style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color}}
            />
            <Text weight="bold" muted size={14}>
              {item.text}
            </Text>
          </div>
        ))}
      </Stack>
      {readability && (
        <div style={{display: 'flex', alignItems: 'center', gap: 7}}>
          <div
            style={{
              minWidth: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: readability.color,
            }}
          />
          <Text weight="bold" muted size={14}>
            Readability: {readability.label} (Flesch {readability.score} · Grade{' '}
            {readability.gradeLevel})
          </Text>
        </div>
      )}
    </Stack>
  )
}

export default MetaDescription
