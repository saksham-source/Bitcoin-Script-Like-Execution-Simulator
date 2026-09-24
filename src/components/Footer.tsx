'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-surface-variant bg-surface-container-lowest py-8 text-xs text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded bg-primary-fixed text-primary font-bold text-sm">
            ₿
          </div>
          <p className="font-label">
            Alexandria Scholarly Edition • Bitcoin Script Execution Environment Specification
          </p>
        </div>
        <div className="flex items-center gap-6 font-label text-xs">
          <span className="hover:text-on-surface transition-colors cursor-pointer">BIP-16 (P2SH)</span>
          <span className="hover:text-on-surface transition-colors cursor-pointer">Consensus Rules</span>
          <span className="hover:text-on-surface transition-colors cursor-pointer">Deterministic LIFO</span>
          <span className="hover:text-on-surface transition-colors cursor-pointer">Terms of Educational Use</span>
        </div>
      </div>
    </footer>
  );
};
