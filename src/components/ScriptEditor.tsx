'use client';

import React from 'react';
import { Terminal, Play, CheckCircle, Trash2, Code2 } from 'lucide-react';
import { DEMO_PRESETS, ScriptPreset } from '@/engine/presets';
import { Instruction, ExecutionError } from '@/engine/types';

interface ScriptEditorProps {
  script: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onValidate: () => void;
  onRun: () => void;
  onSelectPreset: (preset: ScriptPreset) => void;
  currentStepIndex: number;
  instructions: Instruction[];
  isStepping: boolean;
  isCompleted: boolean;
  error: ExecutionError | null;
  validationNotice: string | null;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  onChange,
  onClear,
  onValidate,
  onRun,
  onSelectPreset,
  currentStepIndex,
  instructions,
  isStepping,
  isCompleted,
  error,
  validationNotice,
}) => {
  const lines = script.split('\n');

  return (
    <section className="mb-8 bg-surface-container-lowest border border-outline-variant/60 rounded p-5 shadow-sm">
      {/* Header with Title and Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-surface-variant gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <h2 className="font-headline font-semibold text-lg text-on-surface">
            Target Script Stream
          </h2>
          <span className="text-xs font-label bg-surface-container px-2 py-0.5 rounded text-secondary font-medium">
            ASM Encoded
          </span>
        </div>

        {/* Presets Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-label">
          <span className="text-secondary font-semibold">Presets:</span>
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface transition-colors font-medium text-xs border border-outline-variant/40"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Surface */}
      <div className="relative">
        <label className="sr-only" htmlFor="raw-script">
          Raw Bitcoin Script ASM
        </label>
        <textarea
          id="raw-script"
          value={script}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          rows={5}
          placeholder="Enter script instructions (e.g. PUSH 5\nPUSH 3\nADD\nPUSH 8\nEQUAL)"
          className="w-full font-mono text-xs sm:text-sm bg-surface-container-low border border-outline-variant/60 rounded p-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-y leading-6 font-semibold"
        />
      </div>

      {/* Validation notice or Error notice */}
      {validationNotice && (
        <div className="mt-2 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{validationNotice}</span>
        </div>
      )}
      {error && (
        <div className="mt-2 text-xs font-mono text-rose-800 bg-rose-50 border border-rose-200 p-2 rounded flex items-center gap-1.5">
          <span>
            <strong>[{error.category}]:</strong> {error.message}
          </span>
        </div>
      )}

      {/* Footer Info & Action Buttons */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-secondary gap-3">
        <div className="flex flex-wrap items-center gap-4 font-mono">
          <span>
            Instructions: <strong className="text-on-surface">{instructions.length}</strong>
          </span>
          <span>
            Lines: <strong className="text-on-surface">{lines.length}</strong>
          </span>
          <span>
            Syntax:{' '}
            <strong className={error ? 'text-rose-700' : 'text-emerald-700'}>
              {error ? error.category : 'Validated ASM'}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded font-label text-xs font-semibold text-secondary hover:text-on-surface border border-outline-variant hover:bg-surface-container transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onValidate}
            className="px-3 py-1.5 rounded font-label text-xs font-semibold text-secondary hover:text-on-surface border border-outline-variant hover:bg-surface-container transition-colors"
          >
            Validate Syntax
          </button>
          <button
            onClick={onRun}
            className="px-4 py-1.5 bg-primary text-on-primary rounded font-label text-xs font-semibold hover:bg-primary/90 transition shadow-sm flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Disassemble &amp; Reset VM</span>
          </button>
        </div>
      </div>
    </section>
  );
};
