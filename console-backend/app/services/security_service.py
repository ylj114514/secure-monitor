from __future__ import annotations

import httpx

from app.config import settings
from app.services.prometheus_service import PrometheusService


class SecurityService:
    def __init__(self) -> None:
        self.prometheus = PrometheusService()
        self.base_url = settings.SECURITY_EXPORTER_URL.rstrip("/")

    async def metrics(self) -> dict:
        queries = {
            "failed_login_total": "security_failed_login_total",
            "suspicious_request_total": "security_suspicious_request_total",
            "open_port_count": "security_open_port_count",
            "container_restart_total": "security_container_restart_total",
            "high_cpu_process_count": "security_high_cpu_process_count",
            "security_risk_score": "security_risk_score",
        }
        values = {}
        for key, query in queries.items():
            value = await self.prometheus.query_value(query)
            values[key] = value if value is not None else 0
        return values

    async def post(self, path: str, payload: dict | None = None) -> dict:
        async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
            response = await client.post(f"{self.base_url}{path}", json=payload)
            response.raise_for_status()
            return response.json()
