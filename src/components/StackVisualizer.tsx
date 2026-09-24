'use client';

import React from 'react';
import { StackValue, formatStackValue } from '@/engine/types';
import { Layers } from 'lucide-react';

interface StackVisualizerProps {
  stack: StackValue[];
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ stack }) => {
  // LIFO display: Top item is slot [0] in Stitch notation (last in array)
  const reversedStack = [...stack].reverse();

  // Helper to format values into 64-character 32-byte hex representation as in Stitch
  const get32ByteHexRepresentation = (item: StackValue): string => {
    if (item.type === 'boolean') {
      return item.value
        ? '0x0000000000000000000000000000000000000000000000000000000000000001'
        : '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
    const hex = Math.abs(item.value).toString(16).padStart(8, '0');
    return `0x00000000000000000000000000000000000000000000000000000000${hex}`;
  };

  const getDecLabel = (item: StackValue): string => {
    if (item.type === 'boolean') {
      return item.value ? 'TRUE (0x01)' : 'FALSE (0x00)';
    }
    const hex = Math.abs(item.value).toString(16).padStart(2, '0');
    return `0x${hex} (dec: ${item.value})`;
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded shadow-sm overflow-hidden flex flex-col h-[480px]">
      {/* Header */}
      <div className="p-3.5 border-b border-surface-variant bg-surface-container-low flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="font-headline font-semibold text-sm text-on-surface">
            Bitcoin Script Stack (32-Byte Words)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded">
          LIFO Order
        </span>
      </div>

      {/* Sub-header */}
      <div className="p-3 bg-surface-container-lowest border-b border-surface-variant/60 flex items-center justify-between text-xs">
        <span className="font-label text-secondary font-medium">Top of Stack (μ_s[0])</span>
        <span className="font-mono text-[11px] text-primary font-semibold">
          Depth: {stack.length} / 1024
        </span>
      </div>

      {/* Stack Container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse justify-end gap-2.5 bg-surface-container-low/40">
        {stack.length === 0 ? (
          <div className="border border-dashed border-outline-variant/60 rounded p-6 text-center text-xs font-mono text-secondary my-auto">
            Stack Empty (μ_s = [ ])
          </div>
        ) : (
          reversedStack.map((item, idx) => {
            const isTop = idx === 0;

            return (
              <div
                key={idx}
                className={`bg-surface-container-lowest rounded p-2.5 shadow-sm transition-all relative ${
                  isTop ? 'border-2 border-primary' : 'border border-outline-variant/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      isTop ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    Slot [{idx}] {isTop ? '- Top of Stack' : ''}
                  </span>
                  <span className="text-[10px] font-mono text-secondary font-medium">
                    {getDecLabel(item)}
                  </span>
                </div>
                <div className="font-mono text-xs text-on-surface break-all font-semibold">
                  {get32ByteHexRepresentation(item)}
                </div>
              </div>
            );
          })
        )}

        {/* Available hardware slots placeholders to convey physical LIFO model */}
        {stack.length < 3 && (
          <>
            <div className="border border-dashed border-outline-variant/60 rounded p-2 text-center text-xs font-mono text-secondary/60">
              Stack slot [{stack.length}] (Available)
            </div>
            <div className="border border-dashed border-outline-variant/40 rounded p-2 text-center text-xs font-mono text-secondary/40">
              Stack slot [{stack.length + 1}] (Available)
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-surface-container-low border-t border-surface-variant flex items-center justify-between text-[11px]">
        <span className="text-secondary font-label">Word Alignment:</span>
        <span className="font-mono font-medium text-on-surface">32-Byte Words / Big-Endian</span>
      </div>
    </div>
  );
};
