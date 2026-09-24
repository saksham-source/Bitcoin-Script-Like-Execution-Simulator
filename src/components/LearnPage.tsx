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
    },
    {
      title: 'Tokenizer',
      desc: 'Lexical analysis splits instructions, arguments, and line offsets.',
      icon: Binary,
    },
    {
      title: 'Validator',
      desc: 'Static validation checks opcode support and argument arity.',
      icon: ShieldCheck,
    },
    {
      title: 'Execution Engine',
      desc: 'Step-by-step deterministic state machine evaluates opcodes.',
      icon: Cpu,
    },
    {
      title: 'Stack (LIFO)',
      desc: 'Operands pushed and popped dynamically in last-in, first-out memory.',
      icon: Layers,
    },
    {
      title: 'Execution Trace',
      desc: 'Comprehensive ledger of before/after stack states per operation.',
      icon: ListTree,
    },
    {
      title: 'VALID / INVALID',
      desc: 'Consensus rule: Script succeeds if TOS is truthy and no underflows occurred.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Intro Header */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-primary-fixed text-primary text-xs font-label font-bold uppercase tracking-wider">
            <span>BITCOIN CONSENSUS SPECIFICATION</span>
          </div>
          <h2 className="text-2xl font-bold font-headline text-on-surface">
            How Bitcoin Script Executes
          </h2>
          <p className="text-xs sm:text-sm text-secondary max-w-2xl leading-relaxed font-body">
            Bitcoin uses a Forth-like, stack-based, non-Turing-complete scripting language to define spending conditions for Unspent Transaction Outputs (UTXOs).
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-label font-bold text-xs rounded transition-colors shadow-sm self-start md:self-auto cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Simulator Studio</span>
        </button>
      </div>

      {/* Visual Flow Diagram */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-wider">
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
                <div className="bg-surface-container-low border border-outline-variant/60 hover:border-primary/60 rounded p-3 h-full flex flex-col justify-between transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-secondary font-bold">
                        0{idx + 1}
                      </span>
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="text-xs font-bold font-headline text-on-surface mb-1">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-secondary leading-snug mt-2 font-body">
                    {step.desc}
                  </p>
                </div>

                {!isLast && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-secondary/60" />
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
                <div className="bg-surface-container-low border border-outline-variant/60 rounded p-3 flex items-start gap-3">
                  <div className="p-2 rounded bg-surface-container border border-outline-variant/40 shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-secondary font-bold">
                        Stage 0{idx + 1}:
                      </span>
                      <h4 className="text-xs font-bold font-headline text-on-surface">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-secondary mt-1 font-body">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-secondary/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Technical Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-wider">
              1. What is Stack-Based Execution?
            </h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-body">
            Bitcoin Script does not use registers (like x86 or ARM CPUs) or variables. Instead, it operates strictly on a <strong>Last-In, First-Out (LIFO)</strong> stack.
          </p>
          <ul className="text-xs text-secondary space-y-1.5 list-disc pl-4 font-body">
            <li><strong className="text-on-surface font-label">Push:</strong> Places values directly onto the Top of Stack (TOS).</li>
            <li><strong className="text-on-surface font-label">Pop:</strong> Opcodes consume the topmost items from the stack as inputs.</li>
            <li><strong className="text-on-surface font-label">Result:</strong> Any computation output is immediately pushed back onto the stack.</li>
          </ul>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-wider">
              2. Why Non-Turing Complete?
            </h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-body">
            Unlike Ethereum’s EVM or general programming languages, Bitcoin Script intentionally <strong>omits loops (for/while) and recursion</strong>.
          </p>
          <ul className="text-xs text-secondary space-y-1.5 list-disc pl-4 font-body">
            <li><strong className="text-on-surface font-label">Halting Guarantee:</strong> Script execution is guaranteed to terminate in finite, bounded time.</li>
            <li><strong className="text-on-surface font-label">DoS Prevention:</strong> Nodes validating transactions across the network cannot be frozen by infinite loops.</li>
            <li><strong className="text-on-surface font-label">Predictable Cost:</strong> Validation complexity is strictly linear with respect to script length.</li>
          </ul>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-wider">
              3. Opcode Taxonomy
            </h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-body">
            Opcodes represent atomic execution primitives supported by the Bitcoin virtual machine:
          </p>
          <ul className="text-xs text-secondary space-y-1.5 list-disc pl-4 font-body">
            <li><strong className="text-on-surface font-label">Constants:</strong> <code className="text-primary font-bold">PUSH &lt;val&gt;</code> inserts data.</li>
            <li><strong className="text-on-surface font-label">Arithmetic:</strong> <code className="text-primary font-bold">ADD</code>, <code className="text-primary font-bold">SUB</code> calculate integer values.</li>
            <li><strong className="text-on-surface font-label">Stack Control:</strong> <code className="text-primary font-bold">DUP</code>, <code className="text-primary font-bold">DROP</code> duplicate or discard stack items.</li>
            <li><strong className="text-on-surface font-label">Conditionals:</strong> <code className="text-primary font-bold">EQUAL</code>, <code className="text-primary font-bold">VERIFY</code>, <code className="text-primary font-bold">EQUALVERIFY</code> guard spending conditions.</li>
          </ul>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-wider">
              4. Consensus Validation Rule
            </h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-body">
            When all script instructions have executed, the Bitcoin network applies a strict validation criterion:
          </p>
          <div className="bg-surface-container-low p-3 rounded border border-outline-variant/40 font-mono text-xs space-y-1">
            <div className="text-primary font-bold">VALID:</div>
            <div className="text-on-surface">No errors occurred during execution AND top stack item is TRUE (non-zero).</div>
            <div className="text-rose-800 font-bold pt-1">INVALID:</div>
            <div className="text-on-surface">Any error occurred, or the stack is empty, or the top stack item is FALSE (zero).</div>
          </div>
        </div>
      </div>

      {/* Educational Error Reference */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-700" />
          <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-wider">
            Common Execution Error Types
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-body">
          <div className="bg-surface-container-low p-4 rounded border border-outline-variant/40 space-y-1.5">
            <div className="text-xs font-mono font-bold text-rose-700">
              STACK UNDERFLOW
            </div>
            <p className="text-xs text-secondary leading-snug">
              An opcode attempted to pop more values than are currently present on the stack (e.g. calling <code className="text-on-surface font-semibold">ADD</code> when stack depth &lt; 2).
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded border border-outline-variant/40 space-y-1.5">
            <div className="text-xs font-mono font-bold text-tertiary">
              UNKNOWN OPCODE
            </div>
            <p className="text-xs text-secondary leading-snug">
              An unsupported or invalid instruction token was encountered during execution. The engine halts immediately.
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded border border-outline-variant/40 space-y-1.5">
            <div className="text-xs font-mono font-bold text-primary">
              VERIFY FAILED
            </div>
            <p className="text-xs text-secondary leading-snug">
              A guard condition evaluated to FALSE or 0 during <code className="text-on-surface font-semibold">VERIFY</code> or <code className="text-on-surface font-semibold">EQUALVERIFY</code>, rejecting transaction spending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
