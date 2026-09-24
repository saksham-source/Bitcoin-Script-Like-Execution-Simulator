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
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded shadow-sm overflow-hidden flex flex-col">
      {/* Table Header Toolbar */}
      <div className="bg-surface-container-low border-b border-surface-variant px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <h3 className="font-headline font-semibold text-sm text-on-surface">
            Execution Trace Register
          </h3>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-secondary font-mono ml-2">
            <MousePointerClick className="w-3 h-3 text-primary" />
            <span>Click row to inspect step</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded">
            {trace.length} {trace.length === 1 ? 'Snapshot' : 'Snapshots'}
          </span>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1 text-[11px] font-label font-semibold text-primary hover:text-primary/80 px-2 py-0.5 rounded border border-outline-variant hover:bg-surface-container transition"
              title="Download Trace JSON"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto max-h-[360px] overflow-y-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-container-high/60 text-secondary text-[11px] font-label uppercase tracking-wider sticky top-0 z-10 border-b border-surface-variant">
            <tr>
              <th className="py-2.5 px-3.5 font-semibold w-16">Step</th>
              <th className="py-2.5 px-3.5 font-semibold w-32">Opcode</th>
              <th className="py-2.5 px-3.5 font-semibold">Before Stack</th>
              <th className="py-2.5 px-3.5 font-semibold">Operation</th>
              <th className="py-2.5 px-3.5 font-semibold">After Stack</th>
              <th className="py-2.5 px-3.5 font-semibold w-24 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant">
            {trace.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-secondary italic">
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
                        ? 'bg-primary-fixed/25 border-l-4 border-primary font-medium'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <td className="py-2.5 px-3.5 text-secondary font-bold">
                      #{entry.step}
                    </td>
                    <td className="py-2.5 px-3.5 font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface border border-outline-variant/40">
                        {entry.instruction}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-secondary">
                      {formatStack(entry.stackBefore)}
                    </td>
                    <td className="py-2.5 px-3.5 text-on-surface truncate max-w-[200px]">
                      {entry.operation || entry.explanation || '—'}
                    </td>
                    <td className="py-2.5 px-3.5 text-primary font-bold">
                      {formatStack(entry.stackAfter)}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      {entry.status === 'OK' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" /> OK
                        </span>
                      )}
                      {entry.status === 'ERROR' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                          <X className="w-3 h-3" /> ERR
                        </span>
                      )}
                      {entry.status === 'INITIAL' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
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

      {/* Mobile Card Layout */}
      <div className="md:hidden divide-y divide-surface-variant max-h-[300px] overflow-y-auto">
        {trace.length === 0 ? (
          <div className="p-4 text-center text-xs text-secondary italic font-mono">
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
                  isCurrent
                    ? 'bg-primary-fixed/25 border-l-4 border-primary'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-bold">#{entry.step}</span>
                    <span className="font-bold text-on-surface bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/40">
                      {entry.instruction}
                    </span>
                  </div>
                  <div>
                    {entry.status === 'OK' && (
                      <span className="text-[10px] text-primary font-bold bg-primary-fixed px-1.5 py-0.5 rounded">
                        ✓ OK
                      </span>
                    )}
                    {entry.status === 'ERROR' && (
                      <span className="text-[10px] text-rose-800 font-bold bg-rose-100 px-1.5 py-0.5 rounded">
                        ✕ ERR
                      </span>
                    )}
                    {entry.status === 'INITIAL' && (
                      <span className="text-[10px] text-secondary">INIT</span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-secondary mb-1">
                  {entry.operation || entry.explanation || '—'}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-surface-variant">
                  <span className="text-secondary">Before: {formatStack(entry.stackBefore)}</span>
                  <span className="text-primary font-bold">
                    After: {formatStack(entry.stackAfter)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
