import {TranslateIcon} from '@sanity/icons'
import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {type ReactElement, useCallback, useState} from 'react'
import {type ArrayOfObjectsInputProps, PatchEvent, set, useClient, useFormValue} from 'sanity'

import {buildHreflangs, type HreflangTranslation} from '../../helpers/hreflang'
import type {HreflangConfig} from '../../plugin'

type HreflangOptions = {
  hreflang?: HreflangConfig
  baseUrl?: string
  apiVersion?: string
}

type SyncState = 'idle' | 'loading' | 'done' | 'error'

const DEFAULT_LOCALE_FIELD = 'language'
const DEFAULT_API_VERSION = '2024-01-01'

// Restrict the configurable locale field name to a safe GROQ identifier before interpolation.
function safeField(name: string | undefined): string {
  return name && /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : DEFAULT_LOCALE_FIELD
}

const HreflangInput = (props: ArrayOfObjectsInputProps): ReactElement => {
  const {schemaType, onChange, renderDefault} = props
  const {options} = schemaType as {options?: HreflangOptions}
  const {hreflang, baseUrl, apiVersion} = options ?? {}

  const rootDoc = useFormValue([]) as ({_id?: string} & Record<string, unknown>) | null
  const client = useClient({apiVersion: apiVersion ?? DEFAULT_API_VERSION})

  const [state, setState] = useState<SyncState>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const localeField = safeField(hreflang?.localeField)

  const handleSync = useCallback(async () => {
    const rawId = rootDoc?._id
    if (!rawId) {
      setState('error')
      setMessage('Save the document once before syncing translations.')
      return
    }

    setState('loading')
    setMessage(null)

    try {
      const publishedId = rawId.replace(/^drafts\./, '')
      const query = `*[_type == "translation.metadata" && references($id)][0].translations[].value->{
        "language": ${localeField},
        "slug": slug.current
      }`
      const translations = ((await client.fetch(query, {id: publishedId})) ??
        []) as HreflangTranslation[]

      const entries = buildHreflangs(translations, {
        baseUrl,
        resolvePath: hreflang?.resolvePath,
      })

      if (entries.length === 0) {
        setState('error')
        setMessage('No translations with a resolvable URL were found for this document.')
        return
      }

      const items = entries.map((e) => ({
        _type: 'hreflangEntry',
        _key: e.locale,
        locale: e.locale,
        url: e.url,
      }))
      onChange(PatchEvent.from(set(items)))
      setState('done')
      setMessage(
        `Synced ${items.length} alternate${items.length === 1 ? '' : 's'} from translations.`,
      )
    } catch (err: unknown) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Failed to sync translations.')
    }
  }, [rootDoc?._id, client, localeField, baseUrl, hreflang, onChange])

  return (
    <Stack space={3}>
      <Flex>
        <Button
          mode="ghost"
          tone="primary"
          fontSize={1}
          icon={TranslateIcon}
          text={state === 'loading' ? 'Syncing…' : 'Sync from translations'}
          onClick={handleSync}
          disabled={state === 'loading'}
        />
      </Flex>
      {message && (
        <Card padding={2} radius={2} tone={state === 'error' ? 'critical' : 'positive'}>
          <Text size={1}>{message}</Text>
        </Card>
      )}
      {renderDefault(props)}
    </Stack>
  )
}

export default HreflangInput
