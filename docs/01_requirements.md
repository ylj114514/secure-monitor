# 01 需求分析

## 项目目标

SecureMonitor OS 的目标是在 Prometheus + Grafana + Alertmanager + Exporters 监控系统基础上，新增统一可视化控制台，使课程项目报告展示时可以在一个类操作系统桌面中展示监控总览、Targets、安全指标、告警、Grafana 入口、异常模拟和 Kubernetes 研究内容。

## 基础监控需求

1. Docker Compose 一键启动 Prometheus、Grafana、Alertmanager 和各类 Exporter。
2. 采集主机 CPU、内存、磁盘、网络指标。
3. 采集 Docker 容器 CPU、内存、网络 IO 和运行状态。
4. 使用 blackbox_exporter 探测 demo-app 可用性。
5. 使用 security_exporter 暴露模拟安全指标。
6. 使用 static_configs 和 file_sd_configs 实现静态/动态服务发现。
7. 使用 Prometheus rules 和 Alertmanager 实现告警展示。
8. 使用 Grafana Dashboard 展示主机、容器、服务和安全指标。

## 统一可视化控制台需求

1. 新增 console-backend，统一封装 Prometheus、Alertmanager、Grafana、security_exporter 和 demo-app。
2. 新增 console-frontend，提供类操作系统桌面风格 UI。
3. 顶部状态栏显示系统状态、Targets、告警和资源摘要。
4. 左侧 Dock 提供总览、主机、容器、服务、Targets、安全、告警、Grafana、异常模拟、Kubernetes、文档入口。
5. 主区域以窗口形式展示当前模块。
6. 右侧通知栏展示最近告警、安全风险和服务异常。

## console-backend 需求

- 使用 Python FastAPI。
- 监听端口 `7000`。
- 提供 `/api/health`、`/api/overview`、`/api/targets`、`/api/alerts`、`/api/security/metrics`、`/api/simulation/*`、`/api/grafana/info`、`/api/docs/links`。
- 通过 HTTP 调用 Prometheus、Alertmanager、Grafana 和 security_exporter。
- 不直接执行危险 Docker 控制逻辑。

## console-frontend 需求

- 使用 React + Vite + TypeScript。
- 监听端口 `7001`。
- 使用类操作系统桌面 / 安全运维驾驶舱风格。
- 支持图表、状态卡片、告警表格、Targets 表格、异常模拟按钮和文档入口。

## 安全边界

- 不删除容器、镜像、文件或用户数据。
- 不读取真实敏感信息。
- 异常模拟只用于课程演示。
- 服务停止/恢复操作以建议命令形式展示，不由控制台直接强制执行。

## 验收标准

- `docker compose up -d` 可以启动原监控系统和新控制台。
- `http://localhost:7001` 可以打开 SecureMonitor OS。
- `http://localhost:7000/api/health` 返回健康状态。
- 控制台能展示总览、Targets、安全指标和告警数据。
- README 和 docs 已同步更新。
- 未实际运行的测试结果写“待本地运行后填写”。

## 前端人性化展示需求

SecureMonitor OS 前端需要避免把 Prometheus、Alertmanager、Grafana 或 Kubernetes 的原始 JSON/YAML 直接展示给普通用户。主界面应完成数据归一化和中文化展示：

1. Targets 使用表格、健康状态 Badge、标签组和详情弹窗展示。
2. Alerts 使用统计卡片、告警表格、严重等级颜色和中文状态展示。
3. security_exporter 指标使用安全指标卡片、风险说明和风险分数仪表展示。
4. Grafana Dashboard 信息使用仪表盘卡片和面板列表展示。
5. Kubernetes YAML 示例使用 Deployment、Service、ServiceMonitor、PodMonitor 资源说明卡片展示。
6. Raw JSON / Raw YAML 只允许放在“开发者详情”折叠区域，默认收起。
7. 无数据和接口错误需要有 EmptyState / ErrorState，不允许页面空白。
