import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function LineChartPanel({
  title,
  data
}: {
  title: string;
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#41d3bd" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
