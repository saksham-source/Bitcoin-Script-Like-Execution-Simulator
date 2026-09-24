'use client';

import React from 'react';
import { RotateCcw, SkipBack, SkipForward, Play, Pause, FastForward } from 'lucide-react';
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
  const currentInstruction =
    currentStepIndex < instructions.length ? instructions[currentStepIndex] : null;

  return (
    <div className="mb-8 bg-surface-container-lowest border border-outline-variant/60 rounded p-4 shadow-sm">
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* Left: Control buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onReset}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-label font-semibold rounded border border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface transition active:scale-95"
            title="Reset Simulator (R)"
          >
            <RotateCcw className="w-4 h-4 text-secondary" />
            <span>Reset</span>
          </button>

          <button
            onClick={onStepBack}
            disabled={!canStepBack || isPlaying}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-label font-semibold rounded border transition active:scale-95 ${
              !canStepBack || isPlaying
                ? 'border-outline-variant/40 bg-surface-container-low/40 text-secondary/40 cursor-not-allowed'
                : 'border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface'
            }`}
            title="Step Back to Previous State"
          >
            <SkipBack className="w-4 h-4" />
            <span>Step Back</span>
          </button>

          <button
            onClick={onStepNext}
            disabled={!canStepForward || isPlaying}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-label font-bold rounded shadow-sm transition active:scale-95 ${
              !canStepForward || isPlaying
                ? 'bg-surface-container-high text-secondary/60 cursor-not-allowed'
                : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
            title="Step Opcode (Space)"
          >
            <SkipForward className="w-4 h-4" />
            <span>Step Opcode</span>
          </button>

          <button
            onClick={onTogglePlay}
            disabled={isCompleted}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-label font-bold rounded transition active:scale-95 ${
              isCompleted
                ? 'bg-surface-container-high text-secondary/40 cursor-not-allowed'
                : isPlaying
                ? 'bg-primary-fixed text-primary border border-primary/40'
                : 'bg-surface-container-highest hover:bg-secondary-container text-on-surface'
            }`}
            title={isPlaying ? 'Pause Auto Run' : 'Auto Run (Space)'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Auto Run</span>
              </>
            )}
          </button>

          <button
            onClick={onRunAll}
            disabled={isCompleted || isPlaying}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-label font-semibold rounded border transition active:scale-95 ${
              isCompleted || isPlaying
                ? 'border-outline-variant/40 bg-surface-container-low/40 text-secondary/40 cursor-not-allowed'
                : 'border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
            title="Run All to Completion (Ctrl+Enter)"
          >
            <FastForward className="w-4 h-4 text-primary" />
            <span>Run All</span>
          </button>
        </div>

        {/* Right: VM Telemetry HUD with Left Primary Borders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="border-l-2 border-primary pl-3">
            <div className="text-secondary font-label uppercase text-[10px] tracking-wider font-semibold">
              Program Counter
            </div>
            <div className="font-mono font-bold text-base text-on-surface">
              PC: {currentStepIndex} / {totalSteps}
            </div>
          </div>

          <div className="border-l-2 border-primary pl-3">
            <div className="text-secondary font-label uppercase text-[10px] tracking-wider font-semibold">
              Current Opcode
            </div>
            <div className="font-mono font-bold text-base text-primary">
              {currentInstruction ? currentInstruction.raw : isCompleted ? 'HALTED' : 'INITIAL'}
            </div>
          </div>

          <div className="border-l-2 border-primary pl-3">
            <div className="text-secondary font-label uppercase text-[10px] tracking-wider font-semibold">
              Stack Depth
            </div>
            <div className="font-mono font-bold text-base text-on-surface">
              {stackDepth} / 1024
            </div>
          </div>

          <div className="border-l-2 border-primary pl-3">
            <div className="text-secondary font-label uppercase text-[10px] tracking-wider font-semibold">
              Consensus State
            </div>
            <div
              className={`font-mono font-bold text-base ${
                isCompleted ? 'text-primary' : 'text-tertiary'
              }`}
            >
              {isCompleted ? 'EVALUATED' : 'ACTIVE'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
