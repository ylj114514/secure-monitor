# 10 项目说明稿

## 一、项目介绍

老师好，我的项目是 SecureMonitor OS：基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控可视化操作台。它不是实现操作系统内核，而是把 Prometheus、Grafana、Alertmanager、Exporter、安全指标、异常模拟和 Kubernetes 研究入口整合到一个类操作系统桌面的 Web 控制台中。

Docker Compose 是主实现，Kubernetes 是扩展研究和可选实验。

## 二、演示流程

1. 打开 SecureMonitor OS：`http://127.0.0.1:7001`。
2. 展示顶部状态栏：Prometheus、Grafana、Alertmanager、Targets、告警、CPU/内存/磁盘。
3. 展示总览页：系统健康、服务拓扑、安全风险、最近告警。
4. 展示主机监控页：CPU、内存、磁盘指标。
5. 展示容器监控页：cAdvisor 容器指标说明。
6. 展示服务探测页：probe_success、probe_duration_seconds。
7. 展示 Targets 页：Prometheus targets 和 health 状态。
8. 展示安全中心：失败登录、可疑请求、开放端口、风险分数。
9. 展示告警规则页：说明主机、容器、服务、安全四类 PromQL 规则。
10. 展示验收清单页：说明课程要求、项目实现、证据文件和截图位置。
11. 打开 Grafana 大屏：展示主机、容器和安全 Dashboard，主机大屏显示 Windows 本机指标，容器大屏切换真实容器监控对象。
12. 展示 Kubernetes 研究页：说明 kube-prometheus-stack、ServiceMonitor、PodMonitor 和示例 YAML。
13. 进入异常模拟页，依次点击失败登录、可疑请求、风险分数、开放端口、高 CPU 进程、容器重启、服务宕机命令和恢复命令。
14. 返回安全中心、告警中心、总览页和 Grafana 安全大屏，展示异常模拟后的指标和告警变化。

## 三、技术讲解

- Prometheus 负责指标采集、存储、PromQL 查询和告警规则判断。
- Grafana 负责 Dashboard 可视化。
- Alertmanager 负责告警分组、去重、路由、静默和展示。
- node_exporter 采集主机指标。
- cAdvisor 采集容器指标。
- blackbox_exporter 从外部探测服务可用性。
- security_exporter 暴露模拟安全指标。
- console-backend 统一封装 Prometheus、Alertmanager、Grafana 和 Exporter API。
- console-frontend 提供类操作系统风格的统一驾驶舱。
- Kubernetes 部分研究 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor、PodMonitor。

## 四、项目亮点

- 在原 Prometheus + Grafana 监控链路上新增统一操作台。
- 类操作系统桌面风格，展示效果更集中。
- 统一查看 Targets、安全指标、告警和 Grafana 入口。
- 异常模拟遵守安全边界，不删除数据，不直接强制停止容器。
- 同时保留原生 Prometheus、Grafana、Alertmanager 页面，便于项目报告展示对照。
- 演示视频不是只浏览静态页面，而是先展示基线状态，再触发模拟异常，最后展示 Prometheus 指标、Alertmanager 告警和 Grafana 面板的联动变化。

## 五、项目不足

- SecureMonitor OS 是课程设计控制台，不是真正操作系统。
- Kubernetes 部分主要是研究和可选实验。
- 安全指标为模拟指标。
- Grafana iframe 在生产环境需要额外安全配置。
- 未接入真实邮件、企业微信、钉钉通知。

## 六、可能提问

### 为什么要做统一控制台？

Prometheus、Grafana、Alertmanager 功能分散。统一控制台可以把状态、指标、告警和模拟操作集中展示，更适合课程项目报告展示和运维演示。

### 控制台和 Grafana 的区别是什么？

Grafana 主要负责图表可视化；SecureMonitor OS 负责整合入口、总览状态、Targets、告警、安全指标和异常模拟。两者不是替代关系，而是互补关系。

### 为什么不直接执行 docker stop？

为了安全边界，控制台不直接执行可能影响环境的 Docker 操作，只返回建议命令，避免误删或误停用户数据。

### 为什么异常模拟要先点击按钮再看变化？

这样可以证明系统不是静态展示页面。失败登录、可疑请求、风险分数、开放端口、高 CPU 进程和容器重启等按钮会改变 security_exporter 暴露的 Prometheus 指标，Prometheus 抓取后触发 rules，再由 Alertmanager 和 SecureMonitor OS 展示告警变化。

### 这个系统如何扩展到生产环境？

需要增加登录认证、HTTPS、权限控制、审计日志、真实通知渠道、更多安全数据源和 Kubernetes 实际部署验证。

### 为什么前端没有直接展示原始 JSON？

本项目没有直接把 Prometheus、Alertmanager、Grafana 的原始 JSON 返回值展示给用户，而是在前端进行了数据模型转换和可视化封装。系统将 targets、alerts、security metrics、dashboard JSON、Kubernetes YAML 等复杂数据转换为卡片、表格、状态标签、中文说明和折叠详情，使非专业用户也能理解监控对象、告警状态和安全风险。

在演示时，我会优先展示人类可读的总览页、Targets 表格、告警中心和安全中心。如果老师需要看原始接口数据，可以展开“开发者详情”，但默认界面不会把 JSON/YAML 当作主要内容。
