export default function EmptyState({
  title = "暂无数据",
  description = "当前接口暂未返回可展示的数据。",
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "empty-state compact-empty" : "empty-state"}>
      <strong>{title}</strong>
      {!compact && <p>{description}</p>}
    </div>
  );
}
