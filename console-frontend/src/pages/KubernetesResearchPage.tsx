import InfoCard from "../components/InfoCard";
import RawDataDrawer from "../components/RawDataDrawer";

const yamlSnippets = {
  deployment: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: demo-app
  template:
    metadata:
      labels:
        app: demo-app
    spec:
      containers:
        - name: demo-app
          image: demo-app:latest
          ports:
            - containerPort: 5000`,
  service: `apiVersion: v1
kind: Service
metadata:
  name: demo-app
spec:
  type: ClusterIP
  selector:
    app: demo-app
  ports:
    - name: http
      port: 5000
      targetPort: 5000`,
  serviceMonitor: `apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: demo-app
spec:
  selector:
    matchLabels:
      app: demo-app
  endpoints:
    - port: http
      path: /metrics
      interval: 15s`,
};

export default function KubernetesResearchPage() {
  return (
    <div className="stack">
      <div className="panel">
        <h3>Kubernetes 监控研究</h3>
        <p>Docker Compose 版是本项目主实现；Kubernetes 版用于满足课程中的容器编排环境监控研究要求，说明 Prometheus Operator、kube-prometheus-stack、kube-state-metrics、ServiceMonitor 和 PodMonitor 的作用。</p>
      </div>

      <div className="page-grid">
        <InfoCard title="Prometheus Operator" description="通过 Kubernetes CRD 管理 Prometheus、Alertmanager、ServiceMonitor 和 PodMonitor，让监控目标可以声明式配置。" />
        <InfoCard title="kube-prometheus-stack" description="常用 Helm 监控套件，集成 Prometheus、Grafana、Alertmanager、kube-state-metrics 和 node_exporter。" />
        <InfoCard title="kube-state-metrics" description="监听 Kubernetes API Server，暴露 Pod、Service、Deployment、Node 等资源状态指标。" />
        <InfoCard title="ServiceMonitor / PodMonitor" description="用于告诉 Prometheus Operator 如何发现并抓取服务或 Pod 的指标。" />
      </div>

      <div className="resource-grid">
        <div className="resource-card">
          <h3>Deployment</h3>
          <p>作用：管理 Pod 副本和应用发布，确保 demo-app 按期望副本数运行。</p>
          <dl>
            <div><dt>name</dt><dd>demo-app</dd></div>
            <div><dt>replicas</dt><dd>2</dd></div>
            <div><dt>image</dt><dd>demo-app:latest</dd></div>
            <div><dt>labels</dt><dd>app=demo-app</dd></div>
            <div><dt>ports</dt><dd>5000</dd></div>
          </dl>
          <RawDataDrawer title="查看原始 YAML" data={yamlSnippets.deployment} language="yaml" />
        </div>
        <div className="resource-card">
          <h3>Service</h3>
          <p>作用：为 Pod 提供稳定访问入口，让 Prometheus 或其他服务通过固定名称访问 demo-app。</p>
          <dl>
            <div><dt>name</dt><dd>demo-app</dd></div>
            <div><dt>type</dt><dd>ClusterIP</dd></div>
            <div><dt>selector</dt><dd>app=demo-app</dd></div>
            <div><dt>ports</dt><dd>5000 -&gt; 5000</dd></div>
          </dl>
          <RawDataDrawer title="查看原始 YAML" data={yamlSnippets.service} language="yaml" />
        </div>
        <div className="resource-card">
          <h3>ServiceMonitor</h3>
          <p>作用：告诉 Prometheus Operator 如何发现 demo-app Service 并抓取 /metrics。</p>
          <dl>
            <div><dt>selector</dt><dd>app=demo-app</dd></div>
            <div><dt>endpoints</dt><dd>port=http</dd></div>
            <div><dt>interval</dt><dd>15s</dd></div>
            <div><dt>path</dt><dd>/metrics</dd></div>
          </dl>
          <RawDataDrawer title="查看原始 YAML" data={yamlSnippets.serviceMonitor} language="yaml" />
        </div>
        <div className="resource-card">
          <h3>PodMonitor</h3>
          <p>作用：直接基于 Pod 标签发现监控目标，适合没有稳定 Service 或需要直接监控 Pod 指标的场景。</p>
          <dl>
            <div><dt>selector</dt><dd>matchLabels</dd></div>
            <div><dt>podMetricsEndpoints</dt><dd>声明 Pod 指标端口和路径</dd></div>
            <div><dt>适用场景</dt><dd>Pod 级别指标采集</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
