import {StringInputProps, useFormValue, useClient, set} from 'sanity'
import React, {useEffect, useMemo} from 'react'
import {Stack, Text} from '@sanity/ui'
import {getMetaTitleValidationMessages} from '../../utils/seoUtils'

const MetaTitle = (props: StringInputProps) => {
  const client = useClient({apiVersion: '2024-05-05'})
  const {value, onChange, renderDefault, path} = props

  const parent = useFormValue([path[0]]) as {keywords?: string[]; _type?: string}
  const isParentseoField = parent && parent?._type === 'seoFields'
  const keywords = parent?.keywords || []

  // Fetch home page title if empty
  // useEffect(() => {
  //   if (value) return
  //   const fetchData = async () => {
  //     const data = await client.fetch("*[_type=='homePage'][0]{'title':seo.title}")
  //     if (data?.title && !value) onChange(set(data.title))
  //   }
  //   fetchData()
  // }, [client, onChange, value])

  const feedbackItems = useMemo(
    () => getMetaTitleValidationMessages(value || '', keywords, isParentseoField),
    [value, keywords, isParentseoField],
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

export default MetaTitle
