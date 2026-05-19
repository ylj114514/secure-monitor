import StatusBadge from "../components/StatusBadge";
import { riskLevel } from "../utils/formatters";

export default function NotificationPanel({
  alerts,
  overview,
}: {
  alerts: any[];
  overview: any;
}) {
  const risk = riskLevel(Number(overview.security_risk_score || 0));

  return (
    <aside className="notification-panel">
      <h3>通知中心</h3>
      <div className="notice-card notice-card-row">
        <span>系统状态</span>
        <StatusBadge status={overview.system_status || "unknown"} label={overview.system_status === "ok" ? "正常" : "未知"} />
      </div>
      <div className="notice-card">
        <div className="notice-card-row">
          <span>安全风险分数</span>
          <strong>{Number(overview.security_risk_score || 0).toFixed(0)}</strong>
        </div>
        <StatusBadge status={risk.tone === "good" ? "ok" : risk.tone === "warn" ? "warning" : "critical"} label={risk.label} />
      </div>
      <h4>最近告警</h4>
      <div className="notice-list">
        {alerts.slice(0, 6).map((alert, index) => (
          <div className="notice-item" key={`${alert.name}-${index}`}>
            <b>{alert.name || "未命名告警"}</b>
            <span>{alert.summary || alert.description || "暂无描述"}</span>
            <StatusBadge status={alert.severity || "unknown"} label={alert.severity === "critical" ? "严重" : alert.severity === "warning" ? "警告" : "信息"} />
          </div>
        ))}
        {!alerts.length && <p className="muted">暂无告警，或后端暂未获取到告警数据。</p>}
      </div>
    </aside>
  );
}
