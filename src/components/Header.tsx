'use client';

import React from 'react';
import { Download, Copy, Check, Terminal, BookOpen, GraduationCap, Cpu } from 'lucide-react';

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
    <header className="border-b border-surface-variant bg-surface-container-lowest sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Branding */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded bg-primary-fixed text-primary font-bold text-xl shadow-sm">
              ₿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-lg tracking-tight text-on-surface">
                  Bitcoin Script Visualizer
                </span>
                <span className="text-xs uppercase font-label font-semibold tracking-widest px-2 py-0.5 rounded bg-primary-fixed text-primary">
                  Folio I
                </span>
              </div>
              <p className="text-xs text-secondary font-label">
                Canonical Script Reference Lab
              </p>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <nav className="hidden md:flex items-center bg-surface-container p-1 rounded border border-outline-variant/40">
            <button
              onClick={() => onSelectTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-label font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>Simulator Studio</span>
            </button>
            <button
              onClick={() => onSelectTab('opcodes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-label font-semibold transition-all ${
                activeTab === 'opcodes'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-tertiary" />
              <span>Opcode Lexicon</span>
            </button>
            <button
              onClick={() => onSelectTab('learn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-label font-semibold transition-all ${
                activeTab === 'learn'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span>Learn Architecture</span>
            </button>
          </nav>

          {/* Right Actions & Telemetry */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-secondary bg-surface-container px-3 py-1.5 rounded border border-outline-variant/40">
              <span className="inline-block size-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Bitcoin Consensus Spec</span>
            </div>

            <button
              onClick={onCopyScript}
              className="flex items-center gap-1.5 text-xs font-label font-semibold text-secondary hover:text-on-surface px-3 py-1.5 rounded border border-outline-variant hover:bg-surface-container transition-colors"
              title="Copy Script Source"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onExportTrace}
              className="flex items-center gap-1.5 text-xs font-label font-semibold bg-primary text-on-primary hover:bg-primary/90 px-3.5 py-1.5 rounded transition-all shadow-sm"
              title="Export execution trace JSON audit report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Trace</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-surface-variant">
          <button
            onClick={() => onSelectTab('simulator')}
            className={`text-xs font-label font-semibold px-2 py-1 rounded ${
              activeTab === 'simulator' ? 'text-primary bg-primary-fixed/40' : 'text-secondary'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => onSelectTab('opcodes')}
            className={`text-xs font-label font-semibold px-2 py-1 rounded ${
              activeTab === 'opcodes' ? 'text-primary bg-primary-fixed/40' : 'text-secondary'
            }`}
          >
            Opcodes
          </button>
          <button
            onClick={() => onSelectTab('learn')}
            className={`text-xs font-label font-semibold px-2 py-1 rounded ${
              activeTab === 'learn' ? 'text-primary bg-primary-fixed/40' : 'text-secondary'
            }`}
          >
            Learn
          </button>
        </div>
      </div>
    </header>
  );
};
