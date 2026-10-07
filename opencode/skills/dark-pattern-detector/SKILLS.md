---
name: dark-pattern-detector
description: Guidelines and classification logic for identifying dark patterns, deceptive UI tricks, and manipulative odds displays in sportsbooks.
---

# Dark Pattern Detection Skill (Inspired by CogniGaurd)

When auditing UI components or writing "Truth Mode" deconstruction logic in `apps/web`:

## 1. Core Dark Pattern Categories
Identify and flag these 5 major manipulative UI patterns in sports betting slips:

- **Misdirection / Visual Dominance:** Highlighted potential payouts ($1,250.00!) in bright green while hiding small text risk warnings or negative EV numbers.
- **Hidden Cost / Opaque Vig:** Obscuring the bookmaker juice by showing only combined parlay multipliers (+1200) instead of individual leg probabilities.
- **Sunk Cost & False Urgency:** "Instant Cash Out" offers, countdown timers, or "Trending Parlay" badges designed to induce FOMO.
- **Forced Action / Pre-Selected Slips:** Defaulting user selections to higher-margin 4-leg parlays instead of single bets.
- **Promotional Illusions:** Framing "Bonus Bets" or "20% Profit Boosts" as "Risk-Free", ignoring that house edge remains positive.

## 2. Detection & Audit Workflow
1. Analyze any bet slip layout or promo card against the 5 categories above.
2. In "Truth Mode", override deceptive visual cues:
   - Recolor payout emphasis based on true Expected Value ($EV$).
   - Convert synthetic odds multipliers into true combined implied probability percentage ($P_{\text{true}}$).
   - Display explicit "Vig Tax" dollar amounts next to every parlay slip.