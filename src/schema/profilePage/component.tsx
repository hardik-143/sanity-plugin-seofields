import {JSX} from 'react'

import {buildGenericJsonLd} from '../generator'
import {SchemaOrgScript} from '../SchemaOrgScript'
import {profilePageFields} from './schema'
import type {SchemaOrgProfilePageData} from './types'

export interface ProfilePageSchemaProps {
  data?: SchemaOrgProfilePageData | null
}

export function buildProfilePageJsonLd(
  data?: SchemaOrgProfilePageData | null,
): Record<string, unknown> | null {
  return buildGenericJsonLd(
    'ProfilePage',
    data as Record<string, unknown> | null | undefined,
    profilePageFields,
    [],
  )
}

export function ProfilePageSchema({data}: ProfilePageSchemaProps): JSX.Element | null {
  return <SchemaOrgScript jsonLd={buildProfilePageJsonLd(data)} />
}

export default ProfilePageSchema
