import { useState } from "react";
import { TargetViewModel } from "../utils/normalizers";
import EmptyState from "./EmptyState";
import LabelTags from "./LabelTags";
import RawDataDrawer from "./RawDataDrawer";
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
            <th>抓取地址</th>
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
              <td className="mono-cell">{target.scrapeUrl}</td>
              <td>{target.error || "无错误"}</td>
              <td><LabelTags labels={target.labels} /></td>
              <td><button className="ghost-button" onClick={() => setSelected(target)}>详情</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Target 详情</h3>
              <button className="ghost-button" onClick={() => setSelected(null)}>关闭</button>
            </div>
            <div className="detail-grid">
              <div><span>任务名称</span><strong>{selected.job}</strong></div>
              <div><span>实例地址</span><strong>{selected.instance}</strong></div>
              <div><span>健康状态</span><StatusBadge status={selected.health} label={selected.health === "up" ? "正常" : "异常"} /></div>
              <div><span>最近抓取</span><strong>{selected.lastScrape}</strong></div>
              <div><span>抓取耗时</span><strong>{selected.scrapeDuration}</strong></div>
              <div><span>错误信息</span><strong>{selected.error || "无错误"}</strong></div>
            </div>
            <h4>标签信息</h4>
            <LabelTags labels={selected.labels} />
            <RawDataDrawer data={selected.raw} />
          </div>
        </div>
      )}
    </>
  );
}
