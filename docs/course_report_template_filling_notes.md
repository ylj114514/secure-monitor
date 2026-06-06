# SecureMonitor 期末项目报告填写说明

本文档用于把 SecureMonitor 项目材料整理成课程报告，写作格式参考老师提供的课程报告样例。样例报告的主要结构包括：封面、评分表、题目与作者信息、摘要、关键词、分章节正文、图表说明、测试或实践结果、总结与参考资料。本项目报告可按同样结构组织，但内容必须围绕《网络安全编程技术与实例开发》第 4 题，不夸大 Kubernetes 部分，不把 security_exporter 写成真实入侵检测系统。

## 1. 封面与基本信息

封面建议保留老师模板中的课程名称、学校、学院、班级、学号、姓名、任课老师、日期等格式。题目可写为：

SecureMonitor：基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控告警系统

如果报告中使用“SecureMonitor OS”，需要说明它是本项目新增的统一可视化控制台，不是真正的操作系统内核。

## 2. 摘要写法

摘要应概括项目背景、实现方式、核心功能和结果材料。建议包含以下要点：

- Docker 与 Kubernetes 场景下服务数量多、状态变化快，需要统一监控和告警。
- 本项目使用 Docker Compose 部署 Prometheus、Grafana、Alertmanager、node_exporter、cAdvisor、blackbox_exporter、security_exporter 和 demo-app。
- Prometheus 通过 static_configs 和 file_sd_configs 完成静态与动态服务发现。
- Grafana 通过 provisioning 自动配置 Prometheus 数据源和 Dashboard。
- Alertmanager 对 Prometheus 告警进行分组、路由和展示。
- SecureMonitor OS 将监控、告警、安全指标、异常模拟、Kubernetes 研究入口统一到 Web 控制台。
- Kubernetes 部分作为扩展研究，说明 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor 和 PodMonitor 的作用。

摘要中不要写“已经完成生产级 Kubernetes 部署”，也不要写“真实入侵检测”。

## 3. 关键词

建议关键词：

Prometheus；Grafana；Docker Compose；Alertmanager；Exporter；Kubernetes；安全监控；服务发现

## 4. 正文章节建议

### 4.1 项目背景与意义

说明云原生环境中服务、容器和节点数量增加，人工查看日志和状态难以及时发现异常。结合网络安全课程背景，说明监控系统不仅需要关注 CPU、内存、磁盘等资源指标，还需要关注服务可用性、容器异常、安全事件模拟指标和告警链路。

### 4.2 需求分析

可以按功能需求和非功能需求写：

- 功能需求：一键部署、指标采集、服务发现、告警规则、告警展示、Grafana 可视化、安全指标模拟、异常模拟、Kubernetes 研究。
- 非功能需求：本地可运行、便于截图、配置清晰、文档完整、不编造测试结果、安全边界明确。

### 4.3 系统总体架构

建议先画或描述链路：

被监控对象 -> Exporter -> Prometheus -> Alertmanager / Grafana -> SecureMonitor OS

正文说明：

- node_exporter / Windows host metrics exporter 负责主机性能指标。
- cAdvisor 负责 Docker 容器指标。
- blackbox_exporter 负责 HTTP 可用性探测。
- security_exporter 负责课程模拟安全指标。
- Prometheus 负责抓取、存储、PromQL 查询和告警规则判断。
- Alertmanager 负责告警分组、去重、路由和静默。
- Grafana 负责 Dashboard 可视化。
- console-backend 封装 Prometheus、Grafana、Alertmanager 和 Exporter API。
- console-frontend 提供统一中文可视化界面。

### 4.4 Prometheus 指标采集设计

这一章要重点对应老师要求中的“动态、静态服务发现”。

建议写：

- `global.scrape_interval` 和 `evaluation_interval` 的作用。
- `static_configs` 用于固定服务，例如 Prometheus、node-exporter、cAdvisor、Alertmanager、blackbox-exporter。
- `file_sd_configs` 用于文件型动态服务发现，例如 security-exporter 和 demo-app。
- blackbox 探测不是直接抓 `/metrics`，而是 Prometheus 请求 blackbox_exporter 的 `/probe`，由 blackbox_exporter 去访问 demo-app `/health`。
- `rule_files` 负责加载告警规则。

