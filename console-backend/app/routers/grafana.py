from fastapi import APIRouter

from app.services.grafana_service import GrafanaService

router = APIRouter(prefix="/api/grafana", tags=["grafana"])


@router.get("/info")
async def info():
    return GrafanaService().info()
