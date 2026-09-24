'use client';

import React from 'react';
import { Play, SkipForward, RotateCcw, Code, AlertTriangle } from 'lucide-react';
import { DEMO_PRESETS, ScriptPreset } from '@/engine/presets';
import { Instruction, ExecutionError } from '@/engine/types';

interface ScriptEditorProps {
  script: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onStep: () => void;
  onReset: () => void;
  onSelectPreset: (preset: ScriptPreset) => void;
  currentStepIndex: number;
  instructions: Instruction[];
  isStepping: boolean;
  isCompleted: boolean;
  error: ExecutionError | null;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  onChange,
  onRun,
  onStep,
  onReset,
  onSelectPreset,
  currentStepIndex,
  instructions,
  isStepping,
  isCompleted,
  error,
}) => {
  const lines = script.split('\n');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
      {/* Top bar with preset selector */}
      <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Script Source Editor
          </span>
        </div>

        {/* Demo Presets dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="preset-select" className="text-xs text-slate-400 font-medium">
            Demo Presets:
          </label>
          <select
            id="preset-select"
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            onChange={(e) => {
              const selected = DEMO_PRESETS.find((p) => p.id === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Select a lab scenario...
            </option>
            {DEMO_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Main Content with Line Numbers & Active Line Highlight */}
      <div className="relative flex-1 min-h-[220px] max-h-[340px] flex overflow-hidden font-mono text-sm bg-slate-950">
        {/* Line Numbers */}
        <div className="w-12 bg-slate-950 border-r border-slate-800/80 py-3 select-none flex flex-col items-end pr-3 text-slate-600 font-mono text-xs">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const currentInstruction = instructions[currentStepIndex];
            const isCurrentLine =
              isStepping &&
              !isCompleted &&
              currentInstruction &&
              currentInstruction.line === lineNum;

            return (
              <div
                key={i}
                className={`h-6 leading-6 ${
                  isCurrentLine ? 'text-amber-400 font-bold' : ''
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Editor Area */}
        <div className="relative flex-1 flex flex-col">
          <textarea
            value={script}
            onChange={(e) => onChange(e.target.value)}
            disabled={isStepping}
            placeholder="Enter script instructions (e.g., PUSH 5)..."
            spellCheck={false}
            className={`w-full h-full p-3 bg-transparent text-slate-100 placeholder:text-slate-600 resize-none font-mono text-xs md:text-sm leading-6 focus:outline-none focus:ring-0 ${
              isStepping ? 'cursor-not-allowed opacity-90' : ''
            }`}
            style={{ tabSize: 2 }}
          />

          {/* Stepping Indicator overlay */}
          {isStepping && (
            <div className="absolute top-2 right-3 pointer-events-none bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] text-amber-400 animate-pulse font-sans font-medium">
              Step Mode Active
            </div>
          )}
        </div>
      </div>

      {/* Inline Parser Error Notification */}
      {error && (error.category === 'PARSER_ERROR' || error.category === 'UNKNOWN_OPCODE' || error.category === 'MISSING_ARGUMENT') && (
        <div className="bg-rose-950/40 border-t border-rose-900/50 p-3 px-4 flex items-start gap-2.5 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-rose-200">Validation Notice: </span>
            <span>{error.message}</span>
          </div>
        </div>
      )}

      {/* Control Buttons Footer */}
      <div className="bg-slate-950/90 border-t border-slate-800 p-3 px-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Step Button */}
          <button
            onClick={onStep}
            disabled={isCompleted}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm ${
              isCompleted
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95'
            }`}
          >
            <SkipForward className="w-4 h-4" />
            <span>{currentStepIndex === 0 ? 'Start Step-by-Step' : 'Step Next'}</span>
          </button>

          {/* Run All Button */}
          <button
            onClick={onRun}
            disabled={isCompleted}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
              isCompleted
                ? 'bg-slate-800/50 text-slate-500 border-slate-800 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 hover:border-slate-600 active:scale-95'
            }`}
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Run All</span>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
