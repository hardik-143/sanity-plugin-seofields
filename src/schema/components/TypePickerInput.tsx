/* eslint-disable react/jsx-no-bind */
/**
 * TypePickerInput — a modern command-palette style selector for Sanity array types.
 *
 * Replaces the default Sanity array "Add" button with a searchable, categorized
 * type picker dialog. Used by the `schemaOrg` combined array type.
 */
import {AddIcon, SearchIcon} from '@sanity/icons'
import {Box, Button, Card, Dialog, Flex, Grid, Heading, Stack, Text, TextInput} from '@sanity/ui'
import React, {JSX, useCallback, useMemo, useState} from 'react'
import type {ArrayInputFunctionsProps, ArraySchemaType} from 'sanity'
import type {InputProps} from 'sanity'

import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  SCHEMA_TYPE_METADATA,
  type SchemaTypeCategory,
  type SchemaTypeInfo,
} from './schemaTypeMetadata'

// ─── Search Helpers ───────────────────────────────────────────────────────────

function matchesSearch(info: SchemaTypeInfo, query: string): boolean {
  const q = query.toLowerCase()
  return (
    info.title.toLowerCase().includes(q) ||
    info.description.toLowerCase().includes(q) ||
    info.keywords.some((kw) => kw.toLowerCase().includes(q))
  )
}

function groupByCategory(items: SchemaTypeInfo[]): Map<SchemaTypeCategory, SchemaTypeInfo[]> {
  const map = new Map<SchemaTypeCategory, SchemaTypeInfo[]>()
  for (const cat of CATEGORY_ORDER) {
    const matches = items.filter((i) => i.category === cat)
    if (matches.length) map.set(cat, matches)
  }
  return map
}

// ─── Inner ArrayFunctions Component ───────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TypeArrayFunctions(props: ArrayInputFunctionsProps<any, ArraySchemaType<any>>) {
  const {onValueCreate, schemaType, onItemAppend} = props
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const onClose = useCallback(() => {
    setOpen(false)
    setSearch('')
  }, [])
  const onOpen = useCallback(() => setOpen(true), [])
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
  }, [])

  // Map available schema types to their metadata
  const availableTypes = useMemo(() => {
    const typeNames = new Set(schemaType.of.map((t) => t.name))
    return SCHEMA_TYPE_METADATA.filter((m) => typeNames.has(m.type))
  }, [schemaType.of])

  // Filter by search query
  const filtered = useMemo(
    () => (search ? availableTypes.filter((t) => matchesSearch(t, search)) : availableTypes),
    [availableTypes, search],
  )

  const grouped = useMemo(() => groupByCategory(filtered), [filtered])

  const handleSelect = useCallback(
    (typeName: string) => {
      const schemaItem = schemaType.of.find((t) => t.name === typeName)
      if (schemaItem) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = onValueCreate(schemaItem as any)
        onItemAppend(value)
      }
      onClose()
    },
    [schemaType.of, onValueCreate, onItemAppend, onClose],
  )

  const handleCardClick = useCallback((typeName: string) => handleSelect(typeName), [handleSelect])

  return (
    <Stack space={4}>
      <Button icon={AddIcon} text="Add Schema Type" mode="ghost" onClick={onOpen} />

      {open && (
        <Dialog
          header="Add Schema.org Type"
          id="schema-type-picker"
          onClose={onClose}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              {/* Search Input */}
              <TextInput
                icon={SearchIcon}
                placeholder="Search schema types…"
                value={search}
                onChange={handleSearchChange}
                autoFocus
              />

              {/* Type Grid by Category */}
              {grouped.size === 0 ? (
                <Card padding={4} tone="transparent">
                  <Flex align="center" justify="center">
                    <Text muted size={1}>
                      No matching schema types found.
                    </Text>
                  </Flex>
                </Card>
              ) : (
                <Stack space={5}>
                  {Array.from(grouped.entries()).map(([category, types]) => (
                    <Stack key={category} space={3}>
                      <Heading
                        size={0}
                        style={{textTransform: 'uppercase', letterSpacing: '0.05em'}}
                      >
                        {CATEGORY_LABELS[category]}
                      </Heading>
                      <Grid columns={[1, 1, 2]} gap={2}>
                        {types.map((info) => {
                          const schemaItem = schemaType.of.find((t) => t.name === info.type)
                          const Icon = schemaItem?.icon as React.ComponentType | undefined
                          return (
                            <Card
                              key={info.type}
                              as="button"
                              padding={3}
                              radius={2}
                              shadow={1}
                              tone="default"
                              onClick={() => handleCardClick(info.type)}
                              style={{cursor: 'pointer', textAlign: 'left'}}
                            >
                              <Flex gap={3} align="flex-start">
                                {Icon && (
                                  <Box style={{flexShrink: 0, marginTop: 2}}>
                                    <Text size={2}>
                                      <Icon />
                                    </Text>
                                  </Box>
                                )}
                                <Stack space={2}>
                                  <Text weight="semibold" size={1}>
                                    {info.title}
                                  </Text>
                                  <Text muted size={0}>
                                    {info.description}
                                  </Text>
                                </Stack>
                              </Flex>
                            </Card>
                          )
                        })}
                      </Grid>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>
          </Box>
        </Dialog>
      )}
    </Stack>
  )
}

// ─── Public Wrapper ───────────────────────────────────────────────────────────

/**
 * Custom input component for the `schemaOrg` array type.
 *
 * Wraps the default array input and injects the `TypeArrayFunctions`
 * component for a categorized, searchable type picker experience.
 *
 * @example Usage in `schemaOrg.ts`:
 * ```ts
 * defineType({
 *   name: 'schemaOrg',
 *   type: 'array',
 *   components: { input: TypePickerInput },
 *   // ...
 * })
 * ```
 */
export default function TypePickerInput(props: InputProps): JSX.Element {
  const {renderDefault} = props
  return <Stack space={3}>{renderDefault({...props, arrayFunctions: TypeArrayFunctions})}</Stack>
}
