'use client';

import React from 'react';
import { ExecutionResult, formatStack } from '@/engine/types';
import { CheckCircle2, XCircle, AlertTriangle, Terminal, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ResultBannerProps {
  result: ExecutionResult | null;
}

export const ResultBanner: React.FC<ResultBannerProps> = ({ result }) => {
  if (!result) return null;

  const isValid = result.status === 'VALID';
  const stepsCount = result.trace ? result.trace.length : 0;
  const errorStep = result.error?.step;
  const errorOpcode = result.error?.opcode || result.error?.instruction;

  return (
    <div
      className={`rounded border p-5 shadow-2xl transition-all ${
        isValid
          ? 'bg-[#161F30] border-emerald-500/40 text-emerald-300'
          : 'bg-[#161F30] border-rose-500/40 text-rose-300'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Status Icon and Primary Message */}
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`p-3 rounded border shrink-0 mt-0.5 ${
              isValid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/10'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-md shadow-rose-500/10'
            }`}
          >
            {isValid ? (
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`text-xl font-black tracking-widest uppercase font-mono px-3 py-1 rounded border inline-flex items-center gap-2 ${
                  isValid
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}
              >
                {isValid ? '✓ VALID' : '✕ INVALID'}
              </span>
              <span className="text-xs uppercase font-mono tracking-widest text-[#94A3B8]">
                Consensus Verification
              </span>
            </div>

            <p className="text-sm font-semibold text-[#F8FAFC]">
              {isValid ? 'Script executed successfully.' : 'Script execution failed.'}
            </p>
            <p className="text-xs text-[#94A3B8] font-mono">
              {result.summary}
            </p>
          </div>
        </div>

        {/* Right: Technical Diagnostic Breakdown */}
        <div className="flex flex-wrap items-center gap-3 lg:border-l lg:border-[#1E293B] lg:pl-6">
          {/* Steps Count */}
          <div className="bg-[#0B0F17] px-4 py-2.5 rounded border border-[#1E293B] min-w-[120px]">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-mono block">
              Execution Steps
            </span>
            <span className="text-lg font-mono font-bold text-[#F8FAFC]">
              {stepsCount}
            </span>
          </div>

          {/* Final Stack State */}
          <div className="bg-[#0B0F17] px-4 py-2.5 rounded border border-[#1E293B] min-w-[160px]">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-mono block">
              Final Stack
            </span>
            <span
              className={`text-base font-mono font-bold truncate block ${
                isValid ? 'text-[#F7931A]' : 'text-[#94A3B8]'
              }`}
            >
              {formatStack(result.finalStack)}
            </span>
          </div>
        </div>
      </div>

      {/* Educational Error Deep-Dive (WHAT, WHERE, WHY) */}
      {!isValid && result.error && (
        <div className="mt-4 pt-4 border-t border-rose-500/20 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#0B0F17]/90 p-3 rounded border border-rose-900/40">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block mb-1">
              WHAT HAPPENED
            </span>
            <span className="text-xs font-mono font-bold text-[#F8FAFC] uppercase">
              {result.error.category.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-[#0B0F17]/90 p-3 rounded border border-rose-900/40">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block mb-1">
              WHERE (LOCATION)
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#F8FAFC]">
              {errorStep !== undefined && (
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  Step {errorStep}
                </span>
              )}
              {errorOpcode && (
                <span className="px-1.5 py-0.5 rounded bg-[#161F30] text-[#F7931A] font-bold border border-[#1E293B]">
                  {errorOpcode}
                </span>
              )}
              {result.error.line !== undefined && (
                <span className="text-[#94A3B8]">Line {result.error.line}</span>
              )}
            </div>
          </div>

          <div className="bg-[#0B0F17]/90 p-3 rounded border border-rose-900/40">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block mb-1">
              WHY (DIAGNOSIS)
            </span>
            <p className="text-xs font-mono text-rose-300 leading-snug">
              {result.error.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
