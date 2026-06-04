import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import RawDataDrawer from "../components/RawDataDrawer";
import StatusBadge from "../components/StatusBadge";
import { riskLevel } from "../utils/formatters";
import { normalizeSecurityMetrics } from "../utils/normalizers";
import { onGlobalRefresh } from "../utils/refreshEvents";

const alertMap: Record<string, string> = {
  failed_login_total: "TooManyFailedLogins",
  suspicious_request_total: "TooManySuspiciousRequests",
  open_port_count: "HighOpenPortCount",
  container_restart_total: "ContainerRestartDetected",
  high_cpu_process_count: "HighCpuProcessCount",
};

const actionMap: Record<string, string> = {
  failed_login_total: "观察是否存在短时间大量登录失败，演示时可在异常模拟页触发 20 次失败登录。",
  suspicious_request_total: "关注异常访问、扫描或攻击尝试，后续可接入真实 Web 日志分析。",
  open_port_count: "开放端口越多，攻击面越大，真实环境应配合资产清单和防火墙策略核查。",
  container_restart_total: "容器频繁重启可能说明服务崩溃、资源不足或被异常请求影响。",
  high_cpu_process_count: "高 CPU 进程过多时，需要结合主机监控和容器监控进一步定位。",
};

export default function SecurityCenterPage() {
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadSecurity() {
    api
      .security()
      .then((data) => {
        setMetrics(data || {});
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSecurity();
    const removeListener = onGlobalRefresh(loadSecurity);
    const timer = window.setInterval(loadSecurity, 5000);
    return () => {
      removeListener();
      window.clearInterval(timer);
    };
  }, []);

  const items = useMemo(() => normalizeSecurityMetrics(metrics), [metrics]);
  const riskValue = Number(metrics.security_risk_score || 0);
  const risk = riskLevel(riskValue);
  const normalItems = items.filter((item) => item.key !== "security_risk_score");

  if (error) {
    return (
      <ErrorState
        title="安全指标加载失败"
        description="无法连接 console-backend 或 security_exporter，请先确认 Docker Compose 服务已经启动。"
      />
    );
  }

  return (
    <div className="security-page">
      <section className="security-hero panel">
        <div>
          <h3>安全监控面板</h3>
          <p>
            本页面展示自定义 security_exporter 暴露的课程设计模拟安全指标，用于演示安全风险监控和告警触发流程，
            不读取真实隐私或敏感数据。
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
        <div className="security-risk-meter" aria-label="安全风险分数进度条">
          <div style={{ width: `${Math.max(0, Math.min(100, riskValue))}%` }} />
        </div>
        <div className="security-risk-scale">
          <span>0-30 低风险</span>
          <span>31-70 中风险</span>
          <span>71-100 高风险</span>
        </div>
        <p>
          当前分数用于课程演示中的安全风险判断。当分数超过阈值时，Prometheus 会根据告警规则触发
          HighSecurityRiskScore，并交给 Alertmanager 展示。
        </p>
      </section>

      {loading ? (
        <EmptyState title="正在加载安全指标" description="请稍等，系统正在从后端读取 security_exporter 指标。" />
      ) : (
        <section className="security-metric-list" aria-label="安全指标列表">
          {normalItems.map((item) => (
            <article className={`security-metric-row ${item.tone}`} key={item.key}>
              <div className="security-metric-main">
                <div className="security-metric-title">
                  <h3>{item.title}</h3>
                  <span>{item.type}</span>
                </div>
                <p>{item.description}</p>
                <div className="security-metric-meta">
                  <span>可能告警：{alertMap[item.key] || "暂无对应告警"}</span>
                  <span>{actionMap[item.key]}</span>
                </div>
              </div>
              <div className="security-metric-value">
                <span>当前值</span>
                <strong>{item.value}</strong>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="panel security-alert-note">
        <h3>安全指标如何用于告警</h3>
        <p>
          Prometheus 会根据 security_alerts.yml 中的规则判断失败登录增长、可疑请求增长、开放端口数量和安全风险分数是否超过阈值。
          满足条件后，告警会发送到 Alertmanager，并在告警中心和右侧通知栏展示。
        </p>
        <RawDataDrawer title="查看开发者原始安全指标数据" data={metrics} />
      </section>
    </div>
  );
}
