from fastapi import APIRouter

from app.services.alertmanager_service import AlertmanagerService
from app.services.prometheus_service import PrometheusService

router = APIRouter(prefix="/api", tags=["alerts"])


@router.get("/alerts")
async def alerts():
    prometheus_alerts = await PrometheusService().alerts()
    alertmanager_alerts = await AlertmanagerService().alerts()
    merged = []
    for alert in prometheus_alerts:
        labels = alert.get("labels", {})
        annotations = alert.get("annotations", {})
        merged.append(
            {
                "source": "prometheus",
                "name": labels.get("alertname", ""),
                "severity": labels.get("severity", "unknown"),
                "state": alert.get("state", "unknown"),
                "starts_at": alert.get("activeAt", ""),
                "summary": annotations.get("summary", ""),
                "description": annotations.get("description", ""),
                "labels": labels,
            }
        )
    for alert in alertmanager_alerts:
        labels = alert.get("labels", {})
        annotations = alert.get("annotations", {})
        merged.append(
            {
                "source": "alertmanager",
                "name": labels.get("alertname", ""),
                "severity": labels.get("severity", "unknown"),
                "state": alert.get("status", {}).get("state", "unknown"),
                "starts_at": alert.get("startsAt", ""),
                "summary": annotations.get("summary", ""),
                "description": annotations.get("description", ""),
                "labels": labels,
            }
        )
    return {
        "active_count": len(merged),
        "critical_count": len([a for a in merged if a["severity"] == "critical"]),
        "warning_count": len([a for a in merged if a["severity"] == "warning"]),
        "alerts": merged,
    }
