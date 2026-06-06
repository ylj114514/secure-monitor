from fastapi import APIRouter

from app.services.metadata_service import MetadataService

router = APIRouter(prefix="/api/course", tags=["course"])


@router.get("/checklist")
async def checklist():
    return {"items": MetadataService().course_checklist()}
