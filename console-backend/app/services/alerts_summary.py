from __future__ import annotations

from typing import Any


def build_alerts_summary(
    prometheus_alerts: list[dict[str, Any]],
    alertmanager_alerts: list[dict[str, Any]],
) -> dict[str, Any]:
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
