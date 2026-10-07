---
name: portfolio-risk-engine
description: Quantitative portfolio theory guidelines (Monte Carlo, Sharpe ratio, Kelly criterion, and Risk of Ruin) applied to sports betting slips and bankroll trajectories.
---

# Quantitative Portfolio & Risk Engine Skill

Apply these quantitative principles when building simulation workers (`apps/web/src/workers/`), bankroll analytics tools, or financial math utilities (`apps/web/src/lib/`).

---

## 1. Betting Slips as Asset Portfolios
Treat multi-leg Same-Game Parlays (SGPs) and sequential bet streams as financial asset portfolios governed by expected return ($E[R]$) and variance ($\sigma^2$):

- **Expected Value ($EV$):**
  $$EV = (P_{\text{true}} \times \text{Net Payout}) - ((1 - P_{\text{true}}) \times \text{Stake})$$
- **Expected Return Rate ($R$):**
  $$R = \frac{EV}{\text{Stake}}$$
- **Vig Tax Efficiency Ratio:**
  $$\text{Vig Tax Ratio} = 1 - \frac{P_{\text{true}}}{P_{\text{implied}}}$$

> **Guideline:** A negative $EV$ wager represents a negative drift asset. When combining legs in an SGP, compound the true probability ($P_{\text{true}} = \prod P_i$) and highlight how the house edge compounds exponentially with each additional leg.

---

## 2. Bankroll Simulation & Risk Metrics

When running Monte Carlo bankroll simulations ($N \ge 10,000$ iterations):

1. **Sequential Bankroll Path:**
   $$V_t = \max\left(0, \; V_{t-1} + \Delta_t\right)$$
   Where $\Delta_t = \text{Payout} - \text{Stake}$ on a win ($P_{\text{true}}$) or $-\text{Stake}$ on a loss ($1 - P_{\text{true}}$).

2. **Percentile Distribution Output:**
   Sort all simulated bankroll endpoints at timestep $T$ to extract:
   - **$P_{10}$ (Downside / Value at Risk):** 10th percentile trajectory curve.
   - **$P_{50}$ (Median Trajectory):** 50th percentile expected bankroll curve.
   - **$P_{90}$ (Upside Variance):** 90th percentile optimistic curve.

3. **Risk of Ruin (Ruin Rate):**
   $$\text{Risk of Ruin} = \frac{\text{Count of paths where } V_t \le 0}{\text{Total Simulations } N}$$

4. **Sharpe Ratio Equivalent (Betting Efficiency Score):**
   $$\text{Sharpe Ratio} = \frac{E[R_p] - R_f}{\sigma_p}$$
   Where $R_f$ is risk-free return ($0$) and $\sigma_p$ is standard deviation of bet return streams.

---

## 3. Position Sizing & Kelly Criterion Analysis

To demonstrate optimal bankroll management versus recreational bettor behavior:

- **Full Kelly Fraction ($f^*$):**
  $$f^* = \frac{b \cdot P_{\text{true}} - (1 - P_{\text{true}})}{b}$$
  Where $b$ is net decimal odds ($\text{Decimal Odds} - 1$).
- **Negative EV Rule:** If $EV < 0$, $f^*$ evaluates to a negative number. Explicitly highlight to the user that **mathematically optimal position size is $0 (Do Not Bet)**.
- **Fractional Kelly Simulation:** Provide presets for Half-Kelly ($0.5 \cdot f^*$) and Quarter-Kelly ($0.25 \cdot f^*$) to illustrate variance reduction in winning scenarios.

---

## 4. Implementation Rules & TypeScript Interfaces

When generating code for simulation workers or math helper modules, strictly follow these structural TypeScript definitions:

```typescript
export interface BetLeg {
  id: string;
  americanOdds: number;
  impliedProbability: number;
  fairProbability: number;
}

export interface ParlayPortfolio {
  legs: BetLeg[];
  stake: number;
  offeredAmericanOdds: number;
  totalImpliedProbability: number;
  totalFairProbability: number;
  expectedValue: number;
  vigTaxAmount: number;
  houseEdgePercentage: number;
}

export interface SimulationParams {
  portfolio: ParlayPortfolio;
  initialBankroll: number;
  totalBetsCount: number;
  simulationsCount: number; // Default: 10,000
  wagerStrategy: 'flat' | 'percentage';
  wagerAmountOrPercent: number;
}

export interface SimulationResults {
  percentile10: number[];
  percentile50: number[];
  percentile90: number[];
  riskOfRuinPercent: number;
  expectedMedianFinalBankroll: number;
  totalVigPaidMedian: number;
}