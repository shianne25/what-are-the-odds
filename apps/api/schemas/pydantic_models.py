from typing import Optional

from pydantic import BaseModel, Field


class Leg(BaseModel):
    """A single playable prop bet within a parlay scenario."""

    id: str = Field(description="Unique leg identifier, e.g. 'lal-lal-james-pts'")
    player: str = Field(description="Player name, e.g. 'LeBron James'")
    team: Optional[str] = Field(default=None, description="Owning team abbreviation")
    prop: str = Field(description="Prop description, e.g. 'Over 24.5 Points'")
    line: Optional[float] = Field(default=None, description="Prop line number, null for moneylines")
    odds: int = Field(description="American odds, e.g. -115 or +140")
    true_prob: float = Field(description="True probability estimate, 0.0 - 1.0")


class RealityAudit(BaseModel):
    """Educational audit data shown in 'Truth Mode'."""

    true_win_chance: str = Field(description="True win probability, formatted for display")
    book_implied_chance: str = Field(description="Book implied probability, formatted for display")
    house_edge: str = Field(description="House hold margin, formatted for display")
    expected_loss_per_25: str = Field(description="Expected loss per $25 wager, formatted for display")
    critique_note: str = Field(description="Educational footnote explaining the trap")


class Scenario(BaseModel):
    """A curated NBA game night scenario with its parlay legs."""

    id: str = Field(description="Scenario identifier, e.g. 'lakers-warriors'")
    title: str = Field(description="Marketing-friendly scenario title")
    matchup: str = Field(description="Human-readable matchup, e.g. 'Los Angeles Lakers @ Golden State Warriors'")
    game_date: str = Field(description="Scheduled game date, ISO format")
    broadcast: str = Field(description="Broadcast network, e.g. 'ESPN'")
    promoted_odds: str = Field(description="Boosted parlay payout, e.g. '+850'")
    boosted_from: str = Field(description="Original odds before the boost, e.g. '+650'")
    promo_badges: list[str] = Field(default_factory=list, description="Promo badges shown to bettors")
    legs: list[Leg] = Field(default_factory=list, description="Selectable parlay legs")
    reality_audit: RealityAudit = Field(description="Diagnostic audit data")


class ScenariosResponse(BaseModel):
    """Top-level API response wrapper."""

    scenarios: list[Scenario] = Field(description="List of curated scenarios")


class ScenarioResponse(Scenario):
    """Single scenario response (includes audit)."""


__all__ = [
    "Leg",
    "RealityAudit",
    "Scenario",
    "ScenariosResponse",
]
