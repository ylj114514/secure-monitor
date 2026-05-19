import { useState } from "react";
import { api } from "../api/client";
import CommandButton from "../components/CommandButton";
import RawDataDrawer from "../components/RawDataDrawer";
import StatusBadge from "../components/StatusBadge";

type Result = {
  title: string;
  ok: boolean;
  message: string;
  metric: string;
  alert: string;
  recovery?: string;
  raw?: unknown;
};

export default function SimulationPage() {
  const [result, setResult] = useState<Result | null>(null);

  async function run(config: Omit<Result, "ok" | "message" | "raw">, action: () => Promise<any>) {
    try {
      const raw = await action();
      setResult({
        ...config,
        ok: true,
        message: raw?.message || "模拟操作已发送，等待 Prometheus 下一次抓取后可观察指标变化。",
        raw,
      });
    } catch (error) {
      setResult({
        ...config,
        ok: false,
        message: `请求失败：${String(error)}`,
      });
    }
  }

  return (
    <div className="stack">
      <div className="section-heading">
        <h3>异常模拟演示控制台</h3>
        <p>所有操作仅用于课程演示。服务宕机类操作默认只给出建议命令，不直接停止容器。</p>
      </div>
      <div className="command-grid">
        <CommandButton label="触发 20 次失败登录" description="影响 security_failed_login_total，可能触发 TooManyFailedLogins。" onClick={() => run({ title: "模拟失败登录", metric: "security_failed_login_total", alert: "TooManyFailedLogins", recovery: "等待 5 分钟时间窗口结束，或重启 security_exporter 清空模拟状态。" }, api.simulateFailedLogin)} />
        <CommandButton label="设置风险分数为 90" description="影响 security_risk_score，可能触发 HighSecurityRiskScore。" onClick={() => run({ title: "设置安全风险分数", metric: "security_risk_score", alert: "HighSecurityRiskScore", recovery: "再次调用接口把风险分数设置回较低值，或重启 security_exporter。" }, () => api.simulateRisk(90))} />
        <CommandButton label="模拟容器重启" description="影响 security_container_restart_total，可能触发 ContainerRestartDetected。" onClick={() => run({ title: "模拟容器重启", metric: "security_container_restart_total", alert: "ContainerRestartDetected", recovery: "该指标为模拟 Counter，课程演示中可通过重启 exporter 清空。" }, api.simulateRestart)} />
        <CommandButton label="模拟服务宕机" description="影响 probe_success、up；页面只返回安全建议命令。" onClick={() => run({ title: "模拟服务宕机", metric: "probe_success / up", alert: "ServiceProbeFailed / DemoAppDown", recovery: "执行 docker compose up -d demo-app 恢复服务。" }, api.serviceDown)} />
        <CommandButton label="恢复 demo-app" description="返回 docker compose up -d demo-app 建议命令。" onClick={() => run({ title: "恢复 demo-app", metric: "up / probe_success", alert: "服务恢复后告警会自动恢复", recovery: "确认 demo-app 容器重新 Up。" }, api.serviceRecover)} />
      </div>

      <div className="panel">
        <div className="panel-title-row">
          <h3>执行结果</h3>
          {result && <StatusBadge status={result.ok ? "ok" : "error"} label={result.ok ? "已发送" : "失败"} />}
        </div>
        {result ? (
          <div className="result-card">
            <strong>{result.title}</strong>
            <p>{result.message}</p>
            <div className="detail-grid compact-detail">
              <div><span>影响指标</span><strong>{result.metric}</strong></div>
              <div><span>可能触发告警</span><strong>{result.alert}</strong></div>
              <div><span>恢复方式</span><strong>{result.recovery || "等待指标恢复正常。"}</strong></div>
            </div>
            {result.raw !== undefined && <RawDataDrawer title="查看接口原始返回" data={result.raw} />}
          </div>
        ) : (
          <p className="muted">尚未执行模拟操作。点击上方卡片按钮后，这里会显示指标影响、可能触发的告警和恢复建议。</p>
        )}
      </div>
    </div>
  );
}
