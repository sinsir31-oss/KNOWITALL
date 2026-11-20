# Public starter-kit roadmap

The items below are **proposed**, not shipped, and are not a statement about DLB Labs' private product status.

## Good first contributions

- Add small, offline, dependency-free example adapters and tests.
- Improve validation and error documentation for sample profile inputs.
- Add accessibility-friendly terminal output for the example.
- Add a test demonstrating receipt redaction and safe error formatting.

## Future community extensions (require review)

- Persistent local task journal with clear recovery semantics
- Policy interface for authorization decisions (without client-trusted roles)
- Structured result validation schemas and constrained adapter outputs
- Simulated model router with no network calls
- Independent offline task grader and evidence attachment format
- Token/cost estimator clearly distinguished from actual usage receipts

## Not on the public roadmap

Founder-only KIA identities/instructions, private DLB Labs infrastructure, unreviewed third-party code, production secrets, customer data, and live privileged endpoints.

See [the release policy](PUBLIC_RELEASE_POLICY.md) for contribution boundaries.
