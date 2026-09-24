'use client';

import React from 'react';
import { TraceEntry, formatStack } from '@/engine/types';
import { OPCODE_REGISTRY } from '@/engine/opcodes';
import { Info, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface StepInspectorProps {
  currentEntry?: TraceEntry;
  currentStepIndex: number;
  totalSteps: number;
}

export const StepInspector: React.FC<StepInspectorProps> = ({
  currentEntry,
  currentStepIndex,
  totalSteps,
}) => {
  if (!currentEntry) {
    return (
      <div className="bg-[#161F30] border border-[#1E293B] rounded p-4 text-xs font-mono text-[#64748B] flex items-center justify-center italic">
        Ready to execute. Use the control bar to step or run the script.
      </div>
    );
  }

  const opcodeInfo =
    currentEntry.opcode !== 'INITIAL'
      ? OPCODE_REGISTRY[currentEntry.opcode as keyof typeof OPCODE_REGISTRY]
      : null;

  return (
    <div className="bg-[#161F30] border border-[#1E293B] rounded p-4 shadow-sm flex flex-col justify-between">
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1E293B] mb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#F7931A]" />
            <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#94A3B8]">
              Current Step Inspector
            </h4>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#94A3B8] bg-[#111827] px-2 py-0.5 rounded border border-[#1E293B]">
              Step <strong className="text-[#F8FAFC]">{currentEntry.step}</strong> of {totalSteps}
            </span>
          </div>
        </div>

        {/* Current Instruction Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-extrabold text-[#F7931A] px-2.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30">
              {currentEntry.instruction}
            </span>

            {currentEntry.status === 'OK' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> OK
              </span>
            )}
            {currentEntry.status === 'ERROR' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded border border-[#EF4444]/20">
                <AlertCircle className="w-3.5 h-3.5" /> FAILED
              </span>
            )}
            {currentEntry.status === 'INITIAL' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] bg-[#111827] px-2 py-0.5 rounded border border-[#1E293B]">
                VM INITIALIZED
              </span>
            )}
          </div>

          {opcodeInfo && (
            <span className="text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
              Needs {opcodeInfo.requiredStackSize} on stack
            </span>
          )}
        </div>

        {/* Dynamic Opcode Explanation */}
        <div className="bg-[#111827] border border-[#1E293B] rounded p-3 text-xs leading-relaxed text-[#94A3B8] mb-3">
          <span className="text-[#F8FAFC] font-semibold font-sans">Operation Effect: </span>
          <span>{currentEntry.explanation || opcodeInfo?.educationalSummary || 'System state update.'}</span>
        </div>
      </div>

      {/* Stack Transition Before / After Diff */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1E293B] font-mono text-xs">
        <div className="bg-[#111827] p-2.5 rounded border border-[#1E293B]">
          <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-sans font-semibold mb-1">
            Stack Before:
          </div>
          <div className="text-[#94A3B8] font-bold truncate">
            {formatStack(currentEntry.stackBefore)}
          </div>
        </div>

        <div className="bg-[#111827] p-2.5 rounded border border-[#1E293B] flex items-center justify-between">
          <div className="flex-1 truncate">
            <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-sans font-semibold mb-1">
              Stack After:
            </div>
            <div className="text-[#F7931A] font-bold truncate">
              {formatStack(currentEntry.stackAfter)}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#F7931A] shrink-0 ml-2" />
        </div>
      </div>
    </div>
  );
};
