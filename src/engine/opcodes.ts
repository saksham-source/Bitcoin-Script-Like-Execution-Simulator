import { Instruction, OpcodeName, ExecutionError, formatStackValue } from './types';
import { ScriptStack, StackUnderflowError } from './stack';

export interface OpcodeExecutionResult {
  success: boolean;
  explanation: string;
  error?: ExecutionError;
}

export interface OpcodeDefinition {
  name: OpcodeName;
  description: string;
  educationalSummary: string;
  inputDescription: string;
  outputDescription: string;
  requiredStackSize: number;
  execute: (instruction: Instruction, stack: ScriptStack) => OpcodeExecutionResult;
}

export const OPCODE_REGISTRY: Record<OpcodeName, OpcodeDefinition> = {
  PUSH: {
    name: 'PUSH',
    description: 'Pushes a numeric constant onto the stack.',
    educationalSummary: 'Takes a number provided in the script and places it onto the top of the stack.',
    inputDescription: 'Script constant (e.g. 5)',
    outputDescription: 'Places value on top of stack',
    requiredStackSize: 0,
    execute: (instruction, stack) => {
      if (instruction.arg === undefined) {
        return {
          success: false,
          explanation: 'PUSH missing argument',
          error: {
            category: 'MISSING_ARGUMENT',
            message: `Line ${instruction.line}: PUSH requires one numeric value.`,
            line: instruction.line,
            instruction: instruction.raw,
          },
        };
      }

      stack.push({ type: 'number', value: instruction.arg });
      return {
        success: true,
        explanation: `Pushed ${instruction.arg} onto the stack.`,
      };
    },
  },

  ADD: {
    name: 'ADD',
    description: 'Pops top two numbers, adds them, and pushes the sum.',
    educationalSummary: 'Takes the top two numbers from the stack, adds them together, and puts the result back on top.',
    inputDescription: 'Top 2 numeric values on stack',
    outputDescription: 'Pushes sum of top two values',
    requiredStackSize: 2,
    execute: (instruction, stack) => {
      try {
        stack.assertMinItems(2, 'ADD');
      } catch (err) {
        const underflow = err as StackUnderflowError;
        return {
          success: false,
          explanation: 'Stack underflow on ADD',
          error: {
            category: 'STACK_UNDERFLOW',
            message: `Line ${instruction.line}: ${underflow.message}`,
            line: instruction.line,
            instruction: instruction.raw,
          },
        };
      }

      const val2 = stack.pop('ADD');
      const val1 = stack.pop('ADD');

      if (val1.type !== 'number' || val2.type !== 'number') {
        // Restore stack if type check fails
        stack.push(val1);
        stack.push(val2);
        return {
          success: false,
          explanation: 'Type mismatch on ADD',
          error: {
            category: 'TYPE_ERROR',
            message: `Line ${instruction.line}: ADD requires numeric values on top of the stack, but found ${val1.type} (${formatStackValue(val1)}) and ${val2.type} (${formatStackValue(val2)}).`,
            line: instruction.line,
            instruction: instruction.raw,
          },
        };
      }

      const sum = val1.value + val2.value;
      stack.push({ type: 'number', value: sum });

      return {
        success: true,
        explanation: `Popped ${val2.value} and ${val1.value}, added them, and pushed ${sum}.`,
      };
    },
  },

  EQUAL: {
    name: 'EQUAL',
    description: 'Pops top two values, compares them, and pushes TRUE or FALSE.',
    educationalSummary: 'Pops the top two values, checks if they are equal, and pushes TRUE if equal, FALSE otherwise.',
    inputDescription: 'Top 2 values on stack',
    outputDescription: 'Pushes TRUE if values are equal, FALSE otherwise',
    requiredStackSize: 2,
    execute: (instruction, stack) => {
      try {
        stack.assertMinItems(2, 'EQUAL');
      } catch (err) {
        const underflow = err as StackUnderflowError;
        return {
          success: false,
          explanation: 'Stack underflow on EQUAL',
          error: {
            category: 'STACK_UNDERFLOW',
            message: `Line ${instruction.line}: ${underflow.message}`,
            line: instruction.line,
            instruction: instruction.raw,
          },
        };
      }

      const val2 = stack.pop('EQUAL');
      const val1 = stack.pop('EQUAL');

      const isEqual = val1.type === val2.type && val1.value === val2.value;
      stack.push({ type: 'boolean', value: isEqual });

      return {
        success: true,
        explanation: `Popped ${formatStackValue(val2)} and ${formatStackValue(val1)}, compared equality, and pushed ${isEqual ? 'TRUE' : 'FALSE'}.`,
      };
    },
  },

  VERIFY: {
    name: 'VERIFY',
    description: 'Pops top value and verifies that it is truthy. Fails if false or zero.',
    educationalSummary: 'Checks spending conditions: pops the top value and halts execution with failure if it is FALSE or 0.',
    inputDescription: 'Top 1 value on stack',
    outputDescription: 'Removes top value if TRUE; fails transaction if FALSE',
    requiredStackSize: 1,
    execute: (instruction, stack) => {
      try {
        stack.assertMinItems(1, 'VERIFY');
      } catch (err) {
        const underflow = err as StackUnderflowError;
        return {
          success: false,
          explanation: 'Stack underflow on VERIFY',
          error: {
            category: 'STACK_UNDERFLOW',
            message: `Line ${instruction.line}: ${underflow.message}`,
            line: instruction.line,
            instruction: instruction.raw,
          },
        };
      }

      const top = stack.pop('VERIFY');
      const isTruthy = top.type === 'boolean' ? top.value : top.value !== 0;

      if (!isTruthy) {
        return {
          success: false,
          explanation: 'VERIFY condition failed',
          error: {
            category: 'VERIFY_FAILED',
            message: `Line ${instruction.line}: VERIFY failed: top stack value evaluated to FALSE (${formatStackValue(top)}). Spending condition was not satisfied.`,
            line: instruction.line,
            instruction: instruction.raw,
          },
        };
      }

      return {
        success: true,
        explanation: `Popped ${formatStackValue(top)} and verified condition is satisfied (TRUE).`,
      };
    },
  },
};
