import { useState } from "react";
import { TargetViewModel } from "../utils/normalizers";
import EmptyState from "./EmptyState";
import LabelTags from "./LabelTags";
import StatusBadge from "./StatusBadge";

export default function TargetTable({ targets }: { targets: TargetViewModel[] }) {
  const [selected, setSelected] = useState<TargetViewModel | null>(null);

  if (!targets.length) {
    return <EmptyState title="暂无 Target" description="当前过滤条件下没有 Prometheus 抓取目标。" />;
  }

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            <th>任务名称</th>
            <th>实例地址</th>
            <th>健康状态</th>
            <th>最近抓取时间</th>
            <th>抓取耗时</th>
            <th>错误信息</th>
            <th>标签</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {targets.map((target) => (
            <tr key={target.id}>
              <td>{target.job}</td>
              <td>{target.instance}</td>
              <td><StatusBadge status={target.health} label={target.health === "up" ? "正常" : "异常"} /></td>
              <td>{target.lastScrape}</td>
              <td>{target.scrapeDuration}</td>
              <td>{target.error || "无错误"}</td>
              <td><LabelTags labels={target.labels} /></td>
              <td><button className="ghost-button" onClick={() => setSelected(target)}>展开说明</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Target 采集详情</h3>
              <button className="ghost-button" onClick={() => setSelected(null)}>关闭</button>
            </div>
            <p className="muted-text">
              这里展示 Prometheus 对单个采集目标的健康判断、抓取耗时和标签归属，便于说明监控系统如何确认服务是否在线。
            </p>
            <div className="detail-grid">
              <div><span>任务名称</span><strong>{selected.job}</strong></div>
              <div><span>实例地址</span><strong>{selected.instance}</strong></div>
              <div><span>健康状态</span><StatusBadge status={selected.health} label={selected.health === "up" ? "正常" : "异常"} /></div>
              <div><span>最近抓取</span><strong>{selected.lastScrape}</strong></div>
              <div><span>抓取耗时</span><strong>{selected.scrapeDuration}</strong></div>
              <div><span>错误信息</span><strong>{selected.error || "无错误"}</strong></div>
            </div>
            <div className="explain-grid target-explain-grid">
              <div>
                <span>功能作用</span>
                <p>{targetPurpose(selected.job)}</p>
              </div>
              <div>
                <span>展示结论</span>
                <p>
                  {selected.health === "up"
                    ? "该目标已被 Prometheus 正常采集，可以作为报告中“监控目标在线”的证据。"
                    : "该目标当前存在采集异常，需要结合错误信息和容器状态排查。"}
                </p>
              </div>
            </div>
            <h4>标签信息</h4>
            <LabelTags labels={selected.labels} />
          </div>
        </div>
      )}
    </>
  );
}

function targetPurpose(job: string): string {
  const name = job.toLowerCase();
  if (name.includes("prometheus")) return "Prometheus 负责统一采集、存储和查询项目监控指标。";
  if (name.includes("grafana")) return "Grafana 负责把 Prometheus 指标转成可视化 Dashboard。";
  if (name.includes("alert")) return "Alertmanager 负责接收告警、分组展示和辅助定位异常。";
  if (name.includes("node")) return "node-exporter 负责采集宿主机 CPU、内存、磁盘和网络指标。";
  if (name.includes("cadvisor")) return "cAdvisor 负责采集 Docker 容器资源占用和运行状态。";
  if (name.includes("blackbox")) return "blackbox-exporter 负责从外部探测服务可用性。";
  if (name.includes("security")) return "security_exporter 负责输出课程演示用的安全风险模拟指标。";
  if (name.includes("demo")) return "demo-app 是被监控的示例业务服务，用于演示服务探测和异常告警。";
  return "该目标是 Prometheus 当前采集链路中的一部分，用于形成完整监控证据。";
}
