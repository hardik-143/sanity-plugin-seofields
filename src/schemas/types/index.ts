import {SchemaTypeDefinition} from 'sanity'

import {SeoFieldsPluginConfig} from '../../plugin'
import seoFields from '..'
import metaAttribute from './metaAttribute'
import metaTag from './metaTag'
import openGraph from './openGraph'
import robots from './robots'
import twitter from './twitter'

export default function types(config: SeoFieldsPluginConfig = {}): SchemaTypeDefinition[] {
  return [
    seoFields(config), // pass config here
    openGraph(config), // pass config here
    twitter(config), // pass config here
    metaAttribute as SchemaTypeDefinition,
    metaTag,
    robots,
  ]
}
