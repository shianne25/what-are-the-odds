"""Validate the scenarios.json data against our Pydantic models."""

import json
import sys
from pathlib import Path

# Add the API directory to sys.path so we can import our schemas
API_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(API_DIR))

from schemas.pydantic_models import Scenario, ScenariosResponse  # noqa: E402

json_path = API_DIR / "data" / "scenarios.json"

with open(json_path, "r") as f:
    raw = json.load(f)

data = ScenariosResponse.model_validate(raw)

print(f"Validated {len(data.scenarios)} scenarios successfully!")
for s in data.scenarios:
    print(f"  - {s.id}: {s.title} ({len(s.legs)} legs)")

print(f"First scenario's audit: {data.scenarios[0].reality_audit.model_dump()}")
print(f"First leg: {data.scenarios[0].legs[0].model_dump()}")

sys.exit(0)
