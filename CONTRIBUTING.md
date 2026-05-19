# Contributing to sanity-plugin-seofields

Thanks for taking the time to contribute! Whether you're fixing a bug, improving docs, suggesting a feature, or reporting an issue — every contribution helps make the plugin better for the whole Sanity community.

---

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Ways to contribute](#ways-to-contribute)
- [Reporting bugs](#reporting-bugs)
- [Suggesting features](#suggesting-features)
- [Your first pull request](#your-first-pull-request)
- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Making changes](#making-changes)
- [Commit messages](#commit-messages)
- [Submitting a pull request](#submitting-a-pull-request)
- [Changelog](#changelog)
- [License](#license)

---

## Code of conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) Code of Conduct. By participating you agree to uphold it. Please report unacceptable behaviour to [hello@thehardik.in](mailto:hello@thehardik.in).

---

## Ways to contribute

You don't have to write code to contribute:

| What | How |
|---|---|
| 🐛 Report a bug | [Open a bug report](https://github.com/hardik-143/sanity-plugin-seofields/issues/new) |
| 💡 Suggest a feature | [Open a feature request](https://github.com/hardik-143/sanity-plugin-seofields/issues/new) |
| 📖 Improve docs | Edit a doc page and open a PR |
| ✅ Fix a bug | Comment on the issue, fork, and open a PR |
| ⭐ Spread the word | Star the repo, leave a [review](https://sanity-plugin-seofields.thehardik.in/reviews), or share it with your team |

---

## Reporting bugs

Before opening a new issue, please [search existing issues](https://github.com/hardik-143/sanity-plugin-seofields/issues) to avoid duplicates.

When you open a bug report, include:

- **Plugin version** — run `npm list sanity-plugin-seofields` to find it
- **Sanity Studio version** — v3, v4, or v5
- **Node.js version** — run `node -v`
- **Steps to reproduce** — a minimal example is ideal
- **Expected behaviour** — what you expected to happen
- **Actual behaviour** — what actually happened
- **Screenshots or error output** — if relevant

> **Security vulnerabilities** — please do **not** open a public issue. Email [hello@thehardik.in](mailto:hello@thehardik.in) directly. See [SECURITY.md](./SECURITY.md) for the full policy.

---

## Suggesting features

Open a [feature request issue](https://github.com/hardik-143/sanity-plugin-seofields/issues/new?template=feature_request.md) and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered
- Whether you'd be willing to implement it yourself

Feature requests are discussed openly. If you want to start building before a decision is made, comment on the issue first so work isn't duplicated.

---

## Your first pull request

Never opened a PR on an open-source project before? No worries. Here's a quick primer:

1. Look for issues labelled [`good first issue`](https://github.com/hardik-143/sanity-plugin-seofields/labels/good%20first%20issue) — these are intentionally small and well-scoped.
2. Comment on the issue saying you'd like to tackle it. The maintainer will assign it to you.
3. Fork the repo, make your change, and open a PR. The [Development setup](#development-setup) section below walks you through it.

---

## Development setup

### Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| Sanity Studio | v3, v4, or v5 |

### Fork and clone

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/sanity-plugin-seofields.git
cd sanity-plugin-seofields

# 2. Add the upstream remote so you can pull in future changes
git remote add upstream https://github.com/hardik-143/sanity-plugin-seofields.git
```

### Install dependencies

```bash
npm install
```

### Link the plugin into a local Sanity Studio

The fastest way to test your changes live is to link the plugin into an existing Sanity Studio project on your machine:

```bash
# In the plugin root — build and watch for changes
npm run dev

# In your Sanity Studio project — link the local build
npm link /path/to/sanity-plugin-seofields
```

Then start Sanity Studio normally (`npm run dev` / `sanity dev`) and the studio will pick up your local build. Any file change in the plugin that triggers a rebuild will hot-reload in the studio.

### Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Build in watch mode |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |
| `npm run format` | Run Prettier |

---

## Project structure

```
sanity-plugin-seofields/
├── src/
│   ├── components/       # React components (SERP preview, health dashboard, etc.)
│   ├── schema/          # Sanity schema type definitions (seoFields, openGraph, twitter, etc.)
│   ├── schemas/          # 38 Schema.org type definitions and JSON-LD components
│   ├── cli/              # CLI commands (init, report, doctor, create-config)
│   ├── helpers/          # buildSeoMeta() and other frontend helpers
│   ├── types.ts          # Shared TypeScript types
│   └── index.ts          # Main plugin entry point
├── CHANGELOG.md          # Keep a Changelog format, updated with every release
├── CONTRIBUTING.md       # This file
├── package.json
└── tsconfig.json
```

### Adding a new Schema.org type

Each Schema.org type lives in `src/schema-org/` as a pair of files:

- `{TypeName}.schema.ts` — Sanity schema definition with the correct fields and validation
- `{TypeName}.component.tsx` — React component that renders the `<script type="application/ld+json">` tag

Follow the pattern of an existing type (e.g. `Article`) as your template. The type must be added to the barrel export in `src/schema-org/index.ts` and to the `schemaOrg()` combined helper.

---

## Making changes

### Always branch from `main`

```bash
git checkout main
git pull upstream main
git checkout -b fix/your-fix-name   # or feat/your-feature-name
```

Branch naming conventions:

| Prefix | Use for |
|---|---|
| `fix/` | Bug fixes |
| `feat/` | New features |
| `docs/` | Documentation only |
| `chore/` | Build, config, dependency updates |
| `refactor/` | Code restructuring with no behaviour change |

### TypeScript

- All new code must be written in TypeScript.
- Export any new public-facing types from the appropriate `types/` file.
- Run `npm run type-check` before committing — PRs with TypeScript errors will not be merged.

### Code style

- ESLint and Prettier are configured. Run `npm run lint` and `npm run format` before committing.
- Don't disable lint rules with `// eslint-disable` unless there is no alternative — explain why in a comment if you do.

### Sanity schema compatibility

- All schema changes must work in Sanity Studio **v3, v4, and v5**.
- Do not use any Sanity API that is marked deprecated in v3.
- Test your changes against at least one Studio version before submitting a PR.

---

## Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer — e.g. Closes #12]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `chore` | Build process, dependency, or config changes |
| `test` | Adding or updating tests |

**Examples:**

```
feat(schema-org): add MedicalCondition type

fix(dashboard): correct popover position inside desk panes

Closes #8
```

```
docs(readme): update v5 compatibility note
```

Commits that do not follow this format may be squashed and reworded by the maintainer when merging.

---

## Submitting a pull request

1. Make sure `npm run lint` and `npm run type-check` both pass locally.
2. Push your branch to your fork.
3. Open a PR against `hardik-143/sanity-plugin-seofields` on the `main` branch.
4. Fill in the PR template — describe what changed, why, and how to test it.
5. Link any related issues with `Closes #<issue-number>` in the PR body.

**What to expect:**

- PRs are reviewed within a few days. Complex changes may take longer.
- The maintainer may request changes — please respond to review comments or let us know if you need help.
- Once approved, the maintainer will squash-merge the PR into `main`.
- Your contribution will appear in the next [CHANGELOG.md](./CHANGELOG.md) entry and release.

### PR checklist

Before marking your PR as ready for review, confirm:

- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] Changes tested against Sanity Studio locally
- [ ] New public APIs are exported from the correct entry point
- [ ] Docs updated if behaviour changed (or a docs follow-up issue opened)
- [ ] Commit messages follow the Conventional Commits format

---

## Changelog

This project uses [Keep a Changelog](https://keepachangelog.com/) format and [Semantic Versioning](https://semver.org/).

You do **not** need to update `CHANGELOG.md` in your PR — the maintainer handles this before each release. However, if your change is significant (new feature, breaking change, or important fix), briefly describe it in your PR description so it's easy to write up accurately.

---

## License

By contributing to sanity-plugin-seofields, you agree that your contributions will be licensed under the [MIT License](./LICENSE) that covers this project.

---

Questions? Open a [GitHub Discussion](https://github.com/hardik-143/sanity-plugin-seofields/discussions) or reach out via the [docs site](https://sanity-plugin-seofields.thehardik.in).