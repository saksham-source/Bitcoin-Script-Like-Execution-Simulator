import {
  Instruction,
  StackValue,
  TraceEntry,
  ExecutionError,
  ExecutionResult,
  ExecutionStatus,
  formatStackValue,
} from './types';
import { parseScript } from './parser';
import { ScriptStack } from './stack';
import { OPCODE_REGISTRY } from './opcodes';

export class ScriptSimulator {
  private instructions: Instruction[] = [];
  private currentStepIndex: number = 0;
  private stack: ScriptStack;
  private trace: TraceEntry[] = [];
  private status: ExecutionStatus = 'IDLE';
  private error: ExecutionError | null = null;
  private finalResult: ExecutionResult | null = null;
  private rawSource: string = '';

  constructor(source: string = '') {
    this.stack = new ScriptStack();
    if (source) {
      this.loadScript(source);
    }
  }

  /**
   * Load and validate a script, preparing the simulator for execution.
   */
  public loadScript(source: string): { success: boolean; error?: ExecutionError } {
    this.rawSource = source;
    this.stack.clear();
    this.currentStepIndex = 0;
    this.error = null;
    this.finalResult = null;

    const parseResult = parseScript(source);
    if (!parseResult.success) {
      this.instructions = [];
      this.status = 'ERROR';
      this.error = parseResult.error;
      this.trace = [];
      return { success: false, error: parseResult.error };
    }

    this.instructions = parseResult.instructions;
    this.status = 'READY';

    // Record initial step 0 in trace
    this.trace = [
      {
        step: 0,
        instruction: 'Initial',
        opcode: 'INITIAL',
        operation: 'Initialize VM',
        stackBefore: [],
        stackAfter: [],
        status: 'INITIAL',
        explanation: 'Script parsed and initialized with an empty stack.',
      },
    ];

    return { success: true };
  }

