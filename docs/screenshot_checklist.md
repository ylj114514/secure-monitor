# 项目截图材料清单

本文档用于课程提交前整理截图材料。截图文件建议统一放入 `docs/images/` 或桌面截图文件夹，并在项目报告中按流程引用。没有实际截图前，不得编造结果。

## 基础运行截图

| 编号 | 截图内容 | 建议文件名 | 截图目的 | 状态 |
|---|---|---|---|---|
| S01 | `docker compose ps` 运行状态 | `docker-compose-ps.png` | 证明 Docker Compose 核心服务已启动 | 待本地运行后填写 |
| S02 | SecureMonitor OS 总览页 | `securemonitor-overview.png` | 证明统一控制台可访问并展示总览数据 | 待本地运行后填写 |
| S03 | Prometheus Targets 页面 | `prometheus-targets.png` | 证明 Prometheus 抓取目标正常，包含静态和动态服务发现 | 待本地运行后填写 |
| S04 | Prometheus Alerts 页面 | `prometheus-alerts.png` | 证明 Prometheus 告警规则已加载 | 待本地运行后填写 |

## Grafana 截图

| 编号 | 截图内容 | 建议文件名 | 截图目的 | 状态 |
|---|---|---|---|---|
| S05 | Grafana Prometheus 数据源 | `grafana-datasource.png` | 证明 Grafana 已添加 Prometheus 输入源 | 待本地运行后填写 |
| S06 | Grafana 主机监控 Dashboard | `grafana-host-dashboard.png` | 展示 CPU、内存、磁盘、网络等主机指标 | 待本地运行后填写 |
| S07 | Grafana 容器监控 Dashboard | `grafana-container-dashboard.png` | 展示 Docker 容器资源指标 | 待本地运行后填写 |
| S08 | Grafana 服务监控 Dashboard | `grafana-service-dashboard.png` | 展示 demo-app 可用性和探测指标 | 待本地运行后填写 |
| S09 | Grafana 安全监控 Dashboard | `grafana-security-dashboard.png` | 展示 security_exporter 模拟安全指标 | 待本地运行后填写 |

## SecureMonitor OS 功能截图

| 编号 | 截图内容 | 建议文件名 | 截图目的 | 状态 |
|---|---|---|---|---|
| S10 | 主机监控页面 | `securemonitor-host.png` | 展示宿主机 CPU、内存、磁盘指标 | 待本地运行后填写 |
| S11 | 容器监控页面 | `securemonitor-container.png` | 展示 cAdvisor 容器采集状态 | 待本地运行后填写 |
| S12 | 服务探测页面 | `securemonitor-service.png` | 展示 blackbox_exporter 探测结果 | 待本地运行后填写 |
| S13 | Targets 页面 | `securemonitor-targets.png` | 展示 Prometheus targets 表格 | 待本地运行后填写 |
| S14 | 安全中心模拟前 | `securemonitor-security-before.png` | 展示安全指标初始状态 | 待本地运行后填写 |
| S15 | 异常模拟操作页 | `securemonitor-simulation.png` | 展示模拟按钮和操作说明 | 待本地运行后填写 |
| S16 | 安全中心模拟后 | `securemonitor-security-after.png` | 展示失败登录、安全风险等指标变化 | 待本地运行后填写 |
| S17 | 告警中心 | `securemonitor-alerts.png` | 展示告警列表和严重等级 | 待本地运行后填写 |
| S18 | 告警规则说明中心 | `securemonitor-alert-rules.png` | 展示告警规则中文说明 | 待本地运行后填写 |
| S19 | 项目材料中心 | `securemonitor-materials.png` | 展示课程要求、测试计划、截图清单等材料入口 | 待本地运行后填写 |
| S20 | Kubernetes 研究页 | `securemonitor-kubernetes.png` | 展示 Kubernetes 扩展研究内容 | 待本地运行后填写 |

## Alertmanager 截图

| 编号 | 截图内容 | 建议文件名 | 截图目的 | 状态 |
|---|---|---|---|---|
| S21 | Alertmanager 告警页面 | `alertmanager.png` | 证明 Alertmanager 接收和展示告警 | 待本地运行后填写 |

## 前后对照截图建议

1. 先截 `securemonitor-security-before.png`，记录失败登录次数、安全风险分数等初始值。
2. 在异常模拟页点击“模拟 20 次失败登录”或“设置风险分数为 90”。
3. 等待 Prometheus 下一轮抓取和规则评估。
4. 截 `securemonitor-security-after.png` 和 `securemonitor-alerts.png`。
5. 点击“恢复安全指标初始状态”，再截恢复后的安全中心页面，作为补充材料。
