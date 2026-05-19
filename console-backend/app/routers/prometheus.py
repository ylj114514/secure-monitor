from fastapi import APIRouter, Query

from app.services.prometheus_service import PrometheusService

router = APIRouter(prefix="/api/prometheus", tags=["prometheus"])


@router.get("/query")
async def query(query: str = Query(...)):
    return await PrometheusService().query(query)


@router.get("/range")
async def query_range(
    query: str = Query(...),
    start: str | None = None,
    end: str | None = None,
    step: str = "15s",
):
    return await PrometheusService().query_range(query, start, end, step)
