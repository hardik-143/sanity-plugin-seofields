/**
 * Icons for Schema.org types — sourced from @sanity/icons.
 * Each icon is a React component compatible with Sanity's `icon` field.
 *
 * Built through `defineIcon` rather than named barrel imports: @sanity/icons v5 dropped
 * the named exports (`ApiIcon`, …) from its root entry, and v3 has no per-icon subpaths.
 * The root `Icon` symbol API works across v3, v4 and v5 alike.
 */
import {defineIcon} from '../utils/icon'

const ApiIcon = defineIcon('api')
const BarChartIcon = defineIcon('bar-chart')
const BookIcon = defineIcon('book')
const CalendarIcon = defineIcon('calendar')
const ClipboardIcon = defineIcon('clipboard')
const CodeBlockIcon = defineIcon('code-block')
const CommentIcon = defineIcon('comment')
const ComponentIcon = defineIcon('component')
const DesktopIcon = defineIcon('desktop')
const DocumentTextIcon = defineIcon('document-text')
const EarthGlobeIcon = defineIcon('earth-globe')
const HeartFilledIcon = defineIcon('heart-filled')
const HelpCircleIcon = defineIcon('help-circle')
const HomeIcon = defineIcon('home')
const ImageIcon = defineIcon('image')
const LinkIcon = defineIcon('link')
const ListIcon = defineIcon('list')
const MarkerIcon = defineIcon('marker')
const MasterDetailIcon = defineIcon('master-detail')
const PackageIcon = defineIcon('package')
const PlayIcon = defineIcon('play')
const RobotIcon = defineIcon('robot')
const SparkleIcon = defineIcon('sparkle')
const TagIcon = defineIcon('tag')
const UserIcon = defineIcon('user')
const VideoIcon = defineIcon('video')

export const SchemaOrgIcons = {
  // Website & WebPage
  website: EarthGlobeIcon,
  webPage: DocumentTextIcon,

  // Organization & Business
  organization: ComponentIcon,
  localBusiness: HomeIcon,

  brand: SparkleIcon,

  // People
  person: UserIcon,

  // Navigation
  breadcrumbList: LinkIcon,

  // Media
  imageObject: ImageIcon,
  videoObject: VideoIcon,

  // Content
  article: DocumentTextIcon,
  blogPosting: BookIcon,
  faqPage: HelpCircleIcon,
  howTo: ListIcon,
  recipe: BookIcon,
  socialMediaPosting: CommentIcon,

  // Commerce
  product: PackageIcon,
  offer: TagIcon,
  aggregateRating: BarChartIcon,
  review: HeartFilledIcon,
  service: RobotIcon,

  // Location
  postalAddress: MarkerIcon,
  place: MarkerIcon,
  event: CalendarIcon,

  // Contact
  contactPoint: ApiIcon,

  // Software
  softwareApplication: CodeBlockIcon,
  webApplication: DesktopIcon,

  // Education
  course: BookIcon,

  // Legal & geographic
  legalService: MasterDetailIcon,
  country: EarthGlobeIcon,

  // New types
  jobPosting: ClipboardIcon,
  restaurant: HomeIcon,
  movie: PlayIcon,
  book: BookIcon,
  newsArticle: DocumentTextIcon,
  opinionNewsArticle: DocumentTextIcon,
  itemList: ListIcon,
  profilePage: UserIcon,
  musicRecording: PlayIcon,
  musicAlbum: PackageIcon,
} as const
