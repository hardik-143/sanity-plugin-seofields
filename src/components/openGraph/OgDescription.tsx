import {Stack, Text} from '@sanity/ui'
import {type ReactElement, useMemo} from 'react'
import {PatchEvent, set, StringInputProps, useFormValue} from 'sanity'

import type {AiConfig} from '../../plugin'
import {FeedbackType} from '../../types'
import {getOgDescriptionValidation} from '../../utils/seoUtils'
import SeoGenButton from '../ai/SeoGenButton'

const OgDescription = (props: StringInputProps): ReactElement => {
  const {value, renderDefault, path, schemaType, onChange} = props
  const {options} = schemaType as {
    options?: {ai?: AiConfig; isKeywordsVisible?: (documentType?: string) => boolean}
  }

  // Access parent object to get keywords
  const parent = useFormValue([path[0]]) as {keywords?: string[]; _type?: string}
  const isParentseoField = parent && parent?._type === 'seoFields'
  const keywords = useMemo(() => parent?.keywords || [], [parent?.keywords])
  const rootDoc = useFormValue([]) as {_type?: string} | null

  const keywordsVisible = options?.isKeywordsVisible?.(rootDoc?._type) ?? true

  const feedbackItems = useMemo(
    () => getOgDescriptionValidation(value || '', keywords, isParentseoField, keywordsVisible),
    [value, keywords, isParentseoField, keywordsVisible],
  )

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <SeoGenButton
        field="ogDescription"
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

export default OgDescription
