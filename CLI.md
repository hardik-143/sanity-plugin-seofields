# seofields CLI

The `seofields` CLI is a developer toolkit bundled with `sanity-plugin-seofields`. It helps you manage SEO configuration, audit content health, and export SEO data — all from your terminal.

---

## Installation

The CLI ships with the plugin. No extra install required.

```bash
npx seofields --help
```

Or install globally for convenience:

```bash
npm install -g sanity-plugin-seofields
seofields --help
```

---

## Quick Start

```bash
# Add seofields() to your sanity.config
npx seofields init

# Scaffold a CLI config file (stores project ID, dataset, token)
npx seofields create-config

# Run an SEO health report
npx seofields report

# Export all SEO data as CSV
npx seofields export --format csv --output seo-audit.csv

# Check your setup
npx seofields doctor
```

---

## CLI Config File

Instead of passing `--project-id`, `--dataset`, and `--token` on every command, create a `seofields.cli.ts` (or `.js`) file in your project root.

### Using the interactive wizard

```bash
npx seofields create-config
```

This prompts for your project ID, dataset, token source, and file format, then generates the config file.

### Manual setup

```ts
// seofields.cli.ts
import { defineSeoCli } from "sanity-plugin-seofields/define-cli";

export default defineSeoCli({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN,
});
```

### All options

```ts
defineSeoCli({
  projectId: string;         // Sanity project ID
  dataset: string;           // Dataset name (e.g. "production")
  token?: string;            // API token (needs read access)
  types?: string[];          // Limit report/export to these document types
  showConnectionInfo?: boolean; // Print project/dataset source after report (default: false)
})
```

### Environment variable support

`process.env.VAR_NAME` in your `seofields.cli.ts` file is resolved at runtime. The CLI also automatically loads `.env`, `.env.local`, and `.env.development.local` — so your existing env files work without any extra config.

### Resolution order

1. CLI flags (`--project-id`, `--dataset`, `--token`)
2. `seofields.cli.ts` / `seofields.cli.js` config file
3. Environment variables (`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_TOKEN`)
4. Auto-detected from `sanity.config.ts` / `sanity.config.js`

---

## Commands

### `seofields init`

Adds `seofields()` to your `sanity.config.ts` or `sanity.config.js` file.

```bash
npx seofields init [options]
```

**Options**

| Flag           | Description                                              |
| -------------- | -------------------------------------------------------- |
| `--schema-org` | Also inject `schemaOrg()` from `sanity-plugin-seofields` |

**Behavior**

- Finds your `sanity.config` file automatically
- Checks if `seofields()` (or `schemaOrg()` when `--schema-org` is used) is already imported and registered
- If missing, adds the import statement and registers the plugin in the `plugins: []` array
- If already present, skips with a notice — never adds duplicates

**Examples**

```bash
# Add seofields() plugin
npx seofields init

# Add both seofields() and schemaOrg()
npx seofields init --schema-org
```

---

### `seofields config`

Update `seofields()` configuration options in your `sanity.config` file from the terminal.

```bash
npx seofields config [--option=value ...]
```

**Top-level options**

| Flag                     | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `--baseUrl=<url>`        | Base URL of your site                                  |
| `--titleSeparator=<sep>` | Character between title and site name (e.g. `\|`, `–`) |
| `--siteName=<name>`      | Default site name                                      |

**Health Dashboard options**

| Flag                                           | Description                                    |
| ---------------------------------------------- | ---------------------------------------------- |
| `--healthDashboard.licenseKey=SEOF-…`          | License key to unlock premium features         |
| `--healthDashboard.toolTitle=<title>`          | Studio nav tab label                           |
| `--healthDashboard.showTypeColumn=true\|false` | Show document type in dashboard                |
| `--healthDashboard.showDocumentId=true\|false` | Show document ID in dashboard                  |
| `--healthDashboard.previewMode=true\|false`    | Show demo data (no real content needed)        |
| `--healthDashboard.apiVersion=2024-01-01`      | Sanity API version for dashboard queries       |
| `--healthDashboard.typeColumnMode=badge\|text` | Render doc type as badge or plain text         |
| `--healthDashboard.structureTool=<name>`       | Name of the structure tool (default: `"desk"`) |

**Query options**

| Flag                                             | Description                                  |
| ------------------------------------------------ | -------------------------------------------- |
| `--healthDashboard.query.types=post,page`        | Limit dashboard to these document types      |
| `--healthDashboard.query.requireSeo=true\|false` | Only show documents that have an `seo` field |
| `--healthDashboard.query.groq=<query>`           | Custom GROQ query for the dashboard          |

**Examples**

```bash
npx seofields config --baseUrl=https://example.com

npx seofields config --healthDashboard.licenseKey=SEOF-XXXX-XXXX-XXXX

npx seofields config --healthDashboard.query.types=post,page --healthDashboard.showTypeColumn=true
```

