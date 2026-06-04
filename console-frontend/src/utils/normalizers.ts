import { formatDateTime, formatDuration } from "./formatters";

export type TargetViewModel = {
  id: string;
  job: string;
  instance: string;
  health: string;
  lastScrape: string;
  scrapeDuration: string;
  scrapeUrl: string;
  error: string;
  labels: Record<string, string>;
  raw: unknown;
};

export type AlertViewModel = {
  id: string;
  source: string;
  name: string;
  severity: string;
  state: string;
  job: string;
  instance: string;
  startsAt: string;
  duration: string;
  summary: string;
  description: string;
  labels: Record<string, string>;
  raw: unknown;
};

export type SecurityMetricViewModel = {
  key: string;
  title: string;
  value: number;
  type: "Counter" | "Gauge";
  description: string;
  tone: "default" | "good" | "warn" | "bad";
};

export type DashboardViewModel = {
  name: string;
  purpose: string;
  datasource: string;
  metrics: string[];
  panelCount: number;
  url: string;
  panels: Array<{ title: string; type: string; description: string }>;
  raw: unknown;
};

export function normalizeTargets(raw: unknown): TargetViewModel[] {
  const targets = Array.isArray(raw) ? raw : [];
  return targets.map((target: any, index) => ({
    id: `${target.job || "target"}-${target.instance || index}-${index}`,
    job: target.job || target.labels?.job || "未知任务",
    instance: target.instance || target.labels?.instance || "未知实例",
    health: target.health || "unknown",
    lastScrape: formatDateTime(target.last_scrape || target.lastScrape),
    scrapeDuration: formatDuration(target.scrape_duration || target.lastScrapeDuration),
    scrapeUrl: target.scrape_url || target.scrapeUrl || "暂无数据",
    error: target.lastError || target.error || "无错误",
    labels: target.labels || {},
    raw: target,
  }));
}

export function normalizeAlerts(raw: unknown): AlertViewModel[] {
  const alerts = Array.isArray(raw) ? raw : [];
  return alerts.map((alert: any, index) => {
    const labels = alert.labels || {};
    const annotations = alert.annotations || {};
    return {
      id: `${alert.source || "alert"}-${alert.name || labels.alertname || index}-${index}`,
      source: alert.source || "prometheus",
      name: alert.name || labels.alertname || "未知告警",
      severity: alert.severity || labels.severity || "info",
      state: alert.state || alert.status?.state || "unknown",
      job: labels.job || "未知任务",
      instance: labels.instance || "未知实例",
      startsAt: formatDateTime(alert.starts_at || alert.startsAt || alert.activeAt),
      duration: formatDuration(alert.durationSeconds) || "暂无数据",
      summary: alert.summary || annotations.summary || alert.name || labels.alertname || "暂无摘要",
      description: alert.description || annotations.description || "暂无描述",
      labels,
      raw: alert,
    };
  });
}

export function normalizeSecurityMetrics(raw: Record<string, any> = {}): SecurityMetricViewModel[] {
  return [
    {
      key: "failed_login_total",
      title: "失败登录次数",
      value: Number(raw.failed_login_total || 0),
      type: "Counter",
      description: "短时间内增长过快可能表示暴力破解或异常登录尝试。",
      tone: Number(raw.failed_login_total || 0) > 10 ? "warn" : "default",
    },
    {
      key: "suspicious_request_total",
      title: "可疑请求次数",
      value: Number(raw.suspicious_request_total || 0),
      type: "Counter",
      description: "可能表示异常访问、扫描或攻击尝试。",
      tone: Number(raw.suspicious_request_total || 0) > 20 ? "warn" : "default",
    },
    {
      key: "open_port_count",
      title: "开放端口数量",
      value: Number(raw.open_port_count || 0),
      type: "Gauge",
      description: "开放端口过多会增加攻击面。",
      tone: Number(raw.open_port_count || 0) > 10 ? "warn" : "default",
    },
    {
      key: "container_restart_total",
      title: "容器重启次数",
      value: Number(raw.container_restart_total || 0),
      type: "Counter",
      description: "频繁重启可能表示服务崩溃、资源不足或异常攻击。",
      tone: Number(raw.container_restart_total || 0) > 0 ? "warn" : "default",
    },
    {
      key: "high_cpu_process_count",
      title: "高 CPU 进程数量",
      value: Number(raw.high_cpu_process_count || 0),
      type: "Gauge",
      description: "可能表示异常计算任务或资源消耗攻击。",
      tone: Number(raw.high_cpu_process_count || 0) > 0 ? "warn" : "default",
    },
    {
      key: "security_risk_score",
      title: "安全风险分数",
      value: Number(raw.security_risk_score || 0),
      type: "Gauge",
      description: "0-30 为低风险，31-70 为中风险，71-100 为高风险。",
      tone: Number(raw.security_risk_score || 0) > 80 ? "bad" : Number(raw.security_risk_score || 0) > 30 ? "warn" : "good",
    },
  ];
}

