/**
 * SSRF guard for server-side link checks.
 *
 * Rejects anything that is not plain http(s), URLs with embedded credentials, `localhost`-style
 * names, and any host that is — or resolves to — a private, loopback, link-local, CGNAT, multicast,
 * documentation or otherwise reserved address. Pair with `checkUrl`'s `validateUrl` hook, which runs
 * this for every redirect hop as well.
 *
 * Residual risk: DNS is resolved here and again by `fetch`, so a hostile DNS server could answer
 * differently the second time (DNS rebinding). Run the handler somewhere without access to sensitive
 * internal services if that matters for your threat model.
 */
import {BlockedUrlError} from '../utils/linkCheck'

export type ResolveHostFn = (hostname: string) => Promise<string[]>

export interface PublicUrlOptions {
  /** Custom resolver (hostname → IP addresses). Defaults to `node:dns` `lookup` with `all: true`. */
  resolveHost?: ResolveHostFn
}

function parseIPv4(ip: string): number[] | null {
  const parts = ip.split('.')
  if (parts.length !== 4) return null
  const nums = parts.map((p) => (/^\d{1,3}$/.test(p) ? Number(p) : NaN))
  return nums.every((n) => n >= 0 && n <= 255) ? nums : null
}

function isPrivateIPv4([a, b, c]: number[]): boolean {
  return (
    a === 0 || // "this" network
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // CGNAT 100.64.0.0/10
    (a === 169 && b === 254) || // link-local, cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && c === 0) || // IETF protocol assignments
    (a === 192 && b === 0 && c === 2) || // TEST-NET-1
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    (a === 198 && b === 51 && c === 100) || // TEST-NET-2
    (a === 203 && b === 0 && c === 113) || // TEST-NET-3
    a >= 224 // multicast (224/4), reserved (240/4), broadcast
  )
}

/** Expand an IPv6 address to 8 16-bit groups. Returns null when it is not valid IPv6. */
function parseIPv6(input: string): number[] | null {
  let ip = input.toLowerCase()
  const zone = ip.indexOf('%')
  if (zone !== -1) ip = ip.slice(0, zone)

  // Embedded IPv4 tail, e.g. ::ffff:127.0.0.1
  const lastColon = ip.lastIndexOf(':')
  const tail = ip.slice(lastColon + 1)
  if (tail.includes('.')) {
    const v4 = parseIPv4(tail)
    if (!v4) return null
    const hi = (v4[0] * 256 + v4[1]).toString(16)
    const lo = (v4[2] * 256 + v4[3]).toString(16)
    ip = `${ip.slice(0, lastColon + 1)}${hi}:${lo}`
  }

  const halves = ip.split('::')
  if (halves.length > 2) return null
  const head = halves[0] ? halves[0].split(':') : []
  const rest = halves.length === 2 && halves[1] ? halves[1].split(':') : []
  const missing = 8 - head.length - rest.length
  if (halves.length === 1 ? head.length !== 8 : missing < 1) return null
  const groups = [...head, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...rest]
  const nums = groups.map((g) => (/^[0-9a-f]{1,4}$/.test(g) ? parseInt(g, 16) : NaN))
  return nums.every((n) => !Number.isNaN(n)) ? nums : null
}

function isPrivateIPv6(g: number[]): boolean {
  const allZeroUpTo = (n: number) => g.slice(0, n).every((x) => x === 0)
  if (allZeroUpTo(8)) return true // ::
  if (allZeroUpTo(7) && g[7] === 1) return true // ::1
  // IPv4-mapped (::ffff:a.b.c.d), IPv4-compatible (::a.b.c.d) and NAT64 (64:ff9b::a.b.c.d)
  const embedded = [Math.floor(g[6] / 256), g[6] % 256, Math.floor(g[7] / 256), g[7] % 256]
  if (allZeroUpTo(5) && (g[5] === 0xffff || g[5] === 0)) return isPrivateIPv4(embedded)
  if (g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((x) => x === 0)) {
    return isPrivateIPv4(embedded)
  }
  const first = g[0]
  if (first >= 0xfc00 && first <= 0xfdff) return true // unique local fc00::/7
  if (first >= 0xfe80 && first <= 0xfebf) return true // link-local fe80::/10
  if (first >= 0xfec0 && first <= 0xfeff) return true // site-local (deprecated) fec0::/10
  if (first >= 0xff00) return true // multicast ff00::/8
  if (g[0] === 0x2001 && g[1] === 0x0db8) return true // documentation 2001:db8::/32
  return false
}

/**
 * `true` for private, loopback, link-local, CGNAT, multicast, documentation and reserved IPv4/IPv6
 * addresses. Unparseable input is treated as private (fail closed).
 */
export function isPrivateAddress(address: string): boolean {
  const ip = address.replace(/^\[|\]$/g, '')
  const v4 = parseIPv4(ip)
  if (v4) return isPrivateIPv4(v4)
  const v6 = parseIPv6(ip)
  if (v6) return isPrivateIPv6(v6)
  return true
}

const isIpLiteral = (host: string): boolean =>
  parseIPv4(host) !== null || parseIPv6(host.replace(/^\[|\]$/g, '')) !== null

const BLOCKED_HOSTNAMES = /(^|\.)(localhost|local|internal|home\.arpa)$/i

async function defaultResolveHost(hostname: string): Promise<string[]> {
  let dns: typeof import('node:dns/promises')
  try {
    // Lazy + bundler-ignored so edge bundles that never run the link checker don't try to resolve it.
    dns = await import(/* webpackIgnore: true */ /* @vite-ignore */ 'node:dns/promises')
  } catch {
    throw new BlockedUrlError(
      'DNS lookup is not available in this runtime — pass `resolveHost` to the link-check handler',
    )
  }
  const records = await dns.lookup(hostname, {all: true, verbatim: true})
  return records.map((r) => r.address)
}

/**
 * Throws `BlockedUrlError` unless `input` is an http(s) URL whose host is publicly routable.
 * DNS failures propagate as ordinary errors (reported as `status: 'error'`).
 */
export async function assertPublicUrl(
  input: string | URL,
  options: PublicUrlOptions = {},
): Promise<void> {
  let url: URL
  try {
    url = typeof input === 'string' ? new URL(input) : input
  } catch {
    throw new BlockedUrlError('Malformed URL')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BlockedUrlError('Only http and https URLs are allowed')
  }
  if (url.username || url.password) {
    throw new BlockedUrlError('URLs with embedded credentials are not allowed')
  }

  const host = url.hostname.replace(/\.$/, '')
  if (!host) throw new BlockedUrlError('Missing host')
  if (BLOCKED_HOSTNAMES.test(host)) throw new BlockedUrlError('Local hostnames are not allowed')

  if (isIpLiteral(host)) {
    if (isPrivateAddress(host))
      throw new BlockedUrlError('Private or reserved addresses are not allowed')
    return
  }

  const addresses = await (options.resolveHost ?? defaultResolveHost)(host)
  if (addresses.length === 0) throw new Error('Host not found')
  if (addresses.some(isPrivateAddress)) {
    throw new BlockedUrlError('Host resolves to a private or reserved address')
  }
}
