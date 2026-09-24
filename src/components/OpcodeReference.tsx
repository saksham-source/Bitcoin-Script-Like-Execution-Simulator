'use client';

import React, { useState, useMemo } from 'react';
import { OPCODE_REGISTRY } from '@/engine/opcodes';
import { OpcodeName } from '@/engine/types';
import {
  BookOpen,
  Search,
  ArrowRight,
  Code2,
  Layers,
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
    example: 'PUSH 1\nVERIFY',
  },
  EQUALVERIFY: {
    category: 'Control / Guard',
    before: '[ ..., a, b ]',
    after: '[ ... ] (halts if a != b)',
    example: 'PUSH 100\nPUSH 100\nEQUALVERIFY',
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
      <div className="bg-canvas-surface border border-border-subtle rounded p-5 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-bitcoin" />
              <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-mono">
                Opcode Reference Specification
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Interactive reference manual for Bitcoin Script opcodes supported by this educational simulator.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-canvas-dark border border-border-subtle text-slate-300 font-mono text-xs self-start md:self-auto">
            <Terminal className="w-3.5 h-3.5 text-bitcoin" />
            <span>Supported by this educational simulator</span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-border-subtle">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search opcodes, stack effects, or descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-canvas-dark border border-border-subtle text-slate-200 pl-9 pr-4 py-2 rounded text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-bitcoin transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-bitcoin/20 text-bitcoin border border-bitcoin/40 font-bold'
                    : 'bg-canvas-dark text-slate-400 border border-border-subtle hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Opcodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOpcodes.map((op) => {
          const meta = OPCODE_META[op.name];
          const isCopied = copiedName === op.name;

          return (
            <div
              key={op.name}
              className="bg-canvas-surface border border-border-subtle rounded p-4 flex flex-col justify-between hover:border-slate-600 transition-all shadow-md group"
            >
              <div>
                {/* Opcode Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base px-2.5 py-0.5 rounded bg-bitcoin/10 text-bitcoin border border-bitcoin/30">
                      {op.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-canvas-dark text-slate-400 border border-border-subtle">
                      {meta.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Min Stack: {op.requiredStackSize}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-200 font-medium mb-1.5">
                  {op.description}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {op.educationalSummary}
                </p>

                {/* Stack Effect Box */}
                <div className="bg-canvas-dark p-3 rounded border border-border-subtle space-y-2 mb-4 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 uppercase text-[10px] tracking-wider">Before:</span>
                    <span className="text-slate-300 font-bold">{meta.before}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-500 uppercase text-[10px] tracking-wider">After:</span>
                    <span className="text-cyan-400 font-bold">{meta.after}</span>
                  </div>
                </div>
              </div>

              {/* Example Snippet & Load Action */}
              <div className="pt-3 border-t border-border-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Example Script:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(op.name, meta.example)}
                      className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                      title="Copy example"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
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
                        className="text-[11px] font-mono text-bitcoin hover:text-amber-300 flex items-center gap-1 transition-colors ml-2"
                      >
                        <Code2 className="w-3 h-3" />
                        <span>Load</span>
                      </button>
                    )}
                  </div>
                </div>

                <pre className="bg-slate-950 p-2.5 rounded border border-border-subtle font-mono text-xs text-amber-300 overflow-x-auto">
                  {meta.example}
                </pre>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOpcodes.length === 0 && (
        <div className="text-center py-12 bg-canvas-surface border border-border-subtle rounded text-slate-500 font-mono text-xs">
          No opcodes matching "{search}" in category "{selectedCategory}".
        </div>
      )}
    </div>
  );
};
