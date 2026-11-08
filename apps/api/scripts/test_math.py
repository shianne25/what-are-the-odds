"""Tests for the odds math engine: conversion, vig stripping, EV, house edge."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from utils.bet_math import (  # noqa: E402
    american_to_decimal,
    compound_true_probability,
    expected_value,
    house_hold,
    implied_probability,
    true_probability,
    vig_fraction,
)


def approx(a, b, tol=1e-6):
    return abs(a - b) < tol


def test_american_to_decimal_positive():
    # +140 -> decimal 2.40
    assert approx(american_to_decimal(140), 2.40)


def test_american_to_decimal_negative():
    # -115 -> decimal ~1.87
    assert approx(american_to_decimal(-115), 1.8695652173913043)


def test_implied_probability():
    # -110 -> implied ~0.5238
    assert approx(implied_probability(-110), 0.5238095238095238)


def test_vig_fraction_single_leg_parlay():
    # Two fair legs at -110/-110 -> total implied 1.0476 -> vig ~0.0476
    vig = vig_fraction([-110, -110])
    assert approx(vig, 0.0476, 1e-3)


def test_true_probability_parlay():
    # Two true-50% legs -> parlay true prob 0.25
    true_p = true_probability([-110, -110])
    assert approx(true_p, 0.25, 1e-6)


def test_house_hold():
    # implied 0.5238, true 0.5 -> hold ~4.55%
    hold = house_hold(0.5238095238095238, 0.5)
    assert approx(hold, 4.55, 1e-1)


def test_expected_value_fair_bet_zero():
    # Fair bet: true prob 0.5, decimal 2.0, wager 25 -> EV = 0
    ev = expected_value(0.5, 2.0, 25.0)
    assert approx(ev, 0.0, 1e-9)


def test_expected_value_negative_for_sportsbook():
    # Sportsbook bet at -110 (decimal ~1.91) with true prob 0.5 -> negative EV
    ev = expected_value(0.5, american_to_decimal(-110), 25.0)
    assert ev < 0


def test_compound_true_probability():
    # 0.5 * 0.5 = 0.25
    assert approx(compound_true_probability([0.5, 0.5]), 0.25, 1e-6)


if __name__ == "__main__":
    test_american_to_decimal_positive()
    test_american_to_decimal_negative()
    test_implied_probability()
    test_vig_fraction_single_leg_parlay()
    test_true_probability_parlay()
    test_house_hold()
    test_expected_value_fair_bet_zero()
    test_expected_value_negative_for_sportsbook()
    test_compound_true_probability()
    print("ALL MATH TESTS PASSED")
