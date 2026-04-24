/**
 * Shared field collections reused across multiple Schema.org types.
 *
 * Includes:
 *  - polymorphic helpers (image, author, publisher, genre, keywords)
 *  - Thing common fields (name, alternateName, additionalType, etc.)
 *  - CreativeWork common fields (award, copyrightNotice, copyrightYear, etc.)
 *
 * These helpers keep the polymorphic UX consistent — editors get a `Type`
 * selector and only see the relevant fields for the chosen variant.
 */
import type {SchemaFieldDef} from './generator'

// ─── ImageObject inner fields (per https://schema.org/ImageObject) ────────────

export const imageObjectInnerFields: SchemaFieldDef[] = [
  {
    name: 'url',
    title: 'URL',
    type: 'url',
    description: 'URL of the image.',
    required: {key: 'imageObjectUrlRequired', message: 'Image URL is required.'},
  },
  {name: 'contentUrl', title: 'Content URL', type: 'url', description: 'Direct URL to the file.'},
  {name: 'caption', title: 'Caption', type: 'string', description: 'Caption / alt text.'},
  {name: 'name', title: 'Name', type: 'string'},
  {name: 'description', title: 'Description', type: 'text', rows: 2},
  {name: 'width', title: 'Width (px)', type: 'number'},
  {name: 'height', title: 'Height (px)', type: 'number'},
  {
    name: 'encodingFormat',
    title: 'Encoding Format',
    type: 'string',
    description: 'e.g. image/jpeg',
  },
  {name: 'contentLocation', title: 'Content Location', type: 'string'},
  {name: 'datePublished', title: 'Date Published', type: 'date'},
  {name: 'creditText', title: 'Credit Text', type: 'string'},
  {name: 'license', title: 'License URL', type: 'url'},
  {name: 'acquireLicensePage', title: 'Acquire License Page', type: 'url'},
  {name: 'copyrightNotice', title: 'Copyright Notice', type: 'string'},
  {
    name: 'representativeOfPage',
    title: 'Representative of Page',
    type: 'boolean',
    description: 'Whether this image is the main / lead image for the page.',
  },
  {name: 'embedUrl', title: 'Embed URL', type: 'url'},
  {name: 'thumbnailUrl', title: 'Thumbnail URL', type: 'url'},
]

// ─── Person inner fields (subset for embedding within author/publisher) ───────

const personInnerFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Full Name',
    type: 'string',
    required: {key: 'personNameRequired', message: 'Person name is required.'},
  },
  {name: 'jobTitle', title: 'Job Title', type: 'string'},
  {name: 'url', title: 'Profile URL', type: 'url'},
  {name: 'image', title: 'Image URL', type: 'url'},
  {name: 'email', title: 'Email', type: 'string'},
  {name: 'telephone', title: 'Telephone', type: 'string'},
  {name: 'description', title: 'Bio', type: 'text', rows: 3},
  {
    name: 'sameAs',
    title: 'Same As URL',
    type: 'url',
    description: 'LinkedIn, Twitter, GitHub, or any page about this person.',
    urlValidation: {schemes: ['http', 'https']},
  },
]

// ─── Organization inner fields (subset for embedding) ────────────────────────

const organizationInnerFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Organization Name',
    type: 'string',
    required: {key: 'organizationNameRequired', message: 'Organization name is required.'},
  },
  {name: 'url', title: 'Website URL', type: 'url'},
  {name: 'logo', title: 'Logo URL', type: 'url'},
  {name: 'description', title: 'Description', type: 'text', rows: 2},
  {name: 'email', title: 'Email', type: 'string'},
  {name: 'telephone', title: 'Telephone', type: 'string'},
  {
    name: 'sameAs',
    title: 'Same As URL',
    type: 'url',
    description: 'A page about this organization (e.g. Wikipedia, Wikidata, social profile).',
    urlValidation: {schemes: ['http', 'https']},
  },
]

// ─── Polymorphic Helpers ─────────────────────────────────────────────────────

export interface PolymorphicOptions {
  /** Override field name (defaults vary per helper) */
  name?: string
  /** Override field title */
  title?: string
  /** Help text */
  description?: string
}

/** Image: URL string OR full Schema.org ImageObject. */
export function polymorphicImage(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'image',
    title: opts.title ?? 'Image',
    type: 'select',
    description: opts.description ?? 'Provide either a plain URL or a full ImageObject.',
    defaultVariant: 'url',
    variants: [
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'Image URL',
            type: 'url',
            description: 'Direct URL to the image.',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
      {
        value: 'imageObject',
        title: 'ImageObject (detailed)',
        jsonLdType: 'ImageObject',
        fields: imageObjectInnerFields,
      },
    ],
  }
}

