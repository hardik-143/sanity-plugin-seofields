import {Badge, Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {type ReactElement, useCallback, useDeferredValue, useMemo, useState} from 'react'
import {type StringInputProps, useFormValue} from 'sanity'

import type {ReadabilityConfig} from '../../plugin'
import {extractDocBlocks, resolveContentFields} from '../../utils/extractDocText'
import {
  analyzeContentReadability,
  type ReadabilityCheck,
  type ReadabilityCheckStatus,
} from '../../utils/readability'

const TONE: Record<ReadabilityCheckStatus, 'positive' | 'caution' | 'critical'> = {
  good: 'positive',
  ok: 'caution',
  problem: 'critical',
}

const ICON: Record<ReadabilityCheckStatus, string> = {good: '✓', ok: '!', problem: '✗'}

const COLOR_TONE = {green: 'positive', orange: 'caution', red: 'critical'} as const

function CheckRow({check}: {check: ReadabilityCheck}): ReactElement {
  return (
    <Card padding={3} radius={2} tone={check.status === 'good' ? 'default' : TONE[check.status]}>
      <Flex gap={3} align="flex-start">
        <Badge tone={TONE[check.status]} fontSize={1}>
          {ICON[check.status]}
        </Badge>
        <Stack space={2} flex={1}>
          <Text size={1} weight="medium">
            {check.label}
          </Text>
          <Text size={1} muted>
            {check.value}
          </Text>
          {check.status !== 'good' && (
            <Text size={1} muted>
              {check.hint}
            </Text>
          )}
        </Stack>
      </Flex>
    </Card>
  )
}

function Stat({label, value}: {label: string; value: string | number}): ReactElement {
  return (
    <Stack space={2}>
      <Text size={0} muted>
        {label}
      </Text>
      <Text size={1} weight="semibold">
        {value}
      </Text>
    </Stack>
  )
}

const ReadabilityPanel = (props: StringInputProps): ReactElement => {
  const {schemaType} = props
  const options = (schemaType as {options?: {readability?: ReadabilityConfig}}).options
  const config = options?.readability
  const [expanded, setExpanded] = useState(true)
  const toggleExpanded = useCallback(() => setExpanded((v) => !v), [])

  const doc = useFormValue([]) as Record<string, unknown> | undefined
  // Analysis is linear in text length; deferring keeps typing in large documents smooth.
  const deferredDoc = useDeferredValue(doc)
  const docType = typeof doc?._type === 'string' ? doc._type : undefined

  const fields = useMemo(
    () => resolveContentFields(config?.content, docType),
    [config?.content, docType],
  )

  const result = useMemo(
    () =>
      analyzeContentReadability(extractDocBlocks(deferredDoc, fields), {
        thresholds: config?.thresholds,
      }),
    [deferredDoc, fields, config?.thresholds],
  )

  const fieldList = [fields].flat().join(', ')

  if (!result) {
    return (
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} muted>
          Not enough content to analyse readability yet. Add at least 25 words to{' '}
          <code>{fieldList}</code> (configure the field with the <code>readability.content</code>{' '}
          plugin option).
        </Text>
      </Card>
    )
  }

  const problems = result.checks.filter((c) => c.status !== 'good').length

  return (
    <Card radius={2} border overflow="hidden">
      <Box padding={3}>
        <Flex align="center" justify="space-between" gap={3}>
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Content readability
            </Text>
            <Text size={0} muted>
              Analysing <code>{fieldList}</code> · English heuristics
            </Text>
          </Stack>
          <Flex gap={2} align="center">
            <Badge tone={COLOR_TONE[result.color]} fontSize={1}>
              Flesch {result.score}
            </Badge>
            <Badge tone={problems === 0 ? 'positive' : 'caution'} fontSize={1}>
              {result.passed}/{result.checks.length} checks
            </Badge>
          </Flex>
        </Flex>
      </Box>

      <Card borderTop padding={3} tone="transparent">
        <Flex gap={4} wrap="wrap">
          <Stat label="Reading ease" value={result.label} />
          <Stat label="Grade level" value={result.gradeLevel} />
          <Stat label="Avg. words / sentence" value={result.avgWordsPerSentence} />
          <Stat label="Words" value={result.words} />
          <Stat label="Sentences" value={result.sentences} />
          <Stat label="Subheadings" value={result.headings} />
        </Flex>
      </Card>

      <Box padding={3} paddingTop={2}>
        <button
          type="button"
          onClick={toggleExpanded}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'inherit',
            font: 'inherit',
          }}
        >
          <Text size={1} weight="medium">
            {expanded
              ? '▾ Hide checks'
              : `▸ Show checks${problems ? ` (${problems} to improve)` : ''}`}
          </Text>
        </button>
        {expanded && (
          <Stack space={2} marginTop={3}>
            {result.checks.map((check) => (
              <CheckRow key={check.id} check={check} />
            ))}
          </Stack>
        )}
      </Box>
    </Card>
  )
}

export default ReadabilityPanel
