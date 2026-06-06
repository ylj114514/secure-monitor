from fastapi import APIRouter, Response

from app.services.report_service import InspectionReportService

router = APIRouter(prefix="/api/report", tags=["report"])


@router.get("/inspection")
async def inspection_report():
    markdown = await InspectionReportService().markdown()
    return Response(content=markdown, media_type="text/markdown; charset=utf-8")
