# 课程要求覆盖清单

本文档用于把《网络安全编程技术与实例开发》第 4 题要求逐条映射到 SecureMonitor OS 项目实现，形成“课程要求 -> 项目实现 -> 配置文件 -> 页面截图 -> 测试结果 -> 报告章节”的证据链。

说明：Docker Compose 版本是本项目主实现；Kubernetes 版本是扩展研究和可选实验。未实际运行的截图和测试结果不得编造，统一标记为“待本地运行后填写”。

| 课程要求 | 项目对应实现 | 相关文件 | 页面截图位置 | 测试结果 | 报告章节建议 | 完成状态 |
|---|---|---|---|---|---|---|
| 搭建 Prometheus + Grafana 的全方位监控告警系统 | Docker Compose 一键启动 Prometheus、Grafana、Alertmanager、Exporters、demo-app 和 SecureMonitor OS 控制台 | `docker-compose.yml`、`prometheus/prometheus.yml`、`grafana/provisioning/`、`alertmanager/alertmanager.yml` | `docs/images/docker-compose-ps.png`、`docs/images/securemonitor-overview.png` | 待本地运行后填写 | 系统总体架构、Docker 环境部署 | 待本地验证 |
| 配置 Prometheus 静态服务发现 | 使用 `static_configs` 固定发现 Prometheus、node-exporter、cAdvisor、Alertmanager、blackbox_exporter | `prometheus/prometheus.yml` | `docs/images/prometheus-targets.png` | 待本地运行后填写 | Prometheus 指标采集设计 | 已实现，待截图 |
| 配置 Prometheus 动态服务发现 | 使用 `file_sd_configs` 读取 `targets.json`，动态发现 security_exporter 和 demo-app | `prometheus/prometheus.yml`、`prometheus/file_sd/targets.json` | `docs/images/prometheus-targets.png` | 待本地运行后填写 | Prometheus 指标采集设计 | 已实现，待截图 |
| 实现容器资源指标监控 | 使用 cAdvisor 采集 Docker 容器 CPU、内存、网络 IO 和运行状态 | `docker-compose.yml`、`grafana/dashboards/container-dashboard.json` | `docs/images/grafana-container-dashboard.png`、`docs/images/securemonitor-container.png` | 待本地运行后填写 | 容器监控设计 | 已实现，待截图 |
| 实现物理节点性能监控 | 使用 node_exporter 采集主机指标；Windows 环境下补充 Windows host exporter，用于展示宿主机 CPU、内存、磁盘 | `docker-compose.yml`、`scripts/windows_host_metrics_exporter.py`、`console-backend/app/services/system_service.py` | `docs/images/securemonitor-host.png`、`docs/images/grafana-host-dashboard.png` | 待本地运行后填写 | 主机监控设计 | 已实现，待截图 |
| 实现 service 可用性监控 | blackbox_exporter 探测 demo-app `/health`，Prometheus 采集 `probe_success` 和探测耗时 | `blackbox/blackbox.yml`、`prometheus/prometheus.yml`、`demo-app/app.py` | `docs/images/securemonitor-service.png`、`docs/images/grafana-service-dashboard.png` | 待本地运行后填写 | 服务可用性监控设计 | 已实现，待截图 |
| 实现 pod 和 Kubernetes 资源监控研究 | 通过文档和 YAML 示例说明 Node、Pod、Service、Deployment 的监控方式，介绍 kube-state-metrics、ServiceMonitor、PodMonitor | `docs/07_kubernetes_research.md`、`k8s/README.md`、`k8s/service-monitor.yaml` | `docs/images/securemonitor-kubernetes.png` | 待本地运行后填写 | Kubernetes 环境监控研究 | 扩展研究 |
| 在 Grafana Web 界面展示 Prometheus 监控指标 | Grafana provisioning 自动配置 Prometheus 数据源和四类 Dashboard | `grafana/provisioning/datasources/prometheus.yml`、`grafana/provisioning/dashboards/dashboards.yml`、`grafana/dashboards/*.json` | `docs/images/grafana-datasource.png`、`docs/images/grafana-host-dashboard.png` | 待本地运行后填写 | Grafana 可视化设计 | 已实现，待截图 |
| 研究 Docker 与 Kubernetes 容器编排环境下的安全监控 | Docker 版通过 security_exporter 模拟安全指标和告警；Kubernetes 部分说明 Pod 重启、CrashLoopBackOff、资源限制、镜像权限等安全监控点 | `exporters/security_exporter/app.py`、`docs/06_security_monitoring.md`、`docs/07_kubernetes_research.md` | `docs/images/securemonitor-security-before.png`、`docs/images/securemonitor-security-after.png` | 待本地运行后填写 | 安全监控设计 | 已实现模拟指标，K8s 为研究 |
| 研究 Prometheus 告警工具包 | 按主机、容器、服务、安全四类配置 Prometheus 告警规则，并发送给 Alertmanager | `prometheus/rules/*.yml`、`alertmanager/alertmanager.yml`、`docs/alert_rule_explanation.md` | `docs/images/prometheus-alerts.png`、`docs/images/securemonitor-alerts.png`、`docs/images/alertmanager.png` | 待本地运行后填写 | Alertmanager 告警设计 | 已实现，待截图 |
| 添加 Prometheus 收集的数据作为 Grafana 输入源 | Grafana datasource provisioning 默认添加 Prometheus 数据源 | `grafana/provisioning/datasources/prometheus.yml` | `docs/images/grafana-datasource.png` | 待本地运行后填写 | Grafana 数据源配置 | 已实现，待截图 |
| 完成 Prometheus 和 Grafana 在 Docker 或 Kubernetes 环境下部署 | Docker Compose 为主部署方式；Kubernetes 为可选实验说明 | `docker-compose.yml`、`k8s/README.md` | `docs/images/docker-compose-ps.png` | 待本地运行后填写 | Docker 环境部署、Kubernetes 扩展研究 | Docker 已实现，K8s 可选 |
| 对本机服务器性能和集群状态进行监控 | SecureMonitor OS 总览、主机监控、Targets、容器监控和告警中心集中展示状态 | `console-frontend/src/pages/OverviewPage.tsx`、`console-frontend/src/pages/HostMonitorPage.tsx`、`console-frontend/src/pages/TargetsPage.tsx` | `docs/images/securemonitor-overview.png`、`docs/images/securemonitor-targets.png` | 待本地运行后填写 | 系统测试与结果分析 | 已实现，待截图 |

## 课程提交前核对方法

1. 执行 `docker compose ps`，确认核心服务处于运行状态。
2. 打开 SecureMonitor OS 主界面，检查总览页、Targets、安全中心、告警中心是否有数据。
3. 打开 Prometheus Targets 页面，确认静态发现和文件型动态发现目标均显示。
4. 打开 Grafana，确认 Prometheus 数据源存在，四类 Dashboard 可以访问。
5. 打开异常模拟页面，触发失败登录或安全风险分数模拟，记录前后截图。
6. 打开 Prometheus Alerts 和 SecureMonitor OS 告警中心，记录告警状态。
7. 对未实际运行的 Kubernetes 可选实验，报告中只写扩展研究和可选实验，不写生产级完成。
