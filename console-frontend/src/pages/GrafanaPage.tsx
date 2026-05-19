import { useEffect, useState } from "react";
import { BarChart3, ExternalLink } from "lucide-react";
import { api } from "../api/client";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import RawDataDrawer from "../components/RawDataDrawer";
import { normalizeGrafanaDashboards } from "../utils/normalizers";

function publicGrafanaUrl(url?: string) {
  if (!url) return "http://127.0.0.1:3000/dashboards";
  return url.replace("http://grafana:3000", "http://127.0.0.1:3000");
}

export default function GrafanaPage() {
  const [info, setInfo] = useState<any>({});
  const [error, setError] = useState(false);

  useEffect(() => {
    api.grafana()
      .then((data) => {
        setInfo(data);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  if (error) return <ErrorState />;

  const dashboards = normalizeGrafanaDashboards(info).map((dashboard) => ({
    ...dashboard,
    url: publicGrafanaUrl(dashboard.url),
  }));
  const grafanaHome = publicGrafanaUrl(info.public_url || info.url);

  return (
    <div className="grafana-page">
      <section className="panel grafana-hero">
        <div>
          <h3>Grafana 可视化入口</h3>
          <p>
            Grafana 负责展示 Prometheus 采集到的主机、容器、服务和安全指标。
            本项目通过 provisioning 自动配置 Prometheus 数据源和课程设计 Dashboard。
          </p>
          <p className="muted">默认账号密码：admin / admin。本地演示使用 127.0.0.1:3000 访问 Grafana。</p>
        </div>
        <a className="primary-link" href={`${grafanaHome}/dashboards`} target="_blank" rel="noreferrer">
          打开 Grafana 首页 <ExternalLink size={14} />
        </a>
      </section>

      {dashboards.length ? (
        <section className="grafana-dashboard-list">
          {dashboards.map((dashboard) => (
            <article className="grafana-dashboard-card" key={dashboard.name}>
              <div className="grafana-dashboard-head">
                <div>
                  <h3><BarChart3 size={18} /> {dashboard.name}</h3>
                  <p>{dashboard.purpose}</p>
                </div>
                <span className="status-badge ok">{dashboard.panelCount} 个面板</span>
              </div>

              <div className="grafana-summary-grid">
                <div>
                  <span>关联数据源</span>
                  <strong>{dashboard.datasource}</strong>
                </div>
                <div>
                  <span>主要用途</span>
                  <strong>课程答辩展示与截图</strong>
                </div>
              </div>

              <div className="grafana-panel-list">
                {dashboard.panels.map((panel) => (
                  <div className="grafana-panel-row" key={`${dashboard.name}-${panel.title}`}>
                    <div className="grafana-panel-title">
                      <strong>{panel.title}</strong>
                      <span>{panel.type}</span>
                    </div>
                    <code>{panel.expr}</code>
                    <p>{panel.description}</p>
                  </div>
                ))}
              </div>

              <div className="card-actions">
                <a className="ghost-button" href={dashboard.url} target="_blank" rel="noreferrer">
                  打开 Grafana <ExternalLink size={14} />
                </a>
                <RawDataDrawer title="查看 Dashboard 原始数据" data={dashboard.raw} />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState title="暂无 Dashboard 信息" description="请确认 Grafana 后端信息接口可用。" />
      )}
    </div>
  );
}
