'use client';

import React from 'react';
import { TraceEntry, formatStack } from '@/engine/types';
import { History, Check, AlertTriangle, Minus } from 'lucide-react';

interface TraceTableProps {
  trace: TraceEntry[];
  currentStepIndex: number;
}

export const TraceTable: React.FC<TraceTableProps> = ({ trace, currentStepIndex }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-slate-950/70 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Execution Trace & State Audit Log
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          {trace.length} {trace.length === 1 ? 'entry' : 'entries'} recorded
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-4 font-semibold w-16">Step</th>
              <th className="py-2.5 px-4 font-semibold">Instruction</th>
              <th className="py-2.5 px-4 font-semibold">Stack Before</th>
              <th className="py-2.5 px-4 font-semibold">Stack After</th>
              <th className="py-2.5 px-4 font-semibold w-24 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {trace.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                  No execution trace recorded yet. Run script to generate trace.
                </td>
              </tr>
            ) : (
              trace.map((entry) => {
                const isCurrent = entry.step === currentStepIndex;

                return (
                  <tr
                    key={entry.step}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-amber-500/10 hover:bg-amber-500/15'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-4 text-slate-500 font-bold">
                      #{entry.step}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {entry.instruction}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {formatStack(entry.stackBefore)}
                    </td>
                    <td className="py-2.5 px-4 text-amber-400 font-semibold">
                      {formatStack(entry.stackAfter)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {entry.status === 'OK' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Check className="w-3 h-3" /> OK
                        </span>
                      )}
                      {entry.status === 'ERROR' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" /> ERR
                        </span>
                      )}
                      {entry.status === 'INITIAL' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          <Minus className="w-3 h-3" /> INIT
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
