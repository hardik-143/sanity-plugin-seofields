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

  const rootDoc =
    (useFormValue([]) as ({_type?: string; _id?: string} & Record<string, unknown>) | null) ?? {}
  const client = useClient({apiVersion: options?.apiVersion ?? '2024-01-01'})
  const [groqTitleSuffix, setGroqTitleSuffix] = useState<string>('')
  const [isDuplicateTitle, setIsDuplicateTitle] = useState(false)

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

  const currentDocId = rootDoc._id ?? ''
  useEffect(() => {
    if (!value?.trim() || !currentDocId) {
      setIsDuplicateTitle(false)
      return () => {}
    }
    const timer = setTimeout(() => {
      client
        .fetch<number>(
          `count(*[seo.title == $title && _id != $id && !(_id in path("drafts.**"))])`,
          {title: value, id: currentDocId},
        )
        .then((count) => setIsDuplicateTitle(count > 0))
        .catch(() => setIsDuplicateTitle(false))
    }, 600)
    return () => clearTimeout(timer)
  }, [value, client, currentDocId])

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
        {isDuplicateTitle && (
          <div style={{display: 'flex', alignItems: 'center', gap: 7}}>
            <div
              style={{
                minWidth: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'orange',
              }}
            />
            <Text weight="bold" muted size={14}>
              Duplicate meta title — another published document uses this exact title.
            </Text>
          </div>
        )}
      </Stack>
    </Stack>
  )
}

export default MetaTitle
