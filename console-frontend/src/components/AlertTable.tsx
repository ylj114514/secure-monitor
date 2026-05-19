import { timeSince } from "../utils/formatters";
import { AlertViewModel } from "../utils/normalizers";
import EmptyState from "./EmptyState";
import LabelTags from "./LabelTags";
import RawDataDrawer from "./RawDataDrawer";
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
            {!compact && <th>开发者详情</th>}
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td><strong>{alert.name}</strong></td>
              <td><StatusBadge status={alert.severity} label={alert.severity === "critical" ? "严重" : alert.severity === "warning" ? "警告" : "信息"} /></td>
              <td><StatusBadge status={alert.state} label={alert.state === "resolved" ? "已恢复" : "触发中"} /></td>
              <td>{alert.job}<br /><span className="muted">{alert.instance}</span></td>
              <td>{alert.startsAt}</td>
              {!compact && <td>{timeSince(alert.raw && typeof alert.raw === "object" ? (alert.raw as any).starts_at || (alert.raw as any).startsAt : undefined)}</td>}
              <td><strong>{alert.summary}</strong><p>{alert.description}</p></td>
              {!compact && <td><LabelTags labels={alert.labels} /></td>}
              {!compact && <td><RawDataDrawer data={alert.raw} /></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
