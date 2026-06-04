import httpx

from app.config import settings
from app.services.prometheus_service import PrometheusService
from app.services.security_service import SecurityService


class SystemService:
    def __init__(self) -> None:
        self.prometheus = PrometheusService()
        self.security = SecurityService()

    async def _http_up(self, url: str) -> bool:
        try:
            async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
                response = await client.get(url)
                return response.status_code < 500
        except Exception:
            return False

    async def _windows_host_metrics(self) -> dict | None:
        try:
            async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
                response = await client.get(
                    f"{settings.WINDOWS_HOST_EXPORTER_URL.rstrip('/')}/api/host"
                )
                response.raise_for_status()
                data = response.json()
        except Exception:
            return None

        required = ("cpu_usage", "memory_usage", "disk_usage")
        if not all(key in data for key in required):
            return None
        return data

    async def overview(self) -> dict:
        targets = await self.prometheus.targets()
        targets_total = len(targets)
        targets_up = len([target for target in targets if target["health"] == "up"])
        prometheus_up = await self._http_up(f"{settings.PROMETHEUS_URL}/-/ready")
        grafana_up = await self._http_up(f"{settings.GRAFANA_URL}/api/health")
        alertmanager_up = await self._http_up(f"{settings.ALERTMANAGER_URL}/-/ready")
        alerts = await self.prometheus.alerts()
        active_alerts = len([alert for alert in alerts if alert.get("state") == "firing"])

        host_metrics = await self._windows_host_metrics()
        if host_metrics:
            cpu_usage = host_metrics["cpu_usage"]
            memory_usage = host_metrics["memory_usage"]
            disk_usage = host_metrics["disk_usage"]
            host_metric_source = "windows-host-exporter"
        else:
            cpu_usage = await self.prometheus.query_value(
                '100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)'
            )
            memory_usage = await self.prometheus.query_value(
                "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100"
            )
            # Docker Desktop/WSL2 会同时暴露 Linux 虚拟机挂载点和 Windows 宿主机盘。
            # 课程演示时优先展示 Windows 宿主机盘的最高使用率；非 Windows 环境回退到普通 Linux 文件系统。
            disk_usage = await self.prometheus.query_value(
                'max(100 * (1 - (node_filesystem_avail_bytes{mountpoint=~"/run/desktop/mnt/host/[a-zA-Z]"} / node_filesystem_size_bytes{mountpoint=~"/run/desktop/mnt/host/[a-zA-Z]"}))) '
                'or max(100 * (1 - (node_filesystem_avail_bytes{fstype!~"tmpfs|overlay|squashfs|nsfs|proc|sysfs|devtmpfs|cgroup2?|tracefs|debugfs|fuse.*"} / node_filesystem_size_bytes{fstype!~"tmpfs|overlay|squashfs|nsfs|proc|sysfs|devtmpfs|cgroup2?|tracefs|debugfs|fuse.*"})))'
            )
            host_metric_source = "node-exporter-wsl2"
        security = await self.security.metrics()

        return {
            "system_status": "ok" if targets_total and targets_up else "degraded",
            "prometheus_up": prometheus_up,
            "grafana_up": grafana_up,
            "alertmanager_up": alertmanager_up,
            "targets_total": targets_total,
            "targets_up": targets_up,
            "active_alerts": active_alerts,
            "cpu_usage": cpu_usage or 0,
            "memory_usage": memory_usage or 0,
            "disk_usage": disk_usage or 0,
            "host_metric_source": host_metric_source,
            "security_risk_score": security.get("security_risk_score", 0),
        }
