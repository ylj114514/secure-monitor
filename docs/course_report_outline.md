# SecureMonitor：基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控告警系统

## 1. 课题背景与意义

随着 Docker 和 Kubernetes 在应用部署中的使用越来越广泛，系统中的服务数量、容器数量和运行状态都变得更加动态。传统人工排查方式难以及时发现 CPU、内存、磁盘、网络、服务不可用和安全风险等问题。因此，需要构建一个可持续采集指标、可视化展示状态、并能在异常时产生告警的监控系统。

本项目围绕 Prometheus、Grafana、Alertmanager 和多个 Exporter，构建基于 Docker Compose 的安全监控告警系统，并扩展研究 Kubernetes 场景下的监控方案。

## 2. 相关技术介绍

- Docker：容器化运行环境，用于本地部署 Prometheus、Grafana、Alertmanager 和 Exporter。
- Kubernetes：容器编排平台，用于扩展研究 Pod、Service、Deployment、Node 等对象监控。
- Prometheus：指标采集、存储、查询和告警规则判断系统。
- Grafana：度量分析和可视化展示工具。
- Alertmanager：Prometheus 告警处理组件，负责分组、去重、路由和静默。
- node_exporter：采集主机 CPU、内存、磁盘、网络指标。
- cAdvisor：采集容器 CPU、内存、网络、磁盘 IO 等指标。
- blackbox_exporter：从外部探测 HTTP/TCP 服务可用性。
- 自定义 Exporter：将业务或安全事件转换为 Prometheus 文本格式指标。
- PromQL：Prometheus 查询语言，用于查询、聚合和告警表达式。

## 3. 系统需求分析

功能需求包括：一键启动监控系统、采集主机指标、采集容器指标、探测服务可用性、暴露模拟安全指标、展示 Grafana Dashboard、配置告警规则、通过 Alertmanager 展示告警。

非功能需求包括：配置清晰、便于演示、便于截图、文档完整、测试结果不编造、Kubernetes 部分作为扩展研究。

## 4. 系统总体架构

系统被监控对象包括本机服务器、Docker 容器、demo-app 服务和模拟安全事件。Exporter 负责暴露指标，Prometheus 负责采集和告警判断，Alertmanager 负责告警处理，Grafana 负责可视化展示。Docker Compose 负责本地部署，Kubernetes 部分作为扩展研究。

## 5. Prometheus 指标采集设计

本项目通过 `scrape_configs` 定义抓取任务，使用 `static_configs` 采集固定服务，使用 `file_sd_configs` 读取动态目标，通过 `rule_files` 加载告警规则，通过 `alerting` 指向 Alertmanager。blackbox 探测通过 `/probe` 间接访问 demo-app `/health`。

## 6. Grafana 可视化设计

Grafana 通过 provisioning 自动配置 Prometheus 数据源，并自动加载 Dashboard。Dashboard 分为主机监控、容器监控、服务监控、安全监控四类，分别展示 node_exporter、cAdvisor、blackbox_exporter、demo-app 和 security_exporter 的核心指标。

## 7. Alertmanager 告警设计

告警规则按主机、容器、服务、安全四类拆分。Prometheus 判断告警条件后发送给 Alertmanager，Alertmanager 按 severity 分组和路由，并在 Web 页面展示。当前项目不配置真实邮件或企业微信，后续可扩展通知渠道。

## 8. 自定义 security_exporter 设计

security_exporter 用于模拟安全监控指标，包括失败登录次数、可疑请求次数、开放端口数量、容器重启次数、高 CPU 进程数量和安全风险分数。它提供 `/metrics` 和多个 `/simulate/*` 接口。该模块不读取真实敏感信息，仅用于课程设计演示。

## 9. Docker 环境部署

`docker-compose.yml` 启动 Prometheus、Grafana、Alertmanager、node-exporter、cAdvisor、blackbox-exporter、security-exporter 和 demo-app。主要端口包括 9090、3000、9093、8080、9115、8000、5000。启动方式为 `docker compose up -d`，验证方式包括 `docker compose ps`、Prometheus Targets、Grafana Dashboard 和 Alertmanager 页面。

## 10. Kubernetes 环境监控研究

Kubernetes 部分研究 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor、PodMonitor，以及 Node、Pod、Service、Deployment 的监控方式。安全监控关注 Pod 异常重启、CrashLoopBackOff、节点资源异常、Service 不可用、Deployment 副本异常、镜像安全和权限配置。

## 11. 系统测试与结果分析

测试包括 Docker Compose 启动测试、Prometheus Targets 测试、Grafana Dashboard 测试、告警测试和安全指标测试。当前不编造测试结果，实际结果待本地运行后填写。

截图占位：

![Prometheus Targets](./images/prometheus-targets.png)
![Grafana Dashboard](./images/grafana-dashboard.png)
![Alertmanager](./images/alertmanager.png)

## 12. 总结与不足

本项目完成了 Docker Compose 主实现、Prometheus 采集配置、Grafana 自动配置、Alertmanager 配置、自定义安全指标和测试文档。不足包括 Kubernetes 版主要是扩展研究，安全指标为模拟指标，真实通知渠道未接入，Dashboard 仍可继续优化。

## 13. 后续改进方向

- 接入真实邮件、Webhook、企业微信或钉钉通知。
- 完善 Kubernetes 实验并截图。
- 增加日志监控。
- 接入 Loki。
- 增加更多安全指标。
- 优化 Dashboard 交互和展示。
- 增加权限控制和 HTTPS。

## 14. 参考文献建议

- Prometheus 官方文档。
- Grafana 官方文档。
- Alertmanager 官方文档。
- Docker 官方文档。
- Kubernetes 官方文档。
- kube-prometheus-stack Helm chart 文档。
- Prometheus Operator 官方文档。
