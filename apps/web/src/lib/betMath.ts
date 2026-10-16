import type { Leg, BetMathResult, SimulationParams, SimulationResult } from "./types";

// ── American Odds → Decimal Odds ────────────────────────────────────────────
export function americanToDecimal(americanOdds: number): number {
  if (americanOdds > 0) {
    return 1 + americanOdds / 100;
  }
  return 1 + 100 / Math.abs(americanOdds);
}

// ── American Odds → Implied Probability ─────────────────────────────────────
export function impliedProbability(americanOdds: number): number {
  if (americanOdds > 0) {
    return 100 / (americanOdds + 100);
  }
  return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
}

// ── Combined Decimal Odds (multiply all legs) ───────────────────────────────
export function combinedDecimalOdds(legs: Leg[]): number {
  return legs.reduce((acc, leg) => acc * americanToDecimal(leg.odds), 1);
}

// ── True Compounded Probability ─────────────────────────────────────────────
export function trueCompoundedProbability(legs: Leg[]): number {
  return legs.reduce((acc, leg) => acc * leg.trueProb, 1);
}

// ── House Hold Margin ───────────────────────────────────────────────────────
export function houseHoldPct(impliedProb: number, trueProb: number): number {
  if (impliedProb === 0) return 0;
  return ((impliedProb - trueProb) / impliedProb) * 100;
}

// ── Expected Value ──────────────────────────────────────────────────────────
export function expectedValue(
  trueProb: number,
  potentialProfit: number,
  wager: number
): number {
  return trueProb * potentialProfit - (1 - trueProb) * wager;
}

// ── Full Bet Math Calculation ───────────────────────────────────────────────
export function calculateBetMath(legs: Leg[], wager: number): BetMathResult {
  if (legs.length === 0) {
    return {
      combinedDecimalOdds: 0,
      potentialPayout: 0,
      potentialProfit: 0,
      impliedProbability: 0,
      trueProbability: 0,
      houseHoldPct: 0,
      expectedValue: 0,
      expectedValuePct: 0,
      vigTax: 0,
      legs,
      wager,
    };
  }

  const decimal = combinedDecimalOdds(legs);
  const potentialPayout = wager * decimal;
  const potentialProfit = potentialPayout - wager;
  const impliedProb = 1 / decimal; // Book's implied probability from combined odds
  const trueProb = trueCompoundedProbability(legs);
  const hold = houseHoldPct(impliedProb, trueProb);
  const ev = expectedValue(trueProb, potentialProfit, wager);
  const evPct = (ev / wager) * 100;
  const vigTax = Math.abs(Math.min(ev, 0));

  return {
    combinedDecimalOdds: decimal,
    potentialPayout,
    potentialProfit,
    impliedProbability: impliedProb,
    trueProbability: trueProb,
    houseHoldPct: hold,
    expectedValue: ev,
    expectedValuePct: evPct,
    vigTax,
    legs,
    wager,
  };
}

// ── Monte Carlo Simulation ──────────────────────────────────────────────────
export function runMonteCarlo(params: SimulationParams): SimulationResult {
  const {
    initialBankroll,
    wagerAmount,
    winProbability,
    payoutMultiplier,
    numBets,
    numSimulations,
  } = params;

  const trajectories: number[][] = [];
  let ruinCount = 0;
  let totalHouseEdge = 0;

  for (let sim = 0; sim < numSimulations; sim++) {
    let bankroll = initialBankroll;
    const trajectory: number[] = [bankroll];

    for (let bet = 0; bet < numBets; bet++) {
      if (bankroll <= 0) {
        trajectory.push(0);
        continue;
      }

      const wager = Math.min(wagerAmount, bankroll);
      const won = Math.random() < winProbability;

      if (won) {
        bankroll += wager * payoutMultiplier;
      } else {
        bankroll -= wager;
        totalHouseEdge += wager * 0.045; // Approximate vig per bet
      }

      trajectory.push(Math.max(bankroll, 0));
    }

    if (bankroll <= 0) ruinCount++;
    trajectories.push(trajectory);
  }

  // Calculate percentiles at each bet index
  const percentile10: number[] = [];
  const percentile50: number[] = [];
  const percentile90: number[] = [];

  for (let i = 0; i <= numBets; i++) {
    const values = trajectories
      .map((t) => t[i])
      .sort((a, b) => a - b);

    const p10Idx = Math.floor(values.length * 0.1);
    const p50Idx = Math.floor(values.length * 0.5);
    const p90Idx = Math.floor(values.length * 0.9);

    percentile10.push(values[p10Idx]);
    percentile50.push(values[p50Idx]);
    percentile90.push(values[p90Idx]);
  }

  const finalBankrolls = trajectories.map((t) => t[t.length - 1]).sort((a, b) => a - b);
  const avgFinal = finalBankrolls.reduce((a, b) => a + b, 0) / finalBankrolls.length;
  const medianFinal = finalBankrolls[Math.floor(finalBankrolls.length / 2)];

  return {
    percentile10,
    percentile50,
    percentile90,
    riskOfRuinPct: (ruinCount / numSimulations) * 100,
    avgFinalBankroll: avgFinal,
    medianFinalBankroll: medianFinal,
    houseEdgeTotal: totalHouseEdge / numSimulations,
    betCount: numBets,
  };
}

// ── Formatters ──────────────────────────────────────────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPct(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatOdds(americanOdds: number): string {
  return americanOdds > 0 ? `+${americanOdds}` : `${americanOdds}`;
}
