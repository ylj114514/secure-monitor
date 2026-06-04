# 12 项目文件功能说明

本文档用于说明 SecureMonitor OS 项目中主要文件和目录的作用，方便课程报告、项目报告展示和后续维护。

## 根目录

| 文件 / 目录 | 功能 |
| --- | --- |
| `README.md` | 项目总说明，包含项目定位、技术栈、运行方式、演示流程和文档索引 |
| `AGENTS.md` | 项目开发规则，强调课程设计目标、Docker 主实现、Kubernetes 扩展研究、安全边界和不编造测试结果 |
| `docker-compose.yml` | Docker Compose 主部署文件，用于启动 Prometheus、Grafana、Alertmanager、Exporter、demo-app 和 SecureMonitor OS |
| `.gitignore` | 忽略 Python 缓存、Node 依赖、构建产物、日志和本地环境文件 |

## Prometheus

| 文件 / 目录 | 功能 |
| --- | --- |
| `prometheus/prometheus.yml` | Prometheus 主配置文件，定义全局抓取周期、服务发现、blackbox 探测、告警规则和 Alertmanager 地址 |
| `prometheus/file_sd/targets.json` | 文件型动态服务发现目标，包含 `security-exporter:8000` 和 `demo-app:5000` |
| `prometheus/rules/host_alerts.yml` | 主机 CPU、内存、磁盘和 node_exporter down 告警规则 |
| `prometheus/rules/container_alerts.yml` | 容器 CPU、内存、cAdvisor down 和模拟容器重启告警规则 |
| `prometheus/rules/service_alerts.yml` | 服务探测失败、demo-app down、HTTP 错误请求告警规则 |
| `prometheus/rules/security_alerts.yml` | 失败登录、可疑请求、开放端口、安全风险分数告警规则 |

## Grafana

| 文件 / 目录 | 功能 |
| --- | --- |
| `grafana/provisioning/datasources/prometheus.yml` | 自动配置 Prometheus 数据源 |
| `grafana/provisioning/dashboards/dashboards.yml` | 自动加载 Dashboard JSON 的 provider 配置 |
| `grafana/dashboards/host-dashboard.json` | 主机监控中文 Dashboard |
| `grafana/dashboards/container-dashboard.json` | Docker 容器监控中文 Dashboard |
| `grafana/dashboards/service-dashboard.json` | 服务可用性和 HTTP 请求监控中文 Dashboard |
| `grafana/dashboards/security-dashboard.json` | 自定义安全指标中文 Dashboard |

Grafana 的作用是把 Prometheus 中的指标转换为图表。它是第三方开源软件，本项目通过 Docker 容器运行，并通过 volume 挂载配置和 Dashboard 文件。

## Alertmanager

| 文件 | 功能 |
| --- | --- |
| `alertmanager/alertmanager.yml` | 告警分组、路由、重复通知间隔和 receiver 配置 |

本项目不配置真实邮箱或外部通知账号，课程演示以 Alertmanager 页面展示为主，后续可扩展邮件、Webhook、企业微信或钉钉。

## Exporters

| 文件 / 目录 | 功能 |
| --- | --- |
| `exporters/security_exporter/app.py` | 自定义安全指标 exporter，提供 `/health`、`/metrics` 和模拟安全事件接口 |
| `exporters/security_exporter/requirements.txt` | security_exporter Python 依赖 |
| `exporters/security_exporter/Dockerfile` | security_exporter 镜像构建文件 |

security_exporter 只用于课程设计模拟，不读取真实敏感信息，不执行真实端口扫描。

## demo-app

| 文件 | 功能 |
| --- | --- |
| `demo-app/app.py` | 被监控测试服务，提供健康检查、指标、正常请求、错误请求和慢请求接口 |
| `demo-app/requirements.txt` | demo-app Python 依赖 |
| `demo-app/Dockerfile` | demo-app 镜像构建文件 |

demo-app 用于证明 Prometheus 可以监控自定义应用服务，也用于 blackbox_exporter 探测。

## blackbox

| 文件 | 功能 |
| --- | --- |
| `blackbox/blackbox.yml` | blackbox_exporter 探测模块配置，包含 HTTP 2xx 探测 |

blackbox_exporter 与普通 `/metrics` 抓取不同，它从外部模拟访问服务，用 `probe_success` 和 `probe_duration_seconds` 表示服务可用性和探测耗时。

## scripts

| 文件 | 功能 |
| --- | --- |
| `scripts/simulate_cpu_load.sh` | 模拟 CPU 高负载，默认有限时间运行 |
| `scripts/simulate_failed_login.py` | 调用 security_exporter 模拟失败登录 |
| `scripts/simulate_security_risk.py` | 设置安全风险分数 |
| `scripts/simulate_service_down.sh` | 输出停止 demo-app 的演示命令，不删除容器或镜像 |
| `scripts/simulate_container_restart.sh` | 重启 demo-app 或调用模拟容器重启指标 |

