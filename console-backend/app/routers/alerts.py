from fastapi import APIRouter

from app.services.alertmanager_service import AlertmanagerService
from app.services.alerts_summary import build_alerts_summary
from app.services.prometheus_service import PrometheusService

router = APIRouter(prefix="/api", tags=["alerts"])


@router.get("/alerts")
async def alerts():
    prometheus_alerts = await PrometheusService().alerts()
    alertmanager_alerts = await AlertmanagerService().alerts()
    return build_alerts_summary(prometheus_alerts, alertmanager_alerts)
