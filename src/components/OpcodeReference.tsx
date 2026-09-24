'use client';

import React, { useState, useMemo } from 'react';
import { OPCODE_REGISTRY } from '@/engine/opcodes';
import { OpcodeName } from '@/engine/types';
import {
  BookOpen,
  Search,
  ArrowRight,
  Code2,
  CheckCircle,
  Copy,
  Terminal,
} from 'lucide-react';

interface OpcodeReferenceProps {
  onLoadExample?: (code: string) => void;
}

interface OpcodeMeta {
  category: 'Constants' | 'Arithmetic' | 'Stack' | 'Comparison' | 'Control / Guard';
  before: string;
  after: string;
  example: string;
}

const OPCODE_META: Record<OpcodeName, OpcodeMeta> = {
  PUSH: {
    category: 'Constants',
    before: '[ ... ]',
    after: '[ ..., n ]',
    example: 'PUSH 5',
  },
  ADD: {
    category: 'Arithmetic',
    before: '[ ..., a, b ]',
    after: '[ ..., a + b ]',
    example: 'PUSH 5\nPUSH 3\nADD',
  },
  SUB: {
    category: 'Arithmetic',
    before: '[ ..., a, b ]',
    after: '[ ..., a - b ]',
    example: 'PUSH 10\nPUSH 4\nSUB',
  },
  EQUAL: {
    category: 'Comparison',
    before: '[ ..., a, b ]',
    after: '[ ..., TRUE / FALSE ]',
    example: 'PUSH 8\nPUSH 8\nEQUAL',
  },
  NOT: {
    category: 'Comparison',
    before: '[ ..., x ]',
    after: '[ ..., !x ]',
    example: 'PUSH 0\nNOT',
  },
  VERIFY: {
    category: 'Control / Guard',
    before: '[ ..., x ]',
    after: '[ ... ] (halts if 0/FALSE)',
    example: 'PUSH 1\nVERIFY\nPUSH 1',
  },
  EQUALVERIFY: {
    category: 'Control / Guard',
    before: '[ ..., a, b ]',
    after: '[ ... ] (halts if a != b)',
    example: 'PUSH 100\nPUSH 100\nEQUALVERIFY\nPUSH 1',
  },
  DUP: {
    category: 'Stack',
    before: '[ ..., a ]',
    after: '[ ..., a, a ]',
    example: 'PUSH 42\nDUP',
  },
  DROP: {
    category: 'Stack',
    before: '[ ..., a ]',
    after: '[ ... ]',
    example: 'PUSH 99\nDROP',
  },
};

const CATEGORIES = ['All', 'Constants', 'Arithmetic', 'Stack', 'Comparison', 'Control / Guard'] as const;

export const OpcodeReference: React.FC<OpcodeReferenceProps> = ({ onLoadExample }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const allOpcodes = Object.values(OPCODE_REGISTRY);

  const filteredOpcodes = useMemo(() => {
    return allOpcodes.filter((op) => {
      const meta = OPCODE_META[op.name];
      const matchesSearch =
        op.name.toLowerCase().includes(search.toLowerCase()) ||
        op.description.toLowerCase().includes(search.toLowerCase()) ||
        op.educationalSummary.toLowerCase().includes(search.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' || meta.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [allOpcodes, search, selectedCategory]);

  const handleCopy = (name: string, example: string) => {
    navigator.clipboard.writeText(example);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-headline font-bold text-on-surface">
                Bitcoin Script Opcode Lexicon
              </h2>
            </div>
            <p className="text-xs text-secondary font-body">
              Canonical reference manual for stack opcodes supported by this educational simulator.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container text-secondary font-mono text-xs border border-outline-variant/40">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>Deterministic VM Specification</span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-surface-variant">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search opcodes, stack effects, or descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/60 text-on-surface pl-9 pr-4 py-2 rounded text-xs font-mono placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-label rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'bg-surface-container-high text-secondary hover:text-on-surface hover:bg-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Opcodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpcodes.map((op) => {
          const meta = OPCODE_META[op.name];
          const isCopied = copiedName === op.name;

          return (
            <div
              key={op.name}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded p-5 flex flex-col justify-between hover:border-primary/60 transition-all shadow-sm group"
            >
              <div>
                {/* Opcode Header */}
                <div className="flex items-center justify-between pb-3 border-b border-surface-variant mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base px-2.5 py-0.5 rounded bg-primary-fixed text-primary">
                      {op.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-container text-secondary font-medium">
                      {meta.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-secondary">
                    Min Stack: {op.requiredStackSize}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface font-semibold font-body mb-1.5">
                  {op.description}
                </p>
                <p className="text-xs text-secondary leading-relaxed mb-4 font-body">
                  {op.educationalSummary}
                </p>

                {/* Stack Effect Box */}
                <div className="bg-surface-container-low p-3 rounded border border-outline-variant/40 space-y-1.5 mb-4 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary uppercase text-[10px] tracking-wider font-semibold">
                      Before:
                    </span>
                    <span className="text-on-surface font-bold">{meta.before}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-surface-variant/60">
                    <span className="text-secondary uppercase text-[10px] tracking-wider font-semibold">
                      After:
                    </span>
                    <span className="text-primary font-bold">{meta.after}</span>
                  </div>
                </div>
              </div>

              {/* Example Snippet & Load Action */}
              <div className="pt-3 border-t border-surface-variant space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-label uppercase tracking-wider text-secondary font-bold">
                    Example Script:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(op.name, meta.example)}
                      className="text-[11px] font-label text-secondary hover:text-on-surface flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy example"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-primary" />
                          <span className="text-primary font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    {onLoadExample && (
                      <button
                        onClick={() => onLoadExample(meta.example)}
                        className="text-[11px] font-label text-primary hover:text-primary/80 font-bold flex items-center gap-1 transition-colors ml-2 cursor-pointer"
                      >
                        <Code2 className="w-3 h-3" />
                        <span>Load in VM</span>
                      </button>
                    )}
                  </div>
                </div>

                <pre className="bg-surface-container p-2.5 rounded border border-outline-variant/40 font-mono text-xs text-on-surface overflow-x-auto font-semibold">
                  {meta.example}
                </pre>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOpcodes.length === 0 && (
        <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant/60 rounded text-secondary font-mono text-xs">
          No opcodes matching "{search}" in category "{selectedCategory}".
        </div>
      )}
    </div>
  );
};
