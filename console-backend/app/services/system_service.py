import httpx

from app.config import settings
from app.services.prometheus_service import PrometheusService
from app.services.risk_score_service import RiskScoreService
from app.services.security_service import SecurityService


class SystemService:
    def __init__(self) -> None:
        self.prometheus = PrometheusService()
        self.security = SecurityService()
        self.risk_score = RiskScoreService()

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
        targets_down = max(0, targets_total - targets_up)
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
                'scalar(max(100 * (1 - (node_filesystem_avail_bytes{mountpoint=~"(/mnt|/run/desktop/mnt|/parent-distro/mnt)/host/[a-zA-Z]"} / node_filesystem_size_bytes{mountpoint=~"(/mnt|/run/desktop/mnt|/parent-distro/mnt)/host/[a-zA-Z]"})))) '
                'or scalar(max(100 * (1 - (node_filesystem_avail_bytes{fstype!~"tmpfs|overlay|squashfs|nsfs|proc|sysfs|devtmpfs|cgroup2?|tracefs|debugfs|fuse.*"} / node_filesystem_size_bytes{fstype!~"tmpfs|overlay|squashfs|nsfs|proc|sysfs|devtmpfs|cgroup2?|tracefs|debugfs|fuse.*"}))))'
            )
            host_metric_source = "node-exporter-wsl2"
        security = await self.security.metrics()
        component_status = {
            "prometheus": "up" if prometheus_up else "down",
            "grafana": "up" if grafana_up else "down",
            "alertmanager": "up" if alertmanager_up else "down",
            "targets": "up" if targets_total and targets_down == 0 else "down",
        }
        health = self._health(
            component_status=component_status,
            targets_total=targets_total,
            targets_down=targets_down,
            active_alerts=active_alerts,
        )
        comprehensive_risk = self.risk_score.calculate(
            cpu_usage=cpu_usage or 0,
            memory_usage=memory_usage or 0,
            disk_usage=disk_usage or 0,
            targets_down=targets_down,
            active_alerts=active_alerts,
            failed_login_total=security.get("failed_login_total", 0),
            security_risk_score=security.get("security_risk_score", 0),
        )

        return {
            "system_status": health["system_status"],
            "health_level": health["health_level"],
            "health_message": health["health_message"],
            "component_status": component_status,
            "prometheus_up": prometheus_up,
            "grafana_up": grafana_up,
            "alertmanager_up": alertmanager_up,
            "targets_total": targets_total,
            "targets_up": targets_up,
            "targets_down": targets_down,
            "active_alerts": active_alerts,
            "cpu_usage": cpu_usage or 0,
            "memory_usage": memory_usage or 0,
            "disk_usage": disk_usage or 0,
            "host_metric_source": host_metric_source,
            "security_risk_score": security.get("security_risk_score", 0),
            "comprehensive_risk": comprehensive_risk,
        }

    def _health(
        self,
        *,
        component_status: dict,
        targets_total: int,
        targets_down: int,
        active_alerts: int,
    ) -> dict:
        down_components = [
            name for name, status in component_status.items() if name != "targets" and status != "up"
        ]
        if down_components:
            return {
                "system_status": "critical",
                "health_level": "critical",
                "health_message": "核心监控组件不可用：" + "、".join(down_components),
            }
        if targets_total == 0:
            return {
                "system_status": "critical",
                "health_level": "critical",
                "health_message": "Prometheus 暂未发现任何采集目标，请检查服务发现配置。",
            }
        if targets_down > 0:
            return {
                "system_status": "degraded",
                "health_level": "warning",
                "health_message": f"{targets_down} 个采集目标异常，监控覆盖不完整。",
            }
        if active_alerts > 0:
            return {
                "system_status": "degraded",
                "health_level": "warning",
                "health_message": f"核心组件正常，但存在 {active_alerts} 条活跃告警。",
            }
        return {
            "system_status": "ok",
            "health_level": "ok",
            "health_message": "核心组件和采集目标均正常。",
        }
