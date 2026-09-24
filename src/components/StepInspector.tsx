'use client';

import React from 'react';
import { TraceEntry, formatStack } from '@/engine/types';
import { OPCODE_REGISTRY } from '@/engine/opcodes';
import { Info, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface StepInspectorProps {
  currentEntry?: TraceEntry;
  totalSteps: number;
}

export const StepInspector: React.FC<StepInspectorProps> = ({
  currentEntry,
  totalSteps,
}) => {
  if (!currentEntry) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex items-center justify-center text-slate-500 text-xs italic">
        Ready to execute. Click &quot;Step Next&quot; or &quot;Run All&quot; to inspect operations.
      </div>
    );
  }

  const opcodeInfo =
    currentEntry.opcode !== 'INITIAL'
      ? OPCODE_REGISTRY[currentEntry.opcode as keyof typeof OPCODE_REGISTRY]
      : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Step Inspector
            </h3>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Step {currentEntry.step} of {totalSteps}
          </span>
        </div>

        {/* Current Instruction Banner */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                {currentEntry.instruction}
              </span>
              {currentEntry.status === 'OK' && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> OK
                </span>
              )}
              {currentEntry.status === 'ERROR' && (
                <span className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5" /> ERROR
                </span>
              )}
            </div>
            {opcodeInfo && (
              <p className="text-xs text-slate-300 mt-2 font-medium">
                {opcodeInfo.description}
              </p>
            )}
          </div>
        </div>

        {/* Educational explanation */}
        {currentEntry.explanation && (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 leading-relaxed mb-4">
            <span className="text-slate-500 font-medium">Execution Summary: </span>
            {currentEntry.explanation}
          </div>
        )}
      </div>

      {/* Stack Transition Diff: Before -> After */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 font-mono text-xs">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans mb-1">
            Stack Before:
          </div>
          <div className="text-slate-300 font-bold truncate">
            {formatStack(currentEntry.stackBefore)}
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <div className="flex-1 truncate">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans mb-1">
              Stack After:
            </div>
            <div className="text-amber-400 font-bold truncate">
              {formatStack(currentEntry.stackAfter)}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-500 shrink-0 ml-2" />
        </div>
      </div>
    </div>
  );
};
