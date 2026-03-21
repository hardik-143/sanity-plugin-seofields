import {Stack, Text} from '@sanity/ui'
import React, {useMemo} from 'react'
import {ObjectInputProps, useFormValue} from 'sanity'

import {FeedbackType} from '../../types'
import {getTwitterImageValidation} from '../../utils/seoUtils'

const TwitterImage = (props: ObjectInputProps): React.ReactElement => {
  const {value, renderDefault, path} = props

  const seoParent = useFormValue([path[0]]) as Record<string, unknown> | null
  const imgValue = value as Record<string, unknown> | undefined
  const hasImage = !!imgValue?.asset
  const altText = imgValue?.alt as string | undefined

  const feedbackItems = useMemo(
    () => getTwitterImageValidation(hasImage, altText, seoParent),
    [hasImage, altText, seoParent],
  )

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

export default TwitterImage
