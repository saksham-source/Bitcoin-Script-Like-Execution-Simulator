/**
 * Core Data Models and Types for Bitcoin Script Simulator.
 * Strictly decoupled from UI and React components.
 */

export type StackValueType = 'number' | 'boolean';

export interface NumberStackValue {
  type: 'number';
  value: number;
}

export interface BooleanStackValue {
  type: 'boolean';
  value: boolean;
}

export type StackValue = NumberStackValue | BooleanStackValue;

export type OpcodeName =
  | 'PUSH'
  | 'ADD'
  | 'EQUAL'
  | 'VERIFY'
  | 'DUP'
  | 'SUB'
  | 'DROP'
  | 'NOT'
  | 'EQUALVERIFY';

export interface Instruction {
  index: number;
  line: number;
  opcode: OpcodeName;
  raw: string;
  arg?: number;
}

export type ExecutionStatus = 'IDLE' | 'READY' | 'STEPPING' | 'COMPLETED' | 'ERROR';

export interface TraceEntry {
  step: number;
  instruction: string;
  opcode: string;
  operation: string;
  stackBefore: StackValue[];
  stackAfter: StackValue[];
  status: 'INITIAL' | 'OK' | 'ERROR';
  explanation?: string;
  error?: string;
}

export type ErrorCategory =
  | 'PARSER_ERROR'
  | 'MISSING_ARGUMENT'
  | 'UNKNOWN_OPCODE'
  | 'STACK_UNDERFLOW'
  | 'TYPE_ERROR'
  | 'VERIFY_FAILED';

export interface ExecutionError {
  category: ErrorCategory;
  message: string;
  line?: number;
  instruction?: string;
  step?: number;
  opcode?: string;
}

export interface ExecutionResult {
  status: 'VALID' | 'INVALID';
  finalStack: StackValue[];
  trace: TraceEntry[];
  error?: ExecutionError;
  summary: string;
}

export interface ExecutionState {
  instructions: Instruction[];
  currentStepIndex: number;
  stack: StackValue[];
  trace: TraceEntry[];
  status: ExecutionStatus;
  finalResult: 'VALID' | 'INVALID' | null;
  error: ExecutionError | null;
}

/**
 * Format a single StackValue to string representation (e.g., 5 -> "5", true -> "TRUE")
 */
export function formatStackValue(item: StackValue): string {
  if (item.type === 'boolean') {
    return item.value ? 'TRUE' : 'FALSE';
  }
  return item.value.toString();
}

/**
 * Format a stack array to string representation (e.g., "[5, 3]" or "[]")
 */
export function formatStack(stack: StackValue[]): string {
  return `[${stack.map(formatStackValue).join(', ')}]`;
}

/**
 * Deep clone a stack array to guarantee immutability across traces.
 */
export function cloneStack(stack: StackValue[]): StackValue[] {
  return stack.map((item) => ({ ...item }));
}
