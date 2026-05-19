import { Activity, Bell, Cpu, Database, HardDrive, Shield } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

export default function TopStatusBar({ overview }: { overview: any }) {
  const time = new Date().toLocaleString();
  return (
    <header className="top-status-bar">
      <div className="brand">
        <Shield size={20} />
        <span>SecureMonitor OS</span>
      </div>
      <div className="status-strip">
        <StatusBadge label="Prometheus" ok={overview.prometheus_up} />
        <StatusBadge label="Grafana" ok={overview.grafana_up} />
        <StatusBadge label="Alertmanager" ok={overview.alertmanager_up} />
        <span><Database size={14} /> Targets {overview.targets_up || 0}/{overview.targets_total || 0}</span>
        <span><Bell size={14} /> Alerts {overview.active_alerts || 0}</span>
        <span><Cpu size={14} /> CPU {Number(overview.cpu_usage || 0).toFixed(1)}%</span>
        <span>MEM {Number(overview.memory_usage || 0).toFixed(1)}%</span>
        <span><HardDrive size={14} /> DISK {Number(overview.disk_usage || 0).toFixed(1)}%</span>
        <span><Activity size={14} /> {time}</span>
      </div>
    </header>
  );
}
