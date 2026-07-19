/**
 * Join a base URL and a path into a single URL, tolerating leading/trailing slashes on either side.
 *
 * @example
 * joinUrl('https://example.com/', '/about') // 'https://example.com/about'
 * joinUrl('https://example.com', '')        // 'https://example.com'
 * joinUrl('', 'about')                       // 'about'
 */
export function joinUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/+$/, '') // remove trailing /
  const normalizedPath = path.replace(/^\/+/, '') // remove leading /
  return [normalizedBase, normalizedPath].filter(Boolean).join('/')
}
