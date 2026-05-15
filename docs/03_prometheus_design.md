# 03 Prometheus 设计

## Prometheus 的作用

Prometheus 是本项目的指标采集、存储、查询和告警判断中心。它定时从 node-exporter、cAdvisor、blackbox-exporter、security-exporter、demo-app 等目标抓取指标，将数据保存为时间序列，并通过 PromQL 支持查询、Dashboard 展示和告警规则判断。

## scrape_configs

`scrape_configs` 定义 Prometheus 要抓取哪些目标、多久抓取一次、如何给目标打标签，以及是否需要通过 relabel 变换地址。本项目中每个 job 对应一类监控对象，例如：

- `prometheus`：Prometheus 自身指标。
- `node-exporter`：主机 CPU、内存、磁盘、网络指标。
- `cadvisor`：Docker 容器资源指标。
- `alertmanager`：Alertmanager 自身状态。
- `blackbox-exporter`：探测组件自身状态。
- `dynamic-file-sd`：通过文件型动态发现抓取 security-exporter 和 demo-app。
- `blackbox-http`：通过 blackbox-exporter 探测 demo-app `/health`。

## static_configs 静态服务发现

`static_configs` 适合目标地址固定的服务。本项目静态配置了：

- `prometheus:9090`
- `node-exporter:9100`
- `cadvisor:8080`
- `alertmanager:9093`
- `blackbox-exporter:9115`

这些服务名称来自 Docker Compose 网络中的服务名，Prometheus 可以在同一个 Docker 网络中直接解析并访问。

## file_sd_configs 文件型动态服务发现

`file_sd_configs` 通过读取 JSON 文件动态发现目标。本项目读取 `/etc/prometheus/file_sd/targets.json`，刷新间隔为 `15s`。当前动态目标包括：

- `security-exporter:8000`
- `demo-app:5000`

这种方式便于演示“动态服务发现”：后续新增或删除目标时，可以修改 `prometheus/file_sd/targets.json`，Prometheus 会按刷新间隔重新加载目标。

## alerting 配置

`alerting` 指定 Prometheus 将触发的告警发送到哪里。本项目将告警发送到：

```text
alertmanager:9093
```

Alertmanager 负责告警分组、去重、路由、静默和页面展示。

## rule_files 配置

`rule_files` 指定 Prometheus 加载哪些告警规则文件。本项目按场景拆分：

- `/etc/prometheus/rules/host_alerts.yml`
- `/etc/prometheus/rules/container_alerts.yml`
- `/etc/prometheus/rules/service_alerts.yml`
- `/etc/prometheus/rules/security_alerts.yml`

这种拆分方式便于报告说明，也便于答辩时按“主机、容器、服务、安全”四类场景展示。

## blackbox_exporter 探测流程

blackbox_exporter 用于外部探测服务是否可用。它和普通 `/metrics` 采集不同：

- 普通采集：Prometheus 直接访问目标的 `/metrics`。
- blackbox 探测：Prometheus 访问 blackbox-exporter 的 `/probe`，blackbox-exporter 再访问真正目标。

本项目中 `blackbox-http` job 探测：

```text
http://demo-app:5000/health
```

Prometheus 使用 `relabel_configs` 将原始目标地址写入 `__param_target`，再将实际抓取地址改为 `blackbox-exporter:9115`。关键指标包括：

- `probe_success`：探测成功为 1，失败为 0。
- `probe_duration_seconds`：探测耗时。

PromQL 示例：

```promql
probe_success
probe_duration_seconds
```

## demo-app 指标设计

demo-app 暴露 `/metrics`，提供以下指标：

- `demo_http_requests_total{path,method,status}`：HTTP 请求计数。
- `demo_http_request_duration_seconds`：HTTP 请求耗时。
- `demo_app_up`：服务健康状态。

`/api/error` 用于产生 500 错误请求，`/api/slow` 用于产生慢请求，便于演示服务监控和 Grafana 图表。

## Targets 页面验证

本地启动后访问：

```text
http://localhost:9090/targets
```

检查以下 job 是否为 `UP`：

- `prometheus`
- `node-exporter`
- `cadvisor`
- `alertmanager`
- `blackbox-exporter`
- `dynamic-file-sd`
- `blackbox-http`

如果没有实际启动 Docker Compose，验证结果写为：待本地启动后在 Prometheus Targets 页面验证。
