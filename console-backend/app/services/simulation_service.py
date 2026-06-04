from app.services.security_service import SecurityService


class SimulationService:
    def __init__(self) -> None:
        self.security = SecurityService()

    async def failed_login(self, count: int = 20) -> dict:
        return await self.security.post("/simulate/failed-login", {"count": count})

    async def suspicious_request(self, count: int = 25) -> dict:
        return await self.security.post("/simulate/suspicious-request", {"count": count})

    async def security_risk(self, score: float = 90) -> dict:
        return await self.security.post("/simulate/risk-score", {"score": score})

    async def open_port_count(self, count: int = 12) -> dict:
        return await self.security.post("/simulate/open-port-count", {"count": count})

    async def high_cpu_process_count(self, count: int = 3) -> dict:
        return await self.security.post("/simulate/high-cpu-process-count", {"count": count})

    async def container_restart(self, count: int = 1) -> dict:
        return await self.security.post("/simulate/container-restart", {"count": count})

    async def reset_security(self) -> dict:
        return await self.security.post("/simulate/reset")

    def service_down(self) -> dict:
        return {
            "status": "manual_action_required",
            "message": "为避免误操作，控制台不直接停止容器。请在项目根目录手动执行下方命令。",
            "command": "docker compose stop demo-app",
        }

    def service_recover(self) -> dict:
        return {
            "status": "manual_action_required",
            "message": "请在项目根目录手动执行下方命令恢复 demo-app。",
            "command": "docker compose up -d demo-app",
        }
