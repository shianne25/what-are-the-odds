from fastapi import APIRouter, HTTPException

from schemas.pydantic_models import Scenario, ScenariosResponse

router = APIRouter(
    prefix="/api",
    tags=["scenarios"],
)


# Cache the parsed scenarios at module load time (fast, static data)
_scenarios_response: ScenariosResponse | None = None


def _get_scenarios() -> ScenariosResponse:
    """Load (and cache) the curated scenario data."""
    global _scenarios_response

    if _scenarios_response is None:
        # Loaded lazily on first request and cached for the process lifetime
        # Static data means we never need to re-read the file
        from pathlib import Path
        import json

        data_path = Path(__file__).resolve().parent.parent / "data" / "scenarios.json"
        with open(data_path, "r") as f:
            _scenarios_response = ScenariosResponse.model_validate(json.load(f))

    return _scenarios_response


@router.get("/scenarios", response_model=ScenariosResponse, summary="List all game scenarios")
def list_scenarios() -> ScenariosResponse:
    """Return all curated NBA game scenarios with their parlay legs."""
    return _get_scenarios()


@router.get("/scenarios/{scenario_id}", response_model=Scenario, summary="Get a single scenario")
def get_scenario(scenario_id: str) -> Scenario:
    """Return a single curated scenario by its ID."""
    response = _get_scenarios()

    for scenario in response.scenarios:
        if scenario.id == scenario_id:
            return scenario

    raise HTTPException(status_code=404, detail=f"Scenario '{scenario_id}' not found")
