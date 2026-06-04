# Kubernetes Pod / Service 监控映射说明

本文档说明在 Kubernetes 环境下 Node、Pod、Service、Deployment 等对象如何被 Prometheus 监控。SecureMonitor OS 当前以 Docker Compose 为主实现，Kubernetes 部分用于扩展研究和可选实验，不写成已完成生产级部署。

## Docker Compose 主实现与 Kubernetes 扩展关系

| 部分 | 本项目定位 | 说明 |
|---|---|---|
| Docker Compose | 主实现 | 用于本地运行、项目报告展示、截图和测试 |
| Kubernetes | 扩展研究 / 可选实验 | 用文档和 YAML 示例说明 Pod、Service、Deployment 监控方式 |
| SecureMonitor OS | 统一展示入口 | 集中展示 Docker 主实现中的监控、告警和安全模拟指标 |

## Kubernetes 监控对象映射

| Kubernetes 对象 | 监控内容 | 主要组件 | 典型指标类型 | 项目对应文件 |
|---|---|---|---|---|
| Node | 节点 CPU、内存、磁盘、网络、节点状态 | node_exporter、kube-state-metrics | 节点资源利用率、节点是否 Ready、节点压力状态 | `docs/07_kubernetes_research.md`、`k8s/README.md` |
| Pod | Pod 运行状态、重启次数、容器资源使用、CrashLoopBackOff | kube-state-metrics、cAdvisor、PodMonitor | Pod phase、container restart、CPU/Memory usage | `k8s/demo-app-deployment.yaml`、`k8s/service-monitor.yaml` |
| Service | 服务发现、服务可用性、服务端口、后端 Pod 选择器 | ServiceMonitor、blackbox_exporter | Service endpoints、HTTP probe success、请求耗时 | `k8s/demo-app-service.yaml`、`k8s/service-monitor.yaml` |
| Deployment | 副本数、可用副本、期望副本、滚动更新状态 | kube-state-metrics | desired replicas、available replicas、updated replicas | `k8s/demo-app-deployment.yaml` |
| Namespace | 资源隔离、命名空间下对象数量和状态 | kube-state-metrics | namespace labels、resource count、quota | `docs/07_kubernetes_research.md` |

## 关键组件说明

### Prometheus Operator

Prometheus Operator 把 Prometheus、Alertmanager、ServiceMonitor、PodMonitor 等内容抽象为 Kubernetes 自定义资源，使监控配置可以通过 YAML 声明式管理。

### kube-prometheus-stack

kube-prometheus-stack 是常用 Helm 监控套件，通常包含 Prometheus、Grafana、Alertmanager、node_exporter、kube-state-metrics 等组件，适合快速搭建 Kubernetes 监控环境。

### kube-state-metrics

kube-state-metrics 监听 Kubernetes API Server，将 Node、Pod、Service、Deployment 等资源状态暴露为 Prometheus 指标。它关注资源状态，而 node_exporter 更关注节点系统性能，cAdvisor 更关注容器资源使用。

### ServiceMonitor

ServiceMonitor 用于声明 Prometheus 如何发现和抓取某个 Service 暴露的指标接口。它适合服务实例动态变化的 Kubernetes 场景，相当于比 Docker Compose 中 `file_sd_configs` 更云原生的服务发现方式。

### PodMonitor

PodMonitor 用于直接基于 Pod 标签发现抓取目标，适合没有稳定 Service 或需要直接监控 Pod 指标的场景。

## Kubernetes 安全监控关注点

| 安全监控点 | 说明 | 可用指标来源 |
|---|---|---|
| Pod 异常重启 | 容器频繁重启可能表示服务崩溃、资源不足或异常攻击 | kube-state-metrics、cAdvisor |
| CrashLoopBackOff | Pod 反复启动失败，可能是配置错误或程序崩溃 | kube-state-metrics |
| 节点资源异常 | CPU、内存、磁盘资源长期过高会影响集群稳定性 | node_exporter |
| Service 不可用 | 服务探测失败或后端 Pod 不可用 | ServiceMonitor、blackbox_exporter |
| Deployment 副本异常 | 可用副本数低于期望副本数 | kube-state-metrics |
| 容器资源限制 | 未设置 limits/requests 可能导致资源争抢 | Kubernetes 配置审计、kube-state-metrics |
| 镜像和权限配置 | 高权限容器、特权模式、未知镜像会增加安全风险 | 配置审计、镜像扫描工具 |

## 可选实验流程

1. 安装 kind 或 minikube。
2. 使用 `k8s/kind-config.yaml` 创建本地 Kubernetes 集群。
3. 安装 Helm。
4. 使用 Helm 安装 kube-prometheus-stack。
5. 部署 `k8s/demo-app-deployment.yaml` 和 `k8s/demo-app-service.yaml`。
6. 部署 `k8s/service-monitor.yaml`。
7. 打开 Grafana，查看 Node、Pod、Service、Deployment 指标。
8. 记录截图和测试结果；如未运行，报告中写“待本地运行后填写”。
