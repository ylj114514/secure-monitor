# Kubernetes 扩展实验

Docker Compose 版是 SecureMonitor 的主实现，Kubernetes 版用于满足课程中的扩展研究要求，说明 Prometheus 在 Kubernetes 集群中的部署、服务发现和资源指标监控方式。

## 前置条件

- 已安装 Docker。
- 已安装 kind 或 minikube。
- 已安装 kubectl。
- 已安装 Helm。
- 本机资源足够运行 Kubernetes 和 kube-prometheus-stack。

如果本机资源不足，可以只完成 Docker Compose 版主实现，并在报告中说明 Kubernetes 部分为研究与可选实验。

## 创建 kind 集群

```bash
kind create cluster --name secure-monitor --config k8s/kind-config.yaml
```

## 安装 kube-prometheus-stack

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack
```

## 部署 demo-app

如果使用 kind，需要先构建并导入镜像：

```bash
docker build -t demo-app:latest ./demo-app
kind load docker-image demo-app:latest --name secure-monitor
```

部署 Deployment 和 Service：

```bash
kubectl apply -f k8s/demo-app-deployment.yaml
kubectl apply -f k8s/demo-app-service.yaml
```

## 部署 ServiceMonitor

```bash
kubectl apply -f k8s/service-monitor.yaml
```

## 访问 Grafana

```bash
kubectl port-forward svc/kube-prometheus-stack-grafana 3000:80
```

访问：

```text
http://localhost:3000
```

默认账号密码以 Helm chart 实际输出为准，结果待本地运行后填写。

## 查看指标

可在 Grafana 或 Prometheus 中查看 Node、Pod、Service、Deployment 等资源指标。实际运行结果待本地运行后填写。
