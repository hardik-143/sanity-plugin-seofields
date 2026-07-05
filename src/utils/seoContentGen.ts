import type {AiConfig, AiIndustry} from '../plugin'
import {analyzeReadability} from './readability'
import {type MetaContext, pickPrompt, type SeoGenField} from './seoPrompts'

const DEFAULT_MAX_RETRIES = 2

const PROVIDER_DEFAULTS: Record<string, {baseUrl: string; model: string; requiresKey: boolean}> = {
  openai: {baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', requiresKey: true},
  anthropic: {
    baseUrl: 'https://api.anthropic.com',
    model: 'claude-haiku-4-5-20251001',
    requiresKey: true,
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    requiresKey: true,
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.0-flash',
    requiresKey: true,
  },
  ollama: {baseUrl: 'http://localhost:11434/v1', model: 'llama3.2', requiresKey: false},
}

// Must exactly match validation thresholds in seoUtils.ts
const FIELD_CONSTRAINTS: Partial<Record<SeoGenField, {min: number; max: number}>> = {
  title: {min: 50, max: 60},
  description: {min: 120, max: 160},
  ogTitle: {min: 40, max: 60},
  ogDescription: {min: 90, max: 120},
  twitterTitle: {min: 30, max: 70},
  twitterDescription: {min: 50, max: 200},
}

function parseApiError(status: number, body: unknown): string {
  const msg =
    (body as {error?: {message?: string}})?.error?.message ||
    (body as {message?: string})?.message ||
    ''
  if (status === 401)
    return `Authentication failed (401). Check your API key.${msg ? ` ${msg}` : ''}`
  if (status === 429)
    return `Rate limit reached (429). Wait a moment and try again.${msg ? ` ${msg}` : ''}`
  if (status >= 500)
    return `Provider server error (${status}). Try again shortly.${msg ? ` ${msg}` : ''}`
  return msg || `Request failed with status ${status}.`
}

interface CallOpts {
  apiKey?: string
  model: string
  temperature: number
}

async function callOpenAICompat(
  baseUrl: string,
  opts: CallOpts,
  prompt: string,
  signal: AbortSignal,
): Promise<string> {
  const headers: Record<string, string> = {'Content-Type': 'application/json'}
  if (opts.apiKey) headers.Authorization = `Bearer ${opts.apiKey}`

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({
      model: opts.model,
      messages: [{role: 'user', content: prompt}],
      /* eslint-disable camelcase */
      max_tokens: 300,
      /* eslint-enable camelcase */
      temperature: opts.temperature,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(parseApiError(res.status, data))
  return ((data.choices?.[0]?.message?.content as string) || '').trim()
}

async function callAnthropic(
  opts: CallOpts,
  apiKey: string,
  prompt: string,
  signal: AbortSignal,
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    signal,
    body: JSON.stringify({
      model: opts.model,
      /* eslint-disable camelcase */
      max_tokens: 300,
      /* eslint-enable camelcase */
      temperature: opts.temperature,
      messages: [{role: 'user', content: prompt}],
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(parseApiError(res.status, data))
  return ((data.content?.[0]?.text as string) || '').trim()
}

interface ProxyRequest {
  field: SeoGenField
  content: string
  focusKeyword: string
  keywords: string[]
  meta: MetaContext | undefined
  endpoint: string
  industry: AiIndustry | undefined
  licenseKey: string | undefined
  signal: AbortSignal
}

async function callProxy({
  field,
  content,
  focusKeyword,
  keywords,
  meta,
  endpoint,
  industry,
  licenseKey,
  signal,
}: ProxyRequest): Promise<string> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    signal,
    body: JSON.stringify({field, content, focusKeyword, keywords, meta, industry, licenseKey}),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(parseApiError(res.status, data))
  const result = (data as {result?: string}).result
  if (!result) throw new Error('Proxy response missing "result" field.')
  return result.trim()
}

// Strip surrounding quotes that models sometimes add despite instructions
function stripQuotes(text: string): string {
  return text.replace(/^["'""]|["'""]$/g, '').trim()
}

// Targeted fix: model sees the exact text + what's wrong — far more reliable than blind regeneration
async function refineLength(
  field: SeoGenField,
  raw: string,
  constraint: {min: number; max: number},
  callApi: (prompt: string) => Promise<string>,
): Promise<string> {
  const len = raw.length
  const isTooShort = len < constraint.min
  const action = isTooShort ? 'Expand' : 'Shorten'
  const issue = isTooShort
    ? `too short at ${len} characters (minimum is ${constraint.min})`
    : `too long at ${len} characters (maximum is ${constraint.max})`

  const prompt = `This SEO ${field} is ${issue}. Target range: ${constraint.min}–${constraint.max} characters.
${action} it to fit within that range. Preserve the meaning and any keywords present.
Count every character carefully before outputting. The final text MUST be ${constraint.min}–${constraint.max} chars.
Current text (${len} chars): "${raw}"
Return ONLY the rewritten text. No quotes, no labels, no character count.`

  return callApi(prompt)
}

// Targeted fix: insert the missing keyword while keeping length in range
async function refineKeyword(
  field: SeoGenField,
  raw: string,
  keywords: string[],
  constraint: {min: number; max: number} | undefined,
  callApi: (prompt: string) => Promise<string>,
): Promise<string> {
  const kwList = keywords.join(', ')
  const rangeNote = constraint
    ? ` The final text MUST be ${constraint.min}–${constraint.max} characters.`
    : ''

  const prompt = `This SEO ${field} is missing a required keyword.
Rewrite it to include at least one of these keywords naturally: ${kwList}.${rangeNote}
Do not force the keyword awkwardly — weave it in as if it was always there.
Current text: "${raw}"
Return ONLY the rewritten text. No quotes, no labels, no explanation.`

  return callApi(prompt)
}

// Targeted fix: pick a keyword that actually exists verbatim in the existing title/description
async function refineFocusKeyword(
  raw: string,
  meta: MetaContext,
  callApi: (prompt: string) => Promise<string>,
): Promise<string> {
  const missing: string[] = []
  const kw = raw.toLowerCase().trim()
  if (meta.title && !meta.title.toLowerCase().includes(kw))
    missing.push(`meta title: "${meta.title}"`)
  if (meta.description && !meta.description.toLowerCase().includes(kw))
    missing.push(`meta description: "${meta.description}"`)

  const prompt = `The focus keyword "${raw}" does not appear verbatim in the following existing page fields:
${missing.join('\n')}

Extract a keyword or phrase (1–4 words) that appears VERBATIM in those fields.
Do not invent a new keyword — only return a phrase already present in the text above.
${meta.slug ? `URL slug: "${meta.slug}" — prefer a phrase that also matches part of this.` : ''}

Return ONLY the keyword. No quotes, no explanation, no punctuation. Single line.`

  return callApi(prompt)
}

// Targeted fix: simplify language to improve readability score
async function refineReadability(
  raw: string,
  constraint: {min: number; max: number},
  callApi: (prompt: string) => Promise<string>,
): Promise<string> {
  const prompt = `This SEO meta description uses language that is too complex.
Rewrite it so it reads simply and clearly:
- Use short sentences (under 15 words each)
- Use common everyday words — no jargon or passive voice
- Keep the same core meaning and any keywords present
- The final text MUST be ${constraint.min}–${constraint.max} characters
Current text: "${raw}"
Return ONLY the rewritten text. No quotes, no labels, no explanation.`

  return callApi(prompt)
}

function checkLength(field: SeoGenField, text: string): boolean {
  const constraint = FIELD_CONSTRAINTS[field]
  if (!constraint) return true
  return text.length >= constraint.min && text.length <= constraint.max
}

function checkKeywords(field: SeoGenField, text: string, keywords: string[]): boolean {
  if ((field === 'title' || field === 'description') && keywords.length > 0) {
    const lower = text.toLowerCase()
    return keywords.some((kw) => lower.includes(kw.toLowerCase().trim()))
  }
  return true
}

function checkReadability(field: SeoGenField, text: string): boolean {
  if (field === 'description') {
    const readability = analyzeReadability(text)
    return !readability || readability.score >= 50
  }
  return true
}

function checkFocusKeywordInMeta(kw: string, meta: MetaContext): boolean {
  const lower = kw.toLowerCase().trim()
  if (meta.title && !meta.title.toLowerCase().includes(lower)) return false
  if (meta.description && !meta.description.toLowerCase().includes(lower)) return false
  return true
}

function validateOutput(
  field: SeoGenField,
  text: string,
  keywords: string[],
  meta?: MetaContext,
): string | null {
  if (!checkLength(field, text)) return null
  if (!checkKeywords(field, text, keywords)) return null
  if (!checkReadability(field, text)) return null
  if (field === 'focusKeyword' && meta && (meta.title || meta.description)) {
    if (!checkFocusKeywordInMeta(text, meta)) return null
  }
  return text
}

function warnIfKeyExposed(config: AiConfig): void {
  if (config.apiKey && typeof window !== 'undefined') {
    console.warn(
      '[sanity-plugin-seofields] "apiKey" is bundled into the Studio\'s client-side JS and is readable by ' +
        'anyone with Studio access. Use "endpoint" with a server-side proxy instead — see ' +
        '"sanity-plugin-seofields/server" for ready-made handlers.',
    )
  }
}

function buildCallApi(
  config: AiConfig,
  temperature: number,
  abortSignal: AbortSignal,
): (prompt: string) => Promise<string> {
  const provider = config.provider ?? 'openai'
  const providerDef = PROVIDER_DEFAULTS[provider]
  if (!providerDef) throw new Error(`Unknown provider "${provider}".`)
  if (providerDef.requiresKey && !config.apiKey) {
    throw new Error(`No API key configured for "${provider}". Add apiKey to your ai plugin config.`)
  }

  const baseUrl = config.baseUrl ?? providerDef.baseUrl
  const model = config.model ?? providerDef.model
  const opts: CallOpts = {apiKey: config.apiKey, model, temperature}

  const useAnthropic = provider === 'anthropic' && !config.baseUrl
  return (prompt: string) =>
    useAnthropic
      ? callAnthropic(opts, config.apiKey!, prompt, abortSignal)
      : callOpenAICompat(baseUrl, opts, prompt, abortSignal)
}

interface RefinementCtx {
  field: SeoGenField
  keywords: string[]
  meta: MetaContext | undefined
  constraint: {min: number; max: number} | undefined
  callApi: (prompt: string) => Promise<string>
  abortSignal: AbortSignal
}

// Runs passes 1-4 against a single raw response, tolerating errors/aborts by keeping the prior text.
async function refineRawText(raw: string, ctx: RefinementCtx): Promise<string> {
  const {field, keywords, meta, constraint, callApi, abortSignal} = ctx
  let text = raw

  // Pass 1 — fix length if wrong
  if (constraint && !checkLength(field, text)) {
    try {
      abortSignal.throwIfAborted()
      text = stripQuotes(await refineLength(field, text, constraint, callApi))
    } catch {
      // aborted or errored — continue with what we have
    }
  }

  // Pass 2 — inject missing keyword if required (title/description fields)
  if (!checkKeywords(field, text, keywords)) {
    try {
      abortSignal.throwIfAborted()
      text = stripQuotes(await refineKeyword(field, text, keywords, constraint, callApi))
      // re-fix length after keyword injection since it may have shifted
      if (constraint && !checkLength(field, text)) {
        abortSignal.throwIfAborted()
        text = stripQuotes(await refineLength(field, text, constraint, callApi))
      }
    } catch {
      // aborted or errored — continue with what we have
    }
  }

  // Pass 3 — simplify for readability (description only)
  if (!checkReadability(field, text) && constraint) {
    try {
      abortSignal.throwIfAborted()
      text = stripQuotes(await refineReadability(text, constraint, callApi))
      // re-fix length after rewrite
      if (!checkLength(field, text)) {
        abortSignal.throwIfAborted()
        text = stripQuotes(await refineLength(field, text, constraint, callApi))
      }
    } catch {
      // aborted or errored — continue with what we have
    }
  }

  // Pass 4 — ensure focus keyword exists verbatim in existing title + description
  if (
    field === 'focusKeyword' &&
    meta &&
    (meta.title || meta.description) &&
    !checkFocusKeywordInMeta(text, meta)
  ) {
    try {
      abortSignal.throwIfAborted()
      text = stripQuotes(await refineFocusKeyword(text, meta, callApi))
    } catch {
      // aborted or errored — continue with what we have
    }
  }

  return text
}

export interface GenerateOpts {
  config: AiConfig
  signal?: AbortSignal
  meta?: MetaContext
}

export async function generateSeoText(
  field: SeoGenField,
  content: string,
  focusKeyword: string,
  keywords: string[],
  {config, signal, meta}: GenerateOpts,
): Promise<string> {
  const abortSignal = signal ?? AbortSignal.timeout(15000)

  if (config.endpoint) {
    return callProxy({
      field,
      content,
      focusKeyword,
      keywords,
      meta,
      endpoint: config.endpoint,
      industry: config.industry,
      licenseKey: config._licenseKey,
      signal: abortSignal,
    })
  }

  warnIfKeyExposed(config)
  const callApi = buildCallApi(config, config.temperature ?? 0.7, abortSignal)

  const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES
  const isLicensed = Boolean(config._licenseKey)
  const constraint = FIELD_CONSTRAINTS[field]
  let firstRaw = ''
  let lastRaw = ''

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    abortSignal.throwIfAborted()

    const prompt = await pickPrompt(
      field,
      {content, keyword: focusKeyword, keywords, meta},
      config.industry,
      isLicensed ? config._licenseKey : undefined,
      config._projectId,
    )
    const raw = stripQuotes(await callApi(prompt))
    if (attempt === 0) firstRaw = raw

    lastRaw = await refineRawText(raw, {field, keywords, meta, constraint, callApi, abortSignal})

    const valid = validateOutput(field, lastRaw, keywords, meta)
    if (valid !== null) return valid
  }

  // All attempts exhausted — true = keep first response, false/undefined = keep last
  return config.keepFirstOnValidationFail === true ? firstRaw : lastRaw
}
