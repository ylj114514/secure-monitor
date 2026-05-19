from app.config import settings


class GrafanaService:
    def info(self) -> dict:
        internal_base = settings.GRAFANA_URL.rstrip("/")
        public_base = settings.GRAFANA_PUBLIC_URL.rstrip("/")
        dashboards = [
            {
                "name": "Host Dashboard",
                "uid": "securemonitor-host",
                "url": f"{public_base}/d/securemonitor-host/securemonitor-host-dashboard",
            },
            {
                "name": "Container Dashboard",
                "uid": "securemonitor-container",
                "url": f"{public_base}/d/securemonitor-container/securemonitor-container-dashboard",
            },
            {
                "name": "Service Dashboard",
                "uid": "securemonitor-service",
                "url": f"{public_base}/d/securemonitor-service/securemonitor-service-dashboard",
            },
            {
                "name": "Security Dashboard",
                "uid": "securemonitor-security",
                "url": f"{public_base}/d/securemonitor-security/securemonitor-security-dashboard",
            },
        ]
        return {
            "url": internal_base,
            "public_url": public_base,
            "dashboards": dashboards,
            "note": "Grafana iframe embedding is for local course demonstration only.",
        }
