'use client';

import React from 'react';
import { ExecutionResult, formatStack } from '@/engine/types';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

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
      className={`rounded border p-5 shadow-sm transition-all mb-8 ${
        isValid
          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
          : 'bg-rose-50/70 border-rose-300 text-rose-950'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Status Icon and Primary Message */}
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`p-3 rounded shrink-0 mt-0.5 ${
              isValid
                ? 'bg-emerald-200/60 text-emerald-800'
                : 'bg-rose-200/60 text-rose-800'
            }`}
          >
            {isValid ? (
              <ShieldCheck className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`text-xl font-black tracking-widest uppercase font-mono px-3 py-1 rounded border inline-flex items-center gap-2 ${
                  isValid
                    ? 'bg-emerald-200 text-emerald-900 border-emerald-400'
                    : 'bg-rose-200 text-rose-900 border-rose-400'
                }`}
              >
                {isValid ? '✓ VALID' : '✕ INVALID'}
              </span>
              <span className="text-xs uppercase font-label font-bold tracking-widest text-secondary">
                Consensus Verification Verdict
              </span>
            </div>

            <p className="text-sm font-headline font-bold text-on-surface">
              {isValid ? 'Script executed successfully.' : 'Script execution failed.'}
            </p>
            <p className="text-xs text-secondary font-mono">
              {result.summary}
            </p>
          </div>
        </div>

        {/* Right: Technical Diagnostic Breakdown */}
        <div className="flex flex-wrap items-center gap-3 lg:border-l lg:border-outline-variant/60 lg:pl-6">
          <div className="bg-surface-container-lowest px-4 py-2.5 rounded border border-outline-variant/60 min-w-[120px] shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-secondary font-label font-semibold block">
              Execution Steps
            </span>
            <span className="text-lg font-mono font-bold text-on-surface">
              {stepsCount}
            </span>
          </div>

          <div className="bg-surface-container-lowest px-4 py-2.5 rounded border border-outline-variant/60 min-w-[160px] shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-secondary font-label font-semibold block">
              Final Stack
            </span>
            <span
              className={`text-base font-mono font-bold truncate block ${
                isValid ? 'text-primary' : 'text-secondary'
              }`}
            >
              {formatStack(result.finalStack)}
            </span>
          </div>
        </div>
      </div>

      {/* Educational Error Deep-Dive (WHAT, WHERE, WHY) */}
      {!isValid && result.error && (
        <div className="mt-4 pt-4 border-t border-rose-200 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-surface-container-lowest p-3 rounded border border-rose-200">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 block mb-1 font-bold">
              WHAT HAPPENED
            </span>
            <span className="text-xs font-mono font-bold text-on-surface uppercase">
              {result.error.category.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded border border-rose-200">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 block mb-1 font-bold">
              WHERE (LOCATION)
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-on-surface">
              {errorStep !== undefined && (
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-300">
                  Step {errorStep}
                </span>
              )}
              {errorOpcode && (
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-bold border border-outline-variant">
                  {errorOpcode}
                </span>
              )}
              {result.error.line !== undefined && (
                <span className="text-secondary font-semibold">Line {result.error.line}</span>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded border border-rose-200">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 block mb-1 font-bold">
              WHY (DIAGNOSIS)
            </span>
            <p className="text-xs font-mono text-rose-900 leading-snug">
              {result.error.message}
            </p>
          </div>
        </div>
      )}

      {/* Educational Callout: Empty Stack vs Consensus Validity */}
      {!isValid && result.finalStack.length === 0 && (
        <div className="mt-4 pt-4 border-t border-rose-200">
          <div className="bg-surface-container-lowest p-3.5 rounded border border-rose-300 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-rose-800 mb-1 font-label uppercase text-[11px] tracking-wide">
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>Protocol Consensus Rule: Why is an empty stack evaluated as INVALID?</span>
            </div>
            <p className="font-body text-xs text-on-surface leading-relaxed mt-1">
              Under canonical Bitcoin consensus rules (BIP 66 / Bitcoin Core interpreter), script execution <strong>cannot terminate on an empty stack</strong>. To authorize spending, the final stack must contain a <strong>truthy value</strong> (non-zero or <code className="font-mono font-bold bg-surface-container px-1 py-0.5 rounded text-primary">TRUE</code>).
            </p>
            <p className="font-body text-xs text-secondary leading-relaxed mt-1.5">
              Opcodes like <code className="font-mono font-bold bg-surface-container px-1 py-0.5 rounded text-on-surface">EQUALVERIFY</code> and <code className="font-mono font-bold bg-surface-container px-1 py-0.5 rounded text-on-surface">VERIFY</code> are <strong>assertion guards</strong> that consume their operands upon verification. In standard Bitcoin scripts (such as P2PKH), they are placed in the middle of a script. To make this script evaluate to <code className="font-mono font-bold text-primary">VALID</code>, append <code className="font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/30">PUSH 1</code> at the end.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
