# 00 课程要求对应关系

## 项目名称

SecureMonitor：基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控告警系统。

## 课程题目

《网络安全编程技术与实例开发》课程设计第 4 题：基于 Docker 构建 Prometheus + Grafana 监控集群模型及技术实现。

## 课程要求映射表

| 课程要求 | 本项目对应实现 | 相关文件 | 验收方式 | 完成状态 |
| --- | --- | --- | --- | --- |
| 搭建 Prometheus + Grafana 的全方位监控告警系统 | Docker Compose 编排 Prometheus、Grafana、Alertmanager、Exporter、demo-app | `docker-compose.yml`、`prometheus/`、`grafana/`、`alertmanager/` | 执行 `docker compose up -d`，访问 Prometheus、Grafana、Alertmanager | 待本地验证 |
| 配置 Prometheus 的动态、静态服务发现 | `static_configs` 采集固定服务，`file_sd_configs` 读取动态目标 | `prometheus/prometheus.yml`、`prometheus/file_sd/targets.json` | Prometheus Targets 页面查看 static 和 file_sd target | 待本地验证 |
| 实现对容器、物理节点、service、pod 等资源指标监控 | node_exporter 监控主机，cAdvisor 监控容器，blackbox_exporter 和 demo-app 监控服务，Kubernetes 文档研究 Pod/Service | `docker-compose.yml`、`docs/07_kubernetes_research.md`、`k8s/` | 查询 node、container、probe 指标；K8s 部分查看文档和 YAML | Docker 部分待本地验证，Kubernetes 为可选扩展 |
| 在 Grafana Web 界面展示 Prometheus 的监控指标 | Grafana provisioning 自动加载 Prometheus 数据源和四类 Dashboard | `grafana/provisioning/`、`grafana/dashboards/` | 访问 Grafana 查看 SecureMonitor Dashboards | 待本地验证 |
| 研究 Docker 与 Kubernetes 容器编排环境下的安全监控 | Docker 中实现 security_exporter；Kubernetes 文档说明 Pod 异常、权限、镜像、资源限制等安全监控 | `exporters/security_exporter/`、`docs/06_security_monitoring.md`、`docs/07_kubernetes_research.md` | 查看安全指标和研究文档 | 已实现，Kubernetes 为可选扩展 |
| 研究 Prometheus 监控系统告警工具包 | Prometheus rules + Alertmanager 路由、分组、去重、静默、抑制说明 | `prometheus/rules/`、`alertmanager/alertmanager.yml`、`docs/05_alertmanager_design.md` | Prometheus Alerts 页面和 Alertmanager 页面验证 | 待本地验证 |
| 研究 Prometheus 在 Kubernetes 集群下的部署 | 说明 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor、PodMonitor | `docs/07_kubernetes_research.md`、`k8s/README.md` | 查看文档；可选执行 kind/Helm 实验 | 可选扩展 |
| 研究 Grafana 度量分析可视化工具的使用 | 设计主机、容器、服务、安全四类 Dashboard | `docs/04_grafana_design.md`、`grafana/dashboards/` | Grafana 页面查看 Dashboard | 待本地验证 |
| 添加 Prometheus 收集的数据作为 Grafana 输入源 | Grafana datasource provisioning 自动配置 `http://prometheus:9090` | `grafana/provisioning/datasources/prometheus.yml` | Grafana Data sources 页面查看 Prometheus | 待本地验证 |
| 完成 Prometheus 和 Grafana 在 k8s 或 docker 环境下的部署 | Docker Compose 主实现；Kubernetes 提供扩展研究文件 | `docker-compose.yml`、`k8s/` | Docker Compose 本地启动；K8s 可选实验 | Docker 部分待本地验证，Kubernetes 为可选扩展 |
| 对本机服务器性能和集群状态进行监控 | node_exporter 采集本机性能，cAdvisor 采集 Docker 容器状态，Kubernetes 文档研究集群状态 | `docker-compose.yml`、`docs/03_prometheus_design.md`、`docs/07_kubernetes_research.md` | Prometheus 查询 node/cAdvisor 指标 | 待本地验证 |

## 说明

本项目不夸大未运行内容。Docker Compose 版已经完成配置和代码实现，但实际运行结果需本地执行后填写；Kubernetes 版用于满足课程研究要求和可选实验。