/** Author: Person OR Organization. */
export function polymorphicAuthor(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'author',
    title: opts.title ?? 'Author',
    type: 'select',
    description: opts.description ?? 'The author — choose Person or Organization.',
    defaultVariant: 'person',
    variants: [
      {value: 'person', title: 'Person', jsonLdType: 'Person', fields: personInnerFields},
      {
        value: 'organization',
        title: 'Organization',
        jsonLdType: 'Organization',
        fields: organizationInnerFields,
      },
    ],
  }
}

/** Publisher: Person OR Organization. */
export function polymorphicPublisher(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'publisher',
    title: opts.title ?? 'Publisher',
    type: 'select',
    description: opts.description ?? 'The publisher — choose Person or Organization.',
    defaultVariant: 'organization',
    variants: [
      {
        value: 'organization',
        title: 'Organization',
        jsonLdType: 'Organization',
        fields: organizationInnerFields,
      },
      {value: 'person', title: 'Person', jsonLdType: 'Person', fields: personInnerFields},
    ],
  }
}

/** Genre: free text OR URL (e.g. linking to a Wikipedia genre page). */
export function polymorphicGenre(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'genre',
    title: opts.title ?? 'Genre',
    type: 'select',
    description: opts.description ?? 'Genre — provide as text or a URL.',
    defaultVariant: 'text',
    variants: [
      {value: 'text', title: 'Text', fields: [{name: 'text', title: 'Genre', type: 'string'}]},
      {value: 'url', title: 'URL', fields: [{name: 'url', title: 'Genre URL', type: 'url'}]},
    ],
  }
}

/** Keywords: free text (comma-separated) OR URL. */
export function polymorphicKeywords(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'keywords',
    title: opts.title ?? 'Keywords',
    type: 'select',
    description:
      opts.description ?? 'Keywords describing the content — comma-separated text or a URL.',
    defaultVariant: 'text',
    variants: [
      {
        value: 'text',
        title: 'Text',
        fields: [
          {
            name: 'text',
            title: 'Keywords',
            type: 'string',
            description: 'Comma-separated list, e.g. "react, sanity, seo".',
          },
        ],
      },
      {value: 'url', title: 'URL', fields: [{name: 'url', title: 'Keywords URL', type: 'url'}]},
    ],
  }
}

// ─── Polymorphic additionalType (text or URL) ────────────────────────────────

/** additionalType: free text OR URL (linking to a Schema.org / Wikidata type). */
export function polymorphicAdditionalType(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'additionalType',
    title: opts.title ?? 'Additional Type',
    type: 'select',
    description:
      opts.description ??
      'An additional Schema.org type — provide as text or a URL (e.g. a Wikidata URI).',
    defaultVariant: 'text',
    variants: [
      {
        value: 'text',
        title: 'Text',
        fields: [{name: 'text', title: 'Type', type: 'string'}],
      },
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'Type URL',
            type: 'url',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
    ],
  }
}

// ─── Person-or-Organization role helpers ─────────────────────────────────────

/** Contributor: Person OR Organization. */
export function polymorphicContributor(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'contributor',
    title: opts.title ?? 'Contributor',
    type: 'select',
    description: opts.description ?? 'A secondary contributor — choose Person or Organization.',
    defaultVariant: 'person',
    variants: [
      {value: 'person', title: 'Person', jsonLdType: 'Person', fields: personInnerFields},
      {
        value: 'organization',
        title: 'Organization',
        jsonLdType: 'Organization',
        fields: organizationInnerFields,
      },
    ],
  }
}

/** Creator: Person OR Organization. */
export function polymorphicCreator(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'creator',
    title: opts.title ?? 'Creator',
    type: 'select',
    description: opts.description ?? 'The creator — choose Person or Organization.',
    defaultVariant: 'person',
    variants: [
      {value: 'person', title: 'Person', jsonLdType: 'Person', fields: personInnerFields},
      {
        value: 'organization',
        title: 'Organization',
        jsonLdType: 'Organization',
        fields: organizationInnerFields,
      },
    ],
  }
}

/** Maintainer: Person OR Organization. */
export function polymorphicMaintainer(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'maintainer',
    title: opts.title ?? 'Maintainer',
    type: 'select',
    description: opts.description ?? 'The maintainer — choose Person or Organization.',
    defaultVariant: 'organization',
    variants: [
      {
        value: 'organization',
        title: 'Organization',
        jsonLdType: 'Organization',
        fields: organizationInnerFields,
      },
      {value: 'person', title: 'Person', jsonLdType: 'Person', fields: personInnerFields},
    ],
  }
}

export function polymorphicSponsor(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'sponsor',
    title: opts.title ?? 'Sponsor',
    type: 'select',
    description: opts.description ?? 'A sponsor — choose Person or Organization.',
    defaultVariant: 'organization',
    variants: [
      {
        value: 'organization',
        title: 'Organization',
        jsonLdType: 'Organization',
        fields: organizationInnerFields,
      },
      {value: 'person', title: 'Person', jsonLdType: 'Person', fields: personInnerFields},
    ],
  }
}

