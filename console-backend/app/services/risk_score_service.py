from __future__ import annotations


class RiskScoreService:
    """Calculate a course-demo risk score from monitoring and security signals."""

    def calculate(
        self,
        *,
        cpu_usage: float,
        memory_usage: float,
        disk_usage: float,
        targets_down: int,
        active_alerts: int,
        failed_login_total: float,
        security_risk_score: float,
    ) -> dict:
        score = 0.0
        reasons: list[str] = []

        score += self._resource_score("CPU 使用率", cpu_usage, 70, 85, reasons)
        score += self._resource_score("内存使用率", memory_usage, 70, 85, reasons)
        score += self._resource_score("磁盘使用率", disk_usage, 75, 90, reasons)

        if targets_down > 0:
            target_score = min(20, targets_down * 8)
            score += target_score
            reasons.append(f"{targets_down} 个 Prometheus 采集目标异常，影响监控完整性。")

        if active_alerts > 0:
            alert_score = min(18, active_alerts * 3)
            score += alert_score
            reasons.append(f"当前存在 {active_alerts} 条活跃告警，需要结合告警中心排查。")

        if failed_login_total >= 20:
            score += 12
            reasons.append("失败登录次数较多，可能表示暴力破解模拟或异常登录尝试。")
        elif failed_login_total >= 10:
            score += 6
            reasons.append("失败登录次数开始升高，需要观察是否持续增长。")

        score += min(25, max(0, security_risk_score) * 0.25)
        if security_risk_score >= 80:
            reasons.append("security_exporter 安全风险分数处于高风险区间。")
        elif security_risk_score >= 31:
            reasons.append("security_exporter 安全风险分数处于中风险区间。")

        final_score = round(max(0, min(100, score)), 1)
        level = self._level(final_score)
        if not reasons:
            reasons.append("核心组件、采集目标和模拟安全指标均处于较稳定状态。")

        return {
            "score": final_score,
            "level": level["level"],
            "label": level["label"],
            "status": level["status"],
            "reasons": reasons,
        }

    def _resource_score(
        self,
        name: str,
        value: float,
        warn: float,
        critical: float,
        reasons: list[str],
    ) -> float:
        if value >= critical:
            reasons.append(f"{name}达到 {value:.1f}%，已经超过高风险阈值。")
            return 15
        if value >= warn:
            reasons.append(f"{name}达到 {value:.1f}%，需要持续观察。")
            return 8
        return max(0, value / 100 * 4)

    def _level(self, score: float) -> dict:
        if score >= 70:
            return {"level": "high", "label": "高风险", "status": "critical"}
        if score >= 35:
            return {"level": "medium", "label": "中风险", "status": "warning"}
        return {"level": "low", "label": "低风险", "status": "ok"}
