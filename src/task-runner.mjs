/**
 * Offline, in-memory KIA task runner example.
 * This is NOT an authentication system, production job queue or trusted audit log.
 * The host must authenticate principals and register trusted adapters server-side.
 */
import { randomUUID } from 'node:crypto';

const copy = (value) => structuredClone(value);
const now = () => new Date().toISOString();
const effects = new Set(['read', 'write']);

function principalId(principal) {
  if (!principal || typeof principal.id !== 'string' || !principal.id.trim()) {
    throw new Error('access_denied');
  }
  return principal.id;
}

function checkText(value, max) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new Error('invalid_text');
  }
  return value.trim();
}

/**
 * @param {Record<string,{effect:'read'|'write',execute:(input:unknown,ctx:object)=>Promise<unknown>|unknown}>} adapters
 */
export function createTaskRunner(adapters = {}) {
  const registry = new Map();
  for (const [name, adapter] of Object.entries(adapters)) {
    if (!/^[a-z][a-z0-9_.-]{0,63}$/.test(name) ||
        !adapter || !effects.has(adapter.effect) ||
        typeof adapter.execute !== 'function') {
      throw new Error('invalid_adapter');
    }
    registry.set(name, Object.freeze({ effect: adapter.effect, execute: adapter.execute }));
  }

  const tasks = new Map();
  const log = (task, event, detail = {}) =>
    task.events.push({ at: now(), event, ...detail });
  function owned(principal, taskId) {
    const id = principalId(principal);
    const task = tasks.get(taskId);
    if (!task || task.ownerId !== id) throw new Error('access_denied');
    return task;
  }

  return Object.freeze({
    createTask(principal, request) {
      const ownerId = principalId(principal);
      const title = checkText(request?.title, 200);
      if (!Array.isArray(request?.steps) || request.steps.length < 1 ||
          request.steps.length > 20) throw new Error('invalid_steps');
      const steps = request.steps.map((step) => {
        const name = checkText(step?.tool, 64);
        const adapter = registry.get(name);
        if (!adapter) throw new Error('unknown_tool');
        const input = copy(step.input ?? {});
        return { id: randomUUID(), tool: name, effect: adapter.effect, input,
          status: 'pending', approved: false, approval: null, receipt: null };
      });
      const task = {
        id: randomUUID(), ownerId, title, status: 'queued',
        createdAt: now(), steps, events: []
      };
      log(task, 'task_created');
      tasks.set(task.id, task);
      return copy(task);
    },

    getTask(principal, taskId) {
      return copy(owned(principal, taskId));
    },

    listTasks(principal) {
      const ownerId = principalId(principal);
      return copy([...tasks.values()].filter(t => t.ownerId === ownerId));
    },

    approveWrite(principal, taskId, stepId) {
      const task = owned(principal, taskId);
      // Role must be asserted by a trusted host, never accepted from a client.
      if (principal.role !== 'owner') throw new Error('approval_denied');
      const step = task.steps.find(s => s.id === stepId);
      if (!step || step.effect !== 'write' || step.status !== 'awaiting_approval' ||
          task.status !== 'awaiting_approval') throw new Error('approval_not_pending');
      step.approved = true;
      step.approval = { by: principal.id, at: now() };
      step.status = 'pending';
      task.status = 'queued';
      log(task, 'write_approved', { stepId });
      return copy(task);
    },

    async runNext(principal, taskId) {
      const task = owned(principal, taskId);
      if (['completed', 'failed', 'running', 'cancelled'].includes(task.status)) {
        throw new Error('task_not_runnable');
      }
      const step = task.steps.find(s => s.status !== 'completed');
      if (!step) throw new Error('task_not_runnable');

      const adapter = registry.get(step.tool);
      if (!adapter || adapter.effect !== step.effect) throw new Error('invalid_adapter');
      if (step.effect === 'write' && !step.approved) {
        step.status = 'awaiting_approval';
        task.status = 'awaiting_approval';
        log(task, 'write_approval_requested', { stepId: step.id });
        return copy(task);
      }

      const startedAt = now();
      const start = performance.now();
      task.status = 'running';
      step.status = 'running';
      log(task, 'step_started', { stepId: step.id, tool: step.tool });
      try {
        const result = await adapter.execute(copy(step.input), {
          idempotencyKey: step.id,
          taskId: task.id,
          ownerId: task.ownerId
        });
        step.receipt = {
          stepId: step.id,
          tool: step.tool,
          effect: step.effect,
          outcome: 'completed',
          startedAt, finishedAt: now(),
          durationMs: Math.max(0, Math.round(performance.now() - start)),
          costUsd: null, // Unknown without external billing evidence.
          result: copy(result ?? null)
        };
        step.status = 'completed';
        log(task, 'step_completed', { stepId: step.id });
        task.status = task.steps.every(s => s.status === 'completed')
          ? 'completed' : 'queued';
      } catch {
        // Adapter error details may contain sensitive data: avoid exposing them.
        step.status = 'failed';
        task.status = 'failed';
        step.receipt = {
          stepId: step.id, tool: step.tool, effect: step.effect,
          outcome: 'failed', startedAt, finishedAt: now(),
          durationMs: Math.max(0, Math.round(performance.now() - start)),
          costUsd: null, error: 'adapter_failed'
        };
        log(task, 'step_failed', { stepId: step.id });
      }
      return copy(task);
    }
  });
}
