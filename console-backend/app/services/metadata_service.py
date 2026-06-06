from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


DATA_DIR = Path(__file__).resolve().parents[1] / "data"


class MetadataService:
    @lru_cache(maxsize=8)
    def load(self, filename: str) -> Any:
        path = DATA_DIR / filename
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)

    def course_checklist(self) -> list[dict[str, Any]]:
        return self.load("course_checklist.json")

    def alert_rules(self) -> list[dict[str, Any]]:
        return self.load("alert_rules_meta.json")