/** Funder: Person OR Organization. */
export function polymorphicFunder(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'funder',
    title: opts.title ?? 'Funder',
    type: 'select',
    description: opts.description ?? 'A funder or sponsor — choose Person or Organization.',
    defaultVariant: 'organization',
    variants: [
      {
        value: 'organization',
        title: 'Organization',
        jsonLdType: 'Organization',
        fields: organizationInnerFields,
      },
      {value: 'person', title: 'Person', jsonLdType: 'Person', fields: personInnerFields},
    ],
  }
}

/** Copyright Holder: Person OR Organization. */
export function polymorphicCopyrightHolder(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'copyrightHolder',
    title: opts.title ?? 'Copyright Holder',
    type: 'select',
    description: opts.description ?? 'The copyright holder — choose Person or Organization.',
    defaultVariant: 'organization',
    variants: [
      {
        value: 'organization',
        title: 'Organization',
        jsonLdType: 'Organization',
        fields: organizationInnerFields,
      },
      {value: 'person', title: 'Person', jsonLdType: 'Person', fields: personInnerFields},
    ],
  }
}

// ─── Other polymorphic helpers ────────────────────────────────────────────────

/** Identifier: text (e.g. ISBN, GTIN) OR URL. */
export function polymorphicIdentifier(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'identifier',
    title: opts.title ?? 'Identifier',
    type: 'select',
    description:
      opts.description ?? 'A unique identifier for this item — text (e.g. ISBN, GTIN) or a URL.',
    defaultVariant: 'text',
    variants: [
      {
        value: 'text',
        title: 'Text',
        fields: [
          {
            name: 'text',
            title: 'Identifier',
            type: 'string',
            description: 'e.g. ISBN, GTIN-13, MPN, SKU',
          },
        ],
      },
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'Identifier URL',
            type: 'url',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
    ],
  }
}

/** Owner: Person OR Organization. */
export function polymorphicOwner(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'owner',
    title: opts.title ?? 'Owner',
    type: 'select',
    description: opts.description ?? 'The owner of this item — choose Person or Organization.',
    defaultVariant: 'person',
    variants: [
      {value: 'person', title: 'Person', jsonLdType: 'Person', fields: personInnerFields},
      {
        value: 'organization',
        title: 'Organization',
        jsonLdType: 'Organization',
        fields: organizationInnerFields,
      },
    ],
  }
}

/** Citation: text reference OR URL to the cited work. */
export function polymorphicCitation(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'citation',
    title: opts.title ?? 'Citation',
    type: 'select',
    description:
      opts.description ?? 'A citation for this work — text reference or URL to the cited work.',
    defaultVariant: 'text',
    variants: [
      {
        value: 'text',
        title: 'Text',
        fields: [
          {
            name: 'text',
            title: 'Citation Text',
            type: 'string',
            description: 'e.g. "Smith, J. (2020). Title. Journal, 1(1), 1–10."',
          },
        ],
      },
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'Citation URL',
            type: 'url',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
    ],
  }
}

/** Content Rating: plain text OR structured Rating object. */
export function polymorphicContentRating(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'contentRating',
    title: opts.title ?? 'Content Rating',
    type: 'select',
    description: opts.description ?? 'A rating for the content — e.g. MPAA, ESRB, PEGI.',
    defaultVariant: 'text',
    variants: [
      {
        value: 'text',
        title: 'Text',
        fields: [
          {
            name: 'text',
            title: 'Rating',
            type: 'string',
            description: 'e.g. "PG-13", "PEGI 12", "TV-MA"',
          },
        ],
      },
      {
        value: 'rating',
        title: 'Rating (detailed)',
        jsonLdType: 'Rating',
        fields: [
          {
            name: 'ratingValue',
            title: 'Rating Value',
            type: 'string',
            description: 'Numeric or descriptive value, e.g. "4.5" or "PG-13".',
          },
          {
            name: 'bestRating',
            title: 'Best Rating',
            type: 'string',
            description: 'Highest value allowed, e.g. "5".',
          },
          {
            name: 'worstRating',
            title: 'Worst Rating',
            type: 'string',
            description: 'Lowest value allowed, e.g. "1".',
          },
          {name: 'ratingExplanation', title: 'Rating Explanation', type: 'text', rows: 2},
          {
            name: 'author',
            title: 'Rating Author',
            type: 'string',
            description: 'Name of the rating organization or author.',
          },
        ],
      },
    ],
  }
}

/** archivedAt: URL or simplified WebPage reference. */
export function polymorphicArchivedAt(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'archivedAt',
    title: opts.title ?? 'Archived At',
    type: 'select',
    description:
      opts.description ?? 'A URL where this content is archived, or a WebPage reference.',
    defaultVariant: 'url',
    variants: [
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'Archive URL',
            type: 'url',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
      {
        value: 'webPage',
        title: 'WebPage',
        jsonLdType: 'WebPage',
        fields: [
          {
            name: 'url',
            title: 'Web Page URL',
            type: 'url',
            urlValidation: {schemes: ['http', 'https']},
          },
          {name: 'name', title: 'Page Name', type: 'string'},
          {name: 'description', title: 'Page Description', type: 'text', rows: 2},
        ],
      },
    ],
  }
}

