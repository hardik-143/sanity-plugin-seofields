import {Stack, Text} from '@sanity/ui'
import {type ReactElement, useEffect, useMemo, useState} from 'react'
import {StringInputProps, useClient, useFormValue} from 'sanity'

import {FeedbackType} from '../../types'
import {getMetaTitleValidationMessages} from '../../utils/seoUtils'

const MetaTitle = (props: StringInputProps): ReactElement => {
  const {value, renderDefault, path, schemaType} = props
  const {options} = schemaType as {
    options?: {
      apiVersion?: string
      titleSuffix?: ((doc: {_type?: string} & Record<string, unknown>) => string) | string
      titleSuffixQuery?: string
    }
  }

  const parent = useFormValue([path[0]]) as {keywords?: string[]; _type?: string}
  const isParentseoField = parent && parent?._type === 'seoFields'
  const keywords = useMemo(() => parent?.keywords || [], [parent?.keywords])

  const rootDoc = (useFormValue([]) as ({_type?: string} & Record<string, unknown>) | null) ?? {}
  const client = useClient({apiVersion: options?.apiVersion ?? '2024-01-01'})
  const [groqTitleSuffix, setGroqTitleSuffix] = useState<string>('')

  const titleSuffixQuery = options?.titleSuffixQuery
  const titleSuffixOption = options?.titleSuffix

  useEffect(() => {
    if (!titleSuffixQuery) return
    client
      .fetch<string>(titleSuffixQuery)
      .then((result) => {
        setGroqTitleSuffix(result === null || result === undefined ? '' : String(result))
      })
      .catch(() => {
        setGroqTitleSuffix('')
      })
  }, [titleSuffixQuery, client])

  const resolvedSuffix = useMemo((): string => {
    if (titleSuffixQuery) return groqTitleSuffix
    if (!titleSuffixOption) return ''
    if (typeof titleSuffixOption === 'function') {
      return titleSuffixOption(rootDoc)
    }
    return titleSuffixOption
  }, [titleSuffixQuery, groqTitleSuffix, titleSuffixOption, rootDoc])

  // ` | ` separator = 3 chars
  const suffixLength = resolvedSuffix ? resolvedSuffix.length + 3 : 0

  const feedbackItems = useMemo(
    () => getMetaTitleValidationMessages(value || '', keywords, isParentseoField, suffixLength),
    [value, keywords, isParentseoField, suffixLength],
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

export default MetaTitle
