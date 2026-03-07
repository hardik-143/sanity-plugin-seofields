import SeoHealthDashboard, {SeoHealthDashboardProps} from './SeoHealthDashboard'

/**
 * Sanity Tool component for the SEO Health Dashboard
 * This component wraps the SeoHealthDashboard for use as a custom tool in Sanity Studio
 */
const SeoHealthTool = (props: SeoHealthDashboardProps) => {
  return <SeoHealthDashboard {...props} />
}

export default SeoHealthTool
