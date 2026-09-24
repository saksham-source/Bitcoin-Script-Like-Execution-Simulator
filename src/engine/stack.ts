import { StackValue, cloneStack } from './types';

export class StackUnderflowError extends Error {
  public readonly required: number;
  public readonly available: number;
  public readonly opcode: string;

  constructor(opcode: string, required: number, available: number) {
    super(
      `${opcode} requires ${required} stack ${required === 1 ? 'value' : 'values'}, but only ${available} ${available === 1 ? 'is' : 'are'} available.`
    );
    this.name = 'StackUnderflowError';
    this.opcode = opcode;
    this.required = required;
    this.available = available;
  }
}

/**
 * ScriptStack encapsulates stack operations with underflow protection
 * and immutable snapshot generation.
 */
export class ScriptStack {
  private items: StackValue[] = [];

  constructor(initialItems: StackValue[] = []) {
    this.items = cloneStack(initialItems);
  }

  /**
   * Push an item onto the top of the stack.
   */
  public push(item: StackValue): void {
    this.items.push({ ...item });
  }

  /**
   * Pop the top item from the stack.
   * Throws StackUnderflowError if stack is empty.
   */
  public pop(opcode = 'POP'): StackValue {
    if (this.items.length === 0) {
      throw new StackUnderflowError(opcode, 1, 0);
    }
    return this.items.pop()!;
  }

  /**
   * Peek at the top item without removing it.
   */
  public peek(): StackValue | undefined {
    if (this.items.length === 0) {
      return undefined;
    }
    const top = this.items[this.items.length - 1];
    return { ...top };
  }

  /**
   * Returns current count of items on the stack.
   */
  public size(): number {
    return this.items.length;
  }

  /**
   * Returns true if stack is empty.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Reset/clear the stack.
   */
  public clear(): void {
    this.items = [];
  }

  /**
   * Ensure the stack contains at least `required` items before executing an opcode.
   */
  public assertMinItems(required: number, opcode: string): void {
    if (this.items.length < required) {
      throw new StackUnderflowError(opcode, required, this.items.length);
    }
  }

  /**
   * Returns an immutable, deep-cloned snapshot of the current stack items.
   * Index 0 is bottom of stack, Index [length - 1] is top of stack.
   */
  public getSnapshot(): StackValue[] {
    return cloneStack(this.items);
  }
}
