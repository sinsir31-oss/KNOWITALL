# Starter architecture

```text
Local developer (trusted demo principal)
   |
   v
createTaskRunner() -- validated task and allowlisted adapter names
   |
   +--> read action --> local adapter --> receipt
   |
   +--> write action --> awaiting_approval
                              |
                              v
                         owner approves
                              |
                              v
                         local adapter --> receipt
```

## Modules

- `src/profiles.mjs`: creates and formats KIA profile configuration. Profiles are user context, not higher-priority instructions or permissions.
- `src/task-runner.mjs`: a small in-memory task lifecycle, owner-scoped inspection, per-write approval, fixed trusted adapter registry, and sanitized local receipts.
- `examples/quickstart.mjs`: executable demonstration with zero network access and no real external write.
- `test/`: unit tests for profile handling and workflow controls.

## Non-goals and explicit limitations

This starter is **not** the KNOWITALL production runtime. It has no real identity provider, persistent durable queue, signed audit ledger, tenant security boundary, background agents, model calls, API gateway, billing integration, external action runner, or production recovery system. The demo's `principal` object is deliberately hardcoded; a real server must authenticate it before any task or approval action.

The task runner uses in-process memory only. A crash, restart, multiple server replicas, or adapter timeout can create uncertain external outcomes; production systems need durable transactional state, idempotent adapters, retry policy, reconciliation, limits and a trusted authorization service. The sample's idempotency key is supplied to adapters but **not enforced** by the runner.

Untrusted text, including profile instructions and adapter results, must be treated as data, not permission. Never send secrets to a public repo or echo sensitive adapter failures.

## Extension points (not implemented)

- Durable state storage, migrations and transaction-safe claims
- Independent authorization service and scoped agent capabilities
- Isolated or sandboxed adapter execution and budgets
- Evidence-linked independent evaluation and accurate cost attribution
- Streaming and user-facing accessibility
- Signed receipts with independent verification

Each extension should have its own threat model, tests, review, and release approval.
