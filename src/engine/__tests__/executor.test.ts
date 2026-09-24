import { describe, it, expect } from 'vitest';
import { executeScript, ScriptSimulator } from '../executor';
import { formatStack } from '../types';

describe('Phase 5: Execution Lifecycle and Trace System', () => {
  it('correctly executes the primary working example with full trace', () => {
    const script = `
      PUSH 5
      PUSH 3
      ADD
      PUSH 8
      EQUAL
    `;

    const result = executeScript(script);

    expect(result.status).toBe('VALID');
    expect(result.finalStack).toEqual([{ type: 'boolean', value: true }]);
    expect(result.trace).toHaveLength(6); // Step 0 to Step 5

    // Verify trace states
    expect(result.trace[0]).toMatchObject({
      step: 0,
      instruction: 'Initial',
      status: 'INITIAL',
    });
    expect(formatStack(result.trace[0].stackAfter)).toBe('[]');

    expect(result.trace[1]).toMatchObject({
      step: 1,
      instruction: 'PUSH 5',
      opcode: 'PUSH',
      status: 'OK',
    });
    expect(formatStack(result.trace[1].stackAfter)).toBe('[5]');

    expect(result.trace[2]).toMatchObject({
      step: 2,
      instruction: 'PUSH 3',
      opcode: 'PUSH',
      status: 'OK',
    });
    expect(formatStack(result.trace[2].stackAfter)).toBe('[5, 3]');

    expect(result.trace[3]).toMatchObject({
      step: 3,
      instruction: 'ADD',
      opcode: 'ADD',
      status: 'OK',
    });
    expect(formatStack(result.trace[3].stackAfter)).toBe('[8]');

    expect(result.trace[4]).toMatchObject({
      step: 4,
      instruction: 'PUSH 8',
      opcode: 'PUSH',
      status: 'OK',
    });
    expect(formatStack(result.trace[4].stackAfter)).toBe('[8, 8]');

    expect(result.trace[5]).toMatchObject({
      step: 5,
      instruction: 'EQUAL',
      opcode: 'EQUAL',
      status: 'OK',
    });
    expect(formatStack(result.trace[5].stackAfter)).toBe('[TRUE]');
  });

  it('evaluates equality mismatch as INVALID with [FALSE] on stack', () => {
    const script = `
      PUSH 5
      PUSH 3
      EQUAL
    `;

    const result = executeScript(script);
    expect(result.status).toBe('INVALID');
    expect(result.finalStack).toEqual([{ type: 'boolean', value: false }]);
    expect(result.summary).toContain('falsy');
  });

  it('halts with INVALID on runtime stack underflow', () => {
    const script = `
      PUSH 5
      ADD
    `;

    const result = executeScript(script);
    expect(result.status).toBe('INVALID');
    expect(result.error?.category).toBe('STACK_UNDERFLOW');
    expect(result.trace[result.trace.length - 1].status).toBe('ERROR');
  });

  it('supports interactive step-by-step execution matching runAll', () => {
    const script = `
      PUSH 10
      PUSH 20
      ADD
    `;

    const simStep = new ScriptSimulator(script);
    expect(simStep.getStatus()).toBe('READY');
    expect(simStep.getCurrentStepIndex()).toBe(0);

    // Step 1: PUSH 10
    const step1 = simStep.step();
    expect(step1.done).toBe(false);
    expect(simStep.getStack()).toEqual([{ type: 'number', value: 10 }]);

    // Step 2: PUSH 20
    const step2 = simStep.step();
    expect(step2.done).toBe(false);
    expect(simStep.getStack()).toEqual([
      { type: 'number', value: 10 },
      { type: 'number', value: 20 },
    ]);

    // Step 3: ADD
    const step3 = simStep.step();
    expect(step3.done).toBe(true);
    expect(step3.result?.status).toBe('VALID');
    expect(simStep.getStack()).toEqual([{ type: 'number', value: 30 }]);
  });

  it('resets cleanly back to ready state', () => {
    const script = `
      PUSH 5
      PUSH 5
      EQUAL
    `;

    const sim = new ScriptSimulator(script);
    sim.runAll();
    expect(sim.getStatus()).toBe('COMPLETED');
    expect(sim.getStack().length).toBe(1);

    sim.reset();
    expect(sim.getStatus()).toBe('READY');
    expect(sim.getStack()).toEqual([]);
    expect(sim.getCurrentStepIndex()).toBe(0);
    expect(sim.getTrace().length).toBe(1); // Only Initial step
  });

  it('ensures execution is 100% deterministic across multiple runs', () => {
    const script = `
      PUSH 2
      PUSH 4
      ADD
      PUSH 6
      EQUAL
    `;

    const run1 = executeScript(script);
    const run2 = executeScript(script);

    expect(run1).toEqual(run2);
  });
});