/** isBasedOn: URL or text reference to the source CreativeWork/Product. */
export function polymorphicIsBasedOn(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'isBasedOn',
    title: opts.title ?? 'Is Based On',
    type: 'select',
    description:
      opts.description ??
      'A resource used in the creation of this resource — URL or text reference.',
    defaultVariant: 'url',
    variants: [
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'Source URL',
            type: 'url',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
      {
        value: 'text',
        title: 'Text',
        fields: [{name: 'text', title: 'Source Reference', type: 'string'}],
      },
    ],
  }
}

/** isPartOf: URL or text reference to a parent CreativeWork. */
export function polymorphicIsPartOf(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'isPartOf',
    title: opts.title ?? 'Is Part Of',
    type: 'select',
    description:
      opts.description ?? 'A parent CreativeWork this work is part of — URL or text reference.',
    defaultVariant: 'url',
    variants: [
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'Parent URL',
            type: 'url',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
      {
        value: 'text',
        title: 'Text',
        fields: [{name: 'text', title: 'Parent Reference', type: 'string'}],
      },
    ],
  }
}

/** License: URL to a license document or text name. */
export function polymorphicLicense(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'license',
    title: opts.title ?? 'License',
    type: 'select',
    description:
      opts.description ?? 'A license for the content — URL to license document or text name.',
    defaultVariant: 'url',
    variants: [
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'License URL',
            type: 'url',
            description: 'e.g. https://creativecommons.org/licenses/by/4.0/',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
      {
        value: 'text',
        title: 'Text',
        fields: [
          {
            name: 'text',
            title: 'License Name',
            type: 'string',
            description: 'e.g. "CC BY 4.0", "MIT", "Apache 2.0"',
          },
        ],
      },
    ],
  }
}

/** locationCreated: text name or URL reference to a Place. */
export function polymorphicLocationCreated(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'locationCreated',
    title: opts.title ?? 'Location Created',
    type: 'select',
    description:
      opts.description ?? 'The location where this work was created — text or URL to a Place.',
    defaultVariant: 'text',
    variants: [
      {
        value: 'text',
        title: 'Text',
        fields: [
          {
            name: 'text',
            title: 'Location',
            type: 'string',
            description: 'e.g. "New York, USA"',
          },
        ],
      },
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'Location URL',
            type: 'url',
            description: 'URL to the place (e.g. Wikidata, GeoNames).',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
    ],
  }
}

/** Material: text description OR URL to the material resource. */
export function polymorphicMaterial(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'material',
    title: opts.title ?? 'Material',
    type: 'select',
    description: opts.description ?? 'A material used in the creation of this work — text or URL.',
    defaultVariant: 'text',
    variants: [
      {
        value: 'text',
        title: 'Text',
        fields: [{name: 'text', title: 'Material', type: 'string'}],
      },
      {
        value: 'url',
        title: 'URL',
        fields: [
          {
            name: 'url',
            title: 'Material URL',
            type: 'url',
            urlValidation: {schemes: ['http', 'https']},
          },
        ],
      },
    ],
  }
}

// ─── Simple reusable field factories ─────────────────────────────────────────

/**
 * IETF BCP 47 language options shown in the `inLanguage` dropdown.
 * Add more via `extraOptions` in `inLanguageField()`.
 */
export const IETF_LANGUAGE_OPTIONS: Array<{title: string; value: string}> = [
  {title: 'English', value: 'en'},
  {title: 'Spanish', value: 'es'},
  {title: 'French', value: 'fr'},
  {title: 'German', value: 'de'},
  {title: 'Portuguese', value: 'pt'},
  {title: 'Italian', value: 'it'},
  {title: 'Dutch', value: 'nl'},
  {title: 'Japanese', value: 'ja'},
  {title: 'Chinese (Simplified)', value: 'zh'},
  {title: 'Korean', value: 'ko'},
  {title: 'Hindi', value: 'hi'},
  {title: 'Arabic', value: 'ar'},
  {title: 'Russian', value: 'ru'},
  {title: 'Polish', value: 'pl'},
  {title: 'Turkish', value: 'tr'},
  {title: 'Swedish', value: 'sv'},
  {title: 'Norwegian', value: 'no'},
  {title: 'Danish', value: 'da'},
  {title: 'Finnish', value: 'fi'},
  {title: 'Greek', value: 'el'},
  {title: 'Czech', value: 'cs'},
  {title: 'Hungarian', value: 'hu'},
  {title: 'Romanian', value: 'ro'},
  {title: 'Ukrainian', value: 'uk'},
  {title: 'Hebrew', value: 'he'},
  {title: 'Indonesian', value: 'id'},
  {title: 'Thai', value: 'th'},
  {title: 'Vietnamese', value: 'vi'},
  {title: 'Bengali', value: 'bn'},
]

