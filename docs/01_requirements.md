# 01 需求分析

## 项目目标

本项目需要完成一个适合课程设计答辩的安全监控告警系统。系统应能在 Docker Compose 环境中本地启动，并展示 Prometheus 指标采集、Grafana 可视化、Alertmanager 告警处理和安全指标监控能力。

Kubernetes 部分作为扩展研究和可选实验，重点说明 Prometheus 在 Kubernetes 中的部署方式和资源指标监控方式。

## 功能需求

1. 一键启动 Prometheus、Grafana、Alertmanager 和各类 Exporter。
2. 采集本机 CPU、内存、磁盘、网络等主机性能指标。
3. 采集 Docker 容器 CPU、内存、网络、磁盘 IO 和运行状态指标。
4. 对 demo-app 等服务进行 HTTP 可用性探测。
5. 暴露失败登录次数、可疑请求次数、开放端口数量、安全风险分数等模拟安全指标。
6. 通过 Prometheus 静态服务发现和文件型动态服务发现抓取指标。
7. 通过 Prometheus 告警规则识别性能、服务和安全异常。
8. 通过 Alertmanager 展示告警，并预留邮件、Webhook、企业微信或钉钉通知扩展。
9. 通过 Grafana Dashboard 展示主机、容器、服务和安全监控指标。
10. 通过文档研究 Kubernetes 中 Node、Pod、Service、Deployment 等资源的监控方式。

## 非功能需求

- 项目结构清晰，便于课程报告引用。
- 配置文件尽量添加注释，便于答辩解释。
- Docker Compose 版优先保证可运行和可截图。
- 未运行的测试结果不能编造，必须写“待本地运行后填写”。
- 后续每个模块应单独实现，避免一次性大规模重构。

## 第一阶段范围

本阶段只完成目录结构和基础文档，包括 README、AGENTS、课程映射、需求分析和架构说明。Docker Compose、Prometheus、Grafana、Alertmanager、Exporter 和脚本仅创建占位文件，后续逐步补全。

## 验收标准

- 项目目录结构完整。
- README 包含项目名称、简介、课程要求对应关系、技术栈、服务组成、总体流程、运行方式占位和答辩展示目标。
- AGENTS 包含项目目标、课程要求、技术栈、开发规则和测试结果要求。
- docs 中包含课程映射、需求分析和架构说明。
- 所有未实际运行的结果均标注为“待本地运行后填写”。
