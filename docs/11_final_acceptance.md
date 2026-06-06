# 11 最终验收说明

## 验收目标

本项目最终验收目标是证明 SecureMonitor OS 已经围绕课程设计要求完成以下能力：

1. Docker Compose 可一键启动核心监控系统。
2. Prometheus 可以采集主机、容器、服务和安全模拟指标。
3. Prometheus 同时使用静态服务发现和文件型动态服务发现。
4. Prometheus 可以加载告警规则并向 Alertmanager 发送告警。
5. Grafana 可以使用 Prometheus 作为数据源，并展示中文 Dashboard。
6. SecureMonitor OS 可以作为统一可视化控制台展示监控、告警、安全指标、Grafana 入口和 Kubernetes 研究内容。
7. Kubernetes 部分以研究文档和示例 YAML 形式体现扩展能力。
8. 演示视频可以完整展示基础监控页面、Grafana Dashboard、异常模拟按钮实操和异常触发后的界面变化。

## 验收命令清单

进入项目目录：

```powershell
cd C:\Users\52697\secure-monitor
```

启动服务：

```powershell
docker compose up -d
```

查看容器：

```powershell
docker compose ps
```

停止服务：

```powershell
docker compose down
```

查看 Prometheus 配置是否可加载：

```powershell
docker compose logs prometheus
```

查看 Grafana 是否加载 Dashboard：

```powershell
docker compose logs grafana
```

## 页面验收清单

| 页面 | 地址 | 验收重点 |
| --- | --- | --- |
| SecureMonitor OS | http://127.0.0.1:7001 | 顶部状态栏、总览页、Targets、安全中心、告警中心、Grafana 入口 |
| console-backend | http://127.0.0.1:7000/api/health | 返回后端健康状态 |
| Prometheus | http://127.0.0.1:9090 | Targets、Alerts、PromQL 查询 |
| Grafana | http://127.0.0.1:3000 | 中文 Dashboard，账号 `admin/admin` |
| Alertmanager | http://127.0.0.1:9093 | 告警展示、分组、静默 |
| cAdvisor | http://127.0.0.1:8080 | Docker 容器指标页面 |
| blackbox_exporter | http://127.0.0.1:9115 | 探测 exporter 页面 |
| security_exporter | http://127.0.0.1:8000/metrics | 自定义安全指标 |
| demo-app | http://127.0.0.1:5000/health | 测试服务健康状态 |

## Prometheus 验收 PromQL

可在 Prometheus 页面执行以下查询：

```promql
up
```

```promql
probe_success
```

```promql
security_failed_login_total
```

```promql
security_risk_score
```

```promql
rate(container_cpu_usage_seconds_total{name!=""}[2m])
```

```promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)
```

## Grafana 验收 Dashboard

Grafana 登录信息：

- 用户名：`admin`
- 密码：`admin`

需要检查的 Dashboard：

1. SecureMonitor 主机监控大屏
2. SecureMonitor 容器监控大屏
3. SecureMonitor 服务探测大屏
4. SecureMonitor 安全监控大屏

Dashboard 应使用 Prometheus 数据源，并展示中文面板标题。

## SecureMonitor OS 验收页面

| 页面 | 验收内容 |
| --- | --- |
| 总览 | Prometheus、Grafana、Alertmanager 状态，Targets 数量，活跃告警，资源摘要，安全摘要 |
| 主机监控 | CPU、内存、磁盘、node_exporter 状态 |
| 容器监控 | cAdvisor 状态和容器指标说明 |
| 服务探测 | demo-app 可用性、probe_success、probe_duration_seconds |
| Targets | Prometheus target 表格，健康状态和标签 |
| 安全中心 | 失败登录、可疑请求、开放端口、容器重启、高 CPU 进程、安全风险分数 |
| 告警中心 | 告警统计、严重级别、来源、描述、状态 |
| Grafana | Dashboard 入口和面板说明 |
| 异常模拟 | 失败登录、安全风险分数、容器重启等模拟入口 |
| Kubernetes | Kubernetes 监控研究说明 |

## 演示视频验收

最终演示视频文件：

```text
demo/project_demo.mp4
```

视频应覆盖以下验收点：

1. 前半段展示系统基线：总览、主机监控、容器监控、服务探测、Targets、安全中心、告警中心、告警规则、验收清单、Grafana 和 Kubernetes。
2. Grafana 主机大屏直接展示 Windows 本机指标，不再先闪过 Docker Desktop WSL2 指标；容器大屏会切换不同容器监控对象。
3. 异常模拟部分会逐个点击失败登录、可疑请求、风险分数、开放端口、高 CPU 进程、容器重启、服务宕机命令和恢复命令按钮。
4. 点击后展示安全中心指标变化、告警中心活跃告警、总览页综合风险变化和 Grafana 安全大屏变化。
5. 服务宕机按钮只生成演示命令，不直接停止容器，符合课程演示安全边界。

## 风险项

1. Kubernetes 部分是研究和可选实验，不是主运行环境。
2. security_exporter 是模拟安全指标，不代表真实入侵检测系统。
3. Grafana 自带系统菜单可能不完全中文，但 Dashboard 内容已中文化。
4. Alertmanager 未配置真实邮件、企业微信或钉钉通知，课程演示以页面展示为主。
5. Docker Desktop / WSL2 / Windows 代理可能影响 `localhost` 访问，建议使用 `127.0.0.1`。

## 项目亮点

1. Docker Compose 一键启动完整监控告警系统。
2. Prometheus 同时实现静态服务发现和文件型动态服务发现。
3. 覆盖主机、容器、服务、安全模拟指标。
4. Grafana 自动加载 Prometheus 数据源和中文 Dashboard。
5. Alertmanager 接收和展示 Prometheus 告警。
6. 自定义 security_exporter 体现网络安全课程特色。
7. SecureMonitor OS 统一控制台提升展示效果。
8. Kubernetes 研究文档覆盖课程扩展要求。

## 最终说明

最终验收时不要口头声称已经完成未执行的测试。未运行的截图和结果应在测试报告中保留“待本地运行后填写”。
