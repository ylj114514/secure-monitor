import { useEffect, useState } from "react";
import { api } from "../api/client";
import AlertTable from "../components/AlertTable";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ServiceTopology from "../components/ServiceTopology";
import StatusBadge from "../components/StatusBadge";
import { riskLevel } from "../utils/formatters";
import { normalizeAlerts } from "../utils/normalizers";
import { onGlobalRefresh } from "../utils/refreshEvents";

export default function OverviewPage() {
  const [overview, setOverview] = useState<any>({});
  const [security, setSecurity] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [error, setError] = useState(false);

  async function loadOverview() {
    Promise.all([api.overview(), api.security(), api.alerts()])
      .then(([overviewData, securityData, alertData]) => {
        setOverview(overviewData);
        setSecurity(securityData);
        setAlerts(normalizeAlerts(alertData.alerts || []));
        setError(false);
      })
      .catch(() => setError(true));
  }

  useEffect(() => {
    loadOverview();
    const removeListener = onGlobalRefresh(loadOverview);
    const timer = window.setInterval(loadOverview, 5000);
    return () => {
      removeListener();
      window.clearInterval(timer);
    };
  }, []);

  if (error) return <ErrorState />;

  const securityRisk = riskLevel(Number(overview.security_risk_score || 0));
  const comprehensiveRisk = overview.comprehensive_risk || {};
  const comprehensiveTone =
    comprehensiveRisk.status === "critical" ? "bad" : comprehensiveRisk.status === "warning" ? "warn" : "good";
  const allTargetsUp = Boolean(overview.targets_total) && overview.targets_up === overview.targets_total;
  const activeAlerts = overview.active_alerts || alerts.length || 0;
  const cpu = Number(overview.cpu_usage || 0);
  const memory = Number(overview.memory_usage || 0);
  const disk = Number(overview.disk_usage || 0);
  const source = overview.host_metric_source === "windows-host-exporter" ? "Windows 宿主机原生指标" : "node_exporter 指标";

  return (
    <div className="overview-page clean-overview">
      <section className="overview-hero">
        <div>
          <h2>SecureMonitor OS</h2>
          <p>统一展示监控采集、服务可用性、告警状态和模拟安全风险，适合课程项目报告展示演示和截图。</p>
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
        <div className={`kpi-card ${comprehensiveTone}`}>
          <span>综合风险</span>
          <strong>{Number(comprehensiveRisk.score ?? 0).toFixed(0)}</strong>
          <small>{comprehensiveRisk.label || "低风险"}</small>
        </div>
        <div className="kpi-card good">
          <span>服务可用性</span>
          <strong>{allTargetsUp ? "正常" : "关注"}</strong>
          <small>基于 Prometheus Targets 判断</small>
        </div>
      </section>

      <section className={`panel comprehensive-risk-panel ${comprehensiveTone}`}>
        <div className="panel-title-row">
          <h3>综合风险评分</h3>
          <StatusBadge
            status={comprehensiveRisk.status || "ok"}
            label={comprehensiveRisk.label || "低风险"}
          />
        </div>
        <p className="muted-text">
          综合风险由 CPU、内存、磁盘、异常 Targets、活跃告警、失败登录次数和 security_exporter 风险分数共同计算。
        </p>
        <div className="risk-reason-list">
          {(comprehensiveRisk.reasons || ["核心组件、采集目标和模拟安全指标均处于较稳定状态。"]).map((reason: string) => (
            <span key={reason}>{reason}</span>
          ))}
        </div>
      </section>

      <section className="overview-two-column">
        <div className="panel compact-panel">
          <div className="panel-title-row">
            <h3>资源摘要</h3>
            <span className="muted">{source}</span>
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
            <StatusBadge status={securityRisk.tone === "good" ? "ok" : securityRisk.tone === "warn" ? "warning" : "critical"} label={securityRisk.label} />
          </div>
          <div className="security-summary-list">
            <SummaryRow label="失败登录" value={security.failed_login_total || 0} note="短时间增长过快可能表示暴力破解。" />
            <SummaryRow label="可疑请求" value={security.suspicious_request_total || 0} note="可能表示扫描或异常访问。" />
            <SummaryRow label="开放端口" value={security.open_port_count || 0} note="端口过多会扩大攻击面。" />
            <SummaryRow label="容器重启" value={security.container_restart_total || 0} note="频繁重启可能表示服务异常。" />
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
