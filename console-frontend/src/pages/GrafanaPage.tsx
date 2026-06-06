import { useEffect, useMemo, useState } from "react";
import { BarChart3, ExternalLink } from "lucide-react";
import { api } from "../api/client";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { normalizeGrafanaDashboards } from "../utils/normalizers";

function publicGrafanaUrl(url?: string) {
  if (!url) return "http://127.0.0.1:3000/dashboards";
  return url.replace("http://grafana:3000", "http://127.0.0.1:3000");
}

function panelPurpose(title: string, type: string) {
  const text = `${title} ${type}`.toLowerCase();
  if (text.includes("cpu")) return "观察主机或容器 CPU 负载变化，适合演示高负载告警前后的变化。";
  if (text.includes("内存") || text.includes("memory")) return "观察内存占用情况，辅助判断服务是否存在资源压力。";
  if (text.includes("磁盘") || text.includes("filesystem") || text.includes("disk")) return "观察磁盘空间占用情况，重点关注 Windows 宿主机盘或主要挂载点。";
  if (text.includes("网络") || text.includes("network")) return "观察网络接收和发送速率，辅助分析服务访问流量变化。";
  if (text.includes("probe") || text.includes("服务") || text.includes("http")) return "观察服务可用性、HTTP 请求数量和错误请求变化。";
  if (text.includes("风险") || text.includes("安全") || text.includes("login")) return "观察模拟安全指标变化，用于演示安全风险和告警触发。";
  return "用于课程项目报告展示对应监控指标的变化趋势和当前状态。";
}

function dashboardRole(name: string) {
  if (name.includes("主机")) return "展示 CPU、内存、磁盘、网络和 node_exporter 采集状态。";
  if (name.includes("容器")) return "展示 Docker 容器资源占用和 cAdvisor 采集状态。";
  if (name.includes("服务")) return "展示 demo-app 可用性、blackbox 探测结果和 HTTP 请求指标。";
  if (name.includes("安全")) return "展示 security_exporter 暴露的模拟安全指标和风险状态。";
  return "展示 Prometheus 采集到的课程设计监控数据。";
}

export default function GrafanaPage() {
  const [info, setInfo] = useState<any>({});
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .grafana()
      .then((data) => {
        setInfo(data || {});
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  const dashboards = useMemo(
    () =>
      normalizeGrafanaDashboards(info).map((dashboard) => ({
        ...dashboard,
        url: publicGrafanaUrl(dashboard.url),
      })),
    [info],
  );
  const grafanaHome = publicGrafanaUrl(info.public_url || info.url);

  if (error) {
    return (
      <ErrorState
        title="Grafana 信息加载失败"
        description="无法连接 console-backend 或 Grafana，请确认 Docker Compose 服务已经启动。"
      />
    );
  }

  return (
    <div className="grafana-page">
      <section className="panel grafana-hero">
        <div>
          <h3>Grafana 可视化入口</h3>
          <p>
            Grafana 用来把 Prometheus 采集到的监控指标转换为仪表盘。这里展示的是课程演示入口，
            主界面只保留中文说明、面板用途和展示建议，避免把查询配置直接暴露给项目报告展示观看者。
          </p>
          <p className="muted">默认账号密码：admin / admin。建议项目报告展示时从这里进入对应 Dashboard 截图。</p>
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
                  <h3>
                    <BarChart3 size={18} /> {dashboard.name}
                  </h3>
                  <p>{dashboardRole(dashboard.name)}</p>
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
                  <strong>课程项目报告展示与截图</strong>
                </div>
              </div>

              <div className="grafana-panel-list">
                {dashboard.panels.map((panel) => (
                  <div className="grafana-panel-row clean-panel-row" key={`${dashboard.name}-${panel.title}`}>
                    <div className="grafana-panel-title">
                      <strong>{panel.title}</strong>
                      <span>{panel.type}</span>
                    </div>
                    <p>{panelPurpose(panel.title, panel.type)}</p>
                  </div>
                ))}
              </div>

              <div className="card-actions">
                <a className="ghost-button" href={dashboard.url} target="_blank" rel="noreferrer">
                  打开这个 Dashboard <ExternalLink size={14} />
                </a>
                <span className="status-badge ok">面板内容已展开</span>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState title="暂无 Dashboard 信息" description="请确认 Grafana 信息接口可用，或稍后刷新页面。" />
      )}
    </div>
  );
}
