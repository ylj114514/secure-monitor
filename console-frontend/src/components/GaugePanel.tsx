export default function GaugePanel({ title, value }: { title: string; value: number }) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className="panel">
      <h3>{title}</h3>
      <div className="gauge">
        <div className="gauge-fill" style={{ width: `${bounded}%` }} />
      </div>
      <strong>{bounded.toFixed(1)}%</strong>
    </div>
  );
}
