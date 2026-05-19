import { useState } from "react";

export default function RawDataDrawer({
  title = "开发者原始数据",
  data,
  language = "json",
}: {
  title?: string;
  data: unknown;
  language?: "json" | "yaml" | "text";
}) {
  const [open, setOpen] = useState(false);
  const content = language === "json" ? JSON.stringify(data, null, 2) : String(data || "");
  return (
    <div className="raw-drawer">
      <button className="ghost-button" onClick={() => setOpen((next) => !next)}>
        {open ? "收起开发者详情" : title}
      </button>
      {open && <pre className="raw-block">{content}</pre>}
    </div>
  );
}
