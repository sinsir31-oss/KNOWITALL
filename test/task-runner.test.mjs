import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskRunner } from '../src/task-runner.mjs';

const owner = { id: 'owner-1', role: 'owner' };
const other = { id: 'owner-2', role: 'owner' };

test('read step completes, produces local receipt, and has unknown cost', async () => {
  const runner = createTaskRunner({
    echo: { effect: 'read', execute: ({ value }) => ({ value }) }
  });
  const task = runner.createTask(owner, {
    title: 'Read demo', steps: [{ tool: 'echo', input: { value: 'ok' } }]
  });
  const end = await runner.runNext(owner, task.id);
  assert.equal(end.status, 'completed');
  assert.equal(end.steps[0].receipt.result.value, 'ok');
  assert.equal(end.steps[0].receipt.costUsd, null);
  assert.equal(end.events.at(-1).event, 'step_completed');
});

test('write adapter cannot execute without explicit authorized approval', async () => {
  let writes = 0;
  const runner = createTaskRunner({
    save: { effect: 'write', execute: () => ({ writes: ++writes }) }
  });
  const task = runner.createTask(owner, {
    title: 'Write demo', steps: [{ tool: 'save', input: {} }]
  });
  const waiting = await runner.runNext(owner, task.id);
  assert.equal(waiting.status, 'awaiting_approval');
  assert.equal(writes, 0);
  const step = waiting.steps[0];
  assert.throws(() => runner.approveWrite({ id: owner.id, role: 'viewer' },
    task.id, step.id), /approval_denied/);
  assert.throws(() => runner.approveWrite(other, task.id, step.id),
    /access_denied/);
  runner.approveWrite(owner, task.id, step.id);
  const done = await runner.runNext(owner, task.id);
  assert.equal(done.status, 'completed');
  assert.equal(writes, 1);
  assert.equal(done.steps[0].receipt.result.writes, 1);
  await assert.rejects(runner.runNext(owner, task.id), /task_not_runnable/);
});

test('owner separation and unsupported tools fail closed', async () => {
  const runner = createTaskRunner({ safe: { effect: 'read', execute: () => true } });
  const task = runner.createTask(owner, {
    title: 'Safe', steps: [{ tool: 'safe' }]
  });
  assert.throws(() => runner.getTask(other, task.id), /access_denied/);
  await assert.rejects(runner.runNext(other, task.id), /access_denied/);
  assert.throws(() => runner.createTask(owner, {
    title: 'Unknown', steps: [{ tool: 'not_registered' }]
  }), /unknown_tool/);
  assert.throws(() => runner.createTask(owner, {
    title: 'Empty', steps: []
  }), /invalid_steps/);
});

test('execution failure is recorded without leaking adapter error', async () => {
  const runner = createTaskRunner({
    fail: { effect: 'read', execute: () => { throw Error('secret-info'); } }
  });
  const task = runner.createTask(owner, {
    title: 'Failure case', steps: [{ tool: 'fail' }]
  });
  const outcome = await runner.runNext(owner, task.id);
  assert.equal(outcome.status, 'failed');
  assert.equal(outcome.steps[0].receipt.error, 'adapter_failed');
  assert.ok(!JSON.stringify(outcome).includes('secret-info'));
  await assert.rejects(runner.runNext(owner, task.id), /task_not_runnable/);
});

test('a running task refuses concurrent execution', async () => {
  let release;
  const barrier = new Promise(resolve => { release = resolve; });
  const runner = createTaskRunner({
    delay: { effect: 'read', execute: () => barrier }
  });
  const task = runner.createTask(owner, {
    title: 'Running', steps: [{ tool: 'delay' }]
  });
  const executing = runner.runNext(owner, task.id);
  await assert.rejects(runner.runNext(owner, task.id), /task_not_runnable/);
  release({ done: true });
  assert.equal((await executing).status, 'completed');
});
