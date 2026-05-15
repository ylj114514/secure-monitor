# SecureMonitor：基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控告警系统

## 项目简介

SecureMonitor 是《网络安全编程技术与实例开发》课程设计项目，对应第 4 题“基于 Docker 构建 Prometheus + Grafana 监控集群模型及技术实现”。

项目以 Docker Compose 版作为主实现，能够一键启动 Prometheus、Grafana、Alertmanager、node-exporter、cAdvisor、blackbox-exporter、自定义 security-exporter 和 demo-app。Kubernetes 版作为扩展研究和可选实验，用文档与示例 YAML 体现。

项目重点体现：

- Prometheus 指标采集。
- 静态服务发现 `static_configs`。
- 动态服务发现 `file_sd_configs`。
- Grafana 可视化。
- Alertmanager 告警。
- node_exporter 主机监控。
- cAdvisor 容器监控。
- blackbox_exporter 服务可用性探测。
- security_exporter 自定义安全指标。
- Kubernetes 监控研究。

## 技术栈

- Docker Compose
- Prometheus
- Grafana
- Alertmanager
- node_exporter
- cAdvisor
- blackbox_exporter
- Python Flask
- prometheus-client
- Kubernetes 可选研究：kind / minikube + kube-prometheus-stack

## 服务组成与访问地址

| 服务 | 地址 | 说明 |
| --- | --- | --- |
| Prometheus | http://localhost:9090 | 指标查询、Targets、Alerts |
| Grafana | http://localhost:3000 | Dashboard，可使用 `admin/admin` 登录 |
| Alertmanager | http://localhost:9093 | 告警展示、静默和路由查看 |
| cAdvisor | http://localhost:8080 | 容器资源指标页面 |
| blackbox-exporter | http://localhost:9115 | 服务探测 Exporter |
| security-exporter | http://localhost:8000 | 自定义安全指标 Exporter |
| demo-app | http://localhost:5000 | 被监控测试服务 |

## 总体流程

系统通过 Docker Compose 一键启动 Prometheus、Grafana、Alertmanager、node_exporter、cAdvisor、blackbox_exporter、自定义 security_exporter 和 demo-app 等服务。node_exporter 采集本机服务器 CPU、内存、磁盘、网络等物理节点性能指标；cAdvisor 采集 Docker 容器 CPU、内存、网络、磁盘 IO 和运行状态等容器指标；blackbox_exporter 对 demo-app 等服务进行 HTTP 可用性探测；security_exporter 暴露失败登录次数、可疑请求次数、开放端口数量、安全风险分数等模拟安全指标；demo-app 提供被监控的测试服务和应用指标。

Prometheus 根据 `prometheus.yml` 中的 `scrape_configs` 定时从各个 Exporter 的 `/metrics` 接口抓取指标数据，同时使用 `static_configs` 实现静态服务发现，使用 `file_sd_configs` 实现文件型动态服务发现。Prometheus 抓取到的指标会被存储为时间序列数据，并可通过 PromQL 查询分析。

Prometheus 根据告警规则文件判断 CPU 使用率过高、内存使用率过高、磁盘空间不足、服务不可用、容器异常、安全风险分数过高、失败登录次数过多等场景。如果满足告警条件，Prometheus 生成告警并发送给 Alertmanager。Alertmanager 负责告警分组、去重、路由和展示。

Grafana 通过 Prometheus 数据源读取监控指标，并通过 provisioning 自动加载多个 Dashboard，实现主机性能监控、Docker 容器监控、服务可用性监控和安全风险监控的可视化展示。

## Docker Compose 运行方式

进入项目根目录：

```bash
cd secure-monitor
```

启动全部服务：

```bash
docker compose up -d
```

查看容器状态：

```bash
docker compose ps
```

停止服务：

```bash
docker compose down
```

停止服务并清理持久化卷：

```bash
docker compose down -v
```

本项目当前没有实际运行 Docker Compose，结果需要本地运行后填写。

## Windows / Docker Desktop / WSL2 注意事项

