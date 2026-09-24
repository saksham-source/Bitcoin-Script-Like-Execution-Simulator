'use client';

import React from 'react';
import { TraceEntry, formatStack } from '@/engine/types';
import { History, Check, X, Minus, Download, MousePointerClick } from 'lucide-react';

interface TraceTableProps {
  trace: TraceEntry[];
  currentStepIndex: number;
  onSelectStep?: (stepNumber: number) => void;
  onExport?: () => void;
}

export const TraceTable: React.FC<TraceTableProps> = ({
  trace,
  currentStepIndex,
  onSelectStep,
  onExport,
}) => {
  return (
    <div className="bg-[#111827] border border-[#1E293B] rounded shadow-sm overflow-hidden flex flex-col">
      {/* Table Header Toolbar */}
      <div className="bg-[#161F30] border-b border-[#1E293B] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#F7931A]" />
          <h3 className="font-semibold text-xs tracking-tight text-[#F8FAFC]">
            Execution Trace Register
          </h3>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#64748B] font-mono">
            <MousePointerClick className="w-3 h-3 text-[#38BDF8]" />
            <span>Click row to inspect step</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#94A3B8]">
            {trace.length} {trace.length === 1 ? 'Snapshot' : 'Snapshots'}
          </span>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1 text-[11px] font-mono text-[#38BDF8] hover:text-[#7bd0ff] px-2 py-0.5 rounded bg-[#111827] border border-[#1E293B] hover:border-[#38BDF8]/40 transition"
              title="Download Trace JSON"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View (hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto max-h-[340px] overflow-y-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#161F30]/70 text-[#94A3B8] text-[11px] uppercase tracking-wider sticky top-0 z-10 border-b border-[#1E293B]">
            <tr>
              <th className="py-2 px-3.5 font-semibold w-16">Step</th>
              <th className="py-2 px-3.5 font-semibold w-32">Opcode</th>
              <th className="py-2 px-3.5 font-semibold">Before Stack</th>
              <th className="py-2 px-3.5 font-semibold">Operation</th>
              <th className="py-2 px-3.5 font-semibold">After Stack</th>
              <th className="py-2 px-3.5 font-semibold w-20 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {trace.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#64748B] italic">
                  No execution trace recorded. Enter a script and step through.
                </td>
              </tr>
            ) : (
              trace.map((entry) => {
                const isCurrent = entry.step === currentStepIndex;

                return (
                  <tr
                    key={entry.step}
                    onClick={() => onSelectStep?.(entry.step)}
                    className={`transition-colors cursor-pointer select-none ${
                      isCurrent
                        ? 'bg-[#F7931A]/10 border-l-4 border-l-[#F7931A]'
                        : 'hover:bg-[#161F30]/60'
                    }`}
                  >
                    <td className="py-2 px-3.5 text-[#64748B] font-bold">
                      #{entry.step}
                    </td>
                    <td className="py-2 px-3.5 font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-[#161F30] text-[#F8FAFC] border border-[#1E293B]">
                        {entry.instruction}
                      </span>
                    </td>
                    <td className="py-2 px-3.5 text-[#94A3B8]">
                      {formatStack(entry.stackBefore)}
                    </td>
                    <td className="py-2 px-3.5 text-[#94A3B8] truncate max-w-[200px]">
                      {entry.operation || entry.explanation || '—'}
                    </td>
                    <td className="py-2 px-3.5 text-[#F7931A] font-semibold">
                      {formatStack(entry.stackAfter)}
                    </td>
                    <td className="py-2 px-3.5 text-center">
                      {entry.status === 'OK' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
                          <Check className="w-3 h-3" /> OK
                        </span>
                      )}
                      {entry.status === 'ERROR' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded border border-[#EF4444]/20">
                          <X className="w-3 h-3" /> ERR
                        </span>
                      )}
                      {entry.status === 'INITIAL' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#94A3B8] bg-[#161F30] px-1.5 py-0.5 rounded">
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

      {/* Mobile Card Layout (shown on screens < md) */}
      <div className="md:hidden divide-y divide-[#1E293B] max-h-[300px] overflow-y-auto">
        {trace.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#64748B] italic font-mono">
            No trace recorded.
          </div>
        ) : (
          trace.map((entry) => {
            const isCurrent = entry.step === currentStepIndex;

            return (
              <div
                key={entry.step}
                onClick={() => onSelectStep?.(entry.step)}
                className={`p-3 font-mono text-xs transition-colors cursor-pointer ${
                  isCurrent ? 'bg-[#F7931A]/10 border-l-4 border-l-[#F7931A]' : 'hover:bg-[#161F30]/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B] font-bold">#{entry.step}</span>
                    <span className="font-bold text-[#F8FAFC] bg-[#161F30] px-1.5 py-0.5 rounded border border-[#1E293B]">
                      {entry.instruction}
                    </span>
                  </div>
                  <div>
                    {entry.status === 'OK' && (
                      <span className="text-[10px] text-[#10B981] font-bold">✓ OK</span>
                    )}
                    {entry.status === 'ERROR' && (
                      <span className="text-[10px] text-[#EF4444] font-bold">✕ ERR</span>
                    )}
                    {entry.status === 'INITIAL' && (
                      <span className="text-[10px] text-[#94A3B8]">INIT</span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-[#64748B] mb-1">
                  {entry.operation || entry.explanation || '—'}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1E293B]/40">
                  <span className="text-[#94A3B8]">Before: {formatStack(entry.stackBefore)}</span>
                  <span className="text-[#F7931A] font-bold">After: {formatStack(entry.stackAfter)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
