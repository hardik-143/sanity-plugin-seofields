import {Stack, Text} from '@sanity/ui'
import React, {useMemo} from 'react'
import {StringInputProps, useFormValue} from 'sanity'

import {FeedbackType} from '../../types'
import {getOgImageUrlValidation} from '../../utils/seoUtils'

const OgImageUrl = (props: StringInputProps): React.ReactElement => {
  const {value, renderDefault, path} = props

  const seoParent = useFormValue([path[0]]) as Record<string, unknown> | null

  const feedbackItems = useMemo(() => getOgImageUrlValidation(value, seoParent), [value, seoParent])

  return (
    <Stack space={3}>
      {renderDefault(props)}
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

export default OgImageUrl
