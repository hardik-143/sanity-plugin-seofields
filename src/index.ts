import seofields from './plugin'

// Export the plugin
export {seofields}

// Export all TypeScript types
export * from './types'

// Export schema types for external use
export {default as seoFieldsSchema} from './schemas'
export {default as openGraphSchema} from './schemas/types/openGraph'
export {default as twitterSchema} from './schemas/types/twitter'
export {default as metaAttributeSchema} from './schemas/types/metaAttribute'
export {default as metaTagSchema} from './schemas/types/metaTag'
export {default as allSchemas} from './schemas/types'
