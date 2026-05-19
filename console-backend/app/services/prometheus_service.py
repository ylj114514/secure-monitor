from __future__ import annotations

import time
from typing import Any

import httpx

from app.config import settings


class PrometheusService:
    def __init__(self) -> None:
        self.base_url = settings.PROMETHEUS_URL.rstrip("/")

    async def _get(self, path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
            response = await client.get(f"{self.base_url}{path}", params=params)
            response.raise_for_status()
            return response.json()

    async def query(self, query: str) -> dict[str, Any]:
        return await self._get("/api/v1/query", {"query": query})

    async def query_value(self, query: str) -> float | None:
        try:
            data = await self.query(query)
            result = data.get("data", {}).get("result", [])
            if not result:
                return None
            return float(result[0]["value"][1])
        except Exception:
            return None

    async def query_range(
        self, query: str, start: str | None, end: str | None, step: str
    ) -> dict[str, Any]:
        now = int(time.time())
        params = {
            "query": query,
            "start": start or str(now - 3600),
            "end": end or str(now),
            "step": step,
        }
        return await self._get("/api/v1/query_range", params)

    async def targets(self) -> list[dict[str, Any]]:
        try:
            data = await self._get("/api/v1/targets")
        except Exception:
            return []
        active = data.get("data", {}).get("activeTargets", [])
        return [
            {
                "job": target.get("labels", {}).get("job", ""),
                "instance": target.get("labels", {}).get("instance", ""),
                "health": target.get("health", "unknown"),
                "last_scrape": target.get("lastScrape", ""),
                "scrape_url": target.get("scrapeUrl", ""),
                "labels": target.get("labels", {}),
            }
            for target in active
        ]

    async def alerts(self) -> list[dict[str, Any]]:
        try:
            data = await self._get("/api/v1/alerts")
        except Exception:
            return []
        return data.get("data", {}).get("alerts", [])

    async def service_up(self, job: str) -> bool:
        value = await self.query_value(f'up{{job="{job}"}}')
        return value == 1
