import { describe, it, expect } from 'vitest';
import { ScriptStack } from '../stack';
import { OPCODE_REGISTRY } from '../opcodes';

describe('Phase 4: Opcode Execution Engine', () => {
  it('executes PUSH correctly', () => {
    const stack = new ScriptStack();
    const result = OPCODE_REGISTRY.PUSH.execute(
      { index: 0, line: 1, opcode: 'PUSH', raw: 'PUSH 5', arg: 5 },
      stack
    );

    expect(result.success).toBe(true);
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toEqual({ type: 'number', value: 5 });
  });

  it('executes ADD correctly for numbers', () => {
    const stack = new ScriptStack([
      { type: 'number', value: 5 },
      { type: 'number', value: 3 },
    ]);

    const result = OPCODE_REGISTRY.ADD.execute(
      { index: 0, line: 2, opcode: 'ADD', raw: 'ADD' },
      stack
    );

    expect(result.success).toBe(true);
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toEqual({ type: 'number', value: 8 });
  });

  it('fails ADD on type mismatch', () => {
    const stack = new ScriptStack([
      { type: 'number', value: 5 },
      { type: 'boolean', value: true },
    ]);

    const result = OPCODE_REGISTRY.ADD.execute(
      { index: 0, line: 2, opcode: 'ADD', raw: 'ADD' },
      stack
    );

    expect(result.success).toBe(false);
    expect(result.error?.category).toBe('TYPE_ERROR');
    expect(result.error?.message).toContain('ADD requires numeric values');
  });

  it('executes EQUAL to true when values match', () => {
    const stack = new ScriptStack([
      { type: 'number', value: 8 },
      { type: 'number', value: 8 },
    ]);

    const result = OPCODE_REGISTRY.EQUAL.execute(
      { index: 0, line: 3, opcode: 'EQUAL', raw: 'EQUAL' },
      stack
    );

    expect(result.success).toBe(true);
    expect(stack.peek()).toEqual({ type: 'boolean', value: true });
  });

  it('executes EQUAL to false when values differ', () => {
    const stack = new ScriptStack([
      { type: 'number', value: 8 },
      { type: 'number', value: 3 },
    ]);

    const result = OPCODE_REGISTRY.EQUAL.execute(
      { index: 0, line: 3, opcode: 'EQUAL', raw: 'EQUAL' },
      stack
    );

    expect(result.success).toBe(true);
    expect(stack.peek()).toEqual({ type: 'boolean', value: false });
  });

  it('executes VERIFY correctly for truthy and falsy values', () => {
    const stackTrue = new ScriptStack([{ type: 'boolean', value: true }]);
    const resultTrue = OPCODE_REGISTRY.VERIFY.execute(
      { index: 0, line: 1, opcode: 'VERIFY', raw: 'VERIFY' },
      stackTrue
    );
    expect(resultTrue.success).toBe(true);
    expect(stackTrue.size()).toBe(0);

    const stackFalse = new ScriptStack([{ type: 'boolean', value: false }]);
    const resultFalse = OPCODE_REGISTRY.VERIFY.execute(
      { index: 0, line: 2, opcode: 'VERIFY', raw: 'VERIFY' },
      stackFalse
    );
    expect(resultFalse.success).toBe(false);
    expect(resultFalse.error?.category).toBe('VERIFY_FAILED');
  });

  it('executes the full working example sequence correctly', () => {
    const stack = new ScriptStack();

    // 1. PUSH 5
    OPCODE_REGISTRY.PUSH.execute({ index: 0, line: 1, opcode: 'PUSH', raw: 'PUSH 5', arg: 5 }, stack);
    // 2. PUSH 3
    OPCODE_REGISTRY.PUSH.execute({ index: 1, line: 2, opcode: 'PUSH', raw: 'PUSH 3', arg: 3 }, stack);
    // 3. ADD
    OPCODE_REGISTRY.ADD.execute({ index: 2, line: 3, opcode: 'ADD', raw: 'ADD' }, stack);
    // 4. PUSH 8
    OPCODE_REGISTRY.PUSH.execute({ index: 3, line: 4, opcode: 'PUSH', raw: 'PUSH 8', arg: 8 }, stack);
    // 5. EQUAL
    OPCODE_REGISTRY.EQUAL.execute({ index: 4, line: 5, opcode: 'EQUAL', raw: 'EQUAL' }, stack);

    expect(stack.size()).toBe(1);
    expect(stack.peek()).toEqual({ type: 'boolean', value: true });
  });

  it('executes DUP correctly', () => {
    const stack = new ScriptStack([{ type: 'number', value: 42 }]);
    const res = OPCODE_REGISTRY.DUP.execute(
      { index: 0, line: 1, opcode: 'DUP', raw: 'DUP' },
      stack
    );
    expect(res.success).toBe(true);
    expect(stack.size()).toBe(2);
    expect(stack.pop('T').value).toBe(42);
    expect(stack.pop('T').value).toBe(42);
  });

  it('executes SUB correctly', () => {
    const stack = new ScriptStack([
      { type: 'number', value: 10 },
      { type: 'number', value: 3 },
    ]);
    const res = OPCODE_REGISTRY.SUB.execute(
      { index: 0, line: 1, opcode: 'SUB', raw: 'SUB' },
      stack
    );
    expect(res.success).toBe(true);
    expect(stack.peek()).toEqual({ type: 'number', value: 7 });
  });

  it('executes DROP correctly', () => {
    const stack = new ScriptStack([{ type: 'number', value: 100 }]);
    const res = OPCODE_REGISTRY.DROP.execute(
      { index: 0, line: 1, opcode: 'DROP', raw: 'DROP' },
      stack
    );
    expect(res.success).toBe(true);
    expect(stack.size()).toBe(0);
  });

  it('executes NOT correctly', () => {
    const stack = new ScriptStack([{ type: 'boolean', value: true }]);
    OPCODE_REGISTRY.NOT.execute(
      { index: 0, line: 1, opcode: 'NOT', raw: 'NOT' },
      stack
    );
    expect(stack.peek()).toEqual({ type: 'boolean', value: false });
  });

  it('executes EQUALVERIFY correctly for matching and non-matching', () => {
    const stackMatch = new ScriptStack([
      { type: 'number', value: 50 },
      { type: 'number', value: 50 },
    ]);
    const resMatch = OPCODE_REGISTRY.EQUALVERIFY.execute(
      { index: 0, line: 1, opcode: 'EQUALVERIFY', raw: 'EQUALVERIFY' },
      stackMatch
    );
    expect(resMatch.success).toBe(true);
    expect(stackMatch.size()).toBe(0);

    const stackDiff = new ScriptStack([
      { type: 'number', value: 50 },
      { type: 'number', value: 99 },
    ]);
    const resDiff = OPCODE_REGISTRY.EQUALVERIFY.execute(
      { index: 0, line: 1, opcode: 'EQUALVERIFY', raw: 'EQUALVERIFY' },
      stackDiff
    );
    expect(resDiff.success).toBe(false);
    expect(resDiff.error?.category).toBe('VERIFY_FAILED');
  });
});
