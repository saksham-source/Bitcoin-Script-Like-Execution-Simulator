'use client';

import React from 'react';
import {
  RotateCcw,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  FastForward,
  Activity,
  Layers,
} from 'lucide-react';
import { Instruction, TraceEntry } from '@/engine/types';
import { OPCODE_REGISTRY } from '@/engine/opcodes';

interface ControlBarProps {
  currentStepIndex: number;
  totalSteps: number;
  instructions: Instruction[];
  currentTraceEntry?: TraceEntry;
  isPlaying: boolean;
  canStepBack: boolean;
  canStepForward: boolean;
  isCompleted: boolean;
  stackDepth: number;
  onReset: () => void;
  onStepBack: () => void;
  onTogglePlay: () => void;
  onStepNext: () => void;
  onRunAll: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  currentStepIndex,
  totalSteps,
  instructions,
  currentTraceEntry,
  isPlaying,
  canStepBack,
  canStepForward,
  isCompleted,
  stackDepth,
  onReset,
  onStepBack,
  onTogglePlay,
  onStepNext,
  onRunAll,
}) => {
  // Current executing instruction
  const currentInstruction =
    currentStepIndex < instructions.length ? instructions[currentStepIndex] : null;

  const opcodeInfo = currentInstruction
    ? OPCODE_REGISTRY[currentInstruction.opcode]
    : currentTraceEntry?.opcode && currentTraceEntry.opcode !== 'INITIAL'
    ? OPCODE_REGISTRY[currentTraceEntry.opcode as keyof typeof OPCODE_REGISTRY]
    : null;

  // Calculate execution progress percentage
  const progressPercent = totalSteps > 0 ? Math.min(100, Math.round((currentStepIndex / totalSteps) * 100)) : 0;

  return (
    <div className="bg-[#161F30] border border-[#1E293B] rounded p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Debugger Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[#1E293B] bg-[#111827] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition active:scale-95"
            title="Reset Simulator (R)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Reset</span>
          </button>

          {/* Previous Step */}
          <button
            onClick={onStepBack}
            disabled={!canStepBack || isPlaying}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition active:scale-95 ${
              !canStepBack || isPlaying
                ? 'border-[#1E293B] bg-[#111827]/40 text-[#64748B] cursor-not-allowed'
                : 'border-[#1E293B] bg-[#111827] hover:bg-[#1E293B] text-[#F8FAFC]'
            }`}
            title="Step Back to Previous State"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span>Step Back</span>
          </button>

          {/* Play / Pause Auto-Runner */}
          <button
            onClick={onTogglePlay}
            disabled={isCompleted}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded border transition active:scale-95 ${
              isCompleted
                ? 'border-[#1E293B] bg-[#111827]/40 text-[#64748B] cursor-not-allowed'
                : isPlaying
                ? 'border-[#38BDF8]/60 bg-[#38BDF8]/15 text-[#38BDF8]'
                : 'border-[#1E293B] bg-[#111827] hover:bg-[#1E293B] text-[#F8FAFC]'
            }`}
            title={isPlaying ? 'Pause Auto-Execution' : 'Play Auto-Step (Space)'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-[#38BDF8]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#38BDF8] fill-[#38BDF8]" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          {/* Next Step (Primary Amber Action) */}
          <button
            onClick={onStepNext}
            disabled={!canStepForward || isPlaying}
            className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold rounded shadow-sm transition active:scale-95 ${
              !canStepForward || isPlaying
                ? 'bg-[#1E293B] text-[#64748B] border border-[#1E293B] cursor-not-allowed'
                : 'bg-[#F7931A] hover:bg-[#E87A0C] text-[#0B0F17] shadow-[#F7931A]/10 hover:shadow-[#F7931A]/20'
            }`}
            title="Execute Next Single Instruction (Space)"
          >
            <SkipForward className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{currentStepIndex === 0 ? 'Start Step' : 'Next Step'}</span>
          </button>

          {/* Run All */}
          <button
            onClick={onRunAll}
            disabled={isCompleted || isPlaying}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded border transition active:scale-95 ${
              isCompleted || isPlaying
                ? 'border-[#1E293B] bg-[#111827]/40 text-[#64748B] cursor-not-allowed'
                : 'border-[#1E293B] bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC]'
            }`}
            title="Execute Entire Script to Completion (Ctrl+Enter)"
          >
            <FastForward className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Run All</span>
          </button>
        </div>

        {/* Center / Right: Debugger Telemetry HUD */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          {/* Step Count & Progress Bar */}
          <div className="border-l-2 border-[#F7931A] pl-3 min-w-[150px]">
            <div className="flex items-center justify-between text-[10px] uppercase font-sans font-semibold text-[#94A3B8] tracking-wider mb-1">
              <span>Step Progress</span>
              <span className="font-mono text-[#F8FAFC]">
                {currentStepIndex} / {totalSteps}
              </span>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-full bg-[#111827] h-1.5 rounded overflow-hidden flex border border-[#1E293B]">
              <div
                className="bg-[#F7931A] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Active Opcode Indicator */}
          <div className="border-l-2 border-[#38BDF8] pl-3 min-w-[180px]">
            <div className="text-[10px] uppercase font-sans font-semibold text-[#94A3B8] tracking-wider">
              Current Opcode: <span className="text-[#38BDF8] font-mono font-bold">{currentInstruction ? currentInstruction.raw : isCompleted ? 'HALTED' : 'INITIAL'}</span>
            </div>
            <div className="mt-0.5 text-[11px] text-[#94A3B8] font-sans truncate max-w-[220px]">
              {opcodeInfo ? opcodeInfo.description : isCompleted ? 'Execution finished' : 'Ready to start'}
            </div>
          </div>

          {/* Stack Depth Counter */}
          <div className="border-l-2 border-[#10B981] pl-3">
            <div className="text-[10px] uppercase font-sans font-semibold text-[#94A3B8] tracking-wider">
              Stack Depth
            </div>
            <div className="font-bold text-sm text-[#F8FAFC] mt-0.5">
              {stackDepth} <span className="text-[#64748B] text-[11px] font-normal">/ 1024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
