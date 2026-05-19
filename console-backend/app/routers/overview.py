from fastapi import APIRouter

from app.services.system_service import SystemService

router = APIRouter(prefix="/api", tags=["overview"])


@router.get("/overview")
async def overview():
    return await SystemService().overview()
