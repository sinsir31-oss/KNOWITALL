/**
 * Run: npm run demo
 * No API keys, external APIs, network requests, file writes, or model calls.
 */
import { createProfile, profileContext } from '../src/profiles.mjs';
import { createTaskRunner } from '../src/task-runner.mjs';

const localNotes = [];
const principal = { id: 'local-developer', role: 'owner' };

const runner = createTaskRunner({
  'text.word_count': {
    effect: 'read',
    execute: async ({ text }) => ({
      words: typeof text === 'string' && text.trim()
        ? text.trim().split(/\s+/).length : 0
    })
  },
  'notes.save_demo': {
    effect: 'write',
    execute: async ({ title, body }, { idempotencyKey }) => {
      // This sample writes to a local in-memory array only.
      const note = { title, body, idempotencyKey };
      localNotes.push(note);
      return { savedInMemory: true, count: localNotes.length };
    }
  }
});

const profile = createProfile({
  name: 'Local Demo KIA',
  description: 'Offline example workflow',
  instructions: 'Count the words in an example and create a mock note.'
});

console.log(profileContext(profile));
const task = runner.createTask(principal, {
  title: 'Offline example mission',
  steps: [
    { tool: 'text.word_count', input: { text: 'Built to Help. Built to Last.' } },
    { tool: 'notes.save_demo', input: { title: 'Example', body: 'Hello from KNOWITALL.' } }
  ]
});

await runner.runNext(principal, task.id); // Run read-only step.
const pending = await runner.runNext(principal, task.id); // Write pauses.
if (pending.status !== 'awaiting_approval') throw new Error('approval_gate_failed');
console.log('Write paused for explicit approval (local demo only).');

const writeStep = pending.steps.find(s => s.effect === 'write');
runner.approveWrite(principal, task.id, writeStep.id);
const completed = await runner.runNext(principal, task.id);

console.log('Final task:', completed.status);
console.log('Local execution receipts:', JSON.stringify(
  completed.steps.map(step => step.receipt), null, 2
));
console.log('No remote KIA, model, or production system was contacted.');