export interface SimpleFieldOptions {
  /** Override field title */
  title?: string
  /** Help text / description */
  description?: string
  /** If provided, field is required with this validation config */
  required?: {key: string; message: string}
}

export interface InLanguageFieldOptions {
  /** Override field title (default: 'Language') */
  title?: string
  /** Help text / description */
  description?: string
  /** Default selected language (default: 'en') */
  initialValue?: string
  /** Additional language options appended after the defaults */
  extraOptions?: Array<{title: string; value: string}>
}

/**
 * Reusable `inLanguage` field — renders a searchable dropdown of IETF BCP 47
 * language codes (per https://schema.org/inLanguage), defaulting to English.
 *
 * @example
 * ```ts
 * inLanguageField()                           // 'Language' / default description
 * inLanguageField({ description: 'The language of the page content.' })
 * inLanguageField({ initialValue: 'fr', extraOptions: [{title: 'Catalan', value: 'ca'}] })
 * ```
 */
export function inLanguageField(opts: InLanguageFieldOptions = {}): SchemaFieldDef {
  return {
    name: 'inLanguage',
    title: opts.title ?? 'Language',
    type: 'string',
    description: opts.description ?? 'Content language (IETF BCP 47 tag), e.g. "en".',
    initialValue: opts.initialValue ?? 'en',
    options: [...IETF_LANGUAGE_OPTIONS, ...(opts.extraOptions ?? [])],
  }
}

/**
 * Reusable `name` field — a simple string with configurable title, description,
 * and optional required validation.
 *
 * @example
 * ```ts
 * nameField({ title: 'Website Name', description: 'The name of the website.' })
 * nameField({ title: 'Page Name', required: { key: 'nameRequired', message: 'Name is required.' } })
 * ```
 * @see https://schema.org/name
 */
export function nameField(opts: SimpleFieldOptions = {}): SchemaFieldDef {
  return {
    name: 'name',
    title: opts.title ?? 'Name',
    type: 'string',
    description: opts.description ?? 'The name of the item.',
    ...(opts.required ? {required: opts.required} : {}),
  }
}

/**
 * Reusable `potentialAction` field for SearchAction — allows configuring a sitelinks search box in Google results. Renders a single `target` URL field with the required
 * `{search_term_string}` placeholder.
 * @param opts Options to customize the field's name, title, and description.
 * @returns A SchemaFieldDef for a SearchAction potentialAction with a target URL template.
 * @example
 * ```ts
 * potentialActionSearch() // default name, title, and description
 * potentialActionSearch({ title: 'Google Sitelinks Search Box', description: 'Configure the search URL template for the Google sitelinks search box.' })
 * ```
 * @see https://schema.org/SearchAction#potentialAction
 */
export function potentialActionSearch(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'potentialAction',
    title: opts.title ?? 'Site Search (SearchAction)',
    type: 'object',
    description:
      opts.description ??
      'Enables the sitelinks search box in Google. Configure the search URL template.',
    jsonLdType: 'SearchAction',
    fields: [
      {
        name: 'target',
        title: 'Search URL Template',
        type: 'url',
        description:
          'URL with {search_term_string} placeholder, e.g. "https://example.com/search?q={search_term_string}".',
      },
    ],
  }
}

/**
 * Reusable `description` field — a text area with configurable title, description,
 * and optional required validation.
 * @param opts Options to customize the field's title, description, and validation.
 * @returns A SchemaFieldDef for a description field with the specified options.
 * @example
 * ```ts
 * descriptionField({ title: 'Website Description', description: 'A brief description of the website.' })
 * descriptionField({ title: 'Page Description', required: { key: 'descriptionRequired', message: 'Description is required.' } })
 * ```
 * @see https://schema.org/description
 */
export function descriptionField(opts: SimpleFieldOptions = {}): SchemaFieldDef {
  return {
    name: 'description',
    title: opts.title ?? 'Description',
    type: 'text',
    rows: 3,
    description: opts.description ?? 'A description of the item.',
    ...(opts.required ? {required: opts.required} : {}),
  }
}

/**
 * Reusable `url` field — a URL type with configurable title, description,
 * http/https validation, and optional required validation.
 *
 * @example
 * ```ts
 * urlField({ title: 'Website URL', description: 'The full URL of the website.' })
 * urlField({ title: 'Page URL', required: { key: 'urlRequired', message: 'URL is required.' } })
 * ```
 */
export function urlField(opts: SimpleFieldOptions = {}): SchemaFieldDef {
  return {
    name: 'url',
    title: opts.title ?? 'URL',
    type: 'url',
    description: opts.description ?? 'URL of the item.',
    urlValidation: {schemes: ['http', 'https']},
    ...(opts.required ? {required: opts.required} : {}),
  }
}

export interface DatePublishedFieldOptions extends SimpleFieldOptions {
  /** 'date' (default) or 'datetime' */
  dateType?: 'date' | 'datetime'
  name?: string
  title?: string
}

