# 02 系统架构设计

## 架构定位

SecureMonitor 采用 Docker Compose 作为主实现方式，构建一个本地可运行、可演示、可截图的 Prometheus + Grafana 安全监控告警系统。Kubernetes 作为扩展研究方向，用于说明云原生场景下的监控部署方式和资源指标采集方式。

## 总体流程描述

首先，系统通过 Docker Compose 一键启动 Prometheus、Grafana、Alertmanager、node_exporter、cAdvisor、blackbox_exporter、自定义 security_exporter 和 demo-app 等服务。node_exporter 负责采集本机服务器的 CPU、内存、磁盘、网络等物理节点性能指标；cAdvisor 负责采集 Docker 容器的 CPU、内存、网络、磁盘 IO 和运行状态等容器指标；blackbox_exporter 负责对 demo-app 等服务进行 HTTP 可用性探测；自定义 security_exporter 负责暴露失败登录次数、可疑请求次数、开放端口数量、安全风险分数等模拟安全指标；demo-app 用于提供被监控的测试服务和应用指标。

然后，Prometheus 根据 `prometheus.yml` 中的 `scrape_configs` 定时从各个 Exporter 的 `/metrics` 接口抓取指标数据。其中，Prometheus 同时使用 `static_configs` 实现静态服务发现，使用 `file_sd_configs` 实现文件型动态服务发现。Prometheus 抓取到的指标会被存储为时间序列数据，并可以通过 PromQL 进行查询分析。

接着，Prometheus 根据配置的告警规则文件，对 CPU 使用率过高、内存使用率过高、磁盘空间不足、服务不可用、容器异常、安全风险分数过高、失败登录次数过多等场景进行判断。如果指标满足告警条件，Prometheus 会生成告警并发送给 Alertmanager。Alertmanager 负责对告警进行分组、去重、路由和展示，后续也可以扩展为邮件、Webhook、企业微信或钉钉通知。

最后，Grafana 通过 Prometheus 数据源读取 Prometheus 中的监控指标，并通过自动 provisioning 方式加载多个 Dashboard，实现主机性能监控、Docker 容器监控、服务可用性监控和安全风险监控的可视化展示。用户可以在 Grafana Web 页面中查看 CPU、内存、磁盘、网络、容器状态、服务探测结果和安全指标变化情况。

此外，项目还需要研究 Kubernetes 环境下的 Prometheus 部署方式，包括 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor、PodMonitor 等内容，并说明 Kubernetes 中 Node、Pod、Service、Deployment 等资源指标的监控方式。Docker Compose 版作为主实现，Kubernetes 版作为扩展研究和可选实验。

## Docker Compose 部署架构

Docker Compose 主部署模块将 8 个核心服务放入同一个自定义 bridge 网络 `secure-monitor-net`。各服务之间通过 Compose 服务名互相访问，例如 Prometheus 使用 `node-exporter:9100`、`cadvisor:8080`、`security-exporter:8000`、`demo-app:5000` 抓取指标，Grafana 使用 `http://prometheus:9090` 作为内部数据源地址。

服务分为四层：

1. 数据采集层：`node-exporter`、`cadvisor`、`blackbox-exporter`、`security-exporter`、`demo-app`。
2. 指标存储与规则判断层：`prometheus`。
3. 告警处理层：`alertmanager`。
4. 可视化展示层：`grafana`。

Prometheus、Grafana 和 Alertmanager 使用 Docker volume 持久化运行数据。项目配置文件通过 bind mount 挂载进入容器，便于课程演示时直接修改本地配置并重新加载或重启服务。

## Docker Compose 服务端口

| 服务 | 宿主机端口 | 容器端口 | 说明 |
| --- | --- | --- | --- |
| Prometheus | 9090 | 9090 | 指标查询、Targets、Alerts |
| Grafana | 3000 | 3000 | Dashboard 可视化 |
| Alertmanager | 9093 | 9093 | 告警展示与路由 |
| cAdvisor | 8080 | 8080 | 容器资源指标 |
| blackbox-exporter | 9115 | 9115 | HTTP 探测指标 |
| security-exporter | 8000 | 8000 | 自定义安全指标 |
| demo-app | 5000 | 5000 | 被监控测试服务 |

`node-exporter` 默认在容器网络内暴露 `9100`，当前没有映射到宿主机端口，Prometheus 通过 Docker 网络内部访问即可。

## 逻辑架构

```text
用户浏览器
  |-- Grafana Dashboard         http://localhost:3000
  |-- Prometheus Query UI       http://localhost:9090
  |-- Alertmanager UI           http://localhost:9093

Prometheus
  |-- 抓取 node-exporter 主机指标
  |-- 抓取 cAdvisor 容器指标
  |-- 抓取 blackbox-exporter 探测指标
  |-- 抓取 security-exporter 安全指标
  |-- 抓取 demo-app 应用指标
  |-- 读取 file_sd 动态发现目标
  |-- 根据 rules 生成告警
  |-- 将告警发送到 Alertmanager

Grafana
  |-- 使用 Prometheus 作为数据源
  |-- 自动加载 Dashboard

Alertmanager
  |-- 告警分组
  |-- 告警去重
  |-- 告警路由
  |-- 告警展示
```

## 服务职责

| 服务 | 职责 | 答辩展示点 |
| --- | --- | --- |
| Prometheus | 指标抓取、存储、PromQL 查询、告警规则判断 | Targets、Graph、Alerts 页面 |
| Grafana | 指标可视化展示 | 主机、容器、服务、安全 Dashboard |
| Alertmanager | 告警分组、去重、路由和展示 | 告警列表、告警状态 |
| node-exporter | 采集本机物理节点指标 | CPU、内存、磁盘、网络 |
| cAdvisor | 采集 Docker 容器指标 | 容器资源使用和运行状态 |
| blackbox-exporter | HTTP 可用性探测 | 服务是否可访问、响应耗时 |
| security-exporter | 模拟安全指标输出 | 失败登录、可疑请求、开放端口、风险分数 |
| demo-app | 被监控测试服务 | 应用可用性和应用指标 |

## 数据流

1. Exporter 和 demo-app 暴露 `/metrics` 或探测接口。
2. Prometheus 定时抓取指标并保存为时间序列数据。
3. Prometheus 使用 PromQL 查询指标，并根据规则判断是否触发告警。
4. Alertmanager 接收 Prometheus 告警并进行处理。
5. Grafana 从 Prometheus 查询数据并展示图表。

## 部署策略

- Docker Compose：主实现，用于本地运行、课程演示和截图。
- Kubernetes：扩展研究，用于说明 Prometheus Operator、kube-prometheus-stack、ServiceMonitor 和 PodMonitor。

## 验证说明

本次未实际运行 `docker compose up -d`，需要本地运行 `docker compose up -d` 验证。验证时应检查 `docker compose ps`、Prometheus Targets、Grafana 数据源和 Alertmanager 页面。
