export default function ServiceTopology() {
  const nodes = ["Exporters", "Prometheus", "Alertmanager", "Grafana", "SecureMonitor OS"];
  return (
    <div className="topology">
      {nodes.map((node, index) => (
        <div className="topology-node" key={node}>
          <span>{node}</span>
          {index < nodes.length - 1 && <b>→</b>}
        </div>
      ))}
    </div>
  );
}
