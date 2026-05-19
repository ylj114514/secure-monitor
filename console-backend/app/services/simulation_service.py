from app.services.security_service import SecurityService


class SimulationService:
    def __init__(self) -> None:
        self.security = SecurityService()

    async def failed_login(self) -> dict:
        return await self.security.post("/simulate/failed-login")

    async def security_risk(self, score: float = 90) -> dict:
        return await self.security.post("/simulate/risk-score", {"score": score})

    async def container_restart(self) -> dict:
        return await self.security.post("/simulate/container-restart")

    def service_down(self) -> dict:
        return {
            "status": "manual_action_required",
            "message": "For safety, the console does not stop containers directly.",
            "command": "docker compose stop demo-app",
        }

    def service_recover(self) -> dict:
        return {
            "status": "manual_action_required",
            "message": "Run the command below in the project root to recover demo-app.",
            "command": "docker compose up -d demo-app",
        }
