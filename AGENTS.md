# SecureMonitor 开发协作说明

## 项目目标

SecureMonitor 是《网络安全编程技术与实例开发》课程设计项目，目标是构建一个基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控告警系统。项目必须服务于课程设计答辩，做到能运行、能演示、能截图、能写报告、能答辩。

Docker Compose 版作为主实现，负责本地部署、演示和截图；Kubernetes 版作为扩展研究和可选实验，通过文档和示例 YAML 体现。

## 课程要求

1. 搭建 Prometheus + Grafana 的全方位监控告警系统。
2. 配置 Prometheus 的动态、静态服务发现。
3. 实现对容器、物理节点、service、pod 等资源指标监控。
4. 在 Grafana Web 界面展示 Prometheus 监控指标。
5. 研究 Docker 与 Kubernetes 容器编排环境下的安全监控。
6. 研究 Prometheus 监控系统告警工具包。
7. 研究 Prometheus 在 Kubernetes 集群下的部署。
8. 研究 Grafana 度量分析可视化工具的使用。
9. 添加 Prometheus 收集的数据作为 Grafana 输入源。
10. 完成 Prometheus 和 Grafana 在 k8s 或 docker 环境下的部署。
11. 对本机服务器性能和集群状态进行监控。

## 技术栈

- Docker Compose
- Prometheus
- Grafana
- Alertmanager
- node_exporter
- cAdvisor
- blackbox_exporter
- 自定义 security_exporter
- Python Flask / FastAPI
- 可选 Kubernetes：kind / minikube + kube-prometheus-stack

## 开发规则

1. 不要一次性重构整个项目。
2. 每次只完成一个明确模块。
3. 修改前先说明计划。
4. 修改后说明改了哪些文件。
5. 配置文件必须尽量添加注释。
6. 涉及运行方式时必须同步更新 README。
7. 涉及原理或设计时必须同步更新 docs。
8. 不要编造测试结果。
9. 如果没有实际运行测试，请在文档中写“待本地运行后填写”。
10. 所有功能都要服务于课程设计：能运行、能演示、能截图、能写报告、能答辩。

## 测试结果要求

不能编造运行结果、截图结果、告警触发结果或性能数据。没有实际执行过的命令和测试，必须明确标注“待本地运行后填写”。

## 文档同步要求

修改 Docker Compose、Prometheus、Grafana、Alertmanager、Exporter、脚本或 Kubernetes 配置后，必须同步更新 README 和 docs 中对应的设计说明、运行方式或测试计划。

## 实现边界

- Docker Compose 版是主实现，优先保证本地可运行、可演示。
- Kubernetes 版是扩展研究和可选实验，重点体现 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor、PodMonitor 等研究内容。
- 每个模块应保持可解释、可截图、可答辩。
