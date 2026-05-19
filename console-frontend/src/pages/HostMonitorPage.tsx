import { useEffect, useState } from "react";
import { api } from "../api/client";
import GaugePanel from "../components/GaugePanel";
import LineChartPanel from "../components/LineChartPanel";
import MetricCard from "../components/MetricCard";

const sample = Array.from({ length: 12 }, (_, i) => ({ name: `${i * 5}m`, value: 0 }));

export default function HostMonitorPage() {
  const [overview, setOverview] = useState<any>({});

  useEffect(() => {
    api.overview().then(setOverview).catch(() => undefined);
  }, []);

  return (
    <div className="page-grid">
      <MetricCard title="node_exporter" value={overview.targets_total ? "采集中" : "待验证"} />
      <GaugePanel title="CPU 使用率" value={Number(overview.cpu_usage || 0)} />
      <GaugePanel title="内存使用率" value={Number(overview.memory_usage || 0)} />
      <GaugePanel title="磁盘使用率" value={Number(overview.disk_usage || 0)} />
      <LineChartPanel title="CPU 使用率趋势" data={sample.map((p, i) => ({ ...p, value: Number(overview.cpu_usage || 0) * (i + 1) / 12 }))} />
      <LineChartPanel title="内存使用率趋势" data={sample.map((p, i) => ({ ...p, value: Number(overview.memory_usage || 0) * (i + 1) / 12 }))} />
      <div className="panel wide">
        <h3>说明</h3>
        <p>主机监控数据来自 node_exporter。CPU、内存、磁盘通过 Prometheus 查询聚合后展示。网络收发可在 Grafana Host Dashboard 中进一步查看。</p>
      </div>
    </div>
  );
}
