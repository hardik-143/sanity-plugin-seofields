import React, {useMemo} from 'react'
import {StringInputProps, useFormValue} from 'sanity'
import {Stack, Text} from '@sanity/ui'
import { getOgDescriptionValidation } from '../../utils/seoUtils'

const OgDescription: React.FC<StringInputProps> = (props) => {
  const {value, renderDefault, path} = props

  // Access parent object to get keywords
  const parent = useFormValue(['seoFields']) as {keywords?: string[]}
  const keywords = parent?.keywords || []

  const feedbackItems = useMemo(
    () => getOgDescriptionValidation(value || '', keywords),
    [value, keywords],
  )

  return (
    <Stack space={3}>
      {renderDefault(props)}
      {/* Validation */}
      <Stack space={2}>
        {feedbackItems.map((item: any) => (
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
