"""Demo: run the math engine against real scenario data to see EV numbers."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from utils.bet_math import (  # noqa: E402
    american_to_decimal,
    expected_value,
    house_hold,
    implied_probability,
    true_probability,
)

with open(Path(__file__).resolve().parent.parent / "data" / "scenarios.json") as f:
    data = json.load(f)

scenario = data["scenarios"][0]  # lakers-warriors

print(f"Scenario: {scenario['id']} - {scenario['title']}")
print(f"Matchup: {scenario['matchup']}")
print()

for leg in scenario["legs"]:
    odds = leg["odds"]
    decimal = american_to_decimal(odds)
    implied = implied_probability(odds)
    true_p = leg.get("true_prob", 0.5)
    ev = expected_value(true_p, decimal, 25.0)
    hold = house_hold(implied, true_p)
    print(f"Leg: {leg['player']} - {leg['prop']}")
    print(f"  Odds: {odds} -> Decimal: {decimal:.4f}")
    print(f"  Implied Prob: {implied:.2%}")
    print(f"  True Prob (from data): {true_p:.2%}")
    print(f"  House Hold (vs true): {hold:.2f}%")
    print(f"  EV per $25 wager: {ev:.2f} ({ev:+.2f})")
    print()
