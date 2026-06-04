import { useEffect, useState } from "react";
import { api } from "../api/client";
import GaugePanel from "../components/GaugePanel";
import LineChartPanel from "../components/LineChartPanel";
import MetricCard from "../components/MetricCard";
import { onGlobalRefresh } from "../utils/refreshEvents";

const sample = Array.from({ length: 12 }, (_, i) => ({ name: `${i * 5}m`, value: 0 }));

export default function HostMonitorPage() {
  const [overview, setOverview] = useState<any>({});

  async function loadHostOverview() {
    api.overview().then(setOverview).catch(() => undefined);
  }

  useEffect(() => {
    loadHostOverview();
    const removeListener = onGlobalRefresh(loadHostOverview);
    const timer = window.setInterval(loadHostOverview, 5000);
    return () => {
      removeListener();
      window.clearInterval(timer);
    };
  }, []);

  const cpu = Number(overview.cpu_usage || 0);
  const memory = Number(overview.memory_usage || 0);
  const disk = Number(overview.disk_usage || 0);
  const source =
    overview.host_metric_source === "windows-host-exporter"
      ? "Windows 宿主机原生指标"
      : "node_exporter / Docker Desktop WSL2 指标";

  return (
    <div className="page-grid">
      <MetricCard title="指标来源" value={source} />
      <GaugePanel title="CPU 使用率" value={cpu} />
      <GaugePanel title="内存使用率" value={memory} />
      <GaugePanel title="磁盘使用率" value={disk} />
      <LineChartPanel title="CPU 使用率趋势" data={sample.map((p, i) => ({ ...p, value: (cpu * (i + 1)) / 12 }))} />
      <LineChartPanel title="内存使用率趋势" data={sample.map((p, i) => ({ ...p, value: (memory * (i + 1)) / 12 }))} />
      <div className="panel wide">
        <h3>主机监控说明</h3>
        <p>
          当前指标来源：{source}。在 Windows 课程演示环境中，系统优先读取 Windows 本机 CPU、内存和磁盘；
          如果本机辅助采集器未启动，才会回退到 Docker Desktop / WSL2 中的 node_exporter 指标。
        </p>
        <p>
          这能避免把 Docker 虚拟机内部资源误认为整台 Windows 主机资源。Grafana 主机监控大屏仍展示 Prometheus
          采集到的 node_exporter 趋势，适合说明 Docker/WSL2 环境下的监控差异。
        </p>
      </div>
    </div>
  );
}