脚本用于课程演示，执行前应确认本机 Docker 环境状态。

## console-backend

| 文件 / 目录 | 功能 |
| --- | --- |
| `console-backend/Dockerfile` | console-backend 镜像构建文件 |
| `console-backend/requirements.txt` | FastAPI 后端依赖 |
| `console-backend/app/main.py` | FastAPI 应用入口 |
| `console-backend/app/config.py` | Prometheus、Alertmanager、Grafana、security_exporter、demo-app 地址配置 |
| `console-backend/app/routers/overview.py` | 系统总览 API |
| `console-backend/app/routers/targets.py` | Prometheus Targets API 封装 |
| `console-backend/app/routers/alerts.py` | Prometheus 和 Alertmanager 告警 API 封装 |
| `console-backend/app/routers/security.py` | 安全指标 API |
| `console-backend/app/routers/simulation.py` | 异常模拟 API |
| `console-backend/app/routers/grafana.py` | Grafana 信息 API |
| `console-backend/app/routers/docs.py` | 文档入口 API |
| `console-backend/app/services/` | 调用外部服务的业务封装层 |
| `console-backend/app/schemas.py` | 数据结构定义 |

console-backend 的作用是避免前端直接处理多个原始服务接口，让 SecureMonitor OS 可以用统一 API 获取数据。

## console-frontend

| 文件 / 目录 | 功能 |
| --- | --- |
| `console-frontend/package.json` | React + Vite 前端依赖和构建脚本 |
| `console-frontend/Dockerfile` | console-frontend 镜像构建文件 |
| `console-frontend/src/App.tsx` | 前端页面入口和页面切换 |
| `console-frontend/src/api/client.ts` | 调用 console-backend 的 API 客户端 |
| `console-frontend/src/layouts/` | 顶部状态栏、左侧 Dock、窗口框架、通知栏布局 |
| `console-frontend/src/pages/` | 总览、主机监控、容器监控、服务探测、Targets、安全中心、告警中心、Grafana、异常模拟、Kubernetes 研究页面 |
| `console-frontend/src/components/` | 指标卡片、状态标签、表格、空状态、错误状态、Raw Data 抽屉等复用组件 |
| `console-frontend/src/utils/` | 数据格式化、字段中文映射、API 结果归一化 |
| `console-frontend/src/styles/globals.css` | 前端全局样式 |

SecureMonitor OS 前端的目标是把复杂的 Prometheus、Alertmanager、Grafana、Kubernetes 数据转换成适合项目报告展示截图的中文可视化页面。

## Kubernetes

| 文件 | 功能 |
| --- | --- |
| `k8s/README.md` | Kubernetes 扩展实验说明 |
| `k8s/kind-config.yaml` | kind 单节点集群示例 |
| `k8s/demo-app-deployment.yaml` | Kubernetes 中部署 demo-app 的 Deployment 示例 |
| `k8s/demo-app-service.yaml` | demo-app Service 示例 |
| `k8s/service-monitor.yaml` | Prometheus Operator 的 ServiceMonitor 示例 |

Kubernetes 部分用于课程研究和可选实验，不是 Docker Compose 主实现的必要运行条件。

## docs

| 文件 | 功能 |
| --- | --- |
| `docs/00_course_mapping.md` | 课程要求与项目实现逐条映射 |
| `docs/01_requirements.md` | 需求分析 |
| `docs/02_architecture.md` | 架构设计 |
| `docs/03_prometheus_design.md` | Prometheus 设计说明 |
| `docs/04_grafana_design.md` | Grafana 设计说明 |
| `docs/05_alertmanager_design.md` | Alertmanager 设计说明 |
| `docs/06_security_monitoring.md` | 安全监控设计 |
| `docs/07_kubernetes_research.md` | Kubernetes 研究 |
| `docs/08_test_plan.md` | 测试计划 |
| `docs/09_test_report.md` | 测试报告模板 |
| `docs/10_project_script.md` | 项目说明稿 |
| `docs/course_report_outline.md` | 课程设计报告大纲 |
| `docs/11_final_acceptance.md` | 最终验收说明 |
| `docs/12_project_file_guide.md` | 项目文件功能说明 |

## 总结

本项目的核心不是单独编写一个监控算法，而是基于 Prometheus + Grafana 开源生态完成监控系统集成开发，并补充自定义安全指标、统一可视化控制台、Docker/Kubernetes 研究文档和课程项目材料。
