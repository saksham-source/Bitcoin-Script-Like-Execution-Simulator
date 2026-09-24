import { describe, it, expect } from 'vitest';
import { ScriptStack, StackUnderflowError } from '../stack';

describe('Phase 3: Core Stack Engine', () => {
  it('supports basic push, peek, pop, and size', () => {
    const stack = new ScriptStack();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);

    stack.push({ type: 'number', value: 5 });
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toEqual({ type: 'number', value: 5 });

    stack.push({ type: 'number', value: 3 });
    expect(stack.size()).toBe(2);
    expect(stack.peek()).toEqual({ type: 'number', value: 3 });

    const popped = stack.pop('TEST');
    expect(popped).toEqual({ type: 'number', value: 3 });
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toEqual({ type: 'number', value: 5 });
  });

  it('throws StackUnderflowError when popping from empty stack', () => {
    const stack = new ScriptStack();
    expect(() => stack.pop('POP')).toThrow(StackUnderflowError);
    expect(() => stack.pop('POP')).toThrow('POP requires 1 stack value, but only 0 are available.');
  });

  it('correctly asserts minimum required items and formats clear error', () => {
    const stack = new ScriptStack();
    expect(() => stack.assertMinItems(2, 'ADD')).toThrow(
      'ADD requires 2 stack values, but only 0 are available.'
    );

    stack.push({ type: 'number', value: 10 });
    expect(() => stack.assertMinItems(2, 'ADD')).toThrow(
      'ADD requires 2 stack values, but only 1 is available.'
    );

    stack.push({ type: 'number', value: 20 });
    expect(() => stack.assertMinItems(2, 'ADD')).not.toThrow();
  });

  it('guarantees immutability of snapshots across stack mutations', () => {
    const stack = new ScriptStack();
    stack.push({ type: 'number', value: 5 });
    const snapshot1 = stack.getSnapshot();

    stack.push({ type: 'number', value: 3 });
    const snapshot2 = stack.getSnapshot();

    expect(snapshot1).toHaveLength(1);
    expect(snapshot1[0].value).toBe(5);

    expect(snapshot2).toHaveLength(2);
    expect(snapshot2[0].value).toBe(5);
    expect(snapshot2[1].value).toBe(3);

    // Verify mutating snapshot doesn't affect stack internal
    snapshot1[0].value = 999;
    expect(stack.peek()?.value).toBe(3);
  });

  it('clears stack cleanly', () => {
    const stack = new ScriptStack([{ type: 'number', value: 1 }]);
    expect(stack.size()).toBe(1);
    stack.clear();
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
  });
});
