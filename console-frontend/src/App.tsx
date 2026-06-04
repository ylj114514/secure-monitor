import { useEffect, useState } from "react";
import DesktopLayout from "./layouts/DesktopLayout";
import OverviewPage from "./pages/OverviewPage";
import HostMonitorPage from "./pages/HostMonitorPage";
import ContainerMonitorPage from "./pages/ContainerMonitorPage";
import ServiceMonitorPage from "./pages/ServiceMonitorPage";
import TargetsPage from "./pages/TargetsPage";
import SecurityCenterPage from "./pages/SecurityCenterPage";
import AlertCenterPage from "./pages/AlertCenterPage";
import AlertRulesPage from "./pages/AlertRulesPage";
import GrafanaPage from "./pages/GrafanaPage";
import SimulationPage from "./pages/SimulationPage";
import KubernetesResearchPage from "./pages/KubernetesResearchPage";
import DocsPage from "./pages/DocsPage";
import { api } from "./api/client";
import { normalizeAlerts } from "./utils/normalizers";
import { onGlobalRefresh } from "./utils/refreshEvents";

const pages: Record<string, { title: string; component: JSX.Element }> = {
  overview: { title: "系统总览", component: <OverviewPage /> },
  host: { title: "主机监控", component: <HostMonitorPage /> },
  container: { title: "容器监控", component: <ContainerMonitorPage /> },
  service: { title: "服务探测", component: <ServiceMonitorPage /> },
  targets: { title: "Targets", component: <TargetsPage /> },
  security: { title: "安全中心", component: <SecurityCenterPage /> },
  alerts: { title: "告警中心", component: <AlertCenterPage /> },
  alertRules: { title: "告警规则说明", component: <AlertRulesPage /> },
  grafana: { title: "Grafana 大屏", component: <GrafanaPage /> },
  simulation: { title: "异常模拟", component: <SimulationPage /> },
  kubernetes: { title: "Kubernetes 研究", component: <KubernetesResearchPage /> },
  docs: { title: "项目材料中心", component: <DocsPage /> },
};

function pageFromHash() {
  const key = window.location.hash.replace(/^#\/?/, "");
  return pages[key] ? key : "overview";
}

export default function App() {
  const [activePage, setActivePageState] = useState(pageFromHash());
  const [overview, setOverview] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);

  function setActivePage(page: string) {
    setActivePageState(page);
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page;
    }
  }

  async function refresh() {
    try {
      const [overviewData, alertData] = await Promise.all([api.overview(), api.alerts()]);
      setOverview(overviewData);
      setAlerts(normalizeAlerts(alertData.alerts || []));
    } catch {
      setOverview({ system_status: "offline" });
    }
  }

  useEffect(() => {
    const onHashChange = () => setActivePageState(pageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    refresh();
    const removeListener = onGlobalRefresh(refresh);
    const timer = window.setInterval(refresh, 5000);
    return () => {
      removeListener();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <DesktopLayout
      activePage={activePage}
      setActivePage={setActivePage}
      pageTitle={pages[activePage].title}
      overview={overview}
      alerts={alerts}
    >
      {pages[activePage].component}
    </DesktopLayout>
  );
}
