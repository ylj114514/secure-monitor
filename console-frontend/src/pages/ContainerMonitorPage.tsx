import { useEffect, useState } from "react";
import { api } from "../api/client";
import MetricCard from "../components/MetricCard";
import RawDataDrawer from "../components/RawDataDrawer";
import { onGlobalRefresh } from "../utils/refreshEvents";

export default function ContainerMonitorPage() {
  const [cadvisor, setCadvisor] = useState<any>(null);

  async function loadContainerMetrics() {
    api.query('up{job="cadvisor"}').then(setCadvisor).catch(() => undefined);
  }

  useEffect(() => {
    loadContainerMetrics();
    const removeListener = onGlobalRefresh(loadContainerMetrics);
    const timer = window.setInterval(loadContainerMetrics, 5000);
    return () => {
      removeListener();
      window.clearInterval(timer);
    };
  }, []);

  const cadvisorValue = cadvisor?.data?.result?.[0]?.value?.[1];
  const up = String(cadvisorValue || "") === "1";

  return (
    <div className="page-grid">
      <MetricCard title="cAdvisor 状态" value={up ? "采集中" : "待验证"} tone={up ? "good" : "warn"} />
      <div className="panel wide">
        <h3>容器监控能力</h3>
        <p>
          容器监控数据来自 cAdvisor，主要用于观察 Docker 容器 CPU、内存、网络 IO 和运行状态。
          本控制台展示采集状态，详细趋势图可以进入 Grafana 容器监控大屏查看。
        </p>
        <p>
          如果在“异常模拟”页面触发容器重启事件，安全中心和告警中心会同步展示对应的模拟安全指标和告警。
        </p>
        <RawDataDrawer title="查看 cAdvisor 状态原始查询结果" data={cadvisor} />
      </div>
    </div>
  );
}
