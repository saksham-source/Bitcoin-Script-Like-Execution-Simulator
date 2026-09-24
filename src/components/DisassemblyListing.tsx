'use client';

import React from 'react';
import { Instruction } from '@/engine/types';
import { OPCODE_REGISTRY } from '@/engine/opcodes';
import { ListOrdered, BookOpen, ArrowRight } from 'lucide-react';

interface DisassemblyListingProps {
  instructions: Instruction[];
  currentStepIndex: number;
  onSelectStep: (stepNumber: number) => void;
}

const OPCODE_FORMULAS: Record<string, string> = {
  PUSH: "μ'_s[0] = constant | Stack: push 1",
  ADD: "μ'_s[0] = μ_s[1] + μ_s[0] | Stack: pop 2, push 1",
  SUB: "μ'_s[0] = μ_s[1] - μ_s[0] | Stack: pop 2, push 1",
  EQUAL: "μ'_s[0] = (μ_s[1] == μ_s[0]) ? TRUE : FALSE | Stack: pop 2, push 1",
  NOT: "μ'_s[0] = !μ_s[0] | Stack: pop 1, push 1",
  VERIFY: "Assert(μ_s[0] != 0) | Stack: pop 1",
  EQUALVERIFY: "Assert(μ_s[1] == μ_s[0]) | Stack: pop 2",
  DUP: "μ'_s[0] = μ_s[0], μ'_s[1] = μ_s[0] | Stack: push 1",
  DROP: "Stack: pop 1",
};

const OPCODE_NOTES: Record<string, string> = {
  PUSH: 'push constant',
  ADD: 'pop 2, push sum',
  SUB: 'pop 2, push diff',
  EQUAL: 'compare top 2',
  NOT: 'negate top',
  VERIFY: 'fail if false',
  EQUALVERIFY: 'verify equality',
  DUP: 'duplicate TOS',
  DROP: 'discard TOS',
};

export const DisassemblyListing: React.FC<DisassemblyListingProps> = ({
  instructions,
  currentStepIndex,
  onSelectStep,
}) => {
  // Currently active or next instruction
  const activeInstruction =
    currentStepIndex > 0 && currentStepIndex <= instructions.length
      ? instructions[currentStepIndex - 1]
      : instructions[0];

  const activeOpcodeDef = activeInstruction
    ? OPCODE_REGISTRY[activeInstruction.opcode]
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Disassembly Box */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded shadow-sm overflow-hidden flex flex-col h-[480px]">
        {/* Header */}
        <div className="p-3.5 border-b border-surface-variant bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-primary" />
            <h3 className="font-headline font-semibold text-sm text-on-surface">
              Disassembly Listing
            </h3>
          </div>
          <span className="text-[11px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded">
            Script ASM Verified
          </span>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-surface-variant font-mono text-xs">
          {instructions.length === 0 ? (
            <div className="p-6 text-center text-secondary italic">
              No instructions loaded. Enter a script stream above.
            </div>
          ) : (
            instructions.map((inst, idx) => {
              const stepNumber = idx + 1;
              const isActive = currentStepIndex === stepNumber;

              return (
                <div
                  key={idx}
                  onClick={() => onSelectStep(stepNumber)}
                  className={`p-3 flex items-center justify-between cursor-pointer transition-all ${
                    isActive
                      ? 'bg-primary-fixed/30 border-l-4 border-primary'
                      : 'hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-secondary font-medium w-8 text-[11px]">
                      0x{idx.toString(16).padStart(2, '0')}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold text-[11px] ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {inst.opcode}
                    </span>
                    {inst.arg !== undefined && (
                      <span className="text-on-surface font-semibold text-[11px]">
                        {inst.arg}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-secondary text-[11px]">
                    <span className="italic text-secondary/80">
                      {OPCODE_NOTES[inst.opcode] || 'execute'}
                    </span>
                    {isActive ? (
                      <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                    ) : (
                      <span className="w-3.5" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-surface-container-low border-t border-surface-variant flex items-center justify-between text-[11px] text-secondary">
          <span>Viewing instruction {currentStepIndex} of {instructions.length}</span>
          <span className="font-mono">
            Halting Op: {instructions[instructions.length - 1]?.opcode || 'EQUAL'}
          </span>
        </div>
      </div>

      {/* Semantic Specification Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h4 className="font-headline font-semibold text-xs tracking-wide text-on-surface uppercase">
            Bitcoin Script Semantic Specification
          </h4>
        </div>
        <p className="font-body text-xs text-secondary leading-relaxed mb-2">
          <strong className="text-on-surface font-mono">
            {activeInstruction ? activeInstruction.raw : 'INITIAL'}:
          </strong>{' '}
          {activeOpcodeDef?.educationalSummary ||
            'The Bitcoin Script engine operates strictly on a Last-In First-Out (LIFO) stack machine.'}
        </p>
        <div className="bg-surface-container-low p-2 rounded border border-outline-variant/40 font-mono text-[11px] text-on-surface">
          {activeInstruction
            ? OPCODE_FORMULAS[activeInstruction.opcode] || "μ'_s = eval(op, μ_s)"
            : 'μ_s = []'}
        </div>
      </div>
    </div>
  );
};
