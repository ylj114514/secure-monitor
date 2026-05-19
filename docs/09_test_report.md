# 09 测试报告模板

> 说明：本文件是课程设计测试报告模板。未实际运行、未截图、未观察到的结果不得编造，统一填写“待本地运行后填写”。

## 1. 测试时间

待本地运行后填写。

## 2. 测试环境

| 项目 | 内容 |
| --- | --- |
| 操作系统 | 待本地运行后填写 |
| Docker Desktop / Docker Engine | 待本地运行后填写 |
| Docker Compose | 待本地运行后填写 |
| 浏览器 | 待本地运行后填写 |
| 项目目录 | `C:\Users\52697\secure-monitor` |

## 3. 测试人员

待本地运行后填写。

## 4. 启动命令

```powershell
cd C:\Users\52697\secure-monitor
docker compose up -d
docker compose ps
```

实际启动结果：

```text
待本地运行后填写
```

## 5. 测试结果汇总

| 编号 | 测试名称 | 预期结果 | 实际结果 | 是否通过 | 截图位置 |
| --- | --- | --- | --- | --- | --- |
| T01 | Docker Compose 启动测试 | 所有核心容器处于 Up 状态 | 待本地运行后填写 | 待填写 | `docs/images/docker-compose-ps.png` |
| T02 | Prometheus Targets 测试 | Targets 页面能看到静态和动态 target | 待本地运行后填写 | 待填写 | `docs/images/prometheus-targets.png` |
| T03 | 静态服务发现测试 | prometheus、node-exporter、cadvisor、alertmanager、blackbox-exporter 被采集 | 待本地运行后填写 | 待填写 | `docs/images/static-targets.png` |
| T04 | 动态服务发现测试 | security-exporter、demo-app 通过 file_sd 被采集 | 待本地运行后填写 | 待填写 | `docs/images/file-sd-targets.png` |
| T05 | node_exporter 主机指标测试 | 可查询 CPU、内存、磁盘、网络指标 | 待本地运行后填写 | 待填写 | `docs/images/node-exporter-query.png` |
| T06 | cAdvisor 容器指标测试 | 可查询容器 CPU、内存、网络指标 | 待本地运行后填写 | 待填写 | `docs/images/cadvisor-query.png` |
| T07 | blackbox 服务探测测试 | `probe_success` 可查询，demo-app 探测正常 | 待本地运行后填写 | 待填写 | `docs/images/blackbox-probe.png` |
| T08 | security_exporter 指标测试 | `/metrics` 暴露自定义安全指标 | 待本地运行后填写 | 待填写 | `docs/images/security-exporter-metrics.png` |
| T09 | Grafana 数据源测试 | Grafana 已配置 Prometheus 数据源 | 待本地运行后填写 | 待填写 | `docs/images/grafana-datasource.png` |
| T10 | Grafana Dashboard 测试 | 主机、容器、服务、安全 Dashboard 可打开 | 待本地运行后填写 | 待填写 | `docs/images/grafana-dashboard.png` |
| T11 | CPU 高负载告警测试 | 满足规则后 Prometheus 产生告警 | 待本地运行后填写 | 待填写 | `docs/images/high-cpu-alert.png` |
| T12 | 服务宕机告警测试 | demo-app 不可用时产生服务告警 | 待本地运行后填写 | 待填写 | `docs/images/service-down-alert.png` |
| T13 | 失败登录安全告警测试 | 模拟失败登录后产生安全告警 | 待本地运行后填写 | 待填写 | `docs/images/failed-login-alert.png` |
| T14 | Alertmanager 告警展示测试 | Alertmanager 页面可展示告警 | 待本地运行后填写 | 待填写 | `docs/images/alertmanager-alerts.png` |
| T15 | Docker 容器重启模拟测试 | 模拟重启指标增长并可触发告警 | 待本地运行后填写 | 待填写 | `docs/images/container-restart-alert.png` |
| T16 | console-backend 健康检查 | `/api/health` 返回 `status: ok` | 待本地运行后填写 | 待填写 | `docs/images/backend-health.png` |
| T17 | console-frontend 页面访问 | `http://127.0.0.1:7001` 可打开 | 待本地运行后填写 | 待填写 | `docs/images/securemonitor-os-overview.png` |
| T18 | 总览页数据展示 | 顶部状态栏、Targets、告警、安全风险正常展示 | 待本地运行后填写 | 待填写 | `docs/images/overview-status.png` |
| T19 | Targets 页面展示 | Targets 表格中文展示，支持状态查看 | 待本地运行后填写 | 待填写 | `docs/images/os-targets.png` |
| T20 | 安全中心指标展示 | 安全指标卡片和风险分数正常展示 | 待本地运行后填写 | 待填写 | `docs/images/os-security.png` |
| T21 | 告警中心展示 | 告警统计、筛选和列表正常展示 | 待本地运行后填写 | 待填写 | `docs/images/os-alerts.png` |
| T22 | 异常模拟按钮测试 | 模拟接口可调用，页面显示结果说明 | 待本地运行后填写 | 待填写 | `docs/images/os-simulation.png` |
| T23 | Grafana 入口测试 | SecureMonitor OS 可跳转到 Grafana Dashboard | 待本地运行后填写 | 待填写 | `docs/images/os-grafana.png` |

## 6. 详细测试记录

### T01 Docker Compose 启动测试

- 操作步骤：执行 `docker compose up -d`，再执行 `docker compose ps`。
- 预期结果：所有服务处于 Up 状态。
- 实际结果：待本地运行后填写。
- 截图：`docs/images/docker-compose-ps.png`

### T02 Prometheus Targets 测试

- 操作步骤：访问 `http://127.0.0.1:9090/targets`。
- 预期结果：能看到 prometheus、node-exporter、cadvisor、alertmanager、blackbox-exporter、security-exporter、demo-app 等 target。
- 实际结果：待本地运行后填写。
- 截图：`docs/images/prometheus-targets.png`

### T10 Grafana Dashboard 测试

- 操作步骤：访问 `http://127.0.0.1:3000`，使用 `admin/admin` 登录。
- 预期结果：可查看 SecureMonitor 主机监控、容器监控、服务探测、安全监控四类 Dashboard。
- 实际结果：待本地运行后填写。
- 截图：`docs/images/grafana-dashboard.png`

### T17 SecureMonitor OS 页面访问

- 操作步骤：访问 `http://127.0.0.1:7001`。
- 预期结果：打开统一可视化控制台，顶部状态栏和左侧菜单正常显示。
- 实际结果：待本地运行后填写。
- 截图：`docs/images/securemonitor-os-overview.png`

## 7. 问题记录

| 编号 | 问题 | 影响 | 处理方式 | 状态 |
| --- | --- | --- | --- | --- |
| P01 | 待本地运行后填写 | 待本地运行后填写 | 待本地运行后填写 | 待填写 |

## 8. 测试总结

当前文件为测试报告模板，不包含编造结果。请在本地完成运行、截图和验收后补充实际结果。

如果 Docker Desktop、WSL2 或代理导致 `localhost` 访问异常，建议使用 `127.0.0.1` 访问各服务。
