/**
 * Icons for Schema.org types — sourced from @sanity/icons.
 * Each icon is a React component compatible with Sanity's `icon` field.
 */
import {
  ApiIcon,
  BarChartIcon,
  BookIcon,
  CalendarIcon,
  CodeBlockIcon,
  ComponentIcon,
  DesktopIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  HeartFilledIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  LinkIcon,
  ListIcon,
  MarkerIcon,
  PackageIcon,
  SparkleIcon,
  TagIcon,
  UserIcon,
  VideoIcon,
} from '@sanity/icons'

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

  // Commerce
  product: PackageIcon,
  offer: TagIcon,
  aggregateRating: BarChartIcon,
  review: HeartFilledIcon,

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
} as const
