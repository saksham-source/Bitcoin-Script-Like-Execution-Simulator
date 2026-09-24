'use client';

import React from 'react';
import { Layers, Terminal, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onToggleReference?: () => void;
  showReference?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleReference, showReference }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl">
            ₿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Bitcoin Script Execution Simulator
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Educational Lab
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Visualize stack-based Bitcoin Script execution step-by-step with state inspection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Stack-Based VM</span>
            <span className="text-slate-600">•</span>
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Deterministic</span>
          </div>

          {onToggleReference && (
            <button
              onClick={onToggleReference}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showReference
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Opcode Guide</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
