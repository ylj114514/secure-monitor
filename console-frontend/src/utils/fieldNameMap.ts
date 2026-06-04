export const fieldNameMap: Record<string, string> = {
  job: "任务名称",
  instance: "实例地址",
  health: "健康状态",
  lastScrape: "最近抓取时间",
  last_scrape: "最近抓取时间",
  scrapeDuration: "抓取耗时",
  scrape_duration: "抓取耗时",
  scrapeUrl: "抓取地址",
  scrape_url: "抓取地址",
  labels: "标签",
  severity: "严重等级",
  alertname: "告警名称",
  name: "名称",
  summary: "摘要",
  description: "描述",
  startsAt: "触发时间",
  starts_at: "触发时间",
  endsAt: "恢复时间",
  status: "状态",
  state: "状态",
  datasource: "数据源",
  panel: "面板",
  dashboard: "仪表盘",
  source: "来源",
  url: "地址",
  uid: "唯一标识",
};

export function getFieldName(key: string): string {
  return fieldNameMap[key] || key;
}