export function normalizeGrafanaDashboards(raw: any): DashboardViewModel[] {
  const dashboards = raw?.dashboards || [];
  const fallbackPanels: Record<string, DashboardViewModel["panels"]> = {
    "Host Dashboard": [
      { title: "CPU 使用率", type: "折线图", description: "展示主机 CPU 忙碌程度。" },
      { title: "内存使用率", type: "仪表盘", description: "展示主机内存使用情况。" },
      { title: "磁盘使用率", type: "仪表盘", description: "展示磁盘空间占用情况。" },
    ],
    "Container Dashboard": [
      { title: "容器 CPU 使用率", type: "折线图", description: "展示容器 CPU 消耗。" },
      { title: "容器内存使用", type: "折线图", description: "展示容器内存占用。" },
    ],
    "Service Dashboard": [
      { title: "服务可用性", type: "状态卡", description: "展示 blackbox 探测是否成功。" },
      { title: "HTTP 错误请求", type: "折线图", description: "展示 demo-app 错误请求增长。" },
    ],
    "Security Dashboard": [
      { title: "失败登录次数", type: "状态卡", description: "展示模拟失败登录次数。" },
      { title: "安全风险分数", type: "仪表盘", description: "展示整体安全风险等级。" },
    ],
  };

  return dashboards.map((dashboard: any) => {
    const rawName = dashboard.title || dashboard.name || "未命名仪表盘";
    const panels = dashboard.panels || fallbackPanels[rawName] || [];
    return {
      name: dashboardDisplayName(rawName),
      purpose: dashboard.purpose || dashboardPurpose(rawName),
      datasource: "Prometheus",
      metrics: panels.map((panel: any) => panel.title || "监控面板").slice(0, 4),
      panelCount: panels.length,
      url: dashboard.url || "http://127.0.0.1:3000/dashboards",
      panels: panels.map((panel: any) => ({
        title: panel.title || "未命名面板",
        type: panel.type || "panel",
        description: panel.description || panelPurpose(panel.title || ""),
      })),
      raw: dashboard,
    };
  });
}

function dashboardPurpose(name: string): string {
  if (name.includes("Host")) return "展示本机服务器 CPU、内存、磁盘、网络和 node_exporter 状态。";
  if (name.includes("Container")) return "展示 Docker 容器 CPU、内存、网络 IO 和 cAdvisor 状态。";
  if (name.includes("Service")) return "展示 demo-app 可用性、探测耗时和 HTTP 请求指标。";
  if (name.includes("Security")) return "展示 security_exporter 暴露的模拟安全指标。";
  return "用于课程演示的监控可视化仪表盘。";
}

function dashboardDisplayName(name: string): string {
  if (name.includes("Host")) return "主机监控大屏";
  if (name.includes("Container")) return "容器监控大屏";
  if (name.includes("Service")) return "服务探测大屏";
  if (name.includes("Security")) return "安全监控大屏";
  return name;
}

function panelPurpose(title: string): string {
  if (title.includes("CPU")) return "展示 CPU 使用情况。";
  if (title.includes("内存")) return "展示内存使用情况。";
  if (title.includes("磁盘")) return "展示磁盘空间占用情况。";
  if (title.includes("服务")) return "展示服务可用性。";
  if (title.includes("安全")) return "展示安全风险变化。";
  return "展示课程设计中的监控指标。";
}