  public getInstructions(): Instruction[] {
    return [...this.instructions];
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  public getStack(): StackValue[] {
    return this.stack.getSnapshot();
  }

  public getTrace(): TraceEntry[] {
    return [...this.trace];
  }

  public getStatus(): ExecutionStatus {
    return this.status;
  }

  public getError(): ExecutionError | null {
    return this.error;
  }

  public getFinalResult(): ExecutionResult | null {
    return this.finalResult;
  }

  /**
   * Execute the next single instruction.
   */
  public step(): { done: boolean; entry?: TraceEntry; error?: ExecutionError; result?: ExecutionResult } {
    if (this.status === 'ERROR' || this.status === 'COMPLETED') {
      return { done: true, result: this.finalResult ?? undefined, error: this.error ?? undefined };
    }

    if (this.currentStepIndex >= this.instructions.length) {
      const finalRes = this.evaluateFinalResult();
      return { done: true, result: finalRes };
    }

    this.status = 'STEPPING';
    const instruction = this.instructions[this.currentStepIndex];
    const stackBefore = this.stack.getSnapshot();

    const opcodeDef = OPCODE_REGISTRY[instruction.opcode];
    const execResult = opcodeDef.execute(instruction, this.stack);
    const stackAfter = this.stack.getSnapshot();
    const stepNumber = this.currentStepIndex + 1;

    if (!execResult.success) {
      this.status = 'ERROR';
      this.error = {
        ...execResult.error!,
        step: stepNumber,
        opcode: instruction.opcode,
      };

      const operation =
        instruction.opcode === 'PUSH'
          ? `Push ${instruction.arg}`
          : instruction.opcode === 'ADD'
          ? 'Add top 2 values'
          : instruction.opcode === 'EQUAL'
          ? 'Compare values'
          : 'Verify condition';

      const errorEntry: TraceEntry = {
        step: stepNumber,
        instruction: instruction.raw,
        opcode: instruction.opcode,
        operation,
        stackBefore,
        stackAfter,
        status: 'ERROR',
        explanation: execResult.explanation,
        error: execResult.error?.message,
      };

      this.trace.push(errorEntry);
      this.finalResult = {
        status: 'INVALID',
        finalStack: stackAfter,
        trace: [...this.trace],
        error: this.error,
        summary: `Execution failed at step ${stepNumber} (${instruction.raw}): ${this.error.message}`,
      };

      return { done: true, entry: errorEntry, error: this.error, result: this.finalResult };
    }

    const operation =
      instruction.opcode === 'PUSH'
        ? `Push ${instruction.arg}`
        : instruction.opcode === 'ADD'
        ? 'Add top 2 values'
        : instruction.opcode === 'EQUAL'
        ? 'Compare values'
        : 'Verify condition';

    const okEntry: TraceEntry = {
      step: stepNumber,
      instruction: instruction.raw,
      opcode: instruction.opcode,
      operation,
      stackBefore,
      stackAfter,
      status: 'OK',
      explanation: execResult.explanation,
    };

    this.trace.push(okEntry);
    this.currentStepIndex++;

    if (this.currentStepIndex >= this.instructions.length) {
      const finalRes = this.evaluateFinalResult();
      return { done: true, entry: okEntry, result: finalRes };
    }

    return { done: false, entry: okEntry };
  }

  /**
   * Jump directly to a historical step (0 to instructions.length).
   * Replays cleanly to guarantee deterministic state.
   */
  public jumpToStep(targetStepNumber: number): void {
    if (targetStepNumber < 0 || targetStepNumber > this.instructions.length) {
      return;
    }
    // Reset to step 0
    this.reset();
    for (let i = 0; i < targetStepNumber; i++) {
      const { done } = this.step();
      if (done) break;
    }
  }

  /**
   * Step backward one instruction in execution history.
   */
  public stepBack(): void {
    if (this.currentStepIndex > 0) {
      this.jumpToStep(this.currentStepIndex - 1);
    }
  }

  public canStepBack(): boolean {
    return this.currentStepIndex > 0;
  }

  public canStepForward(): boolean {
    return this.currentStepIndex < this.instructions.length && this.status !== 'ERROR' && this.status !== 'COMPLETED';
  }

  /**
   * Execute all remaining instructions until completion or error.
   */
  public runAll(): ExecutionResult {
    if (this.status === 'ERROR' && this.finalResult) {
      return this.finalResult;
    }

    while (this.currentStepIndex < this.instructions.length && this.status !== 'ERROR') {
      const { done } = this.step();
      if (done) break;
    }

    if (!this.finalResult) {
      this.finalResult = this.evaluateFinalResult();
    }

    return this.finalResult;
  }

  /**
   * Reset the simulator back to its initial ready state.
   */
  public reset(): void {
    if (this.rawSource) {
      this.loadScript(this.rawSource);
    } else {
      this.stack.clear();
      this.instructions = [];
      this.currentStepIndex = 0;
      this.trace = [];
      this.status = 'IDLE';
      this.error = null;
      this.finalResult = null;
    }
  }

  /**
   * Evaluate whether the completed script satisfies Bitcoin spending rules.
   */
  private evaluateFinalResult(): ExecutionResult {
    this.status = 'COMPLETED';
    const finalStack = this.stack.getSnapshot();

    if (finalStack.length === 0) {
      this.finalResult = {
        status: 'INVALID',
        finalStack,
        trace: [...this.trace],
        summary: 'Script executed to completion but left an empty stack. A valid transaction requires a truthy top value.',
      };
      return this.finalResult;
    }

    const top = finalStack[finalStack.length - 1];
    const isTruthy = top.type === 'boolean' ? top.value : top.value !== 0;

    if (isTruthy) {
      this.finalResult = {
        status: 'VALID',
        finalStack,
        trace: [...this.trace],
        summary: `Script executed successfully. Top stack value is ${formatStackValue(top)} (truthy). Spending condition satisfied.`,
      };
    } else {
      this.finalResult = {
        status: 'INVALID',
        finalStack,
        trace: [...this.trace],
        summary: `Script executed, but top stack value is ${formatStackValue(top)} (falsy). Spending condition not satisfied.`,
      };
    }

    return this.finalResult;
  }
}

/**
 * Convenient standalone helper to parse and execute a script completely in one call.
 */
export function executeScript(source: string): ExecutionResult {
  const simulator = new ScriptSimulator();
  const loadResult = simulator.loadScript(source);

  if (!loadResult.success) {
    return {
      status: 'INVALID',
      finalStack: [],
      trace: [],
      error: loadResult.error,
      summary: `Script validation failed: ${loadResult.error?.message}`,
    };
  }

  return simulator.runAll();
}
