import {type ReactElement, useMemo, useState} from 'react'
import {StringInputProps, useFormValue} from 'sanity'
import {
  buildGEOProChecks,
  GEOChecklistProChecks,
  GEOLockedTeaser,
  type GEOProCheck,
} from 'seofields-pro'

interface GEOCheck {
  id: string
  label: string
  pass: boolean
  hint: string
}

type SeoFieldsValue = {
  title?: string
  description?: string
  metaImage?: {asset?: {_ref?: string} | null} | null
  openGraph?: {
    title?: string
    description?: string
    image?: {asset?: {_ref?: string} | null} | null
    imageUrl?: string
  } | null
  focusKeyword?: string
  canonicalUrl?: string
  robots?: {noIndex?: boolean} | null
  keywords?: string[]
} | null

type RootDocValue = {
  schemaOrg?: Array<{_type?: string}> | {_type?: string} | null
} | null

const GEOChecklist = (props: StringInputProps): ReactElement => {
  const {path, schemaType} = props
  const [expanded, setExpanded] = useState(false)

  const licenseKey = (schemaType as {options?: {licenseKey?: string}}).options?.licenseKey

  const seoFields = useFormValue([path[0]]) as SeoFieldsValue
  const rootDoc = useFormValue([]) as RootDocValue

  const freeChecks = useMemo((): GEOCheck[] => {
    const desc = seoFields?.description || ''
    const title = seoFields?.title || ''

    return [
      {
        id: 'description_answer_ready',
        label: 'Description is answer-ready (100–160 chars)',
        pass: !!desc && desc.length >= 100 && desc.length <= 160,
        hint: 'Write a concise 100–160 char answer that directly addresses user intent.',
      },
      {
        id: 'not_noindexed',
        label: 'Page is indexable (not noindex)',
        pass: !seoFields?.robots?.noIndex,
        hint: 'Page is set to noindex — AI overviews cannot cite noindexed pages.',
      },
      {
        id: 'title_concise',
        label: 'Title is 30–60 characters',
        pass: !!(title && title.length >= 30 && title.length <= 60),
        hint: 'Keep your title between 30–60 characters for optimal SERP and AI snippet display.',
      },
      {
        id: 'og_image_present',
        label: 'OG or meta image present',
        pass: !!(seoFields?.metaImage?.asset || seoFields?.openGraph?.image?.asset),
        hint: 'Add a meta or OG image for rich results and social previews.',
      },
      {
        id: 'has_keywords',
        label: 'Keywords added',
        pass: !!(
          seoFields?.keywords &&
          seoFields.keywords.filter((k) => k && k.trim().length > 0).length > 0
        ),
        hint: 'Add at least one keyword to improve topical signal for AI classifiers.',
      },
    ]
  }, [seoFields])

  const proChecks = useMemo(
    () => (licenseKey ? buildGEOProChecks(seoFields, rootDoc) : null),
    [licenseKey, seoFields, rootDoc],
  )

  const freePassing = freeChecks.filter((c) => c.pass).length
  const proPassing = proChecks ? proChecks.filter((c: GEOProCheck) => c.pass).length : 0
  const totalPassing = freePassing + (proChecks ? proPassing : 0)
  const totalChecks = freeChecks.length + (proChecks ? proChecks.length : 0)
  const percentage = totalChecks > 0 ? (totalPassing / totalChecks) * 100 : 0

  let scoreColor = '#dc2626'
  let scoreBg = '#fef2f2'
  let scoreText = '#b91c1c'
  if (percentage >= 80) {
    scoreColor = '#16a34a'
    scoreBg = '#f0fdf4'
    scoreText = '#15803d'
  } else if (percentage >= 50) {
    scoreColor = '#ca8a04'
    scoreBg = '#fefce8'
    scoreText = '#a16207'
  }

  return (
    <div
      style={{
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px 14px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div>
          <div style={{fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2}}>
            AI Overview Readiness
          </div>
          <div style={{fontSize: 11, color: '#9ca3af'}}>
            Signals that improve visibility in AI-generated overviews
          </div>
        </div>
        <div
          style={{
            backgroundColor: scoreBg,
            borderRadius: 20,
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
          }}
        >
          <span style={{fontSize: 16, fontWeight: 700, color: scoreColor}}>{totalPassing}</span>
          <span style={{fontSize: 12, color: scoreText, opacity: 0.7}}>/ {totalChecks}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{height: 3, backgroundColor: '#f3f4f6'}}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: scoreColor,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Toggle */}
      <div style={{padding: '10px 20px'}}>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: 12,
            color: '#6366f1',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              display: 'inline-block',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              flexShrink: 0,
            }}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          {expanded ? 'Hide checks' : 'Show all checks'}
        </button>
      </div>

      {expanded && (
        <div>
          {/* Free checks */}
          <div style={{padding: '0 20px 16px'}}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#9ca3af',
                marginBottom: 10,
                textTransform: 'uppercase',
              }}
            >
              Core Checks
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              {freeChecks.map((check) => (
                <CheckRow key={check.id} check={check} />
              ))}
            </div>
          </div>

          {/* Pro section */}
          <div
            style={{
              margin: '0 12px 12px',
              borderRadius: 8,
              backgroundColor: licenseKey ? '#faf5ff' : '#f9fafb',
              border: `1px solid ${licenseKey ? '#e9d5ff' : '#f3f4f6'}`,
              overflow: 'hidden',
            }}
          >
            {/* Pro header */}
            <div
              style={{
                padding: '10px 16px',
                borderBottom: `1px solid ${licenseKey ? '#e9d5ff' : '#f3f4f6'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: licenseKey ? '#7c3aed' : '#9ca3af',
                  textTransform: 'uppercase',
                }}
              >
                Pro Insights
              </span>
              {!licenseKey && (
                <span
                  style={{
                    fontSize: 10,
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    borderRadius: 4,
                    padding: '1px 6px',
                    fontWeight: 600,
                  }}
                >
                  Unlock with licenseKey
                </span>
              )}
              {licenseKey && proChecks && (
                <span
                  style={{
                    fontSize: 10,
                    backgroundColor: '#d8b4fe',
                    color: '#5b21b6',
                    borderRadius: 4,
                    padding: '1px 6px',
                    fontWeight: 600,
                  }}
                >
                  {proPassing} / {proChecks.length} passing
                </span>
              )}
            </div>

            {/* Pro rows */}
            <div style={{padding: '10px 16px'}}>
              {proChecks ? <GEOChecklistProChecks checks={proChecks} /> : <GEOLockedTeaser />}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CheckRow({check}: {check: GEOCheck}): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 7,
        backgroundColor: check.pass ? 'transparent' : '#fff8f8',
        border: `1px solid ${check.pass ? 'transparent' : '#fee2e2'}`,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: check.pass ? '#dcfce7' : '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: check.pass ? '#16a34a' : '#dc2626',
            lineHeight: 1,
          }}
        >
          {check.pass ? '✓' : '✗'}
        </span>
      </div>

      <div style={{flex: 1, minWidth: 0}}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: check.pass ? '#374151' : '#1f2937',
            lineHeight: 1.4,
          }}
        >
          {check.label}
        </div>
        {!check.pass && (
          <div style={{fontSize: 11, color: '#9ca3af', marginTop: 3, lineHeight: 1.5}}>
            {check.hint}
          </div>
        )}
      </div>
    </div>
  )
}

export default GEOChecklist
