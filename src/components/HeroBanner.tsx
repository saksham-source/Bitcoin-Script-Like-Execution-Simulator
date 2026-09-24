'use client';

import React from 'react';
import { ExecutionResult } from '@/engine/types';

interface HeroBannerProps {
  activeProgramName: string;
  opcodesCount: number;
  status: string;
  finalResult: ExecutionResult | null;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activeProgramName,
  opcodesCount,
  status,
  finalResult,
}) => {
  const isCompleted = status === 'COMPLETED' || status === 'ERROR';
  const isFinalValid = finalResult?.status === 'VALID';

  return (
    <div className="border-b border-surface-variant bg-surface-container-lowest py-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-label text-secondary uppercase tracking-widest mb-2 font-semibold">
              <span>Module 01</span>
              <span className="text-outline-variant">•</span>
              <span>Alexandria Editorial Series</span>
              <span className="text-outline-variant">•</span>
              <span>Deterministic Virtual Machines</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-tight">
              Deconstructing Bitcoin Script Execution: Stack &amp; Opcode State
            </h1>
            <p className="mt-3 text-secondary text-base sm:text-lg leading-relaxed font-body">
              Inspect raw opcodes, track the execution pointer, observe real-time LIFO stack mutations, and analyze consensus validity under canonical Bitcoin protocol constraints.
            </p>
          </div>

          {/* Live Quick Stats Card */}
          <div className="flex md:flex-col gap-3 bg-surface-container-low p-3.5 rounded border border-outline-variant/60 min-w-[240px] shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-label">Active Script:</span>
              <span className="font-mono font-semibold text-primary truncate max-w-[140px]">
                {activeProgramName}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-label">Opcodes Parsed:</span>
              <span className="font-mono font-bold text-on-surface">
                {opcodesCount} Instructions
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary font-label">Consensus State:</span>
              <span
                className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                  isCompleted
                    ? isFinalValid
                      ? 'bg-primary-fixed text-primary'
                      : 'bg-rose-100 text-rose-800'
                    : 'bg-surface-container text-tertiary'
                }`}
              >
                {isCompleted ? finalResult?.status : status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