### 4.5 Grafana 可视化设计

说明 Grafana 是老师要求中的 Web 可视化工具。本项目通过 provisioning 自动添加 Prometheus 数据源，并加载四类 Dashboard：

- 主机监控 Dashboard：CPU、内存、磁盘、网络、node_exporter 状态。
- 容器监控 Dashboard：容器 CPU、内存、网络 IO、cAdvisor 状态。
- 服务监控 Dashboard：demo-app up、probe_success、probe_duration_seconds、HTTP 请求数、错误请求数。
- 安全监控 Dashboard：失败登录、可疑请求、开放端口、容器重启、高 CPU 进程、安全风险分数。

### 4.6 Alertmanager 告警设计

按主机、容器、服务、安全四类介绍告警：

- 主机告警：CPU、内存、磁盘、node_exporter 不可用。
- 容器告警：容器 CPU、容器内存、cAdvisor 不可用、模拟容器重启。
- 服务告警：blackbox 探测失败、demo-app 不可用、HTTP 5xx 错误增加。
- 安全告警：失败登录增长、可疑请求增长、开放端口过多、安全风险分数过高。

说明 `expr`、`for`、`labels`、`annotations` 的含义。

### 4.7 自定义 security_exporter 设计

说明设计目的：课程要求研究安全监控，单纯的主机和容器指标不足以体现安全事件，因此增加自定义 Exporter。指标包括：

- `security_failed_login_total`
- `security_suspicious_request_total`
- `security_open_port_count`
- `security_container_restart_total`
- `security_high_cpu_process_count`
- `security_risk_score`

必须强调这些是课程设计模拟指标，不读取真实账号、密码、日志或隐私数据。

### 4.8 SecureMonitor OS 统一可视化控制台

说明新增控制台的意义：

- 避免老师或普通用户直接面对 Prometheus / Alertmanager / Grafana 原始 JSON。
- 将 Targets、Alerts、安全指标、Grafana 入口、异常模拟、Kubernetes 研究入口统一展示。
- 提供课程要求验收清单、告警规则说明中心、Kubernetes 研究页面和后端巡检报告导出接口。

### 4.9 Kubernetes 监控研究

说明 Docker Compose 是主实现，Kubernetes 是扩展研究和可选实验。重点写清楚：

- Node：通过 node_exporter、kubelet、kube-state-metrics 观察状态。
- Pod：通过 kube-state-metrics、cAdvisor、PodMonitor 观察运行状态、重启和资源使用。
- Service：通过 ServiceMonitor 或 blackbox 探测观察可用性。
- Deployment：通过 kube-state-metrics 观察期望副本数、可用副本数和异常状态。
- ServiceMonitor / PodMonitor 是 Prometheus Operator 下声明式配置抓取目标的方式。

### 4.10 测试与结果分析

测试结果必须来自实际运行。没有运行的项目写“待本地运行后填写”。建议至少放这些截图：

- docker compose ps
- SecureMonitor OS 总览页
- Prometheus Targets
- Prometheus Alerts
- Grafana 主机、容器、服务、安全 Dashboard
- Alertmanager
- 安全中心模拟前
- 异常模拟页
- 安全中心模拟后
- 告警中心模拟后
- Kubernetes 研究页

## 5. 图表安排建议

正文中不要堆大量原始 JSON 或 YAML。建议用图表说明：

- 系统架构图
- Prometheus 抓取流程图
- 告警触发流程图
- Docker Compose 服务组成表
- 课程要求映射表
- 测试用例表
- 截图材料表

## 6. 总结与不足

总结已经实现的内容，同时诚实说明不足：

- Docker Compose 主实现较完整，适合本地运行、截图和课程报告展示。
- Kubernetes 部分目前以研究文档和示例 YAML 为主。
- security_exporter 是模拟安全指标，不是生产级安全检测系统。
- Alertmanager 尚未接入真实邮件、企业微信或钉钉。
- 后续可增加日志监控、Loki、HTTPS、权限控制和更多安全指标。
