// Import the plugin
import seofields from './plugin'

// Default export the plugin
export default seofields

// Re-export everything from plugin.ts
export * from './plugin'

// Export all TypeScript types
export * from './types'

// Export schema types for external use
export {default as seoFieldsSchema} from './schemas'
export {default as openGraphSchema} from './schemas/types/openGraph'
export {default as twitterSchema} from './schemas/types/twitter'
export {default as metaAttributeSchema} from './schemas/types/metaAttribute'
export {default as metaTagSchema} from './schemas/types/metaTag'
export {default as allSchemas} from './schemas/types'
export {default as robotsSchema} from './schemas/types/robots'
