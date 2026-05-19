from fastapi import APIRouter

router = APIRouter(prefix="/api/docs", tags=["docs"])


@router.get("/links")
async def links():
    return {
        "links": [
            {"name": "README", "path": "README.md"},
            {"name": "Course Mapping", "path": "docs/00_course_mapping.md"},
            {"name": "Requirements", "path": "docs/01_requirements.md"},
            {"name": "Architecture", "path": "docs/02_architecture.md"},
            {"name": "Prometheus Design", "path": "docs/03_prometheus_design.md"},
            {"name": "Grafana Design", "path": "docs/04_grafana_design.md"},
            {"name": "Alertmanager Design", "path": "docs/05_alertmanager_design.md"},
            {"name": "Security Monitoring", "path": "docs/06_security_monitoring.md"},
            {"name": "Kubernetes Research", "path": "docs/07_kubernetes_research.md"},
            {"name": "Test Plan", "path": "docs/08_test_plan.md"},
            {"name": "Test Report", "path": "docs/09_test_report.md"},
            {"name": "Defense Script", "path": "docs/10_defense_script.md"},
        ]
    }
