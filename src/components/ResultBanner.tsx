'use client';

import React from 'react';
import { ExecutionResult, formatStack } from '@/engine/types';
import { CheckCircle2, XCircle, AlertCircle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ResultBannerProps {
  result: ExecutionResult | null;
}

export const ResultBanner: React.FC<ResultBannerProps> = ({ result }) => {
  if (!result) return null;

  const isValid = result.status === 'VALID';

  return (
    <div
      className={`rounded-xl p-5 border shadow-2xl transition-all ${
        isValid
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20 border-emerald-500/40 text-emerald-300'
          : 'bg-gradient-to-r from-rose-950/50 via-slate-900 to-rose-950/20 border-rose-500/40 text-rose-300'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl border shrink-0 ${
              isValid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-lg shadow-rose-500/10'
            }`}
          >
            {isValid ? (
              <ShieldCheck className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span
                className={`text-2xl font-black tracking-wider uppercase font-mono px-3 py-0.5 rounded-lg border ${
                  isValid
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}
              >
                {result.status}
              </span>
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                Evaluation Result
              </span>
            </div>

            <p className="text-sm font-medium text-slate-200 mt-2">
              {result.summary}
            </p>

            {result.error && (
              <div className="mt-2 text-xs font-mono text-rose-400 bg-rose-950/60 p-2.5 rounded-lg border border-rose-900/50 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>[{result.error.category}]</strong> {result.error.message}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Final Stack Badge */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 min-w-[200px] flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1">
            Final Stack State:
          </span>
          <span className="text-base font-mono font-bold text-amber-400 truncate">
            {formatStack(result.finalStack)}
          </span>
        </div>
      </div>
    </div>
  );
};