/**
 * Reusable `headline` field — a string type used for article-like content.
 */
export function headlineField(opts: SimpleFieldOptions = {}): SchemaFieldDef {
  return {
    name: 'headline',
    title: opts.title ?? 'Headline',
    type: 'string',
    description: opts.description ?? 'The headline of the content.',
    ...(opts.required ? {required: opts.required} : {}),
  }
}

/**
 * Reusable `datePublished` field — a date or datetime type.
 */
export function datePublishedField(opts: DatePublishedFieldOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'datePublished',
    title: opts.title ?? 'Date Published',
    type: opts.dateType ?? 'date',
    description: opts.description ?? 'The date the content was published.',
    ...(opts.required ? {required: opts.required} : {}),
  }
}

// ─── Embedded Thing inner fields (for use inside about / mainEntity) ──────────

/**
 * Lightweight Thing fields used when embedding a Thing reference inside another
 * schema (e.g. CreativeWork.about, CreativeWork.mainEntity). Excludes recursive
 * polymorphic image/owner to keep the UI manageable.
 */
const thingInnerFields: SchemaFieldDef[] = [
  {name: 'name', title: 'Name', type: 'string'},
  {name: 'description', title: 'Description', type: 'text', rows: 2},
  {name: 'url', title: 'URL', type: 'url', urlValidation: {schemes: ['http', 'https']}},
  {
    name: 'sameAs',
    title: 'Same As URL',
    type: 'url',
    description: 'URL of another page about this same entity.',
    urlValidation: {schemes: ['http', 'https']},
  },
  {
    name: 'identifier',
    title: 'Identifier',
    type: 'string',
    description: 'e.g. ISBN, GTIN, Wikidata QID',
  },
]

// ─── Common Thing fields ─────────────────────────────────────────────────────

/**
 * Base fields from https://schema.org/Thing — the most generic type of item.
 *
 * Includes: additionalType, alternateName, description,
 * disambiguatingDescription, image, name, url, sameAs.
 *
 * Use `withThingCommons(fields)` to append these to any schema.
 */
export const thingCommonFields: SchemaFieldDef[] = [
  {
    name: 'name',
    title: 'Name',
    type: 'string',
    description: 'The name of the item.',
  },
  {
    name: 'alternateName',
    title: 'Alternate Name',
    type: 'string',
    description: 'An alias for the item.',
  },
  polymorphicAdditionalType(),
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'A description of the item.',
  },
  {
    name: 'disambiguatingDescription',
    title: 'Disambiguating Description',
    type: 'text',
    rows: 2,
    description: 'Used to disambiguate from other items with the same name.',
  },
  polymorphicImage({description: 'An image of the item — choose URL or full ImageObject.'}),
  {
    name: 'url',
    title: 'URL',
    type: 'url',
    description: 'URL of the item.',
    urlValidation: {schemes: ['http', 'https']},
  },
  {
    name: 'sameAs',
    title: 'Same As URL',
    type: 'url',
    description: 'URL to another page about this item (Wikipedia, Wikidata, social profile).',
    urlValidation: {schemes: ['http', 'https']},
  },
  polymorphicIdentifier(),
  polymorphicOwner(),
]

/**
 * Merge `thingCommonFields` into a schema's existing field list.
 * Existing fields with the same `name` win (schema-specific titles/validation
 * are preserved). Common fields not yet present are appended.
 */
export function withThingCommons(fields: SchemaFieldDef[]): SchemaFieldDef[] {
  const existing = new Set(fields.map((f) => f.name))
  return [...fields, ...thingCommonFields.filter((f) => !existing.has(f.name))]
}

// ─── Common CreativeWork fields ──────────────────────────────────────────────

/**
 * Common fields from https://schema.org/CreativeWork — the base type for all
 * creative works (Article, Recipe, VideoObject, Book, etc.).
 *
 * All fields are optional so individual schemas can override or omit them.
 * Thing commons (name, alternateName, additionalType, description,
 * disambiguatingDescription, identifier, image, url, sameAs, owner) are
 * appended automatically via `withThingCommons`.
 */
