import {
  Activity,
  Bell,
  Boxes,
  Gauge,
  Home,
  Network,
  PlayCircle,
  Server,
  Shield,
  Target,
} from "lucide-react";

const items = [
  ["overview", "总览", Home],
  ["host", "主机监控", Server],
  ["container", "容器监控", Boxes],
  ["service", "服务探测", Network],
  ["targets", "Targets", Target],
  ["security", "安全中心", Shield],
  ["alerts", "告警中心", Bell],
  ["grafana", "Grafana", Gauge],
  ["simulation", "异常模拟", PlayCircle],
  ["kubernetes", "Kubernetes", Activity],
] as const;

export default function SideDock({
  activePage,
  setActivePage,
}: {
  activePage: string;
  setActivePage: (page: string) => void;
}) {
  return (
    <nav className="side-dock">
      {items.map(([key, label, Icon]) => (
        <button
          key={key}
          className={activePage === key ? "dock-item active" : "dock-item"}
          onClick={() => setActivePage(key)}
          title={label}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