- `docker-compose.yml` 中 cAdvisor 和 node-exporter 使用 Linux 容器路径，例如 `/:/host:ro,rslave`、`/var/lib/docker:/var/lib/docker:ro`、`/sys:/sys:ro`。
- Windows + Docker Desktop 环境中，这些路径指向 Docker Desktop 的 Linux VM 或 WSL2 后端，不完全等同于 Windows 的 `C:\` 或 `D:\`。
- 如果项目放在 Windows 路径中，需要确保 Docker Desktop 已允许该磁盘或目录文件共享。
- 如果在 WSL2 中执行 Docker 命令，建议将项目放在 WSL2 Linux 文件系统内。
- cAdvisor 在 Windows Docker Desktop 下可能看到的是 Docker 后端环境中的容器信息，答辩时可说明这是虚拟化环境差异。

## Prometheus 使用说明

Prometheus 访问地址：

```text
http://localhost:9090
```

Targets 页面：

```text
http://localhost:9090/targets
```

判断服务是否被成功采集：

1. 打开 Targets 页面。
2. 查看 `prometheus`、`node-exporter`、`cadvisor`、`alertmanager`、`blackbox-exporter`、`dynamic-file-sd`、`blackbox-http`。
3. 如果目标状态为 `UP`，说明 Prometheus 已成功采集。
4. 如果为 `DOWN`，查看错误信息、容器状态和网络配置。

待本地启动后在 Prometheus Targets 页面验证。

## security_exporter 使用说明

访问地址：

```text
http://localhost:8000
```

健康检查：

```text
http://localhost:8000/health
```

查看指标：

```text
http://localhost:8000/metrics
```

主要指标：

- `security_failed_login_total`
- `security_suspicious_request_total`
- `security_open_port_count`
- `security_container_restart_total`
- `security_high_cpu_process_count`
- `security_risk_score`

模拟失败登录：

```bash
python scripts/simulate_failed_login.py 20
```

模拟高风险分数：

```bash
python scripts/simulate_security_risk.py 90
```

security_exporter 只用于课程设计模拟，不读取真实敏感信息。

## demo-app 使用说明

访问地址：

```text
http://localhost:5000
```

健康检查：

```text
http://localhost:5000/health
```

查看指标：

```text
http://localhost:5000/metrics
```

测试接口：

- `GET /api/hello`：正常响应。
- `GET /api/error`：返回 500，用于模拟错误请求。
- `GET /api/slow`：延迟 1-3 秒返回，用于模拟慢请求。

主要指标：

- `demo_http_requests_total`
- `demo_http_request_duration_seconds`
- `demo_app_up`

## blackbox_exporter 使用说明

Prometheus 通过 `blackbox-http` job 探测：

```text
http://demo-app:5000/health
```

常用 PromQL：

```promql
probe_success
probe_duration_seconds
```

`probe_success` 为 1 表示探测成功，为 0 表示探测失败。`probe_duration_seconds` 表示探测耗时。实际 probe 结果待本地启动后验证。

## Prometheus 告警与 Alertmanager

Prometheus Alerts 页面：

```text
http://localhost:9090/alerts
```

验证告警规则是否加载：

1. 打开 Prometheus Web。
2. 进入 Status -> Rules。
3. 查看 `host-alerts`、`container-alerts`、`service-alerts`、`security-alerts`。

Alertmanager 访问地址：

```text
http://localhost:9093
```

查看告警：

1. 打开 Alertmanager 页面。
2. 查看 firing 或 pending 告警。
3. 可通过页面创建 silence 静默告警。

本项目没有配置真实通知渠道，以页面展示为主。后续可扩展邮件、Webhook、企业微信或钉钉。

## Grafana 使用说明

访问地址：

```text
http://localhost:3000
```

默认账号密码：

```text
admin / admin
```

查看数据源：

1. 登录 Grafana。
2. 进入 Connections 或 Data sources。
3. 查看 `Prometheus` 数据源，URL 为 `http://prometheus:9090`。

查看 Dashboard：

1. 打开 Dashboards。
2. 进入 `SecureMonitor` 文件夹。
3. 查看 Host、Container、Service、Security 四类 Dashboard。

待本地启动后在 Grafana 页面验证。

## 异常模拟脚本

| 脚本 | 用途 | 示例 |
| --- | --- | --- |
| `scripts/simulate_cpu_load.sh` | 模拟 CPU 占用，默认 60 秒 | `sh scripts/simulate_cpu_load.sh 60` |
| `scripts/simulate_failed_login.py` | 调用 security-exporter 增加失败登录次数 | `python scripts/simulate_failed_login.py 20` |
| `scripts/simulate_security_risk.py` | 设置安全风险分数 | `python scripts/simulate_security_risk.py 90` |
| `scripts/simulate_service_down.sh` | 停止 demo-app 容器 | `sh scripts/simulate_service_down.sh` |
| `scripts/simulate_container_restart.sh` | 重启 demo-app 并增加模拟重启计数 | `sh scripts/simulate_container_restart.sh` |

推荐演示顺序：

1. 启动 `docker compose up -d`。
2. 检查 Prometheus Targets。
3. 打开 Grafana Dashboard。
4. 运行失败登录和风险分数脚本。
5. 查看安全 Dashboard 和 Prometheus Alerts。
6. 运行服务下线脚本。
7. 查看 blackbox 探测和 Alertmanager。
8. 恢复 demo-app。

恢复 demo-app：

```bash
docker compose up -d demo-app
```

## 验收测试

按 `docs/08_test_plan.md` 执行测试。核心命令：

```bash
docker compose up -d
docker compose ps
```

需要验证：

- Prometheus Targets 是否 UP。
- 静态服务发现和动态服务发现是否生效。
- Grafana 数据源和 Dashboard 是否自动加载。
- security_exporter 与 demo-app `/metrics` 是否可访问。
- Prometheus Alerts 和 Alertmanager 是否显示告警状态。

测试报告填写到 `docs/09_test_report.md`。不要编造结果，未运行内容填写“待本地运行后填写”。

## 答辩展示目标

- Docker Compose 一键启动完整监控系统。
- Prometheus Targets 页面展示静态和动态服务发现。
- Grafana 展示主机、容器、服务、安全 Dashboard。
- Prometheus Alerts 和 Alertmanager 展示告警链路。
- security_exporter 展示自定义安全指标。
- Kubernetes 文档说明 Prometheus Operator、kube-prometheus-stack、ServiceMonitor 和 PodMonitor。
