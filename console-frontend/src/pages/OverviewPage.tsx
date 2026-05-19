import { useEffect, useState } from "react";
import { api } from "../api/client";
import AlertTable from "../components/AlertTable";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ServiceTopology from "../components/ServiceTopology";
import StatusBadge from "../components/StatusBadge";
import { riskLevel } from "../utils/formatters";
import { normalizeAlerts } from "../utils/normalizers";

export default function OverviewPage() {
  const [overview, setOverview] = useState<any>({});
  const [security, setSecurity] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([api.overview(), api.security(), api.alerts()])
      .then(([overviewData, securityData, alertData]) => {
        setOverview(overviewData);
        setSecurity(securityData);
        setAlerts(normalizeAlerts(alertData.alerts || []));
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  if (error) return <ErrorState />;

  const risk = riskLevel(Number(overview.security_risk_score || 0));
  const allTargetsUp = Boolean(overview.targets_total) && overview.targets_up === overview.targets_total;
  const activeAlerts = overview.active_alerts || alerts.length || 0;
  const cpu = Number(overview.cpu_usage || 0);
  const memory = Number(overview.memory_usage || 0);
  const disk = Number(overview.disk_usage || 0);

  return (
    <div className="overview-page clean-overview">
      <section className="overview-hero">
        <div>
          <h2>SecureMonitor OS</h2>
          <p>统一展示监控采集、服务可用性、告警状态和模拟安全风险。</p>
        </div>
        <div className="hero-status">
          <StatusBadge ok={overview.prometheus_up} label="Prometheus" />
          <StatusBadge ok={overview.grafana_up} label="Grafana" />
          <StatusBadge ok={overview.alertmanager_up} label="Alertmanager" />
        </div>
      </section>

      <section className="overview-kpi-grid">
        <div className="kpi-card">
          <span>Targets 在线</span>
          <strong>{overview.targets_up || 0}/{overview.targets_total || 0}</strong>
          <small>{allTargetsUp ? "采集目标全部正常" : "存在采集异常"}</small>
        </div>
        <div className={activeAlerts ? "kpi-card warn" : "kpi-card good"}>
          <span>活跃告警</span>
          <strong>{activeAlerts}</strong>
          <small>{activeAlerts ? "需要关注告警中心" : "暂无活跃告警"}</small>
        </div>
        <div className={`kpi-card ${risk.tone}`}>
          <span>安全风险</span>
          <strong>{Number(overview.security_risk_score || 0).toFixed(0)}</strong>
          <small>{risk.label}</small>
        </div>
        <div className="kpi-card good">
          <span>服务可用性</span>
          <strong>{allTargetsUp ? "正常" : "关注"}</strong>
          <small>基于 Prometheus Targets 判断</small>
        </div>
      </section>

      <section className="overview-two-column">
        <div className="panel compact-panel">
          <div className="panel-title-row">
            <h3>资源摘要</h3>
            <span className="muted">主机性能</span>
          </div>
          <div className="resource-list">
            <ResourceBar label="CPU 使用率" value={cpu} />
            <ResourceBar label="内存使用率" value={memory} />
            <ResourceBar label="磁盘使用率" value={disk} />
          </div>
        </div>

        <div className="panel compact-panel">
          <div className="panel-title-row">
            <h3>安全摘要</h3>
            <StatusBadge status={risk.tone === "good" ? "ok" : risk.tone === "warn" ? "warning" : "critical"} label={risk.label} />
          </div>
          <div className="security-summary-list">
            <SummaryRow label="失败登录" value={security.failed_login_total || 0} note="security_failed_login_total" />
            <SummaryRow label="可疑请求" value={security.suspicious_request_total || 0} note="security_suspicious_request_total" />
            <SummaryRow label="开放端口" value={security.open_port_count || 0} note="security_open_port_count" />
            <SummaryRow label="容器重启" value={security.container_restart_total || 0} note="security_container_restart_total" />
          </div>
        </div>
      </section>

      <div className="panel compact-panel">
        <h3>服务拓扑</h3>
        <ServiceTopology />
      </div>

      <div className="panel compact-panel">
        <h3>最近告警</h3>
        {alerts.length ? (
          <AlertTable alerts={alerts.slice(0, 5)} compact />
        ) : (
          <EmptyState title="暂无告警" description="当前没有需要展示的 Prometheus 或 Alertmanager 告警。" />
        )}
      </div>
    </div>
  );
}

function ResourceBar({ label, value }: { label: string; value: number }) {
  const bounded = Math.max(0, Math.min(100, value));
  const tone = bounded > 85 ? "bad" : bounded > 70 ? "warn" : "good";
  return (
    <div className="resource-row">
      <div className="resource-row-head">
        <span>{label}</span>
        <strong>{bounded.toFixed(1)}%</strong>
      </div>
      <div className="thin-meter">
        <div className={`thin-meter-fill ${tone}`} style={{ width: `${bounded}%` }} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <div className="summary-row">
      <div>
        <span>{label}</span>
        <small>{note}</small>
      </div>
      <strong>{value}</strong>
    </div>
  );
}
