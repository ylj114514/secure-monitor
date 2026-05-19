import { useEffect, useState } from "react";
import { api } from "../api/client";
import MetricCard from "../components/MetricCard";

export default function ContainerMonitorPage() {
  const [cadvisor, setCadvisor] = useState<any>(null);

  useEffect(() => {
    api.query('up{job="cadvisor"}').then(setCadvisor).catch(() => undefined);
  }, []);

  const cadvisorValue = cadvisor?.data?.result?.[0]?.value?.[1];
  const up = String(cadvisorValue || "") === "1";
  return (
    <div className="page-grid">
      <MetricCard title="cAdvisor 状态" value={up ? "UP" : "待验证"} tone={up ? "good" : "warn"} />
      <div className="panel wide">
        <h3>容器监控能力</h3>
        <p>容器 CPU、内存、网络 IO 和资源占用排行来自 cAdvisor。当前控制台提供状态入口，详细趋势可以在 Grafana Container Dashboard 中展示。</p>
        <code>{'rate(container_cpu_usage_seconds_total{name!=""}[2m]) * 100'}</code>
        <code>{'container_memory_usage_bytes{name!=""}'}</code>
        <code>{'rate(container_network_receive_bytes_total{name!=""}[2m])'}</code>
      </div>
    </div>
  );
}
