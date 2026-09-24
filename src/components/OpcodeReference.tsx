'use client';

import React from 'react';
import { OPCODE_REGISTRY } from '@/engine/opcodes';
import { BookOpen, X, ArrowRight } from 'lucide-react';

interface OpcodeReferenceProps {
  onClose?: () => void;
}

export const OpcodeReference: React.FC<OpcodeReferenceProps> = ({ onClose }) => {
  const opcodes = Object.values(OPCODE_REGISTRY);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Supported Opcode Reference
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {opcodes.map((op) => (
          <div
            key={op.name}
            className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold text-amber-400 text-sm px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {op.name}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Needs {op.requiredStackSize} on stack
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mb-1">{op.description}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                {op.educationalSummary}
              </p>
            </div>

            <div className="text-[11px] border-t border-slate-900 pt-2 space-y-1 font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[10px] uppercase">Input:</span>
                <span className="text-slate-300 text-[10px] truncate">{op.inputDescription}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="text-slate-300 text-[10px] truncate">{op.outputDescription}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
