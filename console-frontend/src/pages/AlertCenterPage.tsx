import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import AlertTable from "../components/AlertTable";
import ErrorState from "../components/ErrorState";
import MetricCard from "../components/MetricCard";
import { normalizeAlerts } from "../utils/normalizers";
import { onGlobalRefresh } from "../utils/refreshEvents";

export default function AlertCenterPage() {
  const [data, setData] = useState<any>({ alerts: [] });
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(false);

  async function loadAlerts() {
    api
      .alerts()
      .then((next) => {
        setData({ ...next, alerts: normalizeAlerts(next.alerts || []) });
        setError(false);
      })
      .catch(() => setError(true));
  }

  useEffect(() => {
    loadAlerts();
    const removeListener = onGlobalRefresh(loadAlerts);
    const timer = window.setInterval(loadAlerts, 5000);
    return () => {
      removeListener();
      window.clearInterval(timer);
    };
  }, []);

  const alerts = data.alerts || [];
  const visible = useMemo(() => {
    if (filter === "all") return alerts;
    if (filter === "resolved") return alerts.filter((alert: any) => alert.state === "resolved");
    return alerts.filter((alert: any) => alert.severity === filter);
  }, [alerts, filter]);

  if (error) return <ErrorState title="告警数据加载失败" description="请确认 Prometheus 和 Alertmanager 已经启动。" />;

  const critical = alerts.filter((alert: any) => alert.severity === "critical").length;
  const warning = alerts.filter((alert: any) => alert.severity === "warning").length;
  const resolved = alerts.filter((alert: any) => alert.state === "resolved").length;

  return (
    <div className="stack">
      <div className="page-grid compact">
        <MetricCard title="活跃告警总数" value={data.active_count || alerts.length} tone={alerts.length ? "warn" : "good"} />
        <MetricCard title="严重告警" value={data.critical_count || critical} tone="bad" />
        <MetricCard title="警告告警" value={data.warning_count || warning} tone="warn" />
        <MetricCard title="已恢复告警" value={resolved} tone="good" />
      </div>
      <div className="toolbar enhanced-toolbar">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>全部</button>
        <button className={filter === "critical" ? "active" : ""} onClick={() => setFilter("critical")}>严重</button>
        <button className={filter === "warning" ? "active" : ""} onClick={() => setFilter("warning")}>警告</button>
        <button className={filter === "resolved" ? "active" : ""} onClick={() => setFilter("resolved")}>已恢复</button>
      </div>
      <AlertTable alerts={visible} />
    </div>
  );
}
