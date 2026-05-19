import { useEffect, useState } from "react";
import { api } from "../api/client";
import MetricCard from "../components/MetricCard";

export default function ServiceMonitorPage() {
  const [probe, setProbe] = useState<any>(null);
  const [duration, setDuration] = useState<any>(null);

  useEffect(() => {
    api.query("probe_success").then(setProbe).catch(() => undefined);
    api.query("probe_duration_seconds").then(setDuration).catch(() => undefined);
  }, []);

  const success = probe?.data?.result?.[0]?.value?.[1];
  const seconds = duration?.data?.result?.[0]?.value?.[1];
  return (
    <div className="page-grid">
      <MetricCard title="demo-app 探测" value={success === "1" ? "成功" : "待验证"} tone={success === "1" ? "good" : "warn"} />
      <MetricCard title="探测耗时" value={seconds ? Number(seconds).toFixed(3) : "待验证"} unit="s" />
      <div className="panel wide">
        <h3>服务探测说明</h3>
        <p>blackbox_exporter 从外部访问 demo-app 的 /health，用 probe_success 表示可用性，用 probe_duration_seconds 表示探测耗时。</p>
        <code>probe_success</code>
        <code>probe_duration_seconds</code>
        <code>{'increase(demo_http_requests_total{status=~"5.."}[5m])'}</code>
      </div>
    </div>
  );
}
