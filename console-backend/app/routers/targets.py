from fastapi import APIRouter

from app.services.prometheus_service import PrometheusService

router = APIRouter(prefix="/api", tags=["targets"])


@router.get("/targets")
async def targets():
    return {"targets": await PrometheusService().targets()}
