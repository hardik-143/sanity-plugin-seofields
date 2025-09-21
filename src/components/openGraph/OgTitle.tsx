import React, {useMemo} from 'react'
import {StringInputProps, useFormValue} from 'sanity'
import {Stack, Text, Box} from '@sanity/ui'
import { getOgTitleValidation } from '../../utils/seoUtils'

const OgTitle: React.FC<StringInputProps> = (props) => {
  const {value, renderDefault, path} = props

  // Access parent object to get keywords
  const parent = useFormValue([path[0]]) as {keywords?: string[]}
  const keywords = parent?.keywords || []

  const feedbackItems = useMemo(
    () => getOgTitleValidation(value || '', keywords),
    [value, keywords],
  )

  return (
    <Stack space={3}>
      {renderDefault(props)}
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

export default OgTitle
