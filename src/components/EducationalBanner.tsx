'use client';

import React from 'react';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { TraceEntry, Instruction } from '@/engine/types';
import { OPCODE_REGISTRY } from '@/engine/opcodes';

interface EducationalBannerProps {
  currentEntry?: TraceEntry;
  instructions: Instruction[];
  currentStepIndex: number;
  onOpenGuide: () => void;
}

export const EducationalBanner: React.FC<EducationalBannerProps> = ({
  currentEntry,
  instructions,
  currentStepIndex,
  onOpenGuide,
}) => {
  const currentInstruction =
    currentStepIndex > 0 && currentStepIndex <= instructions.length
      ? instructions[currentStepIndex - 1]
      : instructions[0];

  const opcodeDef = currentInstruction
    ? OPCODE_REGISTRY[currentInstruction.opcode]
    : null;

  return (
    <div className="mt-8 bg-surface-container-low border border-outline-variant/60 rounded p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded bg-primary-fixed text-primary shrink-0 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Instruction Flow Architecture
            </h3>
            <p className="font-body text-xs sm:text-sm text-secondary mt-1 leading-relaxed max-w-3xl">
              {currentEntry ? (
                <>
                  In this execution step, the opcode{' '}
                  <code className="font-mono text-primary font-bold">
                    {currentEntry.instruction}
                  </code>{' '}
                  executed against the stack. {currentEntry.explanation}{' '}
                  {currentEntry.status === 'OK' ? (
                    <span>The operation evaluated successfully with no stack underflow.</span>
                  ) : (
                    <span className="text-rose-700 font-semibold">
                      The instruction failed consensus validation.
                    </span>
                  )}
                </>
              ) : (
                <>
                  In this initial state, the Bitcoin Script VM is loaded with{' '}
                  <code className="font-mono text-primary font-bold">
                    {instructions.length} instructions
                  </code>
                  . The next operation{' '}
                  <code className="font-mono text-primary font-bold">
                    {currentInstruction?.raw || 'PUSH'}
                  </code>{' '}
                  will begin populating the LIFO stack. Bitcoin Script strictly forbids loops and
                  recursion, guaranteeing finite termination and deterministic consensus.
                </>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenGuide}
          className="inline-flex items-center gap-1.5 text-xs font-label font-bold text-primary hover:text-primary/80 whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          <span>Read Bitcoin Script Guide</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
