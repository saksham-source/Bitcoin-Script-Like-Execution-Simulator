import { describe, it, expect } from 'vitest';
import { parseScript } from '../parser';

describe('Phase 2: Parser and Instruction Validator', () => {
  it('correctly parses the working assignment script', () => {
    const script = `
      PUSH 5
      PUSH 3
      ADD
      PUSH 8
      EQUAL
    `;

    const result = parseScript(script);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.instructions).toHaveLength(5);
    expect(result.instructions[0]).toEqual({
      index: 0,
      line: 2,
      opcode: 'PUSH',
      raw: 'PUSH 5',
      arg: 5,
    });
    expect(result.instructions[1]).toEqual({
      index: 1,
      line: 3,
      opcode: 'PUSH',
      raw: 'PUSH 3',
      arg: 3,
    });
    expect(result.instructions[2].opcode).toBe('ADD');
    expect(result.instructions[3]).toEqual({
      index: 3,
      line: 5,
      opcode: 'PUSH',
      raw: 'PUSH 8',
      arg: 8,
    });
    expect(result.instructions[4].opcode).toBe('EQUAL');
  });

  it('handles case-insensitivity, comments, and empty lines', () => {
    const script = `
      # Push first value
      push 10
      // Push second value
      PUSH 20
      add
    `;

    const result = parseScript(script);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.instructions).toHaveLength(3);
    expect(result.instructions[0].opcode).toBe('PUSH');
    expect(result.instructions[0].arg).toBe(10);
    expect(result.instructions[1].opcode).toBe('PUSH');
    expect(result.instructions[1].arg).toBe(20);
    expect(result.instructions[2].opcode).toBe('ADD');
  });

  it('rejects unknown opcodes with clear line number and supported list', () => {
    const script = `
      PUSH 5
      MAGIC
    `;

    const result = parseScript(script);
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.category).toBe('UNKNOWN_OPCODE');
    expect(result.error.line).toBe(3);
    expect(result.error.message).toContain("Unknown opcode 'MAGIC'");
    expect(result.error.message).toContain('Supported opcodes are: PUSH, ADD, EQUAL, VERIFY');
  });

  it('rejects PUSH without argument', () => {
    const script = `PUSH`;
    const result = parseScript(script);
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.category).toBe('MISSING_ARGUMENT');
    expect(result.error.line).toBe(1);
    expect(result.error.message).toBe('Line 1: PUSH requires one numeric value.');
  });

  it('rejects PUSH with non-numeric argument', () => {
    const script = `PUSH hello`;
    const result = parseScript(script);
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.category).toBe('PARSER_ERROR');
    expect(result.error.message).toBe("Line 1: PUSH requires a valid numeric value, got 'hello'.");
  });

  it('rejects ADD with extra arguments', () => {
    const script = `ADD 5`;
    const result = parseScript(script);
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.category).toBe('PARSER_ERROR');
    expect(result.error.message).toContain('ADD does not take any arguments');
  });
});
