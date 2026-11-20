# Public release boundary

KNOWITALL's public repository is for explicitly reviewed, reusable source code, tests and developer documentation. It is **not** a mirror of DLB Labs' private production repositories.

## Suitable for publication after review

- Standalone modules with no private runtime dependencies
- Generic tests, examples and public-facing architecture explanations
- Documentation, issue templates and contributor tools
- Open-source dependencies with compatible redistribution licenses and required notices

## Never publish in this repository

- API keys, OAuth secrets, signing keys, passwords, tokens or `.env` values
- Private repositories wholesale, production deployment configs or privileged internal endpoints
- Customer data, conversation history, user memory, payment information or internal investigation evidence
- Founder-only identity rules, sensitive KIA instructions, internal security findings or secret operational telemetry
- Proprietary/vendor code unless redistribution rights are confirmed

## Required review before copying code from internal repositories

1. Confirm ownership and any third-party license obligations.
2. Inspect code and history for embedded secrets, private URLs and sensitive data.
3. Remove production coupling and replace sensitive examples with fixtures.
4. Run available tests and static checks on a clean checkout.
5. Review the exact diff before publishing it to the public default branch.

**Important:** A `.gitignore` file does not protect secrets already committed. Assume public Git history may be copied permanently; rotate any exposed credentials.

## Release and deployment distinction

Public commits are code publication, **not** authorization to deploy production, expand KIA privileges, access customer systems, spend money or change the private infrastructure. Those actions keep their independent approval gates.
