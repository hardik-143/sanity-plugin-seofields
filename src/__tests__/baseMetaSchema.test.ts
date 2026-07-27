import baseMetaSchema from '../schemas/types/baseMeta'

type TestField = {
  name: string
  options?: {
    isKeywordsVisible?: (documentType?: string) => boolean
  }
}

type TestSchema = {
  fields: TestField[]
}

const getField = (schema: TestSchema, fieldName: string): TestField => {
  const field = schema.fields.find(({name}) => name === fieldName)
  if (!field) throw new Error(`Missing field: ${fieldName}`)
  return field
}

describe('baseMetaSchema keyword visibility', () => {
  it('passes default hidden keyword config to title and description inputs', () => {
    const schema = baseMetaSchema({
      defaultHiddenFields: ['keywords'],
    }) as TestSchema

    const titleVisibility = getField(schema, 'title').options?.isKeywordsVisible
    const descriptionVisibility = getField(schema, 'description').options?.isKeywordsVisible

    expect(titleVisibility).toBeDefined()
    expect(descriptionVisibility).toBeDefined()
    expect(titleVisibility?.()).toBe(false)
    expect(descriptionVisibility?.()).toBe(false)
  })

  it('passes document-type hidden keyword config to title and description inputs', () => {
    const schema = baseMetaSchema({
      fieldVisibility: {
        article: {hiddenFields: ['keywords']},
      },
    }) as TestSchema

    const titleVisibility = getField(schema, 'title').options?.isKeywordsVisible
    const descriptionVisibility = getField(schema, 'description').options?.isKeywordsVisible

    expect(titleVisibility).toBeDefined()
    expect(descriptionVisibility).toBeDefined()
    expect(titleVisibility?.()).toBe(true)
    expect(descriptionVisibility?.()).toBe(true)
    expect(titleVisibility?.('article')).toBe(false)
    expect(descriptionVisibility?.('article')).toBe(false)
    expect(titleVisibility?.('page')).toBe(true)
    expect(descriptionVisibility?.('page')).toBe(true)
  })

  it('keeps keywords visible by default', () => {
    const schema = baseMetaSchema() as TestSchema

    expect(getField(schema, 'title').options?.isKeywordsVisible?.('article')).toBe(true)
    expect(getField(schema, 'description').options?.isKeywordsVisible?.('article')).toBe(true)
  })
})
