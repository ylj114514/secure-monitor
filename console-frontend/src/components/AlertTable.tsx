import { timeSince } from "../utils/formatters";
import { AlertViewModel } from "../utils/normalizers";
import EmptyState from "./EmptyState";
import LabelTags from "./LabelTags";
import StatusBadge from "./StatusBadge";

export default function AlertTable({
  alerts,
  compact = false,
}: {
  alerts: AlertViewModel[];
  compact?: boolean;
}) {
  if (!alerts.length) {
    return <EmptyState title="暂无告警" description="当前过滤条件下没有活跃告警或告警数据。" />;
  }

  return (
    <div className="table-scroll">
      <table className={compact ? "data-table alert-table compact-alert-table" : "data-table alert-table"}>
        <thead>
          <tr>
            <th>告警名称</th>
            <th>严重等级</th>
            <th>当前状态</th>
            <th>来源 Job / Instance</th>
            <th>触发时间</th>
            {!compact && <th>持续时间</th>}
            <th>摘要与描述</th>
            {!compact && <th>标签</th>}
            {!compact && <th>处理说明</th>}
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td><strong>{alert.name}</strong></td>
              <td><StatusBadge status={alert.severity} label={alert.severity === "critical" ? "严重" : alert.severity === "warning" ? "警告" : "信息"} /></td>
              <td><StatusBadge status={alert.state} label={alert.state === "resolved" ? "已恢复" : "告警中"} /></td>
              <td>{alert.job}<br /><span className="muted">{alert.instance}</span></td>
              <td>{alert.startsAt}</td>
              {!compact && <td>{alert.duration || timeSince(alert.startsAt)}</td>}
              <td><strong>{alert.summary}</strong><p>{alert.description}</p></td>
              {!compact && <td><LabelTags labels={alert.labels} /></td>}
              {!compact && (
                <td>
                  <div className="table-explain-cell">
                    <strong>{alertAdvice(alert.name, alert.severity).title}</strong>
                    <span>{alertAdvice(alert.name, alert.severity).description}</span>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function alertAdvice(name: string, severity: string): { title: string; description: string } {
  const key = name.toLowerCase();
  if (key.includes("disk")) {
    return { title: "检查磁盘空间", description: "用于证明磁盘容量告警链路有效，处理时应清理日志或扩容挂载点。" };
  }
  if (key.includes("cpu")) {
    return { title: "检查资源压力", description: "结合主机和容器监控定位高负载来源，确认是否为异常进程或业务压力。" };
  }
  if (key.includes("memory")) {
    return { title: "检查内存占用", description: "观察内存使用趋势，必要时重启异常服务或调整资源限制。" };
  }
  if (key.includes("probe") || key.includes("down") || key.includes("service")) {
    return { title: "检查服务可用性", description: "从服务探测页和 demo-app 状态确认访问链路是否恢复。" };
  }
  if (key.includes("login") || key.includes("security") || key.includes("suspicious") || key.includes("port")) {
    return { title: "检查安全风险", description: "对应安全中心模拟指标，可用于展示安全事件到告警中心的完整流程。" };
  }
  return {
    title: severity === "critical" ? "优先处理" : "持续观察",
    description: severity === "critical" ? "该告警等级较高，建议优先定位来源并记录处理结果。" : "该告警用于提示风险趋势，报告展示时说明触发原因即可。",
  };
}
