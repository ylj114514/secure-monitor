import EmptyState from "./EmptyState";

export default function LabelTags({ labels }: { labels?: Record<string, string> }) {
  const entries = Object.entries(labels || {});
  if (!entries.length) return <EmptyState title="暂无标签" compact />;
  return (
    <div className="label-tags">
      {entries.map(([key, value]) => (
        <span className="label-tag" key={key}>
          <b>{key}</b>={String(value)}
        </span>
      ))}
    </div>
  );
}
