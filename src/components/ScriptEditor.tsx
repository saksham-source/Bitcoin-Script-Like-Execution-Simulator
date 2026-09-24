'use client';

import React from 'react';
import {
  Code2,
  Trash2,
  CheckCircle,
  Play,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
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
  const currentInstruction = instructions[currentStepIndex];

  return (
    <div className="bg-[#111827] border border-[#1E293B] rounded flex flex-col shadow-sm overflow-hidden h-full">
      {/* Top Editor Toolbar */}
      <div className="bg-[#161F30] border-b border-[#1E293B] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#F7931A]" />
          <span className="font-semibold text-xs tracking-tight text-[#F8FAFC]">
            Script Editor (ASM)
          </span>
          <span className="font-mono text-[10px] text-[#64748B] bg-[#111827] px-2 py-0.5 rounded border border-[#1E293B]">
            {instructions.length} {instructions.length === 1 ? 'Opcode' : 'Opcodes'}
          </span>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Preset Selector */}
          <div className="flex items-center gap-1 bg-[#111827] px-2 py-1 rounded border border-[#1E293B]">
            <FolderOpen className="w-3.5 h-3.5 text-[#94A3B8]" />
            <label htmlFor="preset-select" className="sr-only">
              Load Example
            </label>
            <select
              id="preset-select"
              className="bg-transparent text-xs text-[#94A3B8] hover:text-[#F8FAFC] focus:outline-none cursor-pointer"
              onChange={(e) => {
                const selected = DEMO_PRESETS.find((p) => p.id === e.target.value);
                if (selected) onSelectPreset(selected);
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Load Example...
              </option>
              {DEMO_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-[#161F30] text-[#F8FAFC]">
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Validate */}
          <button
            onClick={onValidate}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] hover:bg-[#1E293B] rounded border border-[#1E293B] transition"
            title="Validate Script Syntax"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Validate</span>
          </button>

          {/* Clear */}
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#94A3B8] hover:text-[#EF4444] bg-[#111827] hover:bg-[#1E293B] rounded border border-[#1E293B] transition"
            title="Clear Editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Run Script */}
          <button
            onClick={onRun}
            disabled={isCompleted}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition shadow-sm ${
              isCompleted
                ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
                : 'bg-[#F7931A] hover:bg-[#E87A0C] text-[#0B0F17]'
            }`}
            title="Run Script (Ctrl+Enter)"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run Script</span>
          </button>
        </div>
      </div>

      {/* Editor Surface with Line Numbers Gutter */}
      <div className="relative flex-1 min-h-[340px] lg:min-h-[440px] flex overflow-hidden font-mono text-xs sm:text-sm bg-[#111827]">
        {/* Line Numbers Gutter */}
        <div className="w-11 bg-[#0B0F17] border-r border-[#1E293B] py-3 select-none flex flex-col items-end pr-2 text-[#64748B] font-mono text-xs">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const isCurrentLine =
              isStepping &&
              !isCompleted &&
              currentInstruction &&
              currentInstruction.line === lineNum;
            const isErrorLine = error && error.line === lineNum;

            return (
              <div
                key={i}
                className={`h-6 leading-6 flex items-center gap-1 ${
                  isErrorLine
                    ? 'text-[#EF4444] font-bold'
                    : isCurrentLine
                    ? 'text-[#F7931A] font-bold'
                    : 'text-[#64748B]'
                }`}
              >
                {isErrorLine && <span className="text-[10px]">⚠</span>}
                {isCurrentLine && !isErrorLine && <span className="text-[10px]">▶</span>}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Text Input Area */}
        <div className="relative flex-1 flex flex-col">
          <textarea
            value={script}
            onChange={(e) => onChange(e.target.value)}
            disabled={isStepping && !isCompleted}
            placeholder={`Enter script instructions...\n\nPUSH 5\nPUSH 3\nADD\nPUSH 8\nEQUAL`}
            spellCheck={false}
            className={`w-full h-full p-3 bg-transparent text-[#F8FAFC] placeholder:text-[#64748B] resize-none font-mono text-xs sm:text-sm leading-6 focus:outline-none focus:ring-1 focus:ring-[#38BDF8] border-none ${
              isStepping && !isCompleted ? 'cursor-not-allowed opacity-90' : ''
            }`}
            style={{ tabSize: 2 }}
          />

          {/* Stepping Indicator overlay badge */}
          {isStepping && !isCompleted && (
            <div className="absolute top-2 right-3 pointer-events-none bg-[#F7931A]/10 border border-[#F7931A]/30 px-2 py-0.5 rounded text-[11px] text-[#F7931A] animate-pulse font-sans font-medium">
              Step Mode Active
            </div>
          )}
        </div>
      </div>

      {/* Validation / Error Notification Bar */}
      {error && (error.category === 'PARSER_ERROR' || error.category === 'UNKNOWN_OPCODE' || error.category === 'MISSING_ARGUMENT') && (
        <div className="bg-[#EF4444]/10 border-t border-[#EF4444]/30 p-2.5 px-3.5 flex items-start gap-2 text-xs text-[#EF4444] font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#EF4444]" />
          <div>
            <strong className="text-[#EF4444] font-bold">[{error.category}]: </strong>
            <span>{error.message}</span>
          </div>
        </div>
      )}

      {/* Success Validation Notice */}
      {!error && validationNotice && (
        <div className="bg-[#10B981]/10 border-t border-[#10B981]/30 p-2 px-3.5 flex items-center gap-2 text-xs text-[#10B981] font-mono">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationNotice}</span>
        </div>
      )}

      {/* Editor Footer Status Bar */}
      <div className="bg-[#161F30] border-t border-[#1E293B] px-3.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
        <span>Lines: {lines.length} • Encoding: ASCII/ASM</span>
        <span className="text-[#94A3B8]">Bitcoin Script Educational Subset</span>
      </div>
    </div>
  );
};