---

### `seofields create-config`

Interactive wizard to scaffold a `seofields.cli.ts` or `seofields.cli.js` config file.

```bash
npx seofields create-config
```

**What it does**

1. Asks if you want TypeScript or JavaScript
2. Auto-detects your project ID and dataset from `sanity.config` (if found)
3. Lets you confirm or override each value
4. Asks how to provide your token (env var or hardcoded)
5. Generates and writes the config file

**Output example (TypeScript)**

```ts
import { defineSeoCli } from "sanity-plugin-seofields/define-cli";

export default defineSeoCli({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_READ_TOKEN,
});
```

---

### `seofields report`

Queries your Sanity dataset and generates an SEO health report.

```bash
npx seofields report [options]
```

**Options**

| Flag                    | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `-p, --project-id <id>` | Sanity project ID                                      |
| `-d, --dataset <name>`  | Dataset name (default: `production`)                   |
| `-t, --token <token>`   | Sanity API token                                       |
| `--types <types>`       | Comma-separated document types to include              |
| `--format <format>`     | Output format: `table` or `summary` (default: `table`) |

**Formats**

- **`table`** — Full table with columns for document title, type, score, status, and issue count
- **`summary`** — Aggregated counts and percentages grouped by status; useful for a quick overview

**Score thresholds**

| Score  | Status    | Description                |
| ------ | --------- | -------------------------- |
| 90–100 | Excellent | All key SEO fields present |
| 70–89  | Good      | Minor fields missing       |
| 50–69  | Fair      | Several issues detected    |
| 0–49   | Poor      | Critical SEO fields absent |

**Examples**

```bash
# Report using CLI config file
npx seofields report

# Limit to specific document types
npx seofields report --types post,page

# Print a summary instead of a full table
npx seofields report --format summary
```

**Connection info**

Enable `showConnectionInfo: true` in your `defineSeoCli()` config to print a footer showing where project ID, dataset, and token were sourced from:

```
  Project:  66kejpx5   (from seofields.cli.ts)
  Dataset:  production  (from seofields.cli.ts)
  Token:    set         (from env: SANITY_WRITE_TOKEN)
```

---

### `seofields export`

Exports all documents with SEO fields to JSON or CSV.

```bash
npx seofields export [options]
```

**Options**

| Flag                    | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `-p, --project-id <id>` | Sanity project ID                                  |
| `-d, --dataset <name>`  | Dataset name                                       |
| `-t, --token <token>`   | Sanity API token                                   |
| `--types <types>`       | Comma-separated document types to include          |
| `--format <format>`     | Output format: `json` or `csv` (default: `json`)   |
| `-o, --output <path>`   | Save output to file (if omitted, prints to stdout) |

**Exported fields**

Each exported record includes: `_id`, `_type`, `title`, `slug`, `seoScore`, `seoStatus`, `issues`, `seoTitle`, `seoDescription`, `hasKeywords`, `hasOpenGraph`, `hasTwitter`, `hasMetaImage`, `_updatedAt`.

**Examples**

```bash
# Export as JSON to stdout
npx seofields export

# Export as CSV and save to file
npx seofields export --format csv --output seo-audit.csv

# Export only blog posts as JSON
npx seofields export --types post --output posts-seo.json
```

---

### `seofields doctor`

Checks your local SEO setup and reports any configuration issues.

```bash
npx seofields doctor
```

**Checks performed**

- ✅ `sanity.config.ts/js` found
- ✅ `seofields()` plugin registered in config
- ✅ `sanity` peer dependency installed
- ✅ `react` peer dependency installed
- ✅ `seofields.cli.ts/js` config file present (informational)

No options required. The doctor command is purely local — it does not connect to Sanity.

---

## Environment Variables

The CLI reads the following environment variables (in addition to your CLI config file):

| Variable                        | Description              |
| ------------------------------- | ------------------------ |
| `SANITY_PROJECT_ID`             | Sanity project ID        |
| `SANITY_DATASET`                | Dataset name             |
| `SANITY_TOKEN`                  | API token                |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Next.js-style project ID |
| `NEXT_PUBLIC_SANITY_DATASET`    | Next.js-style dataset    |

These are automatically loaded from `.env`, `.env.local`, and `.env.development.local` in your project root.

---

## Troubleshooting

**"Could not determine Sanity project ID"**

Run `npx seofields create-config` to create a `seofields.cli.ts` config file, or pass `--project-id` directly.

**"seofields() is already registered in your config"**

The `init` command detected an existing registration and skipped injection. This is expected behavior.

**Report shows no documents**

Ensure your API token has at least viewer access to the dataset, and that your documents include an `seo` field.

**process.env values not resolving in seofields.cli.ts**

Make sure the variable is defined in `.env` or `.env.local`. The CLI loads these files automatically at startup.
