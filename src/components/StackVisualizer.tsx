'use client';

import React from 'react';
import { StackValue, formatStackValue } from '@/engine/types';
import { Layers, ArrowDown, Database, Cpu } from 'lucide-react';

interface StackVisualizerProps {
  stack: StackValue[];
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ stack }) => {
  // LIFO Stack display: Top item (last in array) shown at the top of the container
  const reversedStack = [...stack].reverse();

  // Helper to format values into fixed hex/padded word representation like Stitch IDE
  const getPaddedRepresentation = (item: StackValue): string => {
    if (item.type === 'boolean') {
      return item.value ? '0x0000...0001 (OP_TRUE)' : '0x0000...0000 (OP_FALSE)';
    }
    const hex = Math.abs(item.value).toString(16).padStart(4, '0');
    return `0x0000...${hex} (dec: ${item.value})`;
  };

  return (
    <div className="bg-[#111827] border border-[#1E293B] rounded flex flex-col shadow-lg h-full overflow-hidden">
      {/* Panel Header */}
      <div className="bg-[#161F30] border-b border-[#1E293B] p-3 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#F7931A]" />
          <h3 className="font-semibold text-xs tracking-tight text-[#F8FAFC]">
            LIFO Execution Stack
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#38BDF8] bg-[#0B0F17] px-2 py-0.5 rounded border border-[#1E293B]">
            Stack Memory
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8] bg-[#0B0F17] px-2 py-0.5 rounded border border-[#1E293B]">
            Depth: <strong className="text-[#F7931A]">{stack.length}</strong> / 1024
          </span>
        </div>
      </div>

      {/* Sub-header: Top of Stack Guide Indicator */}
      <div className="p-2 px-4 bg-[#161F30]/60 border-b border-[#1E293B] flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#F7931A] flex items-center gap-1.5 font-bold tracking-wider text-[10px] uppercase">
          <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
          <span>▲ Top of Stack (TOS) — Next Operand Consumed</span>
        </span>
        <span className="text-[#64748B] text-[10px]">Pop Target</span>
      </div>

      {/* Stack Items Chamber */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-[#0B0F17]/80 min-h-[260px] max-h-[360px]">
        {stack.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#1E293B] rounded space-y-3">
            <div className="size-10 rounded bg-[#161F30] border border-[#1E293B] flex items-center justify-center text-[#64748B]">
              <Layers className="w-5 h-5 text-[#64748B]" />
            </div>
            <div>
              <div className="font-mono text-xs text-[#94A3B8] font-bold">
                Stack Empty: [ ]
              </div>
              <p className="text-[11px] text-[#64748B] max-w-[240px] leading-relaxed mt-1">
                Execute <code className="text-[#F7931A] font-bold">PUSH &lt;val&gt;</code> to place numeric operands onto the stack.
              </p>
            </div>
            {/* Wireframe blueprint register slots */}
            <div className="w-full max-w-[200px] space-y-1.5 pt-1 opacity-25 pointer-events-none">
              <div className="border border-dashed border-[#334155] rounded py-1 text-center text-[10px] font-mono text-[#64748B]">
                [Register 0 : Available]
              </div>
              <div className="border border-dashed border-[#334155] rounded py-1 text-center text-[10px] font-mono text-[#64748B]">
                [Register 1 : Available]
              </div>
            </div>
          </div>
        ) : (
          reversedStack.map((item, reverseIdx) => {
            const originalIndex = stack.length - 1 - reverseIdx;
            const isTop = reverseIdx === 0;

            return (
              <div
                key={originalIndex}
                className={`rounded p-3 transition-all duration-200 border relative ${
                  isTop
                    ? 'bg-[#161F30] border-[#F7931A] shadow-md shadow-[#F7931A]/10 ring-1 ring-[#F7931A]/40'
                    : 'bg-[#111827] border-[#1E293B] text-[#94A3B8]'
                }`}
              >
                {/* Slot index badge & Type pill */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        isTop
                          ? 'bg-[#F7931A]/20 text-[#F7931A] border border-[#F7931A]/40'
                          : 'bg-[#0B0F17] text-[#64748B] border border-[#1E293B]'
                      }`}
                    >
                      Slot [{originalIndex}] {isTop ? '• TOS' : ''}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      item.type === 'boolean'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Primary Large Value Readout */}
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`text-xl font-mono font-black tracking-wider ${
                      item.type === 'boolean'
                        ? item.value
                          ? 'text-[#10B981]'
                          : 'text-[#EF4444]'
                        : 'text-[#F8FAFC]'
                    }`}
                  >
                    {formatStackValue(item)}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B] truncate">
                    {getPaddedRepresentation(item)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Panel Footer: Bottom of Stack Base Plate */}
      <div className="p-2.5 px-4 bg-[#161F30] border-t border-[#1E293B] flex items-center justify-between text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
        <span className="text-slate-500">▼ LIFO Base Plate</span>
        <span>64-bit Word Representation</span>
      </div>
    </div>
  );
};
