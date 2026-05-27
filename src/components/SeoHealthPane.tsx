import {lazy, Suspense} from 'react'
import type {ComponentBuilder, StructureBuilder} from 'sanity/structure'

import type {SeoHealthDashboardProps} from './SeoHealthDashboard'

const LazySeoHealthDashboard = lazy(() => import('./SeoHealthDashboard'))

export interface SeoHealthPaneOptions extends Omit<SeoHealthDashboardProps, 'customQuery'> {
  licenseKey: string
  query?: string
}

export function createSeoHealthPane(
  S: StructureBuilder,
  optionsWhenS: SeoHealthPaneOptions,
): ComponentBuilder {
  const {query, openInPane = true, title: paneTitle, ...rest} = optionsWhenS ?? {}

  const SeoHealthPane = () => (
    <Suspense fallback={null}>
      <LazySeoHealthDashboard
        customQuery={query}
        openInPane={openInPane}
        title={paneTitle}
        {...rest}
      />
    </Suspense>
  )
  SeoHealthPane.displayName = 'SeoHealthPane'

  return (S.component(SeoHealthPane) as ComponentBuilder)
    .title(paneTitle ?? 'SEO Health')
    .child((docId: string, {params}: {params: Record<string, string | undefined>}) => {
      const builder = S.document().documentId(docId)
      return params?.type ? builder.schemaType(params.type) : builder
    })
}

export default createSeoHealthPane
