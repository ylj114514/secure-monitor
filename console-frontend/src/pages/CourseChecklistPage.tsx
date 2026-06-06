import { useEffect, useState } from "react";
import { api } from "../api/client";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";

type ChecklistItem = {
  requirement: string;
  implementation: string;
  evidence_files: string[];
  page_entry: string;
  screenshot: string;
  status: string;
};

export default function CourseChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .courseChecklist()
      .then((data) => {
        setItems(data.items || []);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <ErrorState
        title="验收清单加载失败"
        description="无法读取 /api/course/checklist，请确认 console-backend 已启动。"
      />
    );
  }

  return (
    <div className="stack">
      <section className="panel">
        <h3>课程要求验收清单</h3>
        <p className="muted-text">
          本页面把老师要求逐条映射到项目实现、证据文件、页面入口和截图位置，用于形成课程提交前的证据链。
          Kubernetes 部分按扩展研究和可选实验说明，Docker Compose 是本项目主实现。
        </p>
      </section>

      {items.length ? (
        <section className="panel">
          <div className="table-scroll">
            <table className="data-table checklist-table">
              <thead>
                <tr>
                  <th>课程要求</th>
                  <th>项目实现</th>
                  <th>证据文件</th>
                  <th>页面入口</th>
                  <th>截图位置</th>
                  <th>完成状态</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.requirement}>
                    <td><strong>{item.requirement}</strong></td>
                    <td>{item.implementation}</td>
                    <td>
                      <div className="file-list">
                        {item.evidence_files.map((file) => <code key={file}>{file}</code>)}
                      </div>
                    </td>
                    <td>{item.page_entry}</td>
                    <td>{item.screenshot}</td>
                    <td>
                      <StatusBadge
                        status={item.status.includes("扩展") ? "warning" : "ok"}
                        label={shortStatus(item.status)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState title="暂无验收清单" description="后端暂未返回课程要求映射数据。" />
      )}
    </div>
  );
}

function shortStatus(status: string): string {
  if (status.includes("扩展")) return "扩展研究";
  if (status.includes("待")) return "已完成";
  if (status.includes("验证")) return "已验证";
  return status;
}
