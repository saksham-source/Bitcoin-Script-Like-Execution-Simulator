import { describe, it, expect } from 'vitest';
import { executeScript, ScriptSimulator } from '../executor';
import { parseScript } from '../parser';
import { formatStack } from '../types';

describe('Phase 8: Evaluation Demo Scenarios Verification', () => {
  // Scenario A: Working example
  it('Scenario A: Working example evaluates to VALID with [TRUE] final stack', () => {
    const script = `
      PUSH 5
      PUSH 3
      ADD
      PUSH 8
      EQUAL
    `;

    const result = executeScript(script);
    expect(result.status).toBe('VALID');
    expect(formatStack(result.finalStack)).toBe('[TRUE]');
    expect(result.error).toBeUndefined();
    expect(result.trace).toHaveLength(6);
  });

  // Scenario B: Equality failure
  it('Scenario B: Equality failure evaluates to INVALID with [FALSE] final stack', () => {
    const script = `
      PUSH 5
      PUSH 3
      EQUAL
    `;

    const result = executeScript(script);
    expect(result.status).toBe('INVALID');
    expect(formatStack(result.finalStack)).toBe('[FALSE]');
    expect(result.summary).toContain('falsy');
  });

  // Scenario C: ADD underflow
  it('Scenario C: ADD underflow halts with clear stack underflow error', () => {
    const script = `ADD`;

    const result = executeScript(script);
    expect(result.status).toBe('INVALID');
    expect(result.error?.category).toBe('STACK_UNDERFLOW');
    expect(result.error?.message).toContain('ADD requires 2 stack values, but only 0 are available.');
  });

  // Scenario D: Invalid opcode
  it('Scenario D: Unknown opcode MAGIC rejected by parser with line number', () => {
    const script = `PUSH 5\nMAGIC`;

    const parseRes = parseScript(script);
    expect(parseRes.success).toBe(false);
    if (parseRes.success) return;

    expect(parseRes.error.category).toBe('UNKNOWN_OPCODE');
    expect(parseRes.error.line).toBe(2);
    expect(parseRes.error.message).toContain("Unknown opcode 'MAGIC'");

    // Full executor call should also reject
    const execRes = executeScript(script);
    expect(execRes.status).toBe('INVALID');
    expect(execRes.error?.category).toBe('UNKNOWN_OPCODE');
  });

  // Scenario E: Missing PUSH argument
  it('Scenario E: Missing PUSH argument rejected by parser with line number', () => {
    const script = `PUSH`;

    const parseRes = parseScript(script);
    expect(parseRes.success).toBe(false);
    if (parseRes.success) return;

    expect(parseRes.error.category).toBe('MISSING_ARGUMENT');
    expect(parseRes.error.line).toBe(1);
    expect(parseRes.error.message).toBe('Line 1: PUSH requires one numeric value.');

    const execRes = executeScript(script);
    expect(execRes.status).toBe('INVALID');
    expect(execRes.error?.category).toBe('MISSING_ARGUMENT');
  });

  // Scenario F: Step-by-step tracing for Scenario A
  it('Scenario F: Step-by-step execution matches exact expected transitions', () => {
    const script = `PUSH 5\nPUSH 3\nADD\nPUSH 8\nEQUAL`;
    const sim = new ScriptSimulator(script);

    // Initial
    expect(formatStack(sim.getStack())).toBe('[]');

    // Step 1: PUSH 5
    sim.step();
    expect(formatStack(sim.getStack())).toBe('[5]');

    // Step 2: PUSH 3
    sim.step();
    expect(formatStack(sim.getStack())).toBe('[5, 3]');

    // Step 3: ADD
    sim.step();
    expect(formatStack(sim.getStack())).toBe('[8]');

    // Step 4: PUSH 8
    sim.step();
    expect(formatStack(sim.getStack())).toBe('[8, 8]');

    // Step 5: EQUAL
    const finalStep = sim.step();
    expect(finalStep.done).toBe(true);
    expect(finalStep.result?.status).toBe('VALID');
    expect(formatStack(sim.getStack())).toBe('[TRUE]');
  });
});
