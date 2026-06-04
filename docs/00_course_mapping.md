# 00 课程要求映射

## 项目名称

SecureMonitor OS：基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控可视化操作台。

## 课程题目

《网络安全编程技术与实例开发》课程设计第 4 题：基于 Docker 构建 Prometheus + Grafana 监控集群模型及技术实现。

## 映射总览

| 课程要求 | 本项目对应实现 | 相关文件 | 验收方式 | 完成状态 |
| --- | --- | --- | --- | --- |
| 搭建 Prometheus + Grafana 的全方位监控告警系统 | Docker Compose 一键部署 Prometheus、Grafana、Alertmanager、node_exporter、cAdvisor、blackbox_exporter、security_exporter、demo-app 和 SecureMonitor OS | `docker-compose.yml`、`prometheus/`、`grafana/`、`alertmanager/` | 执行 `docker compose up -d`，访问 9090、3000、9093、7001 | 已实现，待本地最终截图 |
| 配置 Prometheus 的动态、静态服务发现 | `static_configs` 采集固定服务，`file_sd_configs` 读取动态目标文件 | `prometheus/prometheus.yml`、`prometheus/file_sd/targets.json` | Prometheus Targets 页面查看所有 target 是否 UP | 已实现 |
| 实现对容器、物理节点、service、pod 等资源指标监控 | node_exporter 监控物理节点，cAdvisor 监控 Docker 容器，blackbox_exporter 监控 service 可用性，Kubernetes 文档研究 Pod/Service/Deployment 监控 | `docker-compose.yml`、`docs/07_kubernetes_research.md`、`k8s/` | 查询 node、container、probe 指标；K8s 部分查看文档和 YAML | Docker 部分已实现，K8s 为可选扩展 |
| 在 Grafana Web 界面展示 Prometheus 的监控指标 | Grafana provisioning 自动配置 Prometheus 数据源和中文 Dashboard | `grafana/provisioning/`、`grafana/dashboards/` | 登录 Grafana，查看主机、容器、服务、安全四类 Dashboard | 已实现 |
| 研究 Docker 与 Kubernetes 容器编排环境下的安全监控 | Docker 环境实现 security_exporter 模拟安全指标，Kubernetes 文档说明 Pod 重启、CrashLoopBackOff、权限、镜像安全、资源限制等监控思路 | `exporters/security_exporter/`、`docs/06_security_monitoring.md`、`docs/07_kubernetes_research.md` | 查看安全中心指标和 Kubernetes 研究文档 | 已实现，K8s 为研究扩展 |
| 研究 Prometheus 监控系统告警工具包 | Prometheus rules 定义主机、容器、服务、安全告警，Alertmanager 负责接收和展示 | `prometheus/rules/`、`alertmanager/alertmanager.yml`、`docs/05_alertmanager_design.md` | Prometheus Alerts 页面和 Alertmanager 页面验证 | 已实现 |
| 研究 Prometheus 在 Kubernetes 集群下的部署 | 文档说明 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor、PodMonitor | `docs/07_kubernetes_research.md`、`k8s/README.md`、`k8s/*.yaml` | 可选执行 kind/minikube + Helm 实验 | 可选扩展 |
| 研究 Grafana 度量分析可视化工具的使用 | 配置 Prometheus 数据源，设计主机、容器、服务、安全四类中文 Dashboard | `docs/04_grafana_design.md`、`grafana/dashboards/` | Grafana 页面查看 Dashboard、面板和 PromQL | 已实现 |
| 添加 Prometheus 收集的数据作为 Grafana 输入源 | Grafana datasource provisioning 自动添加 `http://prometheus:9090` | `grafana/provisioning/datasources/prometheus.yml` | Grafana Data sources 页面查看 Prometheus 数据源 | 已实现 |
| 完成 Prometheus 和 Grafana 在 k8s 或 docker 环境下的部署 | Docker Compose 主实现已完成；Kubernetes 提供扩展研究文件 | `docker-compose.yml`、`k8s/` | Docker Compose 本地启动；K8s 可选实验 | Docker 已实现，K8s 可选扩展 |
| 对本机服务器性能和集群状态进行监控 | node_exporter 采集本机性能，cAdvisor 采集 Docker 容器状态，SecureMonitor OS 与 Grafana 展示状态 | `docker-compose.yml`、`console-frontend/`、`grafana/dashboards/` | 查看 SecureMonitor OS 总览和 Grafana 主机/容器大屏 | 已实现 |

## 项目报告展示表述建议

本项目以 Docker Compose 作为主实现，已经完成 Prometheus、Grafana、Alertmanager 和多类 Exporter 的部署、采集、告警和可视化。Kubernetes 部分作为扩展研究，通过文档和示例 YAML 说明 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor、PodMonitor 等机制。

不要把 Kubernetes 文档研究表述为已经完成生产级 Kubernetes 集群部署。更准确的说法是：Docker 版可运行、可演示；Kubernetes 版用于课程研究和可选实验。
