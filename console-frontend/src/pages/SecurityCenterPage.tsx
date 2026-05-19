import { useEffect, useState } from "react";
import { api } from "../api/client";
import ErrorState from "../components/ErrorState";
import RawDataDrawer from "../components/RawDataDrawer";
import StatusBadge from "../components/StatusBadge";
import { riskLevel } from "../utils/formatters";
import { normalizeSecurityMetrics } from "../utils/normalizers";

export default function SecurityCenterPage() {
  const [metrics, setMetrics] = useState<any>({});
  const [error, setError] = useState(false);

  useEffect(() => {
    api.security()
      .then((data) => {
        setMetrics(data);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  if (error) return <ErrorState />;

  const items = normalizeSecurityMetrics(metrics);
  const riskValue = Number(metrics.security_risk_score || 0);
  const risk = riskLevel(riskValue);
  const normalItems = items.filter((item) => item.key !== "security_risk_score");

  return (
    <div className="security-page">
      <section className="security-hero panel">
        <div>
          <h3>安全监控面板</h3>
          <p>
            指标来自自定义 security_exporter，仅用于课程设计模拟和告警演示，不读取真实隐私或敏感数据。
          </p>
        </div>
        <StatusBadge
          status={risk.tone === "good" ? "ok" : risk.tone === "warn" ? "warning" : "critical"}
          label={risk.label}
        />
      </section>

      <section className={`security-risk-overview panel ${risk.tone}`}>
        <div className="security-risk-head">
          <div>
            <span>安全风险分数</span>
            <strong>{riskValue.toFixed(0)}</strong>
          </div>
          <StatusBadge
            status={risk.tone === "good" ? "ok" : risk.tone === "warn" ? "warning" : "critical"}
            label={risk.label}
          />
        </div>
        <div className="security-risk-meter">
          <div style={{ width: `${Math.max(0, Math.min(100, riskValue))}%` }} />
        </div>
        <p>0-30 为低风险，31-70 为中风险，71-100 为高风险。当前分数用于触发 HighSecurityRiskScore 告警演示。</p>
        <code>security_risk_score</code>
      </section>

      <section className="security-metric-list">
        {normalItems.map((item) => (
          <article className={`security-metric-row ${item.tone}`} key={item.key}>
            <div className="security-metric-main">
              <div className="security-metric-title">
                <h3>{item.title}</h3>
                <span>{item.type}</span>
              </div>
              <code>{item.field}</code>
              <p>{item.description}</p>
            </div>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel security-alert-note">
        <h3>安全指标如何用于告警</h3>
        <p>
          Prometheus 会根据 security_alerts.yml 中的规则判断失败登录增长、可疑请求增长、开放端口数量和安全风险分数是否超过阈值。
          满足条件后，告警会发送到 Alertmanager，并在告警中心和右侧通知栏展示。
        </p>
        <RawDataDrawer title="查看原始安全指标数据" data={metrics} />
      </section>
    </div>
  );
}
