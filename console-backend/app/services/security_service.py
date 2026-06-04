from __future__ import annotations

import re

import httpx

from app.config import settings
from app.services.prometheus_service import PrometheusService


class SecurityService:
    def __init__(self) -> None:
        self.prometheus = PrometheusService()
        self.base_url = settings.SECURITY_EXPORTER_URL.rstrip("/")

    async def metrics(self) -> dict:
        live_values = await self._exporter_metrics()
        if live_values:
            return live_values

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

    async def _exporter_metrics(self) -> dict:
        metric_map = {
            "security_failed_login_total": "failed_login_total",
            "security_suspicious_request_total": "suspicious_request_total",
            "security_open_port_count": "open_port_count",
            "security_container_restart_total": "container_restart_total",
            "security_high_cpu_process_count": "high_cpu_process_count",
            "security_risk_score": "security_risk_score",
        }
        try:
            async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
                response = await client.get(f"{self.base_url}/metrics")
                response.raise_for_status()
        except Exception:
            return {}

        values: dict[str, float] = {}
        for line in response.text.splitlines():
            if not line or line.startswith("#") or "{" in line:
                continue
            match = re.match(r"^([a-zA-Z_:][a-zA-Z0-9_:]*)\s+(-?\d+(?:\.\d+)?)$", line)
            if not match:
                continue
            name, value = match.groups()
            if name in metric_map:
                values[metric_map[name]] = float(value)
        return values

    async def post(self, path: str, payload: dict | None = None) -> dict:
        async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
            response = await client.post(f"{self.base_url}{path}", json=payload)
            response.raise_for_status()
            return response.json()
