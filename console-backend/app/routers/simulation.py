from fastapi import APIRouter
from pydantic import BaseModel

from app.services.simulation_service import SimulationService

router = APIRouter(prefix="/api/simulation", tags=["simulation"])


class RiskScoreRequest(BaseModel):
    score: float = 90


class CountRequest(BaseModel):
    count: int = 1


@router.post("/failed-login")
async def failed_login(payload: CountRequest = CountRequest(count=20)):
    return await SimulationService().failed_login(payload.count)


@router.post("/suspicious-request")
async def suspicious_request(payload: CountRequest = CountRequest(count=25)):
    return await SimulationService().suspicious_request(payload.count)


@router.post("/security-risk")
async def security_risk(payload: RiskScoreRequest = RiskScoreRequest()):
    return await SimulationService().security_risk(payload.score)


@router.post("/open-port-count")
async def open_port_count(payload: CountRequest = CountRequest(count=12)):
    return await SimulationService().open_port_count(payload.count)


@router.post("/high-cpu-process-count")
async def high_cpu_process_count(payload: CountRequest = CountRequest(count=3)):
    return await SimulationService().high_cpu_process_count(payload.count)


@router.post("/container-restart")
async def container_restart(payload: CountRequest = CountRequest(count=1)):
    return await SimulationService().container_restart(payload.count)


@router.post("/reset-security")
async def reset_security():
    return await SimulationService().reset_security()


@router.post("/service-down")
async def service_down():
    return SimulationService().service_down()


@router.post("/service-recover")
async def service_recover():
    return SimulationService().service_recover()
