from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from app.services.alerts_summary import build_alerts_summary
from app.services.alertmanager_service import AlertmanagerService
from app.services.grafana_service import GrafanaService
from app.services.metadata_service import MetadataService
from app.services.security_service import SecurityService
from app.services.system_service import SystemService
from app.services.prometheus_service import PrometheusService


class InspectionReportService:
    async def markdown(self) -> str:
        overview = await SystemService().overview()
        targets = await PrometheusService().targets()
        alerts = build_alerts_summary(
            await PrometheusService().alerts(),
            await AlertmanagerService().alerts(),
        )
        security = await SecurityService().metrics()
        grafana = GrafanaService().info()
        checklist = MetadataService().course_checklist()

        now = datetime.now(ZoneInfo("Asia/Shanghai")).strftime("%Y-%m-%d %H:%M:%S")
        lines = [
            "# SecureMonitor OS 巡检报告",
            "",
            f"- 生成时间：{now}",
            "- 报告用途：课程项目材料整理与项目报告展示",
            "- 截图位置：待本地截图后补充",
            "- 说明：security_exporter 为课程设计模拟安全指标，不读取真实敏感数据。",
            "",
            "## 1. 系统总览",
            "",
            f"- 系统状态：{overview.get('system_status')}（{overview.get('health_message')}）",
            f"- Prometheus：{self._up(overview.get('prometheus_up'))}",
            f"- Grafana：{self._up(overview.get('grafana_up'))}",
            f"- Alertmanager：{self._up(overview.get('alertmanager_up'))}",
            f"- Targets：{overview.get('targets_up')}/{overview.get('targets_total')}，异常 {overview.get('targets_down')} 个",
            f"- 活跃告警：{overview.get('active_alerts')}",
            f"- CPU / 内存 / 磁盘：{overview.get('cpu_usage'):.1f}% / {overview.get('memory_usage'):.1f}% / {overview.get('disk_usage'):.1f}%",
            "",
            "## 2. 综合风险评分",
            "",
            f"- 综合风险分数：{overview.get('comprehensive_risk', {}).get('score')}",
            f"- 风险等级：{overview.get('comprehensive_risk', {}).get('label')}",
            "- 风险原因：",
        ]
        lines.extend([f"  - {reason}" for reason in overview.get("comprehensive_risk", {}).get("reasons", [])])
        lines.extend(
            [
                "",
                "## 3. Prometheus Targets",
                "",
                "| Job | Instance | Health | Last Scrape | Error |",
                "|---|---|---|---|---|",
            ]
        )
        for target in targets:
            lines.append(
                f"| {target.get('job')} | {target.get('instance')} | {target.get('health')} | {target.get('last_scrape')} | {target.get('last_error') or '无'} |"
            )
        lines.extend(
            [
                "",
                "## 4. 告警摘要",
                "",
                f"- 活跃告警总数：{alerts['active_count']}",
                f"- Critical：{alerts['critical_count']}",
                f"- Warning：{alerts['warning_count']}",
                "",
                "## 5. 安全指标",
                "",
            ]
        )
        for key, value in security.items():
            lines.append(f"- {key}: {value}")
        lines.extend(
            [
                "",
                "## 6. Grafana Dashboard",
                "",
                f"- Grafana 地址：{grafana.get('public_url')}",
            ]
        )
        lines.extend([f"- {item['name']}: {item['url']}" for item in grafana.get("dashboards", [])])
        lines.extend(
            [
                "",
                "## 7. 课程要求覆盖",
                "",
                "| 课程要求 | 完成状态 | 截图位置 |",
                "|---|---|---|",
            ]
        )
        for item in checklist:
            lines.append(f"| {item['requirement']} | {item['status']} | {item['screenshot']} |")
        lines.extend(
            [
                "",
                "## 8. 待补充材料",
                "",
                "- 测试结果：待本地运行后填写",
                "- 页面截图：待本地截图后补充",
                "- Kubernetes 实验运行结果：如本机资源不足，可保留为扩展研究说明",
            ]
        )
        return "\n".join(lines) + "\n"

    def _up(self, value: bool) -> str:
        return "正常" if value else "异常"
