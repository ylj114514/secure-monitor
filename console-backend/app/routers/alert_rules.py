from fastapi import APIRouter

from app.services.metadata_service import MetadataService

router = APIRouter(prefix="/api", tags=["alert-rules"])


@router.get("/alert-rules")
async def alert_rules():
    return {"groups": MetadataService().alert_rules()}
