import { describe, it, expect } from 'vitest';
import {
  StackValue,
  TraceEntry,
  ExecutionResult,
  formatStackValue,
  formatStack,
  cloneStack,
} from '../types';

describe('Phase 1: Data Model and Script Representation', () => {
  it('correctly formats numeric and boolean stack values', () => {
    const num: StackValue = { type: 'number', value: 5 };
    const boolTrue: StackValue = { type: 'boolean', value: true };
    const boolFalse: StackValue = { type: 'boolean', value: false };

    expect(formatStackValue(num)).toBe('5');
    expect(formatStackValue(boolTrue)).toBe('TRUE');
    expect(formatStackValue(boolFalse)).toBe('FALSE');
  });

  it('correctly formats an entire stack', () => {
    const stack: StackValue[] = [
      { type: 'number', value: 5 },
      { type: 'number', value: 3 },
    ];
    expect(formatStack(stack)).toBe('[5, 3]');
    expect(formatStack([])).toBe('[]');
  });

  it('ensures stack cloning is immutable (snapshots do not mutate)', () => {
    const original: StackValue[] = [{ type: 'number', value: 5 }];
    const clone = cloneStack(original);

    // Modify original
    original.push({ type: 'number', value: 3 });
    (original[0] as { type: 'number'; value: number }).value = 999;

    expect(clone).toHaveLength(1);
    expect(clone[0].value).toBe(5);
  });

  it('represents a full execution result and trace entry structure', () => {
    const trace: TraceEntry[] = [
      {
        step: 0,
        instruction: 'Initial',
        opcode: 'INITIAL',
        operation: 'Initialize VM',
        stackBefore: [],
        stackAfter: [],
        status: 'INITIAL',
      },
      {
        step: 1,
        instruction: 'PUSH 5',
        opcode: 'PUSH',
        operation: 'Push 5',
        stackBefore: [],
        stackAfter: [{ type: 'number', value: 5 }],
        status: 'OK',
      },
    ];

    const result: ExecutionResult = {
      status: 'VALID',
      finalStack: [{ type: 'boolean', value: true }],
      trace,
      summary: 'Script executed successfully and left TRUE on the stack.',
    };

    expect(result.status).toBe('VALID');
    expect(result.trace).toHaveLength(2);
    expect(result.finalStack[0].type).toBe('boolean');
  });
});
