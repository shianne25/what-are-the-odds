"""Pure mathematical engine for American odds, vig stripping, parlays, and EV.

All functions are pure (no I/O, no side effects) so they can be unit tested
deterministically.
"""


def american_to_decimal(odds: int) -> float:
    """Convert American odds to decimal odds (total return per $1 staked, including stake).

    - Positive odds (e.g. +140): decimal = 1 + (140 / 100) = 2.40
    - Negative odds (e.g. -115): decimal = 1 + (100 / 115) = 1.87
    """
    if odds > 0:
        return 1.0 + (odds / 100.0)
    return 1.0 + (100.0 / abs(odds))


def implied_probability(american_odds: int) -> float:
    """Implied probability from American odds (includes vig). Returns fraction 0..1."""
    return 1.0 / american_to_decimal(american_odds)


def vig_fraction(american_odds: list[int]) -> float:
    """Vig as a fraction (e.g. 0.0476 for a ~4.76% vig).

    Calculated as: sum of implied probabilities - 1.0
    If the true probabilities sum to 1.0, vig fraction is 0.
    """
    total_implied = sum(1.0 / american_to_decimal(o) for o in american_odds)
    return total_implied - 1.0


def true_probability(american_odds: list[int]) -> float:
    """Strip the vig to reveal true probability, then compound across legs.

    For a single leg: true = implied / (1 + vig).
    For multiple legs: true = product of each leg's true probability.

    Returns compounded true probability (fraction 0..1).
    """
    total_implied = sum(1.0 / american_to_decimal(o) for o in american_odds)
    vig = max(total_implied - 1.0, 0.0)

    per_leg_true = [ (1.0 / american_to_decimal(o)) / (1.0 + vig) for o in american_odds ]

    compounded = 1.0
    for p in per_leg_true:
        compounded *= p
    return compounded


def compound_true_probability(true_probs: list[float]) -> float:
    """Multiply a list of true probabilities together (parlay compounding)."""
    result = 1.0
    for p in true_probs:
        result *= p
    return result


def house_hold(implied: float, true: float) -> float:
    """House hold percentage = ((implied - true) / implied) * 100.

    The percentage of the implied probability that is actually the house edge.
    """
    if implied <= 0:
        return 0.0
    return ((implied - true) / implied) * 100.0


def expected_value(true_prob: float, decimal_odds: float, wager: float) -> float:
    """Expected value in dollars for a bet.

    EV = (TrueProb * ProfitIfWin) - ((1 - TrueProb) * StakeLost)

    Positive EV = bettor has edge. Negative EV = bettor expects to lose.
    """
    profit_if_win = (decimal_odds - 1.0) * wager
    return (true_prob * profit_if_win) - ((1.0 - true_prob) * wager)
