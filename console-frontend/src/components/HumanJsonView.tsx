import { getFieldName } from "../utils/fieldNameMap";
import RawDataDrawer from "./RawDataDrawer";

export default function HumanJsonView({
  data,
  title = "摘要视图",
}: {
  data: Record<string, unknown>;
  title?: string;
}) {
  const entries = Object.entries(data || {}).filter(([, value]) => typeof value !== "object");
  return (
    <div className="human-json-view">
      <h4>{title}</h4>
      <dl>
        {entries.map(([key, value]) => (
          <div key={key}>
            <dt>{getFieldName(key)}</dt>
            <dd>{String(value ?? "暂无数据")}</dd>
          </div>
        ))}
      </dl>
      <RawDataDrawer data={data} />
    </div>
  );
}
