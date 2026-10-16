// ── Core Domain Types ────────────────────────────────────────────────────────

export interface Leg {
  id: string;
  player: string;
  team: string;
  prop: string;
  line: number;
  odds: number; // American odds (e.g., -115, +125)
  trueProb: number; // True probability (0–1) — the "fair" chance
  category: "points" | "rebounds" | "assists" | "threes" | "moneyline" | "spread" | "total";
  correlationNote?: string;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  matchup: string;
  homeTeam: string;
  awayTeam: string;
  homeColor: string;
  awayColor: string;
  date: string;
  broadcast: string;
  promotedOdds: string;
  boostedFrom: string;
  promoBadge: string;
  legs: Leg[];
  realityAudit: {
    trueWinChance: string;
    bookImpliedChance: string;
    houseEdge: string;
    expectedLossPer25: string;
    critiqueNote: string;
  };
}

export interface BetMathResult {
  combinedDecimalOdds: number;
  potentialPayout: number;
  potentialProfit: number;
  impliedProbability: number; // Book's implied probability (0–1)
  trueProbability: number; // True compounded probability (0–1)
  houseHoldPct: number; // House margin percentage
  expectedValue: number; // EV in dollars
  expectedValuePct: number; // EV as percentage of wager
  vigTax: number; // Dollars kept by the book
  legs: Leg[];
  wager: number;
}

export interface SimulationParams {
  initialBankroll: number;
  wagerAmount: number;
  winProbability: number;
  payoutMultiplier: number; // Decimal odds - 1 (net profit per $1)
  numBets: number;
  numSimulations: number;
}

export interface SimulationResult {
  percentile10: number[];
  percentile50: number[];
  percentile90: number[];
  riskOfRuinPct: number;
  avgFinalBankroll: number;
  medianFinalBankroll: number;
  houseEdgeTotal: number;
  betCount: number;
}
