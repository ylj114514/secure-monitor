export function formatDateTime(value?: string): string {
  if (!value) return "暂无数据";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", { hour12: false });
}

export function formatDuration(value?: number | string): string {
  if (value === undefined || value === null || value === "") return "暂无数据";
  const seconds = Number(value);
  if (Number.isNaN(seconds)) return String(value);
  if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
  if (seconds < 60) return `${seconds.toFixed(2)} 秒`;
  return `${Math.floor(seconds / 60)} 分 ${Math.round(seconds % 60)} 秒`;
}

export function timeSince(value?: string): string {
  if (!value) return "暂无数据";
  const start = new Date(value).getTime();
  if (Number.isNaN(start)) return "暂无数据";
  const seconds = Math.max(0, Math.floor((Date.now() - start) / 1000));
  if (seconds < 60) return `${seconds} 秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时`;
  return `${Math.floor(seconds / 86400)} 天`;
}

export function statusText(value?: string | boolean): string {
  if (value === true) return "正常";
  if (value === false) return "异常";
  const normalized = String(value || "unknown").toLowerCase();
  if (["up", "healthy", "ok", "success", "active", "normal"].includes(normalized)) return "正常";
  if (["firing", "pending"].includes(normalized)) return "告警中";
  if (normalized === "resolved") return "已恢复";
  if (["warning", "warn", "degraded"].includes(normalized)) return "警告";
  if (normalized === "critical") return "严重";
  if (["down", "error", "failed", "failure"].includes(normalized)) return "异常";
  return "未知";
}

export function riskLevel(score: number): { label: string; tone: "good" | "warn" | "bad" } {
  if (score <= 30) return { label: "低风险", tone: "good" };
  if (score <= 70) return { label: "中风险", tone: "warn" };
  return { label: "高风险", tone: "bad" };
}

export function toNumber(value: unknown, fallback = 0): number {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}
