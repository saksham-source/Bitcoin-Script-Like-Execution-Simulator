'use client';

import React from 'react';
import { TraceEntry, Instruction, formatStack } from '@/engine/types';
import { ArrowRight, Activity } from 'lucide-react';

interface StepInspectorProps {
  currentEntry?: TraceEntry;
  currentStepIndex: number;
  totalSteps: number;
  nextInstruction?: Instruction | null;
}

export const StepInspector: React.FC<StepInspectorProps> = ({
  currentEntry,
  currentStepIndex,
  totalSteps,
  nextInstruction,
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-headline font-semibold text-xs tracking-wide text-on-surface uppercase">
            Step Transition Inspector
          </span>
        </div>
        <span className="font-mono text-xs text-primary font-bold">
          Step {currentEntry?.step ?? currentStepIndex} / {totalSteps}
        </span>
      </div>

      {/* Before / After Stack Diff */}
      <div className="grid grid-cols-2 gap-3 my-2 text-xs font-mono">
        <div className="bg-surface-container-low p-2 rounded border border-outline-variant/40">
          <span className="text-[10px] text-secondary font-label uppercase block mb-0.5">
            Stack Before:
          </span>
          <span className="font-bold text-on-surface truncate block">
            {currentEntry ? formatStack(currentEntry.stackBefore) : '[ ]'}
          </span>
        </div>

        <div className="bg-surface-container-low p-2 rounded border border-outline-variant/40 flex items-center justify-between">
          <div className="truncate">
            <span className="text-[10px] text-secondary font-label uppercase block mb-0.5">
              Stack After:
            </span>
            <span className="font-bold text-primary truncate block">
              {currentEntry ? formatStack(currentEntry.stackAfter) : '[ ]'}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-1" />
        </div>
      </div>

      <div className="text-[11px] text-secondary font-body mt-2 leading-relaxed">
        <strong className="text-on-surface font-label font-semibold">Effect: </strong>
        <span>
          {currentEntry?.explanation ||
            (nextInstruction
              ? `Ready to execute instruction '${nextInstruction.raw}'.`
              : 'VM initialized.')}
        </span>
      </div>
    </div>
  );
};
