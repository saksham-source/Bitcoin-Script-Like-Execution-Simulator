'use client';

import React from 'react';
import { ExecutionStatus, ExecutionResult, StackValue, ExecutionError, formatStackValue } from '@/engine/types';
import { ShieldCheck, ShieldAlert, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

interface ConsensusAuditCardProps {
  status: ExecutionStatus | string;
  finalResult: ExecutionResult | null;
  stack: StackValue[];
  currentStepIndex: number;
  totalSteps: number;
  error?: ExecutionError | null;
}

export const ConsensusAuditCard: React.FC<ConsensusAuditCardProps> = ({
  status,
  finalResult,
  stack,
  currentStepIndex,
  totalSteps,
  error,
}) => {
  const isCompleted = status === 'COMPLETED';
  const isValid = finalResult?.status === 'VALID';
  const isHalted = status === 'ERROR' || !!error;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isCompleted && isValid ? (
            <ShieldCheck className="w-4 h-4 text-primary" />
          ) : isHalted || (isCompleted && !isValid) ? (
            <ShieldAlert className="w-4 h-4 text-rose-700" />
          ) : (
            <Clock className="w-4 h-4 text-secondary" />
          )}
          <h4 className="font-headline font-semibold text-xs tracking-wide text-on-surface uppercase">
            Consensus Protocol Verdict
          </h4>
        </div>
        <span className="font-mono text-[11px] text-secondary">
          Step {currentStepIndex} / {totalSteps}
        </span>
      </div>

      {/* Main Consensus Verdict Indicator */}
      <div className="my-2">
        {isCompleted ? (
          isValid ? (
            <div className="bg-primary-fixed/30 border border-primary/40 rounded p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="font-label font-bold text-xs text-primary">
                  CONSENSUS: VALID
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold bg-primary text-on-primary px-2 py-0.5 rounded">
                SPEND APPROVED
              </span>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-300 rounded p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-700 shrink-0" />
                <span className="font-label font-bold text-xs text-rose-800">
                  CONSENSUS: INVALID
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold bg-rose-700 text-white px-2 py-0.5 rounded">
                TX REJECTED
              </span>
            </div>
          )
        ) : isHalted ? (
          <div className="bg-rose-50 border border-rose-300 rounded p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-700 shrink-0" />
              <span className="font-label font-bold text-xs text-rose-800">
                EXECUTION HALTED
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold bg-rose-700 text-white px-2 py-0.5 rounded">
              FAULT
            </span>
          </div>
        ) : (
          <div className="bg-surface-container-low border border-outline-variant/40 rounded p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary shrink-0" />
              <span className="font-label font-semibold text-xs text-secondary">
                {status === 'STEPPING' ? 'STEPPING VM...' : 'AWAITING RUN'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded">
              READY
            </span>
          </div>
        )}
      </div>

      {/* Protocol Audit Metrics */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-surface-variant/40 text-[11px] font-mono">
        <div className="text-secondary">
          <span className="text-[9px] uppercase tracking-wider block font-label text-secondary/70">
            Clean Stack Rule
          </span>
          <span className={stack.length === 1 ? 'text-primary font-semibold' : 'text-secondary'}>
            {stack.length === 1 ? '✓ Exactly 1 item' : `${stack.length} items`}
          </span>
        </div>
        <div className="text-right text-secondary">
          <span className="text-[9px] uppercase tracking-wider block font-label text-secondary/70">
            Top Element
          </span>
          <span className="text-on-surface font-semibold truncate block">
            {stack.length > 0 ? formatStackValue(stack[stack.length - 1]) : 'EMPTY'}
          </span>
        </div>
      </div>
    </div>
  );
};
