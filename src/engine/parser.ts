import { Instruction, OpcodeName, ExecutionError } from './types';

export const SUPPORTED_OPCODES: readonly OpcodeName[] = [
  'PUSH',
  'ADD',
  'EQUAL',
  'VERIFY',
  'DUP',
  'SUB',
  'DROP',
  'NOT',
  'EQUALVERIFY',
] as const;

export interface ParseSuccess {
  success: true;
  instructions: Instruction[];
}

export interface ParseFailure {
  success: false;
  error: ExecutionError;
}

export type ParseResult = ParseSuccess | ParseFailure;

/**
 * Parses and validates raw script text into an array of structured Instructions.
 * Preserves 1-based line numbers and generates clear, student-friendly error messages.
 */
export function parseScript(source: string): ParseResult {
  const lines = source.split(/\r?\n/);
  const instructions: Instruction[] = [];
  let instructionIndex = 0;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const rawLine = lines[lineIdx];
    const lineNumber = lineIdx + 1;

    // Remove comments (# or //) if present
    const cleanLine = rawLine.replace(/(\/\/|#).*$/, '').trim();

    if (!cleanLine) {
      continue; // Skip blank or comment-only lines
    }

    // Split tokens by whitespace
    const tokens = cleanLine.split(/\s+/);
    const rawOpcode = tokens[0];
    const normalizedOpcode = rawOpcode.toUpperCase();

    // Check if opcode is supported
    if (!SUPPORTED_OPCODES.includes(normalizedOpcode as OpcodeName)) {
      return {
        success: false,
        error: {
          category: 'UNKNOWN_OPCODE',
          message: `Line ${lineNumber}: Unknown opcode '${rawOpcode}'. Supported opcodes are: ${SUPPORTED_OPCODES.join(', ')}.`,
          line: lineNumber,
          instruction: cleanLine,
        },
      };
    }

    const opcode = normalizedOpcode as OpcodeName;
    const args = tokens.slice(1);

    if (opcode === 'PUSH') {
      if (args.length === 0) {
        return {
          success: false,
          error: {
            category: 'MISSING_ARGUMENT',
            message: `Line ${lineNumber}: PUSH requires one numeric value.`,
            line: lineNumber,
            instruction: cleanLine,
          },
        };
      }

      if (args.length > 1) {
        return {
          success: false,
          error: {
            category: 'PARSER_ERROR',
            message: `Line ${lineNumber}: PUSH takes exactly one argument, but received ${args.length} arguments: '${args.join(' ')}'.`,
            line: lineNumber,
            instruction: cleanLine,
          },
        };
      }

      const numericValue = Number(args[0]);
      if (isNaN(numericValue) || !isFinite(numericValue)) {
        return {
          success: false,
          error: {
            category: 'PARSER_ERROR',
            message: `Line ${lineNumber}: PUSH requires a valid numeric value, got '${args[0]}'.`,
            line: lineNumber,
            instruction: cleanLine,
          },
        };
      }

      instructions.push({
        index: instructionIndex++,
        line: lineNumber,
        opcode: 'PUSH',
        raw: cleanLine,
        arg: numericValue,
      });
    } else {
      // ADD, EQUAL, VERIFY take no inline arguments
      if (args.length > 0) {
        return {
          success: false,
          error: {
            category: 'PARSER_ERROR',
            message: `Line ${lineNumber}: ${opcode} does not take any arguments, but received '${args.join(' ')}'.`,
            line: lineNumber,
            instruction: cleanLine,
          },
        };
      }

      instructions.push({
        index: instructionIndex++,
        line: lineNumber,
        opcode,
        raw: cleanLine,
      });
    }
  }

  return {
    success: true,
    instructions,
  };
}
