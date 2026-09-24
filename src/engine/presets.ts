export interface ScriptPreset {
  id: string;
  name: string;
  description: string;
  expectedResult: 'VALID' | 'INVALID' | 'PARSER_ERROR';
  code: string;
}

export const DEMO_PRESETS: ScriptPreset[] = [
  {
    id: 'demo-1-working',
    name: '1. Standard Arithmetic (VALID)',
    description: 'Working example from lab brief: (5 + 3 == 8) evaluates to TRUE.',
    expectedResult: 'VALID',
    code: `PUSH 5
PUSH 3
ADD
PUSH 8
EQUAL`,
  },
  {
    id: 'demo-2-mismatch',
    name: '2. Equality Failure (INVALID)',
    description: 'Pushes 5 and 3, compares equality: evaluates to FALSE.',
    expectedResult: 'INVALID',
    code: `PUSH 5
PUSH 3
EQUAL`,
  },
  {
    id: 'demo-3-underflow',
    name: '3. Stack Underflow (Error)',
    description: 'Attempts ADD on an empty stack: fails with clear underflow error.',
    expectedResult: 'INVALID',
    code: `ADD`,
  },
  {
    id: 'demo-4-invalid-opcode',
    name: '4. Unknown Opcode (Error)',
    description: 'Contains unknown opcode MAGIC: caught by parser before execution.',
    expectedResult: 'PARSER_ERROR',
    code: `PUSH 5
MAGIC`,
  },
  {
    id: 'demo-5-missing-arg',
    name: '5. Missing Argument (Error)',
    description: 'PUSH instruction missing its numeric value: validation error.',
    expectedResult: 'PARSER_ERROR',
    code: `PUSH`,
  },
  {
    id: 'demo-6-verify',
    name: '6. Opcode VERIFY Check (VALID)',
    description: 'Tests OP_VERIFY: checks that (10 == 10) is true and consumes it.',
    expectedResult: 'VALID',
    code: `PUSH 10
PUSH 10
EQUAL
VERIFY
PUSH 1`,
  },
];
