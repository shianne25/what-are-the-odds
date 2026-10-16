"use client";

import { useState, useCallback } from "react";
import type { SimulationParams, SimulationResult } from "@/lib/types";
import { runMonteCarlo, formatCurrency, formatPct } from "@/lib/betMath";

interface SimulatorProps {
  isRealityMode: boolean;
  winProbability: number;
  payoutMultiplier: number;
  wagerAmount: number;
}

export default function Simulator({
  isRealityMode,
  winProbability,
  payoutMultiplier,
  wagerAmount,
}: SimulatorProps) {
  const [initialBankroll, setInitialBankroll] = useState(1000);
  const [numBets, setNumBets] = useState(100);
  const [numSimulations, setNumSimulations] = useState(1000);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = useCallback(() => {
    setIsRunning(true);

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      const params: SimulationParams = {
        initialBankroll,
        wagerAmount,
        winProbability,
        payoutMultiplier,
        numBets,
        numSimulations,
      };
      const simResult = runMonteCarlo(params);
      setResult(simResult);
      setIsRunning(false);
    }, 50);
  }, [initialBankroll, wagerAmount, winProbability, payoutMultiplier, numBets, numSimulations]);

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        isRealityMode
          ? "border-red-900/50 bg-zinc-950"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <h3
        className={`mb-4 text-sm font-bold uppercase tracking-wider ${
          isRealityMode ? "text-red-400" : "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        Fast-Forward Simulator — Monte Carlo Bankroll Projection
      </h3>

      {/* Parameters */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ParamInput
          label="Bankroll"
          value={initialBankroll}
          onChange={setInitialBankroll}
          prefix="$"
          isRealityMode={isRealityMode}
        />
        <ParamInput
          label="Bets"
          value={numBets}
          onChange={setNumBets}
          isRealityMode={isRealityMode}
        />
        <ParamInput
          label="Simulations"
          value={numSimulations}
          onChange={setNumSimulations}
          isRealityMode={isRealityMode}
        />
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider opacity-60">
            Win Prob
          </label>
          <div
            className={`rounded-lg border-2 px-3 py-2 text-sm font-bold ${
              isRealityMode
                ? "border-red-900/50 bg-zinc-900 text-red-400"
                : "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {formatPct(winProbability * 100, 1)}
          </div>
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={runSimulation}
        disabled={isRunning || numBets === 0}
        className={`mb-4 w-full rounded-lg py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${
          isRunning
            ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
            : isRealityMode
            ? "bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]"
            : "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]"
        }`}
      >
        {isRunning ? "Running..." : `Run ${numSimulations.toLocaleString()} Simulations`}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatCard
              label="Risk of Ruin"
              value={formatPct(result.riskOfRuinPct)}
              isRealityMode={isRealityMode}
              isDanger={result.riskOfRuinPct > 20}
            />
            <StatCard
              label="Avg Final"
              value={formatCurrency(result.avgFinalBankroll)}
              isRealityMode={isRealityMode}
              isDanger={result.avgFinalBankroll < initialBankroll}
            />
            <StatCard
              label="Median Final"
              value={formatCurrency(result.medianFinalBankroll)}
              isRealityMode={isRealityMode}
              isDanger={result.medianFinalBankroll < initialBankroll}
            />
            <StatCard
              label="House Edge Total"
              value={formatCurrency(result.houseEdgeTotal)}
              isRealityMode={isRealityMode}
            />
          </div>

          {/* Simple ASCII Chart */}
          <div
            className={`rounded-lg border p-3 ${
              isRealityMode
                ? "border-red-900/30 bg-zinc-900"
                : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800"
            }`}
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider opacity-60">
              Bankroll Trajectory (Percentile Bands)
            </p>
            <ASCIIChart result={result} initialBankroll={initialBankroll} isRealityMode={isRealityMode} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Param Input ──────────────────────────────────────────────────────────────

function ParamInput({
  label,
  value,
  onChange,
  prefix,
  isRealityMode,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  isRealityMode: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider opacity-60">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold opacity-60">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className={`w-full rounded-lg border-2 py-2 ${prefix ? "pl-7" : "pl-3"} pr-3 text-sm font-bold outline-none transition-colors ${
            isRealityMode
              ? "border-red-900/50 bg-zinc-900 text-red-400 focus:border-red-600"
              : "border-zinc-300 bg-zinc-50 text-zinc-700 focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
          min={1}
        />
      </div>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  isRealityMode,
  isDanger,
}: {
  label: string;
  value: string;
  isRealityMode: boolean;
  isDanger?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-2.5 text-center ${
        isRealityMode
          ? "border-red-900/30 bg-zinc-900"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">{label}</p>
      <p
        className={`text-sm font-bold ${
          isDanger
            ? "text-red-500"
            : isRealityMode
            ? "text-zinc-300"
            : "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ── ASCII Chart ──────────────────────────────────────────────────────────────

function ASCIIChart({
  result,
  initialBankroll,
  isRealityMode,
}: {
  result: SimulationResult;
  initialBankroll: number;
  isRealityMode: boolean;
}) {
  const height = 60;
  const width = 100;

  // Build SVG-like visualization using divs
  const allValues = [
    ...result.percentile10,
    ...result.percentile50,
    ...result.percentile90,
  ];
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, initialBankroll * 1.1);
  const range = maxVal - minVal || 1;

  const scaleY = (val: number) => height - ((val - minVal) / range) * height;

  // Sample points for display
  const step = Math.max(1, Math.floor(result.percentile50.length / width));
  const sample50: number[] = [];
  const sample10: number[] = [];
  const sample90: number[] = [];

  for (let i = 0; i < result.percentile50.length; i += step) {
    sample50.push(result.percentile50[i]);
    sample10.push(result.percentile10[i]);
    sample90.push(result.percentile90[i]);
  }

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <div
          key={pct}
          className="absolute left-0 right-0 border-t border-dashed border-zinc-700/30"
          style={{ top: `${pct * 100}%` }}
        />
      ))}

      {/* Percentile band (90th - 10th) */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isRealityMode ? "#ef4444" : "#3b82f6"} stopOpacity="0.2" />
            <stop offset="100%" stopColor={isRealityMode ? "#ef4444" : "#3b82f6"} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* 90th percentile line */}
        <polyline
          fill="none"
          stroke={isRealityMode ? "#ef4444" : "#3b82f6"}
          strokeWidth="1"
          strokeOpacity="0.3"
          points={sample90.map((v, i) => `${(i / (sample90.length - 1)) * width},${scaleY(v)}`).join(" ")}
        />
        {/* 10th percentile line */}
        <polyline
          fill="none"
          stroke={isRealityMode ? "#ef4444" : "#3b82f6"}
          strokeWidth="1"
          strokeOpacity="0.3"
          points={sample10.map((v, i) => `${(i / (sample10.length - 1)) * width},${scaleY(v)}`).join(" ")}
        />
        {/* Median line */}
        <polyline
          fill="none"
          stroke={isRealityMode ? "#ef4444" : "#3b82f6"}
          strokeWidth="2"
          points={sample50.map((v, i) => `${(i / (sample50.length - 1)) * width},${scaleY(v)}`).join(" ")}
        />
      </svg>

      {/* Labels */}
      <div className="absolute right-0 top-0 text-[9px] text-zinc-500">
        90th: {formatCurrency(sample90[sample90.length - 1] || 0)}
      </div>
      <div className="absolute right-0 bottom-0 text-[9px] text-zinc-500">
        10th: {formatCurrency(sample10[sample10.length - 1] || 0)}
      </div>
    </div>
  );
}
