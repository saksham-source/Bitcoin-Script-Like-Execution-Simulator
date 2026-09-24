'use client';

import React from 'react';
import { StackValue, formatStackValue } from '@/engine/types';
import { Layers, ArrowDown } from 'lucide-react';

interface StackVisualizerProps {
  stack: StackValue[];
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ stack }) => {
  // Stack items in display order: Top item (Index length-1) rendered at top of visual container
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
    <div className="bg-[#111827] border border-[#1E293B] rounded flex flex-col shadow-sm h-full overflow-hidden">
      {/* Panel Header */}
      <div className="bg-[#161F30] border-b border-[#1E293B] p-3 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#F7931A]" />
          <h3 className="font-semibold text-xs tracking-tight text-[#F8FAFC]">
            Stack State Engine
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#38BDF8] bg-[#111827] px-2 py-0.5 rounded border border-[#1E293B]">
            LIFO Order
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8] bg-[#111827] px-2 py-0.5 rounded border border-[#1E293B]">
            Depth: <strong className="text-[#F7931A]">{stack.length}</strong> / 1024
          </span>
        </div>
      </div>

      {/* Sub-header: Top of Stack Marker */}
      <div className="p-2.5 px-4 bg-[#161F30]/40 border-b border-[#1E293B] flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#94A3B8] flex items-center gap-1.5 font-sans font-medium">
          <ArrowDown className="w-3.5 h-3.5 text-[#F7931A] animate-bounce" />
          <span>Top of Stack (TOS)</span>
        </span>
        <span className="text-[#64748B] text-[10px]">LIFO Registers</span>
      </div>

      {/* Stack Items Chamber */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5 bg-[#0B0F17]/60 min-h-[260px] max-h-[360px]">
        {stack.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#1E293B] rounded space-y-2">
            <span className="text-xl">📭</span>
            <div className="font-mono text-xs text-[#94A3B8] font-semibold">
              Stack is currently empty [ ]
            </div>
            <p className="text-[11px] text-[#64748B] max-w-[240px] leading-relaxed">
              Execute <code className="text-[#F7931A] font-bold">PUSH &lt;val&gt;</code> instructions to place operands onto the stack.
            </p>
            {/* Placeholder wireframe slots to evoke physical hardware registers */}
            <div className="w-full space-y-1.5 pt-2 opacity-30 pointer-events-none">
              <div className="border border-dashed border-[#334155] rounded p-1.5 text-center text-[10px] font-mono text-[#64748B]">
                Register [0] (Available)
              </div>
              <div className="border border-dashed border-[#334155] rounded p-1.5 text-center text-[10px] font-mono text-[#64748B]">
                Register [1] (Available)
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
                className={`rounded p-3 transition-all relative border ${
                  isTop
                    ? 'bg-[#161F30] border-[#F7931A] shadow-sm shadow-[#F7931A]/10 ring-1 ring-[#F7931A]/30'
                    : 'bg-[#111827] border-[#1E293B] text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                        isTop ? 'text-[#F7931A]' : 'text-[#64748B]'
                      }`}
                    >
                      Slot [{originalIndex}] {isTop ? '• Top of Stack (TOS)' : ''}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                      item.type === 'boolean'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Primary Value Display */}
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`text-lg font-mono font-extrabold tracking-wide ${
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

      {/* Panel Footer: Bottom of Stack Marker & Telemetry */}
      <div className="p-2.5 px-4 bg-[#161F30] border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
        <span>══ BOTTOM OF STACK ══</span>
        <span>Word Alignment: 64-bit Int / Bool</span>
      </div>
    </div>
  );
};
