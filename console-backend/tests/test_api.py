from fastapi.testclient import TestClient

from app.main import app
from app.services.alertmanager_service import AlertmanagerService
from app.services.grafana_service import GrafanaService
from app.services.prometheus_service import PrometheusService
from app.services.security_service import SecurityService
from app.services.system_service import SystemService


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_course_checklist_endpoint():
    response = client.get("/api/course/checklist")
    assert response.status_code == 200
    body = response.json()
    assert body["items"]
    assert "requirement" in body["items"][0]
    assert "evidence_files" in body["items"][0]


def test_alert_rules_endpoint():
    response = client.get("/api/alert-rules")
    assert response.status_code == 200
    body = response.json()
    assert body["groups"]
    first_group = body["groups"][0]
    assert "group" in first_group
    assert "rules" in first_group
    assert "promql" in first_group["rules"][0]


def test_inspection_report_endpoint(monkeypatch):
    async def fake_overview(self):
        return {
            "system_status": "ok",
            "health_message": "核心组件和采集目标均正常。",
            "prometheus_up": True,
            "grafana_up": True,
            "alertmanager_up": True,
            "targets_up": 2,
            "targets_total": 2,
            "targets_down": 0,
            "active_alerts": 0,
            "cpu_usage": 12.3,
            "memory_usage": 45.6,
            "disk_usage": 67.8,
            "comprehensive_risk": {
                "score": 18.5,
                "label": "低风险",
                "reasons": ["核心组件、采集目标和模拟安全指标均处于较稳定状态。"],
            },
        }

    async def fake_targets(self):
        return [
            {
                "job": "prometheus",
                "instance": "prometheus:9090",
                "health": "up",
                "last_scrape": "2026-06-04T00:00:00Z",
                "last_error": "",
            }
        ]

    async def fake_alerts(self):
        return []

    async def fake_security(self):
        return {
            "failed_login_total": 0,
            "suspicious_request_total": 0,
            "open_port_count": 5,
            "container_restart_total": 0,
            "high_cpu_process_count": 0,
            "security_risk_score": 20,
        }

    monkeypatch.setattr(SystemService, "overview", fake_overview)
    monkeypatch.setattr(PrometheusService, "targets", fake_targets)
    monkeypatch.setattr(PrometheusService, "alerts", fake_alerts)
    monkeypatch.setattr(AlertmanagerService, "alerts", fake_alerts)
    monkeypatch.setattr(SecurityService, "metrics", fake_security)
    monkeypatch.setattr(
        GrafanaService,
        "info",
        lambda self: {
            "public_url": "http://localhost:3000",
            "dashboards": [
                {
                    "name": "Host Dashboard",
                    "url": "http://localhost:3000/d/securemonitor-host",
                }
            ],
        },
    )

    response = client.get("/api/report/inspection")
    assert response.status_code == 200
    assert "text/markdown" in response.headers["content-type"]
    assert "# SecureMonitor OS 巡检报告" in response.text
    assert "截图位置：待本地截图后补充" in response.text
