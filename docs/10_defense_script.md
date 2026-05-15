# 10 答辩稿

## 一、1 分钟项目介绍

老师好，我的课程设计题目是 SecureMonitor：基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控告警系统。

这个项目对应课程第 4 题，目标是基于 Docker 构建 Prometheus + Grafana 监控集群模型。我的实现以 Docker Compose 作为主部署方式，一键启动 Prometheus、Grafana、Alertmanager、node-exporter、cAdvisor、blackbox-exporter、自定义 security_exporter 和 demo-app。

系统可以采集主机性能指标、Docker 容器指标、服务可用性指标和模拟安全指标，并通过 Grafana 展示 Dashboard，通过 Prometheus 告警规则和 Alertmanager 展示告警。同时，我也研究了 Kubernetes 场景下的 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor 和 PodMonitor。

## 二、3 分钟系统演示流程

1. 打开项目结构，说明 `docker-compose.yml`、`prometheus/`、`grafana/`、`alertmanager/`、`exporters/`、`demo-app/`、`k8s/` 和 `docs/`。
2. 在项目根目录执行 `docker compose up -d`。
3. 打开 Prometheus：`http://localhost:9090`。
4. 打开 Targets 页面，查看静态服务发现和 file_sd 动态服务发现目标。
5. 打开 Grafana：`http://localhost:3000`。
6. 查看主机监控 Dashboard，说明 CPU、内存、磁盘、网络指标。
7. 查看容器监控 Dashboard，说明 cAdvisor 容器 CPU、内存、网络指标。
8. 查看服务可用性 Dashboard，说明 demo-app up、probe_success、probe_duration_seconds。
9. 查看安全监控 Dashboard，说明失败登录、可疑请求、开放端口、风险分数。
10. 运行 `python scripts/simulate_failed_login.py 20`。
11. 回到 Grafana 或 Prometheus 查询安全指标变化。
12. 打开 Prometheus Alerts 页面查看告警规则状态。
13. 打开 Alertmanager：`http://localhost:9093`，查看告警展示。

实际演示结果以本地运行结果为准，不提前编造。

## 三、5 分钟技术讲解流程

1. Prometheus 通过 `scrape_configs` 定期访问各个目标的 `/metrics` 接口，把指标保存为时间序列数据。
2. `static_configs` 用于固定目标，例如 Prometheus、node-exporter、cAdvisor、Alertmanager、blackbox-exporter。
3. `file_sd_configs` 用于文件型动态服务发现，本项目通过 `targets.json` 发现 security-exporter 和 demo-app。
4. node-exporter 采集主机 CPU、内存、磁盘、网络等操作系统指标。
5. cAdvisor 采集 Docker 容器 CPU、内存、网络 IO 和运行状态指标。
6. blackbox-exporter 从外部访问 demo-app `/health`，通过 `probe_success` 反映服务是否可用。
7. security_exporter 是自定义安全指标模块，提供失败登录、可疑请求、开放端口、容器重启、高 CPU 进程和风险分数等模拟指标。
8. Grafana 通过 provisioning 自动连接 Prometheus，并加载四类 Dashboard。
9. Alertmanager 接收 Prometheus 告警，进行分组、去重、路由、静默和页面展示。
10. Kubernetes 部分研究 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor 和 PodMonitor，用于说明云原生环境的监控方案。

## 四、项目亮点

- Docker Compose 一键部署，适合本地演示和截图。
- 多 Exporter 指标采集，覆盖主机、容器、服务和安全指标。
- 同时实现 Prometheus 静态服务发现和文件型动态服务发现。
- 自定义 security_exporter，将安全事件转化为 Prometheus 指标。
- 提供主机、容器、服务、安全四类 Dashboard。
- 使用 Prometheus 告警规则和 Alertmanager 组成告警链路。
- Kubernetes 监控扩展研究覆盖 Prometheus Operator 和 ServiceMonitor。

## 五、项目不足

- Kubernetes 版主要是扩展研究和可选实验，Docker Compose 版是主实现。
- 安全指标是课程设计模拟指标，不读取真实安全日志。
- 告警通知暂未接入真实邮件、企业微信或钉钉。
- Dashboard 是简洁版，后续可以继续优化交互和展示。
- 当前未接入日志监控，例如 Loki。

## 六、老师可能提问与回答

### 1. 为什么选 Prometheus + Grafana？

Prometheus 适合采集和查询时间序列指标，生态中有大量 Exporter；Grafana 可视化能力强，适合做监控 Dashboard。两者组合是云原生监控中常见方案。

### 2. Prometheus 和 Grafana 分别负责什么？

Prometheus 负责指标采集、存储、PromQL 查询和告警规则判断；Grafana 负责读取 Prometheus 数据源并进行可视化展示。

### 3. 什么是 Exporter？

Exporter 是把某类系统、服务或业务数据转换成 Prometheus 文本格式指标的组件。Prometheus 通过 `/metrics` 抓取这些指标。

### 4. node_exporter 和 cAdvisor 区别是什么？

node_exporter 关注宿主机操作系统层面的 CPU、内存、磁盘、网络指标；cAdvisor 关注容器层面的 CPU、内存、网络 IO 和运行状态。

### 5. static_configs 和 file_sd_configs 区别是什么？

`static_configs` 直接在 Prometheus 配置中写固定目标，适合稳定服务；`file_sd_configs` 从文件读取目标，Prometheus 可按刷新间隔重新加载，适合演示动态发现。

### 6. blackbox_exporter 有什么作用？

blackbox_exporter 从外部探测服务是否可用，比如访问 HTTP `/health`。它反映的是用户视角的服务可达性，不是服务内部自身指标。

### 7. Alertmanager 有什么作用？

Alertmanager 接收 Prometheus 告警，负责分组、去重、路由、静默和抑制。本项目主要通过 Alertmanager 页面展示告警。

### 8. 你的安全监控体现在哪里？

我实现了自定义 security_exporter，暴露失败登录、可疑请求、开放端口、容器重启、高 CPU 进程和风险分数等模拟安全指标，并配置了对应 Prometheus 告警规则和 Grafana Dashboard。

### 9. Kubernetes 部分你做到了什么程度？

Docker Compose 是主实现。Kubernetes 部分完成了研究文档和可选实验 YAML，说明了 kube-prometheus-stack、kube-state-metrics、ServiceMonitor、PodMonitor 和 Kubernetes 资源监控方式。

### 10. 如果要监控 Pod 和 Service，应该怎么做？

在 Kubernetes 中可以使用 kube-prometheus-stack 部署 Prometheus，再用 kube-state-metrics 采集资源状态，用 ServiceMonitor 或 PodMonitor 声明式配置应用指标抓取。

### 11. 为什么 Docker 版可以满足题目要求？

题目要求完成 Prometheus 和 Grafana 在 k8s 或 docker 环境下的部署。本项目 Docker Compose 版实现了 Prometheus、Grafana、Alertmanager 和多类 Exporter 的完整监控告警链路，因此可以作为主实现。

### 12. 这个项目如何扩展到真实生产环境？

可以接入真实通知渠道，增加鉴权和 HTTPS，完善 Dashboard，接入日志系统 Loki，接入真实安全日志，扩展 Kubernetes 部署，并对 Prometheus、Grafana 和 Alertmanager 做持久化、备份和权限控制。
