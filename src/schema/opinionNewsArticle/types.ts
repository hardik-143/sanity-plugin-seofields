import type {SchemaOrgCreativeWorkData} from '../_types'

/** Schema.org OpinionNewsArticle — data shape from GROQ query */
export interface SchemaOrgOpinionNewsArticleData extends SchemaOrgCreativeWorkData {
  _type?: 'schemaOrgOpinionNewsArticle'
  articleSection?: string
  articleBody?: string
  backstory?: string
  wordCount?: number
  dateline?: string
  printColumn?: string
  printEdition?: string
  printPage?: string
  printSection?: string
}

/** Configuration for `schemaOrgOpinionNewsArticle()` */
export interface SchemaOrgOpinionNewsArticleConfig {
  validation?: Record<string, string>
}
