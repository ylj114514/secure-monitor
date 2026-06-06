# 04 Grafana 设计

## Grafana 的作用

Grafana 是本项目的可视化展示层。它通过 Prometheus 数据源查询监控指标，并以 Dashboard 的方式展示主机性能、Docker 容器、服务可用性和安全风险指标。

## Prometheus 数据源配置

数据源文件位于 `grafana/provisioning/datasources/prometheus.yml`。配置内容：

- 名称：`Prometheus`
- 类型：`prometheus`
- URL：`http://prometheus:9090`
- 默认数据源：是
- UID：`prometheus`

Grafana 在 Docker Compose 网络内部通过服务名访问 Prometheus。

## Dashboard provisioning 机制

Dashboard provider 文件位于 `grafana/provisioning/dashboards/dashboards.yml`。Grafana 启动后会扫描：

```text
/var/lib/grafana/dashboards
```

该目录由 Docker Compose 挂载到项目的 `grafana/dashboards`，因此本地 JSON 文件会被自动加载。

## Dashboard 设计

| Dashboard | 文件 | 核心内容 |
| --- | --- | --- |
| 主机监控 | `host-dashboard.json` | CPU、内存、磁盘、网络、node-exporter up |
| 容器监控 | `container-dashboard.json` | 容器 CPU、内存、网络 IO、cAdvisor up |
| 服务监控 | `service-dashboard.json` | demo-app up、probe_success、probe_duration_seconds、HTTP 请求与错误 |
| 安全监控 | `security-dashboard.json` | 失败登录、可疑请求、开放端口、高 CPU 进程、风险分数 |

## 核心 PromQL

主机 CPU：

```promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)
```

主机内存：

```promql
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

容器 CPU：

```promql
rate(container_cpu_usage_seconds_total{name!=""}[2m]) * 100
```

服务可用性：

```promql
probe_success
probe_duration_seconds
```

安全风险：

```promql
security_risk_score
increase(security_failed_login_total[5m])
```

## 项目报告展示作用

Grafana 是项目报告展示中最直观的展示入口。可以依次打开四类 Dashboard，说明 Prometheus 指标如何从采集、存储、查询最终转化为可视化图表。实际截图待本地启动后在 Grafana 页面验证。

## 本机路径与监控对象切换

在 Windows + Docker Desktop 环境中，node_exporter 会同时暴露 Linux 虚拟机、Docker Desktop 节点和 Windows 宿主机盘符路径。主机 Dashboard 的“本机磁盘”变量在界面上显示为“Windows 本机 C 盘 / Windows 本机 D 盘”，内部再映射到 Docker Desktop 可查询的真实挂载点，例如 `/run/desktop/mnt/host/c`。这样既保证 PromQL 能查到数据，也避免项目展示时先出现 `/`、`/run/desktop`、`/parent-distro` 等节点内部路径。

容器 Dashboard 的“监控对象”变量使用 cAdvisor 当前暴露的 Docker 容器 `id`。演示视频脚本会从 Prometheus 查询两个真实容器 ID，并切换变量值，使 Grafana 展示不同被监控服务容器的 CPU、内存和网络曲线。
