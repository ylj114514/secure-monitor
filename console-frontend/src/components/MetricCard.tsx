export default function MetricCard({
  title,
  value,
  unit,
  tone = "default",
  description,
  status,
}: {
  title: string;
  value: string | number;
  unit?: string;
  tone?: "default" | "good" | "warn" | "bad";
  description?: string;
  status?: string;
}) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="metric-card-header">
        <span>{title}</span>
        {status && <em>{status}</em>}
      </div>
      <strong>
        {value}
        {unit && <small>{unit}</small>}
      </strong>
      {description && <p>{description}</p>}
    </div>
  );
}
