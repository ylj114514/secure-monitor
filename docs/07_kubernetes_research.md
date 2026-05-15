# 07 Kubernetes 监控研究

## 定位说明

Docker Compose 版是本项目主实现，负责本地运行、演示和截图。Kubernetes 版作为扩展研究和可选实验，用于说明 Prometheus 在 Kubernetes 集群中的部署方式和监控思路。

## Kubernetes 监控对象

- Node：集群节点，关注 CPU、内存、磁盘、网络、节点状态。
- Pod：最小调度单元，关注运行状态、重启次数、资源使用和 CrashLoopBackOff。
- Service：服务访问入口，关注可用性、端口、后端 Pod。
- Deployment：应用副本控制器，关注期望副本数、可用副本数、滚动更新状态。
- Namespace：资源隔离边界，关注不同命名空间下的资源和告警。

## Kubernetes 监控组件

- Prometheus Operator：用 CRD 管理 Prometheus、Alertmanager、ServiceMonitor、PodMonitor。
- kube-prometheus-stack：Helm chart，集成 Prometheus、Grafana、Alertmanager、kube-state-metrics、node_exporter 等。
- kube-state-metrics：监听 Kubernetes API Server，暴露资源状态指标。
- node_exporter：采集节点操作系统层面的 CPU、内存、磁盘、网络指标。
- Alertmanager：处理 Prometheus 告警。
- Grafana：展示 Kubernetes 和应用指标。

## kube-state-metrics 的作用

kube-state-metrics 监听 Kubernetes API Server，将 Pod、Service、Deployment、Node 等资源对象的状态转换为 Prometheus 指标。它与 node_exporter 和 cAdvisor 的区别：

- kube-state-metrics：关注 Kubernetes 对象状态，例如副本数、Pod 状态、Deployment 状态。
- node_exporter：关注节点操作系统资源。
- cAdvisor：关注容器资源使用情况。

## ServiceMonitor 和 PodMonitor

ServiceMonitor 和 PodMonitor 是 Prometheus Operator 提供的声明式抓取配置：

- ServiceMonitor：通过 Service 发现后端应用指标。
- PodMonitor：直接通过 Pod 发现应用指标。
- 适合 Kubernetes 中服务动态变化的场景。

Docker Compose 中的 `file_sd_configs` 通过文件维护目标；Kubernetes 中 ServiceMonitor/PodMonitor 通过 Kubernetes API 和标签选择器发现目标，更适合云原生环境。

## Kubernetes 安全监控内容

- Pod 异常重启。
- Pod CrashLoopBackOff。
- 节点资源异常。
- Service 不可用。
- Deployment 副本数异常。
- 容器资源限制缺失或过大。
- 镜像安全和权限配置。
- 高权限容器、宿主机路径挂载、特权模式等风险。

## 可选实验流程

1. 安装 kind 或 minikube。
2. 创建本地 Kubernetes 集群。
3. 安装 Helm。
4. 使用 Helm 安装 kube-prometheus-stack。
5. 构建并部署 demo-app。
6. 配置 ServiceMonitor。
7. 查看 Grafana Dashboard。
8. 查看 Pod、Service、Node、Deployment 指标。

实际运行结果待本地运行后填写。Kubernetes 部分不作为 Docker Compose 主实现的运行前提。
