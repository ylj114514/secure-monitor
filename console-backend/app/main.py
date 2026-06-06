from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    alert_rules,
    alerts,
    course,
    docs,
    grafana,
    overview,
    prometheus,
    report,
    security,
    simulation,
    targets,
)

app = FastAPI(
    title="SecureMonitor OS Console Backend",
    description="Unified API gateway for Prometheus, Grafana, Alertmanager and custom exporters.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "console-backend"}


app.include_router(overview.router)
app.include_router(prometheus.router)
app.include_router(targets.router)
app.include_router(alerts.router)
app.include_router(alert_rules.router)
app.include_router(course.router)
app.include_router(security.router)
app.include_router(simulation.router)
app.include_router(grafana.router)
app.include_router(docs.router)
app.include_router(report.router)
