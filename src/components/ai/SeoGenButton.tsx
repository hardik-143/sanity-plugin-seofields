import {SparklesIcon} from '@sanity/icons'
import {Button, Card, Flex, Text} from '@sanity/ui'
import {type ReactElement, useCallback, useEffect, useRef, useState} from 'react'
import {useFormValue, useWorkspace} from 'sanity'

import type {AiConfig} from '../../plugin'
import {extractDocText, resolveContentFields} from '../../utils/extractDocText'
import {generateSeoText} from '../../utils/seoContentGen'
import {type MetaContext, pickTestOutput, type SeoGenField} from '../../utils/seoPrompts'

type GenState = 'idle' | 'loading' | 'cooldown' | 'error'

interface Props {
  field: SeoGenField
  ai?: AiConfig
  seoFieldPath: string
  onGenerate: (value: string) => void
}

export default function SeoGenButton({
  field,
  ai,
  seoFieldPath,
  onGenerate,
}: Props): ReactElement | null {
  const [state, setState] = useState<GenState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const rootDoc = useFormValue([]) as ({_type?: string} & Record<string, unknown>) | null
  const workspace = useWorkspace()
  const seoObj = useFormValue([seoFieldPath]) as Record<string, unknown> | null
  const focusKeyword = (seoObj?.focusKeyword as string | undefined) ?? ''
  const keywords = (seoObj?.keywords as string[] | undefined) ?? []
  const bodyField = resolveContentFields(ai?.content, rootDoc?._type)
  const content = rootDoc ? extractDocText(rootDoc, bodyField) : ''

  const meta: MetaContext | undefined =
    field === 'focusKeyword'
      ? {
          title: (seoObj?.title as string | undefined) ?? undefined,
          description: (seoObj?.description as string | undefined) ?? undefined,
          slug: (rootDoc?.slug as {current?: string} | undefined)?.current ?? undefined,
        }
      : undefined

  const handleGenerate = useCallback(async () => {
    if (!ai) return

    abortRef.current?.abort()
    if (cooldownRef.current) clearTimeout(cooldownRef.current)

    setState('loading')
    setErrorMsg(null)

    try {
      let result: string
      if (ai.testMode) {
        await new Promise<void>((r) => setTimeout(r, 400))
        result = pickTestOutput(field)
      } else {
        const controller = new AbortController()
        abortRef.current = controller
        result = await generateSeoText(field, content, focusKeyword, keywords, {
          config: {...ai, _projectId: workspace.projectId},
          signal: controller.signal,
          meta,
        })
      }

      onGenerate(result)
      setState('cooldown')
      cooldownRef.current = setTimeout(() => setState('idle'), 2000)
    } catch (err: unknown) {
      if ((err as {name?: string}).name === 'AbortError') {
        setState('idle')
        return
      }
      setErrorMsg(err instanceof Error ? err.message : 'Generation failed.')
      setState('error')
    }
  }, [ai, field, content, focusKeyword, keywords, meta, onGenerate, workspace.projectId])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (cooldownRef.current) clearTimeout(cooldownRef.current)
    }
  }, [])

  const isConfigured = Boolean(
    ai?.apiKey || ai?.endpoint || ai?.testMode || ai?.provider === 'ollama',
  )
  if (!isConfigured) return null

  const isLoading = state === 'loading'
  const isTestMode = Boolean(ai?.testMode)
  let buttonText = 'Generate with AI'
  if (isLoading) buttonText = 'Generating…'
  else if (isTestMode) buttonText = 'Generate (test)'

  const isFullWidth = (ai?.buttonWidth ?? 'full') === 'full'

  return (
    <Flex direction="column" gap={1} align={isFullWidth ? 'stretch' : 'flex-start'}>
      <Button
        mode="ghost"
        tone="primary"
        paddingX={isFullWidth ? 2 : 3}
        paddingY={3}
        fontSize={1}
        icon={SparklesIcon}
        text={buttonText}
        onClick={handleGenerate}
        disabled={isLoading || state === 'cooldown'}
      />
      {!content && (
        <Text size={0} muted>
          (Set <code>ai.content</code> in plugin config for better results)
        </Text>
      )}
      {state === 'error' && errorMsg && (
        <Card padding={2} tone="critical" radius={2}>
          <Text size={1}>{errorMsg}</Text>
        </Card>
      )}
    </Flex>
  )
}
