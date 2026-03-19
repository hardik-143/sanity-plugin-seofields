# Contributing to sanity-plugin-seofields

Thank you for your interest in contributing to the **sanity-plugin-seofields** project! We welcome contributions from the community and appreciate your help in making this Sanity Studio plugin better.

Whether you're fixing a bug, adding a feature, improving documentation, or suggesting enhancements, we're excited to work with you. This guide will help you get started.

---

## Table of Contents

- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing Requirements](#testing-requirements)
- [Git Workflow](#git-workflow)
- [Commit Message Convention](#commit-message-convention)
- [License](#license)

---

## Development Setup

### Prerequisites

- **Node.js** >= 18 (we recommend using [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage versions)
- **npm** or **pnpm** (we use pnpm in this project, but npm works fine too)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/hardik-143/sanity-plugin-seofields.git
cd sanity-plugin-seofields/npm
```

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Available npm Scripts

Once you're in the `npm/` directory, you can use these commands:

| Script | Description |
|--------|-------------|
| `npm run build` | Build the plugin for distribution using `tsup` |
| `npm run watch` | Watch source files and rebuild on changes |
| `npm run link-watch` | Link plugin for development with automatic watching |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier (fixes style issues automatically) |
| `npm run typecheck` | Check TypeScript types without emitting files |

### Development Workflow

1. **Install dependencies**: `npm install`
2. **Make your changes** in the `src/` directory
3. **Watch for changes**: `npm run watch` (in one terminal)
4. **Lint and format**: `npm run lint && npm run format`
5. **Typecheck**: `npm run typecheck`
6. **Build**: `npm run build` (before committing)

---

## Code Style

We maintain consistent code style using **ESLint** and **Prettier** to ensure code quality and readability across the project.

### Configuration Files

- **ESLint Config**: `.eslintrc`
  - Extends: Sanity's ESLint config with React and TypeScript support
  - Plugins: React, React Hooks, Prettier integration
  
- **Prettier Config**: `.prettierrc`
  - Print width: 100 characters
  - Quotes: Single quotes
  - Semicolons: Disabled
  - Bracket spacing: Disabled

### Before Committing

Always run these commands to ensure your code passes linting and formatting checks:

```bash
# Check code style
npm run lint

# Automatically fix formatting issues
npm run format

# Verify TypeScript compilation
npm run typecheck
```

### Style Tips

- Use **TypeScript** for type safety
- Follow React best practices and hooks conventions
- Keep components small and focused
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all imports are used

---

## Testing Requirements

This project uses **Jest** for testing. We encourage writing tests for new features and bug fixes.

### Running Tests

Currently, the project is set up with Jest configuration in `tsconfig.json`. To run tests:

```bash
npm test
# or
npm run test
```

### Writing Tests

- Create test files alongside the code they test (e.g., `MyComponent.test.ts`)
- Use descriptive test names that explain what is being tested
- Aim for good coverage of critical functionality
- Test both happy paths and edge cases

**Example test structure:**

```typescript
import {renderSeoField} from '../src/seoField'

describe('SeoField', () => {
  it('should render meta title input', () => {
    const result = renderSeoField()
    expect(result).toContain('Meta Title')
  })

  it('should validate character limits', () => {
    const result = validateMetaTitle('x'.repeat(161))
    expect(result.valid).toBe(false)
  })
})
```

### Testing Checklist

- [ ] New features have corresponding tests
- [ ] Bug fixes include regression tests
- [ ] All tests pass locally before pushing
- [ ] Test coverage is reasonable for the changes

---

## Git Workflow

We follow a standard fork-and-pull-request workflow to manage contributions.

### Step 1: Fork the Repository

Click the **"Fork"** button on [GitHub](https://github.com/hardik-143/sanity-plugin-seofields) to create your own copy of the repository.

### Step 2: Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/sanity-plugin-seofields.git
cd sanity-plugin-seofields/npm
```

### Step 3: Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/your-bug-fix-name
```

Use descriptive branch names:
- `feature/add-json-ld-support` ✅
- `fix/handle-missing-og-image` ✅
- `docs/improve-readme` ✅
- `feature/123` ❌ (too vague)

### Step 4: Make Your Changes

- Write clean, focused commits
- Keep changes related to one feature/fix per branch
- Run `npm run format && npm run lint` frequently

### Step 5: Push Your Branch

```bash
git push origin feature/your-feature-name
```

### Step 6: Create a Pull Request

1. Go to the original repository on GitHub
2. Click **"New Pull Request"**
3. Select your fork and branch
4. Fill in the PR title and description
5. Submit the PR

### PR Guidelines

- **Title**: Use [Conventional Commits](#commit-message-convention) format
- **Description**: Explain what changes you made and why
- **Link issues**: Reference related issues with `Fixes #123` or `Related to #456`
- **Keep it focused**: One feature/fix per PR
- **Be open to feedback**: We may suggest changes during review

---

## Commit Message Convention

We follow the **Conventional Commits** specification to keep our commit history organized and enable automated changelog generation.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build, dependencies, or maintenance

### Examples

**Bug fix commit:**
```
fix(validation): prevent empty meta descriptions

Previously, the plugin allowed empty meta descriptions.
This commit adds validation to require at least 1 character.

Fixes #38
```

**Documentation commit:**
```
docs: update installation instructions for Sanity v4
```

**Chore commit:**
```
chore(deps): update TypeScript to 5.9.2
```

### Tips

- Be specific and descriptive in your subject line (50 characters max)
- Use imperative mood: "add" not "added" or "adds"
- Wrap the body at 72 characters
- Explain *what* and *why*, not just *what*
- Reference issues when applicable

---

## License

By contributing to this project, you agree that your contributions will be licensed under the **MIT License**. This ensures that your work can be freely used, modified, and distributed while maintaining attribution.

The MIT License is included in the `LICENSE` file at the root of the repository.

---

## Additional Resources

- **Repository**: [GitHub](https://github.com/hardik-143/sanity-plugin-seofields)
- **Sanity Documentation**: [sanity.io/docs](https://www.sanity.io/docs)
- **TypeScript Handbook**: [typescriptlang.org](https://www.typescriptlang.org/docs/)
- **React Documentation**: [react.dev](https://react.dev)

---

## Questions?

If you have questions or need help getting started, feel free to:

- Open a **Discussion** on GitHub
- Open an **Issue** to report bugs or request features
- Reach out via email: [dhardik1430@gmail.com](mailto:dhardik1430@gmail.com)

Thank you for contributing! 🎉
