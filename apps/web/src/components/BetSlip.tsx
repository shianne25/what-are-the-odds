"use client";

import type { BetMathResult } from "@/lib/types";
import { formatCurrency, formatPct } from "@/lib/betMath";

interface BetSlipProps {
  isRealityMode: boolean;
  wager: number;
  onWagerChange: (w: number) => void;
  mathResult: BetMathResult;
  scenarioTitle: string;
}

export default function BetSlip({
  isRealityMode,
  wager,
  onWagerChange,
  mathResult,
  scenarioTitle,
}: BetSlipProps) {
  const hasLegs = mathResult.legs.length > 0;

  return (
    <div
      className={`rounded-xl border p-5 shadow-lg transition-all duration-300 ${
        isRealityMode
          ? "border-red-600/80 bg-zinc-950 text-zinc-100"
          : "border-green-500/50 bg-slate-900 text-white shadow-green-500/10"
      }`}
    >
      {/* Wager Input */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-60">
          Wager Amount
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold opacity-60">
              $
            </span>
            <input
              type="number"
              value={wager}
              onChange={(e) => onWagerChange(Math.max(0, Number(e.target.value)))}
              className={`w-full rounded-lg border-2 py-2.5 pl-7 pr-3 text-lg font-bold outline-none transition-colors ${
                isRealityMode
                  ? "border-red-900/50 bg-zinc-900 text-red-400 focus:border-red-600"
                  : "border-green-900/50 bg-zinc-900 text-green-400 focus:border-green-500"
              }`}
              min={1}
            />
          </div>
          {[10, 25, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => onWagerChange(amount)}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                wager === amount
                  ? isRealityMode
                    ? "bg-red-600 text-white"
                    : "bg-green-500 text-black"
                  : isRealityMode
                  ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Rendering */}
      {!hasLegs ? (
        <EmptyState isRealityMode={isRealityMode} />
      ) : isRealityMode ? (
        <RealityView mathResult={mathResult} wager={wager} scenarioTitle={scenarioTitle} />
      ) : (
        <PromotedView mathResult={mathResult} wager={wager} scenarioTitle={scenarioTitle} />
      )}
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ isRealityMode }: { isRealityMode: boolean }) {
  return (
    <div className="py-8 text-center">
      <div className="text-4xl mb-3">{isRealityMode ? "" : ""}</div>
      <p className={`text-sm ${isRealityMode ? "text-zinc-500" : "text-zinc-400"}`}>
        Select legs from the bet builder to see the {isRealityMode ? "audit" : "payout"}
      </p>
    </div>
  );
}

// ── Promoted View (Sportsbook Mode) ─────────────────────────────────────────

function PromotedView({
  mathResult,
  wager,
}: {
  mathResult: BetMathResult;
  wager: number;
  scenarioTitle: string;
}) {
  return (
    <div>
      {/* Boost Badge */}
      <div className="mb-4 inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
        25% PARLAY BOOST APPLIED
      </div>

      {/* Payout */}
      <div className="mb-4">
        <p className="text-xs text-zinc-400 uppercase tracking-wider">Potential Payout</p>
        <p className="text-4xl font-black text-green-400">
          {formatCurrency(mathResult.potentialPayout)}
        </p>
        <p className="text-sm text-zinc-400">
          Risk {formatCurrency(wager)} to win {formatCurrency(mathResult.potentialProfit)}
        </p>
      </div>

      {/* Legs Summary */}
      <div className="mb-4 space-y-1">
        {mathResult.legs.map((leg) => (
          <div key={leg.id} className="flex items-center justify-between text-xs text-zinc-400">
            <span>{leg.player} — {leg.prop}</span>
            <span>{leg.odds > 0 ? `+${leg.odds}` : leg.odds}</span>
          </div>
        ))}
      </div>

      {/* Place Bet Button */}
      <button className="w-full rounded-lg bg-green-500 py-3.5 text-sm font-black uppercase tracking-wider text-black transition-colors hover:bg-green-400 active:scale-[0.98]">
        Place Bet Now
      </button>

      {/* Risk-Free Badge */}
      <div className="mt-3 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2 text-center">
        <span className="text-xs font-bold text-green-400">
          Risk-Free Token Applied — First Bet Covered!
        </span>
      </div>
    </div>
  );
}

// ── Reality View (Truth Mode) ───────────────────────────────────────────────

function RealityView({
  mathResult,
  wager,
  scenarioTitle,
}: {
  mathResult: BetMathResult;
  wager: number;
  scenarioTitle: string;
}) {
  const winChance = mathResult.trueProbability;
  const oneIn = winChance > 0 ? Math.round(1 / winChance) : 0;

  return (
    <div>
      {/* Audit Header */}
      <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
        <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
          Audit: Algorithmic Advantage
        </span>
        <span className="rounded bg-red-600/20 px-2 py-0.5 text-xs font-bold text-red-400">
          HOUSE HOLD: {formatPct(mathResult.houseHoldPct)}
        </span>
      </div>

      {/* True Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">True Chance of Winning</span>
          <span className="font-bold text-red-400">
            1 in {oneIn} games ({formatPct(winChance * 100, 2)})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Book Implied Probability</span>
          <span className="font-mono text-sm text-zinc-300">
            {formatPct(mathResult.impliedProbability * 100, 2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Expected Value per {formatCurrency(wager)}</span>
          <span className="font-bold text-red-400">
            {formatCurrency(mathResult.expectedValue)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Vig Tax (book's cut)</span>
          <span className="font-bold text-amber-500">
            {formatCurrency(mathResult.vigTax)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Long-term house edge</span>
          <span className="font-bold text-red-400">
            {formatPct(mathResult.expectedValuePct, 1)} per bet
          </span>
        </div>
      </div>

      {/* Fine Print */}
      <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 p-3">
        <p className="text-[11px] leading-relaxed text-red-300">
          <strong>Notice:</strong> Multi-leg parlays compound the book's margin from ~4.5% up to{" "}
          {formatPct(mathResult.houseHoldPct)}. Over 100 bets, this guarantees total loss of capital.
          {scenarioTitle && (
            <span className="mt-1 block text-red-400/80">
              Scenario: {scenarioTitle}
            </span>
          )}
        </p>
      </div>

      {/* Comparison */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-zinc-900 p-2">
          <p className="text-[10px] text-zinc-500 uppercase">Your Bet</p>
          <p className="text-sm font-bold text-red-400">1 in {oneIn}</p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-2">
          <p className="text-[10px] text-zinc-500 uppercase">Roulette</p>
          <p className="text-sm font-bold text-zinc-300">1 in 38</p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-2">
          <p className="text-[10px] text-zinc-500 uppercase">Powerball</p>
          <p className="text-sm font-bold text-zinc-300">1 in 292M</p>
        </div>
      </div>
    </div>
  );
}
