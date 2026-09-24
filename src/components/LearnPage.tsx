'use client';

import React from 'react';
import {
  Code,
  Binary,
  ShieldCheck,
  Cpu,
  Layers,
  ListTree,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Play,
} from 'lucide-react';

interface LearnPageProps {
  onOpenSimulator: () => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onOpenSimulator }) => {
  const pipelineSteps = [
    {
      title: 'Script Input',
      desc: 'Raw text of Bitcoin Script instructions and numeric operands.',
      icon: Code,
      accent: 'text-amber-400',
    },
    {
      title: 'Tokenizer',
      desc: 'Lexical analysis splits instructions, arguments, and line offsets.',
      icon: Binary,
      accent: 'text-sky-400',
    },
    {
      title: 'Validator',
      desc: 'Static validation checks opcode support and argument arity.',
      icon: ShieldCheck,
      accent: 'text-indigo-400',
    },
    {
      title: 'Execution Engine',
      desc: 'Step-by-step deterministic state machine evaluates opcodes.',
      icon: Cpu,
      accent: 'text-purple-400',
    },
    {
      title: 'Stack (LIFO)',
      desc: 'Operands pushed and popped dynamically in last-in, first-out memory.',
      icon: Layers,
      accent: 'text-cyan-400',
    },
    {
      title: 'Execution Trace',
      desc: 'Comprehensive ledger of before/after stack states per operation.',
      icon: ListTree,
      accent: 'text-emerald-400',
    },
    {
      title: 'VALID / INVALID',
      desc: 'Consensus rule: Script succeeds if TOS is truthy and no underflows occurred.',
      icon: CheckCircle2,
      accent: 'text-emerald-500',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Intro Header */}
      <div className="bg-canvas-surface border border-border-subtle rounded p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-bitcoin/10 text-bitcoin border border-bitcoin/30 text-xs font-mono">
            <span>BITCOIN PROTOCOL SPECIFICATION</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-slate-100">
            How Bitcoin Script Executes
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Bitcoin uses a Forth-like, stack-based, non-Turing-complete scripting language to define spending conditions for Unspent Transaction Outputs (UTXOs).
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-bitcoin hover:bg-amber-500 text-canvas-dark font-mono font-bold text-xs rounded transition-colors shadow-lg self-start md:self-auto"
        >
          <Play className="w-4 h-4 fill-canvas-dark" />
          <span>Launch Simulator</span>
        </button>
      </div>

      {/* Visual Flow Diagram */}
      <div className="bg-canvas-surface border border-border-subtle rounded p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">
            7-Stage Script Execution Lifecycle
          </h3>
        </div>

        {/* Desktop Pipeline Flow */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-2 relative">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === pipelineSteps.length - 1;

            return (
              <div key={step.title} className="flex flex-col relative group">
                <div className="bg-canvas-dark border border-border-subtle hover:border-slate-600 rounded p-3 h-full flex flex-col justify-between transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                        0{idx + 1}
                      </span>
                      <Icon className={`w-4 h-4 ${step.accent}`} />
                    </div>
                    <h4 className="text-xs font-bold font-mono text-slate-200 mb-1">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug mt-2">
                    {step.desc}
                  </p>
                </div>

                {!isLast && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile/Tablet Pipeline Stack */}
        <div className="lg:hidden space-y-3">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === pipelineSteps.length - 1;

            return (
              <div key={step.title} className="space-y-2">
                <div className="bg-canvas-dark border border-border-subtle rounded p-3 flex items-start gap-3">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 shrink-0">
                    <Icon className={`w-4 h-4 ${step.accent}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                        Stage 0{idx + 1}:
                      </span>
                      <h4 className="text-xs font-bold font-mono text-slate-200">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Technical Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-canvas-surface border border-border-subtle rounded p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-bitcoin" />
            <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">
              1. What is Stack-Based Execution?
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Bitcoin Script does not use registers (like x86 or ARM CPUs) or variables. Instead, it operates strictly on a <strong>Last-In, First-Out (LIFO)</strong> stack.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
            <li><strong className="text-slate-200">Push:</strong> Places values directly onto the Top of Stack (TOS).</li>
            <li><strong className="text-slate-200">Pop:</strong> Opcodes consume the topmost items from the stack as inputs.</li>
            <li><strong className="text-slate-200">Result:</strong> Any computation output is immediately pushed back onto the stack.</li>
          </ul>
        </div>

        <div className="bg-canvas-surface border border-border-subtle rounded p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">
              2. Why Non-Turing Complete?
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike Ethereum’s EVM or general programming languages, Bitcoin Script intentionally <strong>omits loops (for/while) and recursion</strong>.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
            <li><strong className="text-slate-200">Halting Guarantee:</strong> Script execution is guaranteed to terminate in finite, bounded time.</li>
            <li><strong className="text-slate-200">DoS Prevention:</strong> Nodes validating transactions across the network cannot be frozen by infinite loops.</li>
            <li><strong className="text-slate-200">Predictable Cost:</strong> Validation complexity is strictly linear with respect to script length.</li>
          </ul>
        </div>

        <div className="bg-canvas-surface border border-border-subtle rounded p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">
              3. Opcode Taxonomy
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Opcodes represent atomic execution primitives supported by the Bitcoin virtual machine:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
            <li><strong className="text-amber-400">Constants:</strong> <code className="text-slate-200">PUSH &lt;val&gt;</code> inserts data.</li>
            <li><strong className="text-cyan-400">Arithmetic:</strong> <code className="text-slate-200">ADD</code>, <code className="text-slate-200">SUB</code> calculate integer values.</li>
            <li><strong className="text-indigo-400">Stack Control:</strong> <code className="text-slate-200">DUP</code>, <code className="text-slate-200">DROP</code> duplicate or discard stack items.</li>
            <li><strong className="text-emerald-400">Conditionals:</strong> <code className="text-slate-200">EQUAL</code>, <code className="text-slate-200">VERIFY</code>, <code className="text-slate-200">EQUALVERIFY</code> guard spending conditions.</li>
          </ul>
        </div>

        <div className="bg-canvas-surface border border-border-subtle rounded p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">
              4. Consensus Validation Rule
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When all script instructions have executed, the Bitcoin network applies a strict validation criterion:
          </p>
          <div className="bg-canvas-dark p-3 rounded border border-border-subtle font-mono text-xs text-slate-300 space-y-1">
            <div className="text-emerald-400 font-bold">VALID:</div>
            <div>No errors occurred during execution AND top stack item is TRUE (non-zero).</div>
            <div className="text-rose-400 font-bold pt-1">INVALID:</div>
            <div>Any error occurred, or the stack is empty, or the top stack item is FALSE (zero).</div>
          </div>
        </div>
      </div>

      {/* Educational Error Reference */}
      <div className="bg-canvas-surface border border-border-subtle rounded p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">
            Common Execution Error Types
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-canvas-dark p-4 rounded border border-border-subtle space-y-2">
            <div className="text-xs font-mono font-bold text-rose-400">
              STACK UNDERFLOW
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              An opcode attempted to pop more values than are currently present on the stack (e.g. calling <code className="text-slate-200">ADD</code> when stack depth &lt; 2).
            </p>
          </div>

          <div className="bg-canvas-dark p-4 rounded border border-border-subtle space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400">
              UNKNOWN OPCODE
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              An unsupported or invalid instruction token was encountered during execution. The engine halts immediately.
            </p>
          </div>

          <div className="bg-canvas-dark p-4 rounded border border-border-subtle space-y-2">
            <div className="text-xs font-mono font-bold text-sky-400">
              VERIFY FAILED
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              A guard condition evaluated to FALSE or 0 during <code className="text-slate-200">VERIFY</code> or <code className="text-slate-200">EQUALVERIFY</code>, rejecting transaction spending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
