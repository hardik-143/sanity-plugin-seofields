import {Stack} from '@sanity/ui'
import {type ReactElement} from 'react'
import {ArrayOfPrimitivesInputProps, PatchEvent, set} from 'sanity'

import type {AiConfig} from '../../plugin'
import KeywordSuggestions from '../ai/KeywordSuggestions'

const KeywordsInput = (props: ArrayOfPrimitivesInputProps): ReactElement => {
  const {value, renderDefault, path, schemaType, onChange} = props
  const {options} = schemaType as {options?: {ai?: AiConfig}}

  const existing: string[] = (value as string[] | undefined) ?? []

  const handleAdd = (kw: string) => {
    if (existing.includes(kw)) return
    onChange(PatchEvent.from(set([...existing, kw])))
  }

  const handleAddAll = (keywords: string[]) => {
    const merged = [...new Set([...existing, ...keywords])]
    onChange(PatchEvent.from(set(merged)))
  }

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <KeywordSuggestions
        ai={options?.ai}
        seoFieldPath={String(path[0])}
        existing={existing}
        onAdd={handleAdd}
        onAddAll={handleAddAll}
      />
    </Stack>
  )
}

export default KeywordsInput