export const creativeWorkCommonFields: SchemaFieldDef[] = withThingCommons([
  // ── Internal field (not Schema.org) ────────────────────────────────────────
  {
    name: 'alternateType',
    title: 'Alternate @type',
    type: 'string',
    description: 'Override the emitted Schema.org @type, e.g. "NewsArticle" instead of "Article".',
  },

  // ── Schema.org CreativeWork fields (alphabetical) ──────────────────────────

  {
    name: 'about',
    title: 'About',
    type: 'object',
    description: 'The subject matter of the content.',
    jsonLdType: 'Thing',
    fields: thingInnerFields,
  },
  {
    name: 'accountablePerson',
    title: 'Accountable Person',
    type: 'object',
    description: 'Person primarily accountable for this content.',
    jsonLdType: 'Person',
    fields: personInnerFields,
  },
  {
    name: 'aggregateRating',
    title: 'Aggregate Rating',
    type: 'object',
    description: 'The overall rating based on a collection of reviews/ratings.',
    jsonLdType: 'AggregateRating',
    fields: [
      {name: 'ratingValue', title: 'Rating Value', type: 'string', description: 'e.g. "4.5"'},
      {
        name: 'ratingCount',
        title: 'Rating Count',
        type: 'number',
        description: 'Number of ratings.',
      },
      {
        name: 'reviewCount',
        title: 'Review Count',
        type: 'number',
        description: 'Number of written reviews.',
      },
      {
        name: 'bestRating',
        title: 'Best Rating',
        type: 'string',
        description: 'Highest value allowed, e.g. "5".',
      },
      {
        name: 'worstRating',
        title: 'Worst Rating',
        type: 'string',
        description: 'Lowest value allowed, e.g. "1".',
      },
      {name: 'ratingExplanation', title: 'Rating Explanation', type: 'text', rows: 2},
    ],
  },
  {
    name: 'alternativeHeadline',
    title: 'Alternative Headline',
    type: 'string',
    description: 'A secondary title or sub-headline for the work.',
  },
  polymorphicArchivedAt(),
  polymorphicAuthor(),
  {
    name: 'award',
    title: 'Awards',
    type: 'array',
    of: [{type: 'string'}],
    description: 'Awards won by or for this item.',
  },
  {
    name: 'backstory',
    title: 'Backstory',
    type: 'text',
    rows: 3,
    description: 'A backstory of the article (sources, context, etc.).',
  },
  {
    name: 'character',
    title: 'Character',
    type: 'object',
    description: 'Fictional person connected with this creative work.',
    jsonLdType: 'Person',
    fields: personInnerFields,
  },
  polymorphicCitation(),
  polymorphicContentRating(),
  {
    name: 'contentReferenceTime',
    title: 'Content Reference Time',
    type: 'datetime',
    description: 'The specific time described by this work (for time-sensitive content).',
  },
  polymorphicContributor(),
  polymorphicCopyrightHolder(),
  {
    name: 'copyrightNotice',
    title: 'Copyright Notice',
    type: 'string',
    description: 'Text of any copyright notice associated with the work.',
  },
  {
    name: 'copyrightYear',
    title: 'Copyright Year',
    type: 'copyrightYear',
    description:
      'Year of copyright. Toggle "Use current year" to emit the current year automatically.',
  },
  polymorphicCreator(),
  {
    name: 'creditText',
    title: 'Credit Text',
    type: 'string',
    description: 'Text giving credit to the creator (e.g. for image attribution).',
  },
  {
    name: 'dateCreated',
    title: 'Date Created',
    type: 'datetime',
    description: 'The date on which the work was created.',
  },
  {
    name: 'dateModified',
    title: 'Date Modified',
    type: 'datetime',
    description: 'The date on which the work was most recently modified.',
  },
  {
    name: 'datePublished',
    title: 'Date Published',
    type: 'datetime',
    description: 'The date on which the work was first published.',
  },
  {
    name: 'discussionUrl',
    title: 'Discussion URL',
    type: 'url',
    description: 'A link to the page that contains the review or comments about this item.',
    urlValidation: {schemes: ['http', 'https']},
  },
  {
    name: 'editor',
    title: 'Editor',
    type: 'object',
    description: 'Specifies the Person who edited the work.',
    jsonLdType: 'Person',
    fields: personInnerFields,
  },
  polymorphicFunder(),
  polymorphicGenre(),
  {
    name: 'headline',
    title: 'Headline',
    type: 'string',
    description: 'Headline of the article.',
  },
  {
    name: 'isAccessibleForFree',
    title: 'Is Accessible For Free',
    type: 'boolean',
    description: 'Whether the work is accessible without paying.',
  },
  polymorphicIsBasedOn(),
  {
    name: 'isFamilyFriendly',
    title: 'Is Family Friendly',
    type: 'boolean',
    description: 'Whether the content is suitable for family / children.',
  },
  polymorphicIsPartOf(),
  polymorphicKeywords(),
  {
    name: 'learningResourceType',
    title: 'Learning Resource Type',
    type: 'string',
    description: 'The predominant type of learning resource (e.g. "Video", "Exercise", "Exam").',
  },
  polymorphicLicense(),
  polymorphicLocationCreated(),
  {
    name: 'mainEntity',
    title: 'Main Entity',
    type: 'object',
    description: 'Indicates the primary entity described in this work.',
    jsonLdType: 'Thing',
    fields: thingInnerFields,
  },
  polymorphicMaintainer(),
  polymorphicMaterial(),
  {
    name: 'thumbnailUrl',
    title: 'Thumbnail URL',
    type: 'url',
    description: 'URL of a thumbnail image.',
    urlValidation: {schemes: ['http', 'https']},
  },
])

