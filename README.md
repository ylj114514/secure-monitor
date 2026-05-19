# SecureMonitor OS：基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控可视化操作台

## 项目简介

SecureMonitor OS 是在原 SecureMonitor 监控告警系统基础上升级的一体化可视化控制台。它不是操作系统内核，而是一个“类操作系统桌面 / 安全运维驾驶舱”风格的 Web 控制台，把 Prometheus、Grafana、Alertmanager、Exporter、安全指标、异常模拟和 Kubernetes 研究入口集中到一个界面中展示和操作。

项目对应《网络安全编程技术与实例开发》课程设计第 4 题：基于 Docker 构建 Prometheus + Grafana 监控集群模型及技术实现。

Docker Compose 版是主实现，Kubernetes 版作为扩展研究和可选实验。

## 服务组成

| 服务 | 地址 | 作用 |
| --- | --- | --- |
| SecureMonitor OS Console | http://localhost:7001 | 统一可视化控制台 |
| console-backend | http://localhost:7000 | 统一封装 Prometheus、Alertmanager、Grafana、Exporter API |
| Prometheus | http://localhost:9090 | 指标采集、PromQL 查询、告警规则 |
| Grafana | http://localhost:3000 | Dashboard 可视化，默认账号 `admin/admin` |
| Alertmanager | http://localhost:9093 | 告警分组、去重、路由和展示 |
| cAdvisor | http://localhost:8080 | Docker 容器指标 |
| blackbox-exporter | http://localhost:9115 | HTTP/TCP 服务可用性探测 |
| security-exporter | http://localhost:8000 | 自定义安全指标 |
| demo-app | http://localhost:5000 | 被监控测试服务 |

## SecureMonitor OS 功能

- 顶部状态栏：Prometheus、Grafana、Alertmanager 状态，Targets UP 数量，Active Alerts，CPU/内存/磁盘摘要，当前时间。
- 左侧 Dock：总览、主机监控、容器监控、服务探测、Targets、安全中心、告警中心、Grafana 大屏、异常模拟、Kubernetes 研究、项目文档。
- 总览页：系统健康状态、Targets、告警、安全风险分数、服务拓扑和最近告警。
- Targets 页面：展示 Prometheus 所有采集目标，支持按 health 过滤。
- 安全中心：展示失败登录、可疑请求、开放端口、容器重启、高 CPU 进程、安全风险分数。
- 告警中心：整合 Prometheus alerts 和 Alertmanager alerts。
- 异常模拟：调用安全模拟接口，服务宕机/恢复只返回建议命令，不直接停止或删除容器。
- Grafana 大屏：提供 Dashboard 入口，可选 iframe 嵌入。
- Kubernetes 研究页：展示 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor、PodMonitor 研究内容。

## 运行方式

进入项目目录：

```bash
cd C:\Users\52697\secure-monitor
```

启动所有服务：

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

清理容器和持久化卷：

```bash
docker compose down -v
```

本项目当前没有实际运行 Docker Compose，结果需要本地运行后填写。

## 演示流程

1. 打开 SecureMonitor OS：http://localhost:7001。
2. 展示顶部状态栏，说明 Prometheus、Grafana、Alertmanager 和 Targets 状态。
3. 展示总览页，说明系统健康、服务拓扑、安全风险和最近告警。
4. 打开主机监控、容器监控、服务探测页面。
5. 打开 Targets 页面，展示 static_configs 和 file_sd_configs 发现的目标。
6. 打开安全中心，查看 security_exporter 指标。
7. 打开异常模拟页，点击“模拟失败登录”或“设置风险分数为 90”。
8. 回到安全中心和告警中心观察指标/告警变化。
9. 打开 Grafana 大屏入口，查看原生 Grafana Dashboard。
10. 展示 Kubernetes 研究页和项目文档页。

## Grafana iframe 说明

本项目在 Docker Compose 中设置了：

```yaml
GF_SECURITY_ALLOW_EMBEDDING: "true"
```

这只适用于本地课程演示。生产环境应重新配置认证、HTTPS、跨域和安全策略。如果 iframe 不显示，请直接访问：

```text
http://localhost:3000
```

## 异常模拟安全边界

- 异常模拟只用于课程设计演示。
- 控制台不会删除容器、镜像、文件或用户数据。
- “服务宕机”和“服务恢复”按钮只返回建议命令，不直接执行 Docker 停止/恢复操作。
- security_exporter 不读取真实敏感信息，不扫描真实端口，不读取真实登录日志。
- 生产环境需要增加鉴权、HTTPS、权限控制和审计。

## 常用验证地址

- Prometheus Targets：http://localhost:9090/targets
- Prometheus Alerts：http://localhost:9090/alerts
- Alertmanager：http://localhost:9093
- security_exporter metrics：http://localhost:8000/metrics
- demo-app health：http://localhost:5000/health
- console-backend health：http://localhost:7000/api/health

## 测试说明

测试计划见 `docs/08_test_plan.md`，测试报告模板见 `docs/09_test_report.md`。不要编造测试结果，未运行内容填写“待本地运行后填写”。
