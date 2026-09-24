'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScriptSimulator } from '@/engine/executor';
import { DEMO_PRESETS, ScriptPreset } from '@/engine/presets';
import {
  Instruction,
  StackValue,
  TraceEntry,
  ExecutionError,
  ExecutionResult,
} from '@/engine/types';
import { Header, ActiveTab } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { ScriptEditor } from '@/components/ScriptEditor';
import { ControlBar } from '@/components/ControlBar';
import { DisassemblyListing } from '@/components/DisassemblyListing';
import { StackVisualizer } from '@/components/StackVisualizer';
import { StepInspector } from '@/components/StepInspector';
import { TraceTable } from '@/components/TraceTable';
import { ConsensusAuditCard } from '@/components/ConsensusAuditCard';
import { ResultBanner } from '@/components/ResultBanner';
import { EducationalBanner } from '@/components/EducationalBanner';
import { OpcodeReference } from '@/components/OpcodeReference';
import { LearnPage } from '@/components/LearnPage';
import { Footer } from '@/components/Footer';

export const SimulatorContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [activePreset, setActivePreset] = useState<ScriptPreset>(DEMO_PRESETS[0]);
  const [scriptText, setScriptText] = useState<string>(DEMO_PRESETS[0].code);
  const [copied, setCopied] = useState<boolean>(false);
  const [validationNotice, setValidationNotice] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
  const [canStepBack, setCanStepBack] = useState<boolean>(false);
  const [canStepForward, setCanStepForward] = useState<boolean>(true);

  // Sync simulator state to component
  const syncState = useCallback(() => {
    setInstructions(simulator.getInstructions());
    setCurrentStepIndex(simulator.getCurrentStepIndex());
    setStack(simulator.getStack());
    setTrace(simulator.getTrace());
    setStatus(simulator.getStatus());
    setError(simulator.getError());
    setFinalResult(simulator.getFinalResult());
    setCanStepBack(simulator.canStepBack());
    setCanStepForward(simulator.canStepForward());
  }, [simulator]);

  // Load script into engine on change
  const loadScriptToEngine = useCallback(
    (code: string) => {
      setIsPlaying(false);
      simulator.loadScript(code);
      syncState();
    },
    [simulator, syncState]
  );

  // Initial load
  useEffect(() => {
    loadScriptToEngine(DEMO_PRESETS[0].code);
  }, [loadScriptToEngine]);

  // Auto-play timer effect (650ms interval)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (simulator.canStepForward()) {
        const { done } = simulator.step();
        syncState();
        if (done) {
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    }, 650);

    return () => clearInterval(interval);
  }, [isPlaying, simulator, syncState]);

  // Handlers
  const handleScriptChange = (newCode: string) => {
    setScriptText(newCode);
    setValidationNotice(null);
    loadScriptToEngine(newCode);
  };

  const handleSelectPreset = (preset: ScriptPreset) => {
    setActivePreset(preset);
    setScriptText(preset.code);
    setValidationNotice(null);
    loadScriptToEngine(preset.code);
    setActiveTab('simulator');
  };

  const handleLoadExampleFromGuide = (exampleCode: string) => {
    setScriptText(exampleCode);
    setValidationNotice(null);
    loadScriptToEngine(exampleCode);
    setActiveTab('simulator');
  };

  const handleClear = () => {
    setScriptText('');
    setValidationNotice(null);
    loadScriptToEngine('');
  };

  const handleValidate = () => {
    const currentErr = simulator.getError();
    if (currentErr) {
      setValidationNotice(null);
      return;
    }

    const instrs = simulator.getInstructions();
    if (instrs.length === 0) {
      setValidationNotice('Notice: Script is empty. Enter instructions.');
    } else {
      setValidationNotice(`✓ Syntax check passed: ${instrs.length} valid instructions.`);
    }

    setTimeout(() => {
      setValidationNotice(null);
    }, 3500);
  };

  const handleStep = () => {
    setIsPlaying(false);
    simulator.step();
    syncState();
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    simulator.stepBack();
    syncState();
  };

  const handleTogglePlay = () => {
    if (status === 'COMPLETED' || status === 'ERROR') {
      simulator.reset();
      syncState();
      setIsPlaying(true);
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const handleRunAll = () => {
    setIsPlaying(false);
    simulator.runAll();
    syncState();
  };

  const handleReset = () => {
    setIsPlaying(false);
    simulator.reset();
    syncState();
  };

  const handleSelectStep = (stepNumber: number) => {
    setIsPlaying(false);
    simulator.jumpToStep(stepNumber);
    syncState();
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExportTrace = () => {
    const exportData = {
      title: 'Bitcoin Script Execution Trace',
      timestamp: new Date().toISOString(),
      script: scriptText,
      status: finalResult?.status || status,
      totalInstructions: instructions.length,
      finalStack: finalResult?.finalStack || stack,
      error: error,
      trace: trace,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bitcoin-script-trace-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT';

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunAll();
        return;
      }

      if (!isInput) {
        if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          if (simulator.canStepForward()) {
            handleStep();
          }
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          handleReset();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (simulator.canStepBack()) {
            handleStepBack();
          }
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (simulator.canStepForward()) {
            handleStep();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [simulator, handleRunAll, handleStep, handleReset, handleStepBack]);

  const activeTraceEntry =
    trace.length > 0 ? trace[trace.length - 1] : undefined;

  const isStepping = currentStepIndex > 0;
  const isCompleted = status === 'COMPLETED' || status === 'ERROR';
  const nextInstruction =
    currentStepIndex < instructions.length ? instructions[currentStepIndex] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-body antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* 1. Header Region & Top Branding */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExportTrace={handleExportTrace}
        onCopyScript={handleCopyScript}
        copied={copied}
      />

      {/* 2. Article Hero Banner (Stitch Canonical) */}
      <HeroBanner
        activeProgramName={activePreset.name}
        opcodesCount={instructions.length}
        status={status}
        finalResult={finalResult}
      />

      {/* 3. Main Workstation Studio */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'simulator' && (
          <div>
            {/* Target Script Stream Section (Input & Presets) */}
            <ScriptEditor
              script={scriptText}
              onChange={handleScriptChange}
              onClear={handleClear}
              onValidate={handleValidate}
              onRun={handleRunAll}
              onSelectPreset={handleSelectPreset}
              currentStepIndex={currentStepIndex}
              instructions={instructions}
              isStepping={isStepping}
              isCompleted={isCompleted}
              error={error}
              validationNotice={validationNotice}
            />

            {/* Execution Controller & Step Bar (Buttons & 4-Metric Telemetry HUD) */}
            <ControlBar
              currentStepIndex={currentStepIndex}
              totalSteps={instructions.length}
              instructions={instructions}
              currentTraceEntry={activeTraceEntry}
              isPlaying={isPlaying}
              canStepBack={canStepBack}
              canStepForward={canStepForward}
              isCompleted={isCompleted}
              stackDepth={stack.length}
              onReset={handleReset}
              onStepBack={handleStepBack}
              onTogglePlay={handleTogglePlay}
              onStepNext={handleStep}
              onRunAll={handleRunAll}
            />

            {/* Final Result Verdict Banner (when completed or error occurs) */}
            {isCompleted && finalResult && <ResultBanner result={finalResult} />}

            {/* 3-Column Studio Core (Matching Google Stitch Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Column 1 (4 cols): Disassembly Listing & Semantic Spec Card */}
              <div className="lg:col-span-4">
                <DisassemblyListing
                  instructions={instructions}
                  currentStepIndex={currentStepIndex}
                  onSelectStep={handleSelectStep}
                />
              </div>

              {/* Column 2 (4 cols): Stack Transformation (LIFO) & Transition Diff */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <StackVisualizer stack={stack} />
                <StepInspector
                  currentEntry={activeTraceEntry}
                  currentStepIndex={currentStepIndex}
                  totalSteps={instructions.length}
                  nextInstruction={nextInstruction}
                />
              </div>

              {/* Column 3 (4 cols): Execution Trace Register & Consensus Audit Card */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <TraceTable
                  trace={trace}
                  currentStepIndex={currentStepIndex}
                  onSelectStep={handleSelectStep}
                  onExport={handleExportTrace}
                />
                <ConsensusAuditCard
                  status={status}
                  finalResult={finalResult}
                  stack={stack}
                  currentStepIndex={currentStepIndex}
                  totalSteps={instructions.length}
                  error={error}
                />
              </div>
            </div>

            {/* Educational Deep-Dive Banner / Execution Insights */}
            <EducationalBanner
              currentEntry={activeTraceEntry}
              instructions={instructions}
              currentStepIndex={currentStepIndex}
              onOpenGuide={() => setActiveTab('opcodes')}
            />
          </div>
        )}

        {/* Opcode Guide Tab */}
        {activeTab === 'opcodes' && (
          <OpcodeReference onLoadExample={handleLoadExampleFromGuide} />
        )}

        {/* Learn Bitcoin Script Tab */}
        {activeTab === 'learn' && (
          <LearnPage onOpenSimulator={() => setActiveTab('simulator')} />
        )}
      </main>

      {/* 4. Editorial Footnote / Lexicon Reference */}
      <Footer />
    </div>
  );
};
