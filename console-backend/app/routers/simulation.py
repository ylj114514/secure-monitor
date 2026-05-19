from fastapi import APIRouter
from pydantic import BaseModel

from app.services.simulation_service import SimulationService

router = APIRouter(prefix="/api/simulation", tags=["simulation"])


class RiskScoreRequest(BaseModel):
    score: float = 90


@router.post("/failed-login")
async def failed_login():
    return await SimulationService().failed_login()


@router.post("/security-risk")
async def security_risk(payload: RiskScoreRequest = RiskScoreRequest()):
    return await SimulationService().security_risk(payload.score)


@router.post("/container-restart")
async def container_restart():
    return await SimulationService().container_restart()


@router.post("/service-down")
async def service_down():
    return SimulationService().service_down()


@router.post("/service-recover")
async def service_recover():
    return SimulationService().service_recover()
