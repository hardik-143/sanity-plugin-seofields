/**
 * Escapes characters in a JSON string that could enable XSS when embedded
 * inside a `<script>` tag. Prevents `</script>` breakout, HTML comment
 * injection, and Unicode line terminators that can break JS parsing.
 */
export function escapeJsonForScript(json: string): string {
  return json
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
