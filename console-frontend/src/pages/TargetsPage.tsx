import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import ErrorState from "../components/ErrorState";
import MetricCard from "../components/MetricCard";
import TargetTable from "../components/TargetTable";
import { normalizeTargets } from "../utils/normalizers";
import { onGlobalRefresh } from "../utils/refreshEvents";

export default function TargetsPage() {
  const [targets, setTargets] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(false);

  async function loadTargets() {
    api
      .targets()
      .then((data) => {
        setTargets(normalizeTargets(data.targets || []));
        setError(false);
      })
      .catch(() => setError(true));
  }

  useEffect(() => {
    loadTargets();
    const removeListener = onGlobalRefresh(loadTargets);
    const timer = window.setInterval(loadTargets, 5000);
    return () => {
      removeListener();
      window.clearInterval(timer);
    };
  }, []);

  const visible = useMemo(() => {
    return targets.filter((target) => {
      const matchHealth = filter === "all" || target.health === filter;
      const text = `${target.job} ${target.instance}`.toLowerCase();
      return matchHealth && text.includes(keyword.trim().toLowerCase());
    });
  }, [targets, filter, keyword]);

  if (error) return <ErrorState title="Targets 加载失败" description="请确认 Prometheus 已经启动并且可以访问 targets API。" />;

  const up = targets.filter((target) => target.health === "up").length;
  const down = targets.filter((target) => target.health !== "up").length;

  return (
    <div className="stack">
      <div className="page-grid compact">
        <MetricCard title="Targets 总数" value={targets.length} />
        <MetricCard title="正常 Target" value={up} tone="good" />
        <MetricCard title="异常 Target" value={down} tone={down ? "bad" : "good"} />
      </div>
      <div className="toolbar enhanced-toolbar">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>全部</button>
        <button className={filter === "up" ? "active" : ""} onClick={() => setFilter("up")}>正常</button>
        <button className={filter === "down" ? "active" : ""} onClick={() => setFilter("down")}>异常</button>
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索 Job 或 Instance" />
      </div>
      <TargetTable targets={visible} />
    </div>
  );
}
