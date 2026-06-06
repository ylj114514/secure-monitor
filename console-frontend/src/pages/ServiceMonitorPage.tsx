import { useEffect, useState } from "react";
import { api } from "../api/client";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import { onGlobalRefresh } from "../utils/refreshEvents";

export default function ServiceMonitorPage() {
  const [probe, setProbe] = useState<any>(null);
  const [duration, setDuration] = useState<any>(null);

  async function loadServiceMetrics() {
    api.query("probe_success").then(setProbe).catch(() => undefined);
    api.query("probe_duration_seconds").then(setDuration).catch(() => undefined);
  }

  useEffect(() => {
    loadServiceMetrics();
    const removeListener = onGlobalRefresh(loadServiceMetrics);
    const timer = window.setInterval(loadServiceMetrics, 5000);
    return () => {
      removeListener();
      window.clearInterval(timer);
    };
  }, []);

  const success = probe?.data?.result?.[0]?.value?.[1];
  const seconds = duration?.data?.result?.[0]?.value?.[1];

  return (
    <div className="page-grid">
      <MetricCard title="demo-app 探测" value={success === "1" ? "成功" : "暂无数据"} tone={success === "1" ? "good" : "warn"} />
      <MetricCard title="探测耗时" value={seconds ? Number(seconds).toFixed(3) : "暂无数据"} unit={seconds ? "s" : ""} />
      <div className="panel wide">
        <div className="panel-title-row">
          <h3>服务探测说明</h3>
          <StatusBadge status="ok" label="测试已完成" />
        </div>
        <p>
          blackbox_exporter 会从监控系统外部访问 demo-app 的健康检查接口，用于判断服务是否可用。
          探测成功显示为“成功”，探测耗时用于观察服务响应速度。
        </p>
        <p>
          如果需要演示服务宕机，可以在“异常模拟”页面查看安全命令，再手动停止 demo-app；
          恢复后本页面会在下一轮 Prometheus 抓取后自动更新。
        </p>
        <div className="explain-grid">
          <div>
            <span>探测对象</span>
            <p>demo-app 示例业务服务，用于证明服务可用性监控和告警链路。</p>
          </div>
          <div>
            <span>判断方式</span>
            <p>{success === "1" ? "外部探测已经成功，说明服务入口可访问。" : "当前未读取到成功结果，需要检查 demo-app 或 blackbox-exporter。"}</p>
          </div>
          <div>
            <span>展示建议</span>
            <p>项目报告展示时说明探测结果、耗时和宕机恢复流程，再切换到告警中心查看相关告警。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