/**
 * Merge `creativeWorkCommonFields` into a schema's existing field list.
 * Existing fields with the same `name` win (schema-specific titles/validation
 * are preserved). All common CW fields not already present are appended.
 */
export function withCreativeWorkCommons(fields: SchemaFieldDef[]): SchemaFieldDef[] {
  const existing = new Set(fields.map((f) => f.name))
  return [...fields, ...creativeWorkCommonFields.filter((f) => !existing.has(f.name))]
}

// ─── Runtime resolvers for component-side JSON-LD builders ───────────────────

/**
 * Resolve a polymorphic image value into a JSON-LD-emittable shape.
 * Accepts:
 *   - `{variant: 'url', url}` → emits the URL string
 *   - `{variant: 'imageObject', imageObject: {...}}` → emits `{@type: 'ImageObject', ...}`
 */
export function resolvePolymorphicImage(input: unknown): string | Record<string, unknown> | null {
  if (input === null || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>
  const variant = obj.variant as string | undefined

  if (variant === 'imageObject' && obj.imageObject && typeof obj.imageObject === 'object') {
    const inner = obj.imageObject as Record<string, unknown>
    const out: Record<string, unknown> = {'@type': 'ImageObject'}
    for (const [k, v] of Object.entries(inner)) {
      if (v !== undefined && v !== null && v !== '') out[k] = v
    }
    return Object.keys(out).length > 1 ? out : null
  }

  if (variant === 'url') {
    if (typeof obj.url === 'string' && obj.url) return obj.url
  }
  return null
}

/**
 * Resolve a polymorphic Person/Organization value into a JSON-LD-emittable shape.
 * Accepts:
 *   - `{variant: 'person', person: {...}}` → `{@type: 'Person', ...}`
 *   - `{variant: 'organization', organization: {...}}` → `{@type: 'Organization', ...}`
 */
export function resolvePolymorphicPersonOrOrg(
  input: unknown,
  // _defaultType: 'Person' | 'Organization' = 'Person',
): Record<string, unknown> | null {
  if (input === null || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>
  const variant = obj.variant as string | undefined

  if (variant === 'person' && obj.person && typeof obj.person === 'object') {
    return {'@type': 'Person', ...stripEmpty(obj.person as Record<string, unknown>)}
  }
  if (variant === 'organization' && obj.organization && typeof obj.organization === 'object') {
    return {'@type': 'Organization', ...stripEmpty(obj.organization as Record<string, unknown>)}
  }
  return null
}

/** Resolve polymorphic text-or-url value into a string suitable for JSON-LD. */
export function resolvePolymorphicTextOrUrl(input: unknown): string | null {
  if (input === null || typeof input !== 'object') return null
  const obj = input as Record<string, unknown>
  const variant = obj.variant as string | undefined
  if (variant === 'text' && typeof obj.text === 'string' && obj.text) return obj.text
  if (variant === 'url' && typeof obj.url === 'string' && obj.url) return obj.url
  return null
}

function stripEmpty(obj: Record<string, unknown>, exclude: string[] = []): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (exclude.includes(k)) continue
    if (v === undefined || v === null || v === '') continue
    if (Array.isArray(v) && v.length === 0) continue
    out[k] = v
  }
  return out
}

// issn
export function issnField(opts: SimpleFieldOptions = {}): SchemaFieldDef {
  return {
    name: 'issn',
    title: opts.title ?? 'ISSN',
    type: 'string',
    description: opts.description ?? 'International Standard Serial Number (ISSN) for periodicals.',
    ...(opts.required ? {required: opts.required} : {}),
  }
}

// {
//     name: 'isPartOf',
//     title: 'Part Of (Website)',
//     type: 'object',
//     description: 'The website this page belongs to.',
//     jsonLdType: 'WebSite',
//     fields: [
//       {
//         name: 'url',
//         title: 'Website URL',
//         type: 'url',
//         description: 'URL of the parent website.',
//       },
//     ],
//   }

export function isPartOfField(opts: PolymorphicOptions = {}): SchemaFieldDef {
  return {
    name: opts.name ?? 'isPartOf',
    title: opts.title ?? 'Part Of (Website)',
    type: 'object',
    description: opts.description ?? 'The website this page belongs to.',
    jsonLdType: 'WebSite',
    fields: [
      {
        name: 'url',
        title: 'Website URL',
        type: 'url',
        description: 'URL of the parent website.',
        urlValidation: {schemes: ['http', 'https']},
      },
    ],
  }
}

// {
//     name: 'license',
//     title: 'License URL',
//     type: 'url',
//     description: 'URL of the license under which the content is published.',
//   }

export function licenseUrlField(opts: SimpleFieldOptions = {}): SchemaFieldDef {
  return {
    name: 'license',
    title: opts.title ?? 'License URL',
    type: 'url',
    description: opts.description ?? 'URL of the license under which the content is published.',
    urlValidation: {schemes: ['http', 'https']},
    ...(opts.required ? {required: opts.required} : {}),
  }
}
