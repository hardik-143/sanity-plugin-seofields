# Security Policy

Thanks for helping keep `sanity-plugin-seofields` and its users safe.

If you believe you have found a security vulnerability, please **do not open a public GitHub issue**. Report it privately first so there is time to investigate and ship a fix.

---

## Supported versions

Security fixes are currently provided for the latest published major version of the plugin.

| Version                | Supported |
| ---------------------- | --------- |
| `1.x` (latest release) | ✅ Yes    |
| Older releases         | ❌ No     |

If you are running an older release, upgrade to the latest `1.x` version before requesting support.

---

## Reporting a vulnerability

Please email **[hello@thehardik.in](mailto:hello@thehardik.in)** with:

- A clear description of the issue
- The affected package version
- Your Sanity Studio version and Node.js version
- Reproduction steps or a minimal test case
- The impact you expect (for example: XSS, data exposure, privilege escalation, SSRF)
- Any suggested fix or mitigation, if you have one

If possible, include:

- A proof of concept
- Stack traces, logs, or screenshots
- Whether the issue affects Studio runtime, frontend helpers, CLI commands, or Schema.org output

Please avoid sharing the report publicly until a fix or mitigation is available.

---

## What to expect

After a report is received:

1. I will acknowledge receipt as soon as possible.
2. I will investigate and confirm whether the report is a valid vulnerability.
3. If confirmed, I will work on a fix and coordinate a release.
4. Once a fix is available, I may ask you to help verify it.

I appreciate responsible disclosure and will do my best to keep you informed during the process.

---

## Scope

This policy covers security issues in the `npm/` package, including:

- The published `sanity-plugin-seofields` package
- Next.js helpers exported from `sanity-plugin-seofields/next`
- Schema.org helpers exported from `sanity-plugin-seofields/schema` and `sanity-plugin-seofields/schema/next`
- The `seofields` CLI shipped with the package

Non-security bugs, feature requests, and documentation issues should be reported through the normal GitHub issues flow:

- https://github.com/hardik-143/sanity-plugin-seofields/issues
