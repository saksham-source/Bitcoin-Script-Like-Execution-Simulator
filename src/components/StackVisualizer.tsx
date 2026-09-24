'use client';

import React from 'react';
import { StackValue, formatStackValue } from '@/engine/types';
import { Layers, ArrowDown } from 'lucide-react';

interface StackVisualizerProps {
  stack: StackValue[];
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ stack }) => {
  // Stack items in display order: Top item rendered first, down to Bottom
  const reversedStack = [...stack].reverse();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col shadow-xl min-h-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Stack State Visualizer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Depth: <strong className="text-amber-400">{stack.length}</strong> {stack.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Visual Stack Chamber */}
      <div className="flex-1 flex flex-col justify-end bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 relative overflow-y-auto">
        {stack.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-slate-800 rounded-lg">
            <span className="text-2xl mb-1">📭</span>
            <p className="text-xs font-semibold text-slate-400 font-mono">Stack is Empty []</p>
            <p className="text-[11px] text-slate-600 mt-1 max-w-[200px]">
              Execute instructions like <code className="text-amber-500 font-bold">PUSH</code> to add items
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 w-full">
            {reversedStack.map((item, reverseIdx) => {
              const originalIndex = stack.length - 1 - reverseIdx;
              const isTop = reverseIdx === 0;

              return (
                <div key={originalIndex} className="relative group">
                  {/* Top indicator tag */}
                  {isTop && (
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 mb-1 px-1">
                      <ArrowDown className="w-3 h-3 text-amber-400 animate-bounce" />
                      <span>TOP OF STACK</span>
                    </div>
                  )}

                  {/* Stack Card */}
                  <div
                    className={`p-3 rounded-lg border font-mono transition-all flex items-center justify-between shadow-md ${
                      isTop
                        ? 'bg-slate-900 border-amber-500/50 shadow-amber-500/5 ring-1 ring-amber-500/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Stack index */}
                      <span className="text-[11px] text-slate-500 font-bold px-1.5 py-0.5 bg-slate-950 rounded border border-slate-800">
                        [{originalIndex}]
                      </span>

                      {/* Stack item value */}
                      <span
                        className={`text-base font-extrabold tracking-wide ${
                          item.type === 'boolean'
                            ? item.value
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {formatStackValue(item)}
                      </span>
                    </div>

                    {/* Type badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.type === 'boolean'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stack Base Indicator */}
      <div className="mt-2 text-center text-[10px] font-mono uppercase tracking-widest text-slate-600 border-t border-slate-800/60 pt-2">
        ══ BOTTOM OF STACK ══
      </div>
    </div>
  );
};
