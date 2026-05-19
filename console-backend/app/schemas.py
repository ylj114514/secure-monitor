from pydantic import BaseModel


class SimulationResponse(BaseModel):
    status: str
    message: str
    command: str | None = None
    data: dict | None = None


class GrafanaDashboard(BaseModel):
    name: str
    url: str


class GrafanaInfo(BaseModel):
    url: str
    dashboards: list[GrafanaDashboard]
