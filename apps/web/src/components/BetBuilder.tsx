"use client";

import type { Scenario, Leg } from "@/lib/types";
import { formatOdds, impliedProbability, formatPct } from "@/lib/betMath";

interface BetBuilderProps {
  scenario: Scenario;
  isRealityMode: boolean;
  activeLegIds: string[];
  onToggleLeg: (legId: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

export default function BetBuilder({
  scenario,
  isRealityMode,
  activeLegIds,
  onToggleLeg,
  onSelectAll,
  onClear,
}: BetBuilderProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Matchup Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          {scenario.broadcast} · {scenario.date}
        </div>
        <h2 className="mt-1 text-xl font-black text-zinc-900 dark:text-zinc-50">
          {scenario.matchup}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{scenario.title}</p>
      </div>

      {/* Promo Badge */}
      {!isRealityMode && (
        <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2">
          <span className="text-xs font-bold text-green-600 dark:text-green-400">
            {scenario.promoBadge}
          </span>
        </div>
      )}

      {/* Prop List */}
      <div className="space-y-2">
        {scenario.legs.map((leg) => (
          <PropItem
            key={leg.id}
            leg={leg}
            isSelected={activeLegIds.includes(leg.id)}
            isRealityMode={isRealityMode}
            onToggle={() => onToggleLeg(leg.id)}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={onSelectAll}
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Select All
        </button>
        <button
          onClick={onClear}
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

// ── Individual Prop Item ────────────────────────────────────────────────────

interface PropItemProps {
  leg: Leg;
  isSelected: boolean;
  isRealityMode: boolean;
  onToggle: () => void;
}

function PropItem({ leg, isSelected, isRealityMode, onToggle }: PropItemProps) {
  const implied = impliedProbability(leg.odds);

  if (isRealityMode) {
    return (
      <button
        onClick={onToggle}
        className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
          isSelected
            ? "border-red-600 bg-red-950/20 dark:bg-red-950/30"
            : "border-zinc-200 bg-zinc-50 hover:border-red-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-red-800"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {leg.player}
              </span>
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {leg.team}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {leg.prop} ({leg.line})
            </p>
            <div className="mt-1.5 space-y-0.5">
              <p className="text-[11px] text-red-500">
                Implied Prob: {formatPct(implied * 100)} vs True:{" "}
                {formatPct(leg.trueProb * 100)}
              </p>
              {leg.correlationNote && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  {leg.correlationNote}
                </p>
              )}
            </div>
          </div>
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-red-600">
            {isSelected && <span className="text-xs font-black text-red-600">X</span>}
          </div>
        </div>
      </button>
    );
  }

  // Sportsbook Mode
  return (
    <button
      onClick={onToggle}
      className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
        isSelected
          ? "border-green-500 bg-green-500/10 shadow-md shadow-green-500/10"
          : "border-zinc-200 bg-white hover:border-green-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-800"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {leg.player}
            </span>
            <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-400">
              {formatOdds(leg.odds)}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {leg.prop} ({leg.line})
          </p>
          {leg.category === "points" && (
            <p className="mt-0.5 text-[10px] text-green-600 dark:text-green-500">
              Trending: 72% of bets on Over
            </p>
          )}
        </div>
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
            isSelected
              ? "border-green-500 bg-green-500"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          {isSelected && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
