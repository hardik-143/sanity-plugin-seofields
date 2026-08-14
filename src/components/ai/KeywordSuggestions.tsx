import {Badge, Box, Button, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {type ReactElement, useCallback, useEffect, useRef, useState} from 'react'
import {useFormValue, useWorkspace} from 'sanity'

import type {AiConfig} from '../../plugin'
import {extractDocText, resolveContentFields} from '../../utils/extractDocText'
import {defineIcon} from '../../utils/icon'
import {generateSeoText} from '../../utils/seoContentGen'
import {pickTestOutput} from '../../utils/seoPrompts'

const SparklesIcon = defineIcon('sparkles')

interface Props {
  ai?: AiConfig
  seoFieldPath: string
  existing: string[]
  onAdd: (keyword: string) => void
  onAddAll: (keywords: string[]) => void
}

type PanelState = 'idle' | 'loading' | 'suggestions' | 'error'

export default function KeywordSuggestions({
  ai,
  seoFieldPath,
  existing,
  onAdd,
  onAddAll,
}: Props): ReactElement | null {
  const [panelState, setPanelState] = useState<PanelState>('idle')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const rootDoc = useFormValue([]) as ({_type?: string} & Record<string, unknown>) | null
  const workspace = useWorkspace()
  const seoObj = useFormValue([seoFieldPath]) as Record<string, unknown> | null
  const focusKeyword = (seoObj?.focusKeyword as string | undefined) ?? ''
  const bodyField = resolveContentFields(ai?.content, rootDoc?._type)
  const content = rootDoc ? extractDocText(rootDoc, bodyField) : ''

  const handleSuggest = useCallback(async () => {
    if (!ai) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setPanelState('loading')
    setErrorMsg(null)
    setSuggestions([])

    try {
      let csv: string
      if (ai.testMode) {
        await new Promise<void>((r) => setTimeout(r, 400))
        csv = pickTestOutput('keywords')
      } else {
        csv = await generateSeoText('keywords', content, focusKeyword, existing, {
          config: {...ai, _projectId: workspace.projectId},
          signal: abortRef.current.signal,
        })
      }

      const parsed = csv
        .split(',')
        .map((k) => k.replace(/^["']|["']$/g, '').trim())
        .filter(Boolean)

      if (parsed.length === 0) {
        setErrorMsg('No keywords returned. Try again.')
        setPanelState('error')
        return
      }

      setSuggestions(parsed)
      setPanelState('suggestions')
    } catch (err: unknown) {
      if ((err as {name?: string}).name === 'AbortError') {
        setPanelState('idle')
        return
      }
      setErrorMsg(err instanceof Error ? err.message : 'Keyword generation failed.')
      setPanelState('error')
    }
  }, [ai, content, focusKeyword, existing, workspace.projectId])

  const handleAdd = useCallback(
    (kw: string) => {
      onAdd(kw)
      setSuggestions((prev) => prev.filter((s) => s !== kw))
      if (suggestions.length <= 1) setPanelState('idle')
    },
    [onAdd, suggestions.length],
  )

  const handleAddAll = useCallback(() => {
    const toAdd = suggestions.filter((kw) => !existing.includes(kw))
    if (toAdd.length > 0) onAddAll(toAdd)
    setSuggestions([])
    setPanelState('idle')
  }, [suggestions, existing, onAddAll])

  const handleDismiss = useCallback(() => {
    abortRef.current?.abort()
    setSuggestions([])
    setPanelState('idle')
    setErrorMsg(null)
  }, [])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const isConfigured = Boolean(
    ai?.apiKey || ai?.endpoint || ai?.testMode || ai?.provider === 'ollama',
  )
  if (!isConfigured) return null

  if (panelState === 'idle' || panelState === 'error') {
    return (
      <Stack space={2}>
        <Button
          mode="ghost"
          tone="primary"
          paddingX={2}
          paddingY={3}
          fontSize={1}
          icon={SparklesIcon}
          text={ai?.testMode ? 'Suggest Keywords (test)' : 'Suggest Keywords with AI'}
          onClick={handleSuggest}
        />
        {panelState === 'error' && errorMsg && (
          <Card padding={2} tone="critical" radius={2}>
            <Text size={1}>{errorMsg}</Text>
          </Card>
        )}
      </Stack>
    )
  }

  if (panelState === 'loading') {
    return (
      <Flex align="center" gap={2} paddingY={2}>
        <Spinner muted />
        <Text size={1} muted>
          Finding keywords…
        </Text>
      </Flex>
    )
  }

  const pendingSuggestions = suggestions.filter((kw) => !existing.includes(kw))
  const alreadyAdded = suggestions.filter((kw) => existing.includes(kw))

  return (
    <Card padding={3} radius={2} tone="transparent" border>
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Text size={1} weight="semibold" muted>
            AI keyword suggestions
          </Text>
          <Flex gap={2}>
            {pendingSuggestions.length > 1 && (
              <Button
                mode="ghost"
                tone="primary"
                paddingX={2}
                paddingY={2}
                fontSize={1}
                text="Add all"
                onClick={handleAddAll}
              />
            )}
            <Button
              mode="ghost"
              tone="default"
              paddingX={2}
              paddingY={2}
              fontSize={1}
              text="Dismiss"
              onClick={handleDismiss}
            />
          </Flex>
        </Flex>

        {pendingSuggestions.length > 0 && (
          <Box>
            <Text size={0} muted style={{marginBottom: 8}}>
              Click to add:
            </Text>
            <Flex gap={2} wrap="wrap" style={{marginTop: 6}}>
              {pendingSuggestions.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleAdd(kw)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    border: '1px solid var(--card-border-color)',
                    background: 'transparent',
                    color: 'var(--card-fg-color)',
                    cursor: 'pointer',
                    fontSize: 12,
                    lineHeight: 1.4,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      'var(--card-border-color)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  + {kw}
                </button>
              ))}
            </Flex>
          </Box>
        )}

        {alreadyAdded.length > 0 && (
          <Box>
            <Text size={0} muted style={{marginBottom: 6}}>
              Already added:
            </Text>
            <Flex gap={2} wrap="wrap" style={{marginTop: 4}}>
              {alreadyAdded.map((kw) => (
                <Badge key={kw} tone="positive" radius={5} fontSize={0} padding={2}>
                  ✓ {kw}
                </Badge>
              ))}
            </Flex>
          </Box>
        )}

        {pendingSuggestions.length === 0 && (
          <Text size={1} muted>
            All suggested keywords added.
          </Text>
        )}
      </Stack>
    </Card>
  )
}
