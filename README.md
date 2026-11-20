# KNOWITALL™ — Open-Source Components

**KNOWITALL™** is part of DLB Labs. This public repository hosts selected, reviewed components that can be shared with developers and contributors.

**Repository status:** Initial open-source foundation. This is **not** the complete deployed myAssistant/KNOWITALL application, its production configuration, or a live KIA workforce.

## What is included

- A small portable KIA profile utility in `src/profiles.mjs` and its Node.js test in `test/profiles.test.mjs`.
- Open-source license and contributor/security guidance.

## Getting started

Requires Node.js 20 or newer. Clone this repository and run:

```bash
npm test
```

The profile utility handles configuration text only. **It does not authenticate users, grant permissions, run agents, connect to services, or authorize any tool calls.** Applications must enforce those controls separately.

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md). Public release boundaries are in [docs/PUBLIC_RELEASE_POLICY.md](docs/PUBLIC_RELEASE_POLICY.md).

## License and brand

Code and documentation published in this repository are licensed under the [MIT License](LICENSE), unless a file explicitly states otherwise. The license does not grant rights to KNOWITALL™, myAssistant, or DLB Labs names, logos, or other trademarks.

Project website: [knowitall.tech](https://knowitall.tech)
