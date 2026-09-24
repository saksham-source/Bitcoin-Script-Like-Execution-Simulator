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
    name: 'Demo 1: Main Working Example (VALID)',
    description: 'Assignment working example: (5 + 3 == 8) evaluates to TRUE and VALID.',
    expectedResult: 'VALID',
    code: `PUSH 5
PUSH 3
ADD
PUSH 8
EQUAL`,
  },
  {
    id: 'demo-2-arithmetic-variation',
    name: 'Demo 2: Arithmetic Variation (VALID)',
    description: 'Chained arithmetic: (10 + 25 == 35) evaluates to TRUE.',
    expectedResult: 'VALID',
    code: `PUSH 10
PUSH 25
ADD
PUSH 35
EQUAL`,
  },
  {
    id: 'demo-3-equality-failure',
    name: 'Demo 3: Equality Mismatch (INVALID)',
    description: 'Compares 5 and 3: leaves [FALSE] on the stack, failing condition.',
    expectedResult: 'INVALID',
    code: `PUSH 5
PUSH 3
EQUAL`,
  },
  {
    id: 'demo-4-underflow',
    name: 'Demo 4: Stack Underflow (Error)',
    description: 'Executes ADD on empty stack: halts with clear underflow error.',
    expectedResult: 'INVALID',
    code: `ADD`,
  },
  {
    id: 'demo-5-invalid-opcode',
    name: 'Demo 5: Invalid Opcode (Error)',
    description: 'Contains unknown opcode MAGIC: caught by parser before execution.',
    expectedResult: 'PARSER_ERROR',
    code: `PUSH 5
MAGIC`,
  },
  {
    id: 'demo-6-missing-arg',
    name: 'Demo 6: Missing Argument (Error)',
    description: 'PUSH instruction missing its numeric value: validation error.',
    expectedResult: 'PARSER_ERROR',
    code: `PUSH`,
  },
  {
    id: 'demo-7-verify-check',
    name: 'Demo 7: VERIFY Condition (VALID)',
    description: 'Tests OP_VERIFY: checks that (10 == 10) is true and consumes it.',
    expectedResult: 'VALID',
    code: `PUSH 10
PUSH 10
EQUAL
VERIFY
PUSH 1`,
  },
];
