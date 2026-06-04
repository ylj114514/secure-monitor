import { useState } from "react";
import { api } from "../api/client";
import CommandButton from "../components/CommandButton";
import RawDataDrawer from "../components/RawDataDrawer";
import StatusBadge from "../components/StatusBadge";
import { emitGlobalRefresh } from "../utils/refreshEvents";

type Result = {
  title: string;
  ok: boolean;
  message: string;
  metric: string;
  alert: string;
  recovery?: string;
  raw?: unknown;
};

type ActionConfig = Omit<Result, "ok" | "message" | "raw"> & {
  successMessage?: string;
};

const scrapeHint = "Prometheus 默认每 15 秒抓取一次，告警和 Grafana 曲线可能需要等待下一轮抓取后更新。";

export default function SimulationPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [running, setRunning] = useState("");

  async function run(config: ActionConfig, action: () => Promise<any>) {
    setRunning(config.title);
    try {
      const raw = await action();
      setResult({
        ...config,
        ok: true,
        message: raw?.message || config.successMessage || `操作已完成。${scrapeHint}`,
        raw,
      });
      emitGlobalRefresh();
      emitGlobalRefresh(3000);
      emitGlobalRefresh(16000);
    } catch (error) {
      setResult({
        ...config,
        ok: false,
        message: `请求失败：${String(error)}`,
      });
    } finally {
      setRunning("");
    }
  }

  return (
    <div className="stack simulation-page">
      <div className="section-heading">
        <h3>异常模拟演示控制台</h3>
        <p>
          这里的按钮只用于课程演示。安全指标会直接改变 security_exporter 的模拟值，主界面和安全中心会自动刷新；
          Prometheus 告警和 Grafana 曲线需要等待下一次指标抓取。
        </p>
      </div>

      <div className="command-grid">
        <CommandButton
          label="模拟 20 次失败登录"
          description="用于演示暴力破解或异常登录尝试，可能触发 TooManyFailedLogins。"
          onClick={() =>
            run(
              {
                title: "模拟失败登录",
                metric: "失败登录次数",
                alert: "TooManyFailedLogins",
                recovery: "点击“恢复安全指标初始状态”，或等待 5 分钟时间窗口结束。",
              },
              () => api.simulateFailedLogin(20),
            )
          }
        />
        <CommandButton
          label="模拟 25 次可疑请求"
          description="用于演示扫描、异常访问或攻击尝试，可能触发 TooManySuspiciousRequests。"
          onClick={() =>
            run(
              {
                title: "模拟可疑请求",
                metric: "可疑请求次数",
                alert: "TooManySuspiciousRequests",
                recovery: "点击“恢复安全指标初始状态”，或等待告警时间窗口结束。",
              },
              () => api.simulateSuspiciousRequest(25),
            )
          }
        />
        <CommandButton
          label="设置风险分数为 90"
          description="用于演示高风险安全状态，可能触发 HighSecurityRiskScore。"
          onClick={() =>
            run(
              {
                title: "设置安全风险分数",
                metric: "安全风险分数",
                alert: "HighSecurityRiskScore",
                recovery: "点击“恢复安全指标初始状态”，风险分数会回到 20。",
              },
              () => api.simulateRisk(90),
            )
          }
        />
        <CommandButton
          label="设置开放端口为 12"
          description="用于演示攻击面变大，可能触发 HighOpenPortCount。"
          onClick={() =>
            run(
              {
                title: "模拟开放端口过多",
                metric: "开放端口数量",
                alert: "HighOpenPortCount",
                recovery: "点击“恢复安全指标初始状态”，开放端口数量会回到 5。",
              },
              () => api.simulateOpenPorts(12),
            )
          }
        />
        <CommandButton
          label="模拟 3 个高 CPU 进程"
          description="用于演示异常资源消耗风险，安全中心会同步显示变化。"
          onClick={() =>
            run(
              {
                title: "模拟高 CPU 进程",
                metric: "高 CPU 进程数量",
                alert: "可作为安全风险辅助指标",
                recovery: "点击“恢复安全指标初始状态”，高 CPU 进程数量会回到 0。",
              },
              () => api.simulateHighCpuProcesses(3),
            )
          }
        />
        <CommandButton
          label="模拟容器重启"
          description="用于演示容器异常事件，可能触发 ContainerRestartDetected。"
          onClick={() =>
            run(
              {
                title: "模拟容器重启",
                metric: "容器重启次数",
                alert: "ContainerRestartDetected",
                recovery: "点击“恢复安全指标初始状态”，容器重启次数会回到 0。",
              },
              () => api.simulateRestart(1),
            )
          }
        />
        <CommandButton
          label="恢复安全指标初始状态"
          description="把失败登录、可疑请求、风险分数、开放端口和容器重启恢复为演示初始值。"
          onClick={() =>
            run(
              {
                title: "恢复安全指标",
                metric: "全部安全模拟指标",
                alert: "相关安全告警会在 Prometheus 下一轮评估后恢复",
                recovery: "已经执行恢复操作；如告警仍显示，等待下一轮抓取和评估即可。",
              },
              api.resetSecurity,
            )
          }
        />
        <CommandButton
          label="生成服务宕机演示命令"
          description="出于安全边界，控制台只给出 stop 命令，不直接停止容器。"
          onClick={() =>
            run(
              {
                title: "服务宕机演示",
                metric: "服务可用性",
                alert: "ServiceProbeFailed / DemoAppDown",
                recovery: "执行恢复命令：docker compose up -d demo-app。",
              },
              api.serviceDown,
            )
          }
        />
        <CommandButton
          label="生成 demo-app 恢复命令"
          description="用于服务宕机演示后的恢复说明，不删除容器或镜像。"
          onClick={() =>
            run(
              {
                title: "恢复 demo-app",
                metric: "服务可用性",
                alert: "服务恢复后告警会自动恢复",
                recovery: "在项目根目录执行 docker compose up -d demo-app。",
              },
              api.serviceRecover,
            )
          }
        />
      </div>

      <div className="panel">
        <div className="panel-title-row">
          <h3>执行结果</h3>
          {running && <StatusBadge status="warning" label="执行中" />}
          {!running && result && <StatusBadge status={result.ok ? "ok" : "error"} label={result.ok ? "已完成" : "失败"} />}
        </div>
        {result ? (
          <div className="result-card">
            <strong>{result.title}</strong>
            <p>{result.message}</p>
            <p className="muted">{scrapeHint}</p>
            <div className="detail-grid compact-detail">
              <div>
                <span>影响内容</span>
                <strong>{result.metric}</strong>
              </div>
              <div>
                <span>可能触发</span>
                <strong>{result.alert}</strong>
              </div>
              <div>
                <span>恢复方式</span>
                <strong>{result.recovery || "等待指标恢复正常。"}</strong>
              </div>
            </div>
            {result.raw !== undefined && <RawDataDrawer title="查看接口原始返回" data={result.raw} />}
          </div>
        ) : (
          <p className="muted">尚未执行模拟操作。点击上方卡片后，这里会显示影响内容、可能触发的告警和恢复方式。</p>
        )}
      </div>
    </div>
  );
}
