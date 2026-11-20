# Quickstart: build your first local KIA workflow

This walkthrough runs completely offline. It requires **Node.js 20+** and Git. You do not need credentials, a hosted model, database, billing account, or DLB Labs access.

## 1. Clone and validate

```bash
git clone https://github.com/sinsir31-oss/KNOWITALL.git
cd KNOWITALL
npm test
```

The test suite checks KIA profile validation, task ownership separation, write approvals, receipts, and failed execution handling.

## 2. Run the example

```bash
npm run demo
```

The script will:

1. Construct a local KIA profile.
2. Create a mission with a read-only word-count step.
3. Pause on a mock write action and show `awaiting_approval`.
4. Simulate the local owner approving that action.
5. Save a note to an **in-memory array only** and print local execution receipts.

Nothing is deployed, and no remote models or paid calls run.

## 3. Add an adapter

The sample registers adapters directly in `examples/quickstart.mjs`:

```js
import { createTaskRunner } from './src/task-runner.mjs';

const runner = createTaskRunner({
  'text.uppercase': {
    effect: 'read',
    execute: async ({ value }) => ({ result: String(value).toUpperCase() })
  }
});

const principal = { id: 'local-developer', role: 'owner' };
const task = runner.createTask(principal, {
  title: 'Uppercase demo',
  steps: [{ tool: 'text.uppercase', input: { value: 'Hello' } }]
});
console.log((await runner.runNext(principal, task.id)).steps[0].receipt);
```

Never accept executable adapters or role assertions directly from client requests. For a deployed service, authenticate users in a trusted server and resolve permissions for each action.

## 4. Understand receipts

Receipts include the tool, effect, outcome, local start/end timestamps and measured process duration. The starter sets `costUsd: null` because no billing provider was queried. **Local receipts do not prove externally executed actions** and are not tamper-proof.

## 5. Contribute

Read [CONTRIBUTING.md](../CONTRIBUTING.md), then submit a small PR with a test and a clear description. Review the [public release boundary](PUBLIC_RELEASE_POLICY.md) before copying code from other repositories.
