'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScriptSimulator } from '@/engine/executor';
import { DEMO_PRESETS, ScriptPreset } from '@/engine/presets';
import { Instruction, StackValue, TraceEntry, ExecutionError, ExecutionResult } from '@/engine/types';
import { Header } from '@/components/Header';
import { ScriptEditor } from '@/components/ScriptEditor';
import { StackVisualizer } from '@/components/StackVisualizer';
import { StepInspector } from '@/components/StepInspector';
import { TraceTable } from '@/components/TraceTable';
import { ResultBanner } from '@/components/ResultBanner';
import { OpcodeReference } from '@/components/OpcodeReference';

export const SimulatorContainer: React.FC = () => {
  const [scriptText, setScriptText] = useState<string>(DEMO_PRESETS[0].code);
  const [showOpcodeGuide, setShowOpcodeGuide] = useState<boolean>(false);

  // Instantiate simulator engine
  const simulator = useMemo(() => new ScriptSimulator(), []);

  // UI state synchronized from simulator
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stack, setStack] = useState<StackValue[]>([]);
  const [trace, setTrace] = useState<TraceEntry[]>([]);
  const [status, setStatus] = useState<string>('READY');
  const [error, setError] = useState<ExecutionError | null>(null);
  const [finalResult, setFinalResult] = useState<ExecutionResult | null>(null);

  // Sync simulator state to component
  const syncState = useCallback(() => {
    setInstructions(simulator.getInstructions());
    setCurrentStepIndex(simulator.getCurrentStepIndex());
    setStack(simulator.getStack());
    setTrace(simulator.getTrace());
    setStatus(simulator.getStatus());
    setError(simulator.getError());
    setFinalResult(simulator.getFinalResult());
  }, [simulator]);

  // Load script into engine on change
  const loadScriptToEngine = useCallback(
    (code: string) => {
      simulator.loadScript(code);
      syncState();
    },
    [simulator, syncState]
  );

  // Initial load
  useEffect(() => {
    loadScriptToEngine(DEMO_PRESETS[0].code);
  }, [loadScriptToEngine]);

  const handleScriptChange = (newCode: string) => {
    setScriptText(newCode);
    loadScriptToEngine(newCode);
  };

  const handleSelectPreset = (preset: ScriptPreset) => {
    setScriptText(preset.code);
    loadScriptToEngine(preset.code);
  };

  const handleStep = () => {
    simulator.step();
    syncState();
  };

  const handleRunAll = () => {
    simulator.runAll();
    syncState();
  };

  const handleReset = () => {
    simulator.reset();
    syncState();
  };

  // Find the active trace entry to show in the inspector
  const activeTraceEntry =
    trace.length > 0 ? trace[trace.length - 1] : undefined;

  const isStepping = currentStepIndex > 0;
  const isCompleted = status === 'COMPLETED' || status === 'ERROR';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-black pb-12">
      {/* Top Navbar */}
      <Header
        showReference={showOpcodeGuide}
        onToggleReference={() => setShowOpcodeGuide((prev) => !prev)}
      />

      {/* Main Educational Dashboard */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Opcode Reference collapsible drawer/banner */}
        {showOpcodeGuide && (
          <OpcodeReference onClose={() => setShowOpcodeGuide(false)} />
        )}

        {/* Final Result / Error Banner if completed */}
        {finalResult && <ResultBanner result={finalResult} />}

        {/* Top Grid: Script Editor + Stack Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Script Editor & Controls */}
          <div className="lg:col-span-7 flex flex-col">
            <ScriptEditor
              script={scriptText}
              onChange={handleScriptChange}
              onRun={handleRunAll}
              onStep={handleStep}
              onReset={handleReset}
              onSelectPreset={handleSelectPreset}
              currentStepIndex={currentStepIndex}
              instructions={instructions}
              isStepping={isStepping}
              isCompleted={isCompleted}
              error={error}
            />
          </div>

          {/* Right Column: Visual Stack */}
          <div className="lg:col-span-5 flex flex-col">
            <StackVisualizer stack={stack} />
          </div>
        </div>

        {/* Middle Section: Active Step Inspector */}
        <StepInspector
          currentEntry={activeTraceEntry}
          totalSteps={instructions.length}
        />

        {/* Bottom Section: Execution Trace Audit Table */}
        <TraceTable trace={trace} currentStepIndex={currentStepIndex} />
      </main>
    </div>
  );
};
