import seoFields from '..'
import metaAttribute from './metaAttribute'
import openGraph from './openGraph'
import twitter from './twitter'
import robots from './robots'
import metaTag from './metaTag'
import {SeoFieldsPluginConfig} from '../../plugin'

export default function types(config: SeoFieldsPluginConfig = {}) {
  return [
    seoFields(config), // pass config here
    openGraph(config), // pass config here
    twitter(config), // pass config here
    metaAttribute,
    metaTag,
    robots,
  ]
}
