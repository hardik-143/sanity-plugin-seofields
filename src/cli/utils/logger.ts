/* eslint-disable no-console */
import pc from 'picocolors'

export const log = {
  info: (msg: string): void => console.log(pc.blue('ℹ'), msg),
  success: (msg: string): void => console.log(pc.green('✔'), msg),
  warn: (msg: string): void => console.log(pc.yellow('⚠'), msg),
  error: (msg: string): void => console.log(pc.red('✖'), msg),
  dim: (msg: string): void => console.log(pc.dim(msg)),
  heading: (msg: string): void => console.log(`\n${pc.bold(pc.cyan(msg))}`),
  table: (rows: string[][]): void => {
    if (rows.length === 0) return
    const colWidths = rows[0].map((_, i): number =>
      Math.max(...rows.map((r): number => (r[i] || '').length)),
    )
    for (const row of rows) {
      console.log(row.map((cell, i): string => (cell || '').padEnd(colWidths[i] + 2)).join(''))
    }
  },
}

export const STATUS_ICONS: Record<string, string> = {
  excellent: pc.green('●'),
  good: pc.blue('●'),
  fair: pc.yellow('●'),
  poor: pc.red('●'),
  missing: pc.dim('○'),
}

export const STATUS_LABELS: Record<string, string> = {
  excellent: pc.green('Excellent'),
  good: pc.blue('Good'),
  fair: pc.yellow('Fair'),
  poor: pc.red('Poor'),
  missing: pc.dim('Missing'),
}
