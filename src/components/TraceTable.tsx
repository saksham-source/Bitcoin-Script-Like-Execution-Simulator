'use client';

import React, { useState } from 'react';
import { TraceEntry, formatStack } from '@/engine/types';
import {
  History,
  Check,
  X,
  Minus,
  Download,
  MousePointerClick,
  ArrowRight,
  List,
  Table as TableIcon,
} from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'feed' | 'table'>('feed');

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded shadow-sm overflow-hidden flex flex-col h-[480px]">
      {/* Table Header Toolbar */}
      <div className="bg-surface-container-low border-b border-surface-variant p-3 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <History className="w-4 h-4 text-primary shrink-0" />
            <h3 className="font-headline font-semibold text-sm text-on-surface truncate">
              Execution Trace Register
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded whitespace-nowrap">
              {trace.length} {trace.length === 1 ? 'Step' : 'Steps'}
            </span>
            {onExport && (
              <button
                type="button"
                onClick={onExport}
                className="inline-flex items-center gap-1 text-[11px] font-label font-semibold text-primary hover:text-primary/80 px-2 py-0.5 rounded border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition whitespace-nowrap"
                title="Download Trace JSON"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-toolbar: Hint and Mode Toggle */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-secondary font-mono pt-1.5 border-t border-surface-variant/40">
          <div className="flex items-center gap-1 min-w-0 truncate text-secondary/90">
            <MousePointerClick className="w-3 h-3 text-primary shrink-0" />
            <span className="truncate">Click step to inspect stack</span>
          </div>

          <div className="flex items-center bg-surface-container rounded p-0.5 border border-outline-variant/40 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('feed')}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-label font-bold transition ${
                viewMode === 'feed'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
              title="Feed Card View"
            >
              <List className="w-3 h-3" />
              <span>Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-label font-bold transition ${
                viewMode === 'table'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
              title="Audit Table View"
            >
              <TableIcon className="w-3 h-3" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'feed' ? (
        /* Feed View: Clean, vertical step-by-step audit cards */
        <div className="flex-1 overflow-y-auto divide-y divide-surface-variant font-mono text-xs">
          {trace.length === 0 ? (
            <div className="p-8 text-center text-secondary italic">
              No execution trace recorded. Enter a script and step through.
            </div>
          ) : (
            trace.map((entry) => {
              const isCurrent = entry.step === currentStepIndex;

              return (
                <div
                  key={entry.step}
                  onClick={() => onSelectStep?.(entry.step)}
                  className={`p-3 transition-colors cursor-pointer select-none flex flex-col gap-1.5 ${
                    isCurrent
                      ? 'bg-primary-fixed/30 border-l-4 border-primary font-medium'
                      : 'hover:bg-surface-container-low'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-secondary font-bold text-[11px] shrink-0">
                        {entry.step === 0 ? 'INIT' : `#${entry.step}`}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface border border-outline-variant/40 font-bold text-[11px] truncate">
                        {entry.instruction}
                      </span>
                    </div>

                    <div className="shrink-0">
                      {entry.status === 'OK' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                          <Check className="w-3 h-3" /> OK
                        </span>
                      )}
                      {entry.status === 'ERROR' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
                          <X className="w-3 h-3" /> ERR
                        </span>
                      )}
                      {entry.status === 'INITIAL' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-secondary bg-surface-container px-1.5 py-0.5 rounded">
                          <Minus className="w-3 h-3" /> INIT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Operation Semantic Explanation */}
                  <div className="text-[11px] text-secondary truncate font-body">
                    {entry.operation || entry.explanation || '—'}
                  </div>

                  {/* Stack Before -> After Diff */}
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-surface-variant/40 bg-surface-container-low/40 px-2 py-1 rounded">
                    <div className="truncate max-w-[45%]">
                      <span className="text-[9px] uppercase tracking-wider block font-label text-secondary/70">
                        Before
                      </span>
                      <span className="font-mono text-secondary truncate block">
                        {formatStack(entry.stackBefore)}
                      </span>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-secondary/50 shrink-0 mx-1" />

                    <div className="truncate max-w-[45%] text-right">
                      <span className="text-[9px] uppercase tracking-wider block font-label text-secondary/70">
                        After
                      </span>
                      <span className="font-mono font-bold text-primary truncate block">
                        {formatStack(entry.stackAfter)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Table View: Concise column layout with horizontal scroll if needed */
        <div className="flex-1 overflow-x-auto overflow-y-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-surface-container-high/60 text-secondary text-[10px] font-label uppercase tracking-wider sticky top-0 z-10 border-b border-surface-variant">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-12 text-center">Step</th>
                <th className="py-2.5 px-3 font-semibold w-24">Opcode</th>
                <th className="py-2.5 px-3 font-semibold">After Stack</th>
                <th className="py-2.5 px-3 font-semibold w-16 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {trace.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-secondary italic">
                    No execution trace recorded.
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
                      <td className="py-2 px-3 text-secondary font-bold text-center">
                        {entry.step === 0 ? 'INIT' : `#${entry.step}`}
                      </td>
                      <td className="py-2 px-3 font-bold">
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface border border-outline-variant/40 text-[11px]">
                          {entry.instruction}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-primary font-bold truncate max-w-[140px]">
                        {formatStack(entry.stackAfter)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {entry.status === 'OK' && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                            <Check className="w-3 h-3" /> OK
                          </span>
                        )}
                        {entry.status === 'ERROR' && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
                            <X className="w-3 h-3" /> ERR
                          </span>
                        )}
                        {entry.status === 'INITIAL' && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-secondary bg-surface-container px-1.5 py-0.5 rounded">
                            INIT
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
      )}

      {/* Footer */}
      <div className="p-2.5 bg-surface-container-low border-t border-surface-variant flex items-center justify-between text-[11px] text-secondary shrink-0">
        <span>Recorded: {trace.length} state snapshots</span>
        <span className="font-mono text-primary font-semibold">
          Active: {currentStepIndex === 0 ? 'INIT' : `Step #${currentStepIndex}`}
        </span>
      </div>
    </div>
  );
};
