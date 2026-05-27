import type {ReactElement, ReactNode} from 'react'

import type {DeprecationWarning, DocumentWithSeoHealth} from '../types'

export interface SeoHealthDashboardProps {
  icon?: string
  title?: string
  description?: string
  showTypeColumn?: boolean
  showDocumentId?: boolean
  queryTypes?: string[]
  queryRequireSeo?: boolean
  customQuery?: string
  apiVersion?: string
  licenseKey?: string
  typeDisplayLabels?: Record<string, string>
  typeColumnMode?: 'badge' | 'text'
  titleField?: string | Record<string, string>
  getDocumentBadge?: (
    doc: DocumentWithSeoHealth & Record<string, unknown>,
  ) => {label: string; bgColor?: string; textColor?: string; fontSize?: string} | undefined
  loadingLicense?: ReactNode
  loadingDocuments?: ReactNode
  noDocuments?: ReactNode
  previewMode?: boolean
  openInPane?: boolean
  structureTool?: string
  _deprecationWarnings?: DeprecationWarning[]
  exportEnabled?: boolean
  exportFormats?: Array<'csv' | 'json'>
  compactStats?: boolean
}

// Full implementation ships as part of the pro build.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SeoHealthDashboard = (_props: SeoHealthDashboardProps): ReactElement => (
  <div style={{padding: 40, textAlign: 'center', fontFamily: 'sans-serif', color: '#6b7280'}}>
    <div style={{fontSize: 32, marginBottom: 12}}>🔒</div>
    <div style={{fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#1f2937'}}>
      SEO Health Dashboard
    </div>
    <div style={{fontSize: 14}}>This feature requires a valid license key.</div>
  </div>
)

export default SeoHealthDashboard
