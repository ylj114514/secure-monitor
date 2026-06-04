# 02 系统架构设计

## 架构定位

SecureMonitor OS 是一个基于 Docker Compose 的安全监控可视化操作台。它不是操作系统内核，而是将 Prometheus、Grafana、Alertmanager、Exporter、异常模拟和 Kubernetes 研究入口整合到统一 Web 控制台中。

## 总体流程

1. Docker Compose 启动 Prometheus、Grafana、Alertmanager、node-exporter、cAdvisor、blackbox-exporter、security-exporter、demo-app。
2. Exporter 和 demo-app 暴露 `/metrics`。
3. Prometheus 通过 `static_configs` 和 `file_sd_configs` 发现目标并采集指标。
4. Prometheus 使用 PromQL 查询、分析和判断告警。
5. Alertmanager 接收告警并进行分组、去重、路由和展示。
6. Grafana 连接 Prometheus 并展示 Dashboard。
7. console-backend 封装 Prometheus、Alertmanager、Grafana、security_exporter 等接口。
8. console-frontend 以类操作系统桌面形式展示监控状态、告警、安全指标、异常模拟和文档入口。

## SecureMonitor OS 架构图文字说明

```text
用户浏览器
  -> console-frontend:7001
    -> console-backend:7000
      -> Prometheus API:9090
      -> Alertmanager API:9093
      -> Grafana:3000
      -> security_exporter:8000
      -> demo-app:5000

Prometheus
  -> node-exporter:9100
  -> cAdvisor:8080
  -> blackbox-exporter:9115
  -> security-exporter:8000
  -> demo-app:5000
```

## console-backend 关系

console-backend 是统一 API 网关：

- 从 Prometheus 查询总览、Targets、主机、容器、服务、安全指标。
- 从 Alertmanager 获取告警列表。
- 从 Grafana 返回 Dashboard 入口信息。
- 调用 security_exporter 的模拟接口。
- 对服务宕机/恢复只返回建议命令，不直接执行危险操作。

## console-frontend 页面模块

- TopStatusBar：顶部状态栏。
- SideDock：左侧 Dock 菜单。
- WindowFrame：操作系统窗口风格主内容。
- NotificationPanel：右侧通知栏。
- OverviewPage：系统总览。
- HostMonitorPage：主机监控。
- ContainerMonitorPage：容器监控。
- ServiceMonitorPage：服务探测。
- TargetsPage：Prometheus targets。
- SecurityCenterPage：安全中心。
- AlertCenterPage：告警中心。
- GrafanaPage：Grafana 大屏入口。
- SimulationPage：异常模拟。
- KubernetesResearchPage：Kubernetes 研究。
- DocsPage：项目文档入口。

## 部署端口

| 服务 | 端口 |
| --- | --- |
| console-frontend | 7001 |
| console-backend | 7000 |
| Prometheus | 9090 |
| Grafana | 3000 |
| Alertmanager | 9093 |
| cAdvisor | 8080 |
| blackbox-exporter | 9115 |
| security-exporter | 8000 |
| demo-app | 5000 |

## 安全设计

控制台只执行安全范围内的 HTTP 调用。涉及 Docker stop/restart 的演示功能只返回建议命令，避免误删容器、镜像或用户数据。security_exporter 只暴露模拟指标，不读取真实隐私或敏感数据。

## 验证说明

本次未实际运行 `docker compose up -d`，需要本地启动后验证控制台、Prometheus、Grafana、Alertmanager 和模拟功能。

## 前端数据展示架构

console-frontend 不直接把后端返回的原始 API 数据渲染到主界面，而是在前端增加展示模型转换层：

```text
Prometheus / Alertmanager / Grafana / Kubernetes 原始数据
        -> normalizers.ts 归一化
        -> 中文字段映射 fieldNameMap.ts
        -> MetricCard / TargetTable / AlertTable / InfoCard
        -> RawDataDrawer 折叠保留原始数据
```

这种结构把“机器可读数据”和“项目报告展示可读界面”分离。主界面展示卡片、表格、状态标签和中文说明；原始 JSON/YAML 仅作为开发者详情保留，便于排查但不会影响课程展示效果。
