import InfoCard from "../components/InfoCard";

const resources = [
  {
    name: "Deployment",
    role: "负责管理应用副本、滚动更新和故障恢复，是 Kubernetes 中部署业务服务的常用资源。",
    fields: [
      ["资源名称", "securemonitor-demo-app"],
      ["副本数量", "1"],
      ["容器镜像", "demo-app 示例镜像"],
      ["标签", "app=demo-app"],
      ["服务端口", "5000"],
    ],
  },
  {
    name: "Service",
    role: "为 Pod 提供稳定访问入口，即使后端 Pod 重建，访问地址也可以保持不变。",
    fields: [
      ["资源名称", "demo-app"],
      ["服务类型", "ClusterIP"],
      ["选择器", "app=demo-app"],
      ["服务端口", "5000"],
      ["目标端口", "5000"],
    ],
  },
  {
    name: "ServiceMonitor",
    role: "配合 Prometheus Operator 使用，用声明式方式告诉 Prometheus 如何发现并抓取服务指标。",
    fields: [
      ["匹配对象", "带有 app=demo-app 标签的 Service"],
      ["抓取路径", "/metrics"],
      ["抓取周期", "15s"],
      ["端口名称", "http"],
      ["适用场景", "服务数量动态变化的 Kubernetes 集群"],
    ],
  },
  {
    name: "PodMonitor",
    role: "直接基于 Pod 标签发现监控目标，适合没有稳定 Service 或需要直接监控 Pod 的场景。",
    fields: [
      ["发现方式", "通过 Pod 标签匹配"],
      ["抓取对象", "Pod 暴露的指标接口"],
      ["常见用途", "调试应用、监控特殊 Pod"],
      ["与 ServiceMonitor 区别", "ServiceMonitor 面向 Service，PodMonitor 面向 Pod"],
    ],
  },
];

const components = [
  {
    title: "Prometheus Operator",
    description: "把 Prometheus、Alertmanager 和监控抓取规则抽象成 Kubernetes 资源，降低集群监控配置复杂度。",
  },
  {
    title: "kube-prometheus-stack",
    description: "Helm 社区常用监控套件，通常包含 Prometheus、Grafana、Alertmanager、node_exporter 和 kube-state-metrics。",
  },
  {
    title: "kube-state-metrics",
    description: "读取 Kubernetes API Server，把 Node、Pod、Service、Deployment 等资源状态转换成 Prometheus 指标。",
  },
  {
    title: "Kubernetes 安全监控",
    description: "重点关注 Pod 异常重启、CrashLoopBackOff、节点资源异常、Deployment 副本不足、镜像权限和资源限制等问题。",
  },
];

export default function KubernetesResearchPage() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <h2>Kubernetes 监控研究</h2>
          <p>
            本项目以 Docker Compose 作为主实现，Kubernetes 部分用于课程扩展研究，说明在集群环境下如何监控
            Node、Pod、Service、Deployment 和 Namespace 等资源。
          </p>
        </div>
      </section>

      <section className="section-panel">
        <div className="section-heading">
          <h3>核心组件说明</h3>
          <span>扩展研究</span>
        </div>
        <div className="info-grid">
          {components.map((item) => (
            <InfoCard key={item.title} title={item.title} description={item.description} />
          ))}
        </div>
      </section>

      <section className="section-panel">
        <div className="section-heading">
          <h3>Kubernetes 资源说明</h3>
          <span>面向项目流程说明</span>
        </div>
        <div className="resource-list">
          {resources.map((resource) => (
            <article className="resource-card" key={resource.name}>
              <div>
                <h4>{resource.name}</h4>
                <p>{resource.role}</p>
              </div>
              <div className="kv-list">
                {resource.fields.map(([label, value]) => (
                  <div className="kv-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-panel">
        <h3>与 Docker Compose 版本的关系</h3>
        <p className="muted-text">
          Docker Compose 版本使用 static_configs 和 file_sd_configs 发现目标；Kubernetes 版本更适合使用
          ServiceMonitor 和 PodMonitor，由 Prometheus Operator 根据资源标签自动维护抓取目标。
        </p>
        <div className="flow-strip">
          <div><strong>Deployment</strong><span>管理业务副本</span></div>
          <div><strong>Service</strong><span>提供稳定访问入口</span></div>
          <div><strong>ServiceMonitor</strong><span>声明监控抓取规则</span></div>
          <div><strong>Prometheus</strong><span>自动发现并采集指标</span></div>
          <div><strong>Grafana / Alertmanager</strong><span>展示趋势并处理告警</span></div>
        </div>
        <div className="explain-grid">
          <div>
            <span>研究结论</span>
            <p>Kubernetes 部分用于说明扩展方案，Docker Compose 仍是当前项目可运行的主实现。</p>
          </div>
          <div>
            <span>展示重点</span>
            <p>项目报告展示时说明资源对象之间的关系，而不是直接展示配置文件正文。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
