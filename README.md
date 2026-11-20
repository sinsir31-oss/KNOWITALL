# KNOWITALL™ — Open-Source Developer Starter Kit

**Built to Help. Built to Last.** — DLB Labs

This public repository gives developers a hands-on introduction to reusable **KNOWITALL™ / KIA** concepts. It contains a small, **offline-only** example of task creation, sequential tool steps, explicit write approval and local execution receipts.

> **Scope:** This is a learning starter kit, not the production myAssistant/KNOWITALL app, a hosted KIA service, a live autonomous agent workforce or a copy of DLB Labs' private infrastructure.

## Jump in

Requires **Node.js 20+**. No API keys, paid API calls, database, or account needed.

```bash
git clone https://github.com/sinsir31-oss/KNOWITALL.git
cd KNOWITALL
npm test
npm run demo
```

The demo counts words, pauses for approval, then writes a mock note into local memory and prints a receipt. **It never calls an AI provider or production system.**

## What developers can build on

| Component | Location | What it teaches |
| --- | --- | --- |
| KIA profile utility | [`src/profiles.mjs`](src/profiles.mjs) | Input validation and separating context from authority |
| Task runner | [`src/task-runner.mjs`](src/task-runner.mjs) | Scoped tasks, fixed adapters, approval gates and execution state |
| Runnable demonstration | [`examples/quickstart.mjs`](examples/quickstart.mjs) | End-to-end offline workflow with example receipts |
| Automated tests | [`test/`](test/) | Ownership separation, approval enforcement and failures |
| First-project tutorial | [`docs/QUICKSTART.md`](docs/QUICKSTART.md) | Clone, run and extend your first adapter |
| Architecture and limits | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Understand what is simulated versus what requires production systems |

## Starter workflow

```text
Create task -> run read step -> request write approval
                                    |
                                    v
                             developer approves
                                    |
                                    v
                           run mock write -> receipt
```

Receipts in this example describe **local execution only**. They are not signed or independently verified; `costUsd: null` means cost was not measured. Do not rely on demo principals, in-memory state or simulated approvals for real customer operations.

## Build with us

We welcome focused fixes, examples, tests and documentation. See [CONTRIBUTING.md](CONTRIBUTING.md), [public roadmap](docs/ROADMAP.md) and [public release policy](docs/PUBLIC_RELEASE_POLICY.md). Report vulnerabilities privately per [SECURITY.md](SECURITY.md).

## Licensing and identity

Code and documentation in this repository are provided under the [MIT License](LICENSE), unless otherwise stated. The MIT License does not grant trademark rights to KNOWITALL™, myAssistant or DLB Labs branding.

Project website: [knowitall.tech](https://knowitall.tech)
