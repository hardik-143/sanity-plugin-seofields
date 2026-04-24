import type {SchemaOrgCreativeWorkData} from '../_types'

/** Schema.org NewsArticle — data shape from GROQ query */
export interface SchemaOrgNewsArticleData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgNewsArticle'
  articleSection?: string
  articleBody?: string
  wordCount?: number
  dateline?: string
  printColumn?: string
  printEdition?: string
  printPage?: string
  printSection?: string
}

/** Configuration for `schemaOrgNewsArticle()` */
export interface SchemaOrgNewsArticleConfig {
  validation?: Record<string, string>
}
