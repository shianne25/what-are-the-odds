"""FastAPI in-process tests for the What Are The Odds API."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient  # noqa: E402

from main import app  # noqa: E402

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_list_scenarios():
    response = client.get("/api/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert len(data["scenarios"]) == 3


def test_get_single_scenario():
    response = client.get("/api/scenarios/lakers-warriors")
    assert response.status_code == 200
    assert response.json()["id"] == "lakers-warriors"
    assert len(response.json()["legs"]) == 4


def test_scenario_not_found():
    response = client.get("/api/scenarios/does-not-exist")
    assert response.status_code == 404


if __name__ == "__main__":
    test_health_check()
    test_list_scenarios()
    test_get_single_scenario()
    test_scenario_not_found()
    print("ALL TESTS PASSED")
