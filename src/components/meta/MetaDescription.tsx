import {StringInputProps, useFormValue, useClient, set} from 'sanity'
import React, {useEffect, useMemo} from 'react'
import {Stack, Text} from '@sanity/ui'
import {getMetaDescriptionValidationMessages} from '../../utils/seoUtils'

const MetaDescription = (props: StringInputProps) => {
  const client = useClient({apiVersion: '2024-05-05'})
  const {value, onChange, renderDefault, path} = props

  const parent = useFormValue([path[0]]) as {keywords?: string[]}
  const keywords = parent?.keywords || []

  // Fetch default meta description from home page if empty
  useEffect(() => {
    if (value) return
    const fetchData = async () => {
      const data = await client.fetch("*[_type=='homePage'][0]{'description':seo.description}")
      if (data?.description && !value) onChange(set(data.description))
    }
    fetchData()
  }, [client, onChange, value])

  const feedbackItems = useMemo(
    () => getMetaDescriptionValidationMessages(value || '', keywords),
    [value, keywords],
  )

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Stack space={2}>
        {feedbackItems.map((item: any) => (
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
    </Stack>
  )
}

export default MetaDescription
