'use client';

import React from 'react';
import { Layers, Terminal, Download, Copy, Check, BookOpen, GraduationCap, Cpu } from 'lucide-react';

export type ActiveTab = 'simulator' | 'opcodes' | 'learn';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onExportTrace: () => void;
  onCopyScript: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onExportTrace,
  onCopyScript,
  copied,
}) => {
  return (
    <header className="border-b border-[#1E293B] bg-[#0B0F17]/95 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded bg-[#F7931A] text-[#0B0F17] flex items-center justify-center font-black text-lg shadow-sm shadow-[#F7931A]/20">
            ₿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-[#F8FAFC]">
                Bitcoin Script Visualizer
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#161F30] text-[#38BDF8] border border-[#1E293B]">
                Simulator IDE
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-mono">
              Deterministic Ledger Execution & Stack Visualizer
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center bg-[#161F30] p-1 rounded border border-[#1E293B] self-start md:self-center">
          <button
            onClick={() => onSelectTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'simulator'
                ? 'bg-[#1E293B] text-[#F8FAFC] shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#F7931A]" />
            <span>Simulator</span>
          </button>
          <button
            onClick={() => onSelectTab('opcodes')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'opcodes'
                ? 'bg-[#1E293B] text-[#F8FAFC] shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Opcode Guide</span>
          </button>
          <button
            onClick={() => onSelectTab('learn')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'learn'
                ? 'bg-[#1E293B] text-[#F8FAFC] shadow-sm font-semibold'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Learn Bitcoin Script</span>
          </button>
        </nav>

        {/* Right Actions & Telemetry */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-[#94A3B8] bg-[#161F30] px-2.5 py-1 rounded border border-[#1E293B]">
            <span className="inline-block size-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Stack LIFO VM</span>
            <span className="text-[#334155]">•</span>
            <span>Deterministic</span>
          </div>

          <button
            onClick={onCopyScript}
            className="flex items-center gap-1 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] bg-[#161F30] hover:bg-[#1E293B] px-2.5 py-1.5 rounded border border-[#1E293B] transition-colors"
            title="Copy Script Source"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={onExportTrace}
            className="flex items-center gap-1 text-xs font-semibold bg-[#161F30] hover:bg-[#1E293B] text-[#38BDF8] border border-[#1E293B] hover:border-[#334155] px-3 py-1.5 rounded transition-all shadow-sm"
            title="Export full execution trace as JSON audit report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Trace</span>
          </button>
        </div>
      </div>
    </header>
  );
};
