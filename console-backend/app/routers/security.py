from fastapi import APIRouter

from app.services.security_service import SecurityService

router = APIRouter(prefix="/api/security", tags=["security"])


@router.get("/metrics")
async def metrics():
    return await SecurityService().metrics()
