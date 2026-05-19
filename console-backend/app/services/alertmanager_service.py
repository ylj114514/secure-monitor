from __future__ import annotations

from typing import Any

import httpx

from app.config import settings


class AlertmanagerService:
    def __init__(self) -> None:
        self.base_url = settings.ALERTMANAGER_URL.rstrip("/")

    async def alerts(self) -> list[dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
                response = await client.get(f"{self.base_url}/api/v2/alerts")
                response.raise_for_status()
                return response.json()
        except Exception:
            return []
