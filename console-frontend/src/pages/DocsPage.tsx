import { useEffect, useState } from "react";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";

const docMeta: Record<string, { purpose: string; chapter: string; status: string }> = {
  "课程要求映射": { purpose: "把课程要求逐条映射到项目实现，方便答辩对照。", chapter: "需求分析 / 验收说明", status: "已完成" },
  "项目需求文档": { purpose: "说明系统功能需求、非功能需求和课程目标。", chapter: "系统需求分析", status: "已完成" },
  "系统架构设计": { purpose: "描述 Docker Compose、Prometheus、Grafana、Alertmanager 和统一控制台关系。", chapter: "系统总体架构", status: "已完成" },
  "Prometheus 设计说明": { purpose: "说明 scrape_configs、static_configs、file_sd_configs 和告警规则加载。", chapter: "Prometheus 指标采集设计", status: "已完成" },
  "Grafana 设计说明": { purpose: "说明数据源 provisioning 和 Dashboard 设计。", chapter: "Grafana 可视化设计", status: "已完成" },
  "Alertmanager 设计说明": { purpose: "说明告警分组、去重、路由、静默和展示。", chapter: "Alertmanager 告警设计", status: "已完成" },
  "安全监控设计": { purpose: "说明 security_exporter 模拟安全指标和告警用途。", chapter: "自定义安全监控设计", status: "已完成" },
  "Kubernetes 研究": { purpose: "说明 Prometheus Operator、kube-prometheus-stack、ServiceMonitor 和 PodMonitor。", chapter: "Kubernetes 环境监控研究", status: "已完成" },
  "测试计划": { purpose: "列出课程验收测试用例、步骤、预期结果和截图位置。", chapter: "系统测试与结果分析", status: "待本地验证" },
  "测试报告": { purpose: "记录本地运行后的测试结果和截图。", chapter: "测试结果记录", status: "待本地验证" },
  "答辩稿": { purpose: "提供 1 分钟介绍、3 分钟演示和老师可能提问。", chapter: "答辩准备", status: "已完成" },
};

const fallbackDocs = [
  "课程要求映射",
  "项目需求文档",
  "系统架构设计",
  "Prometheus 设计说明",
  "Grafana 设计说明",
  "Alertmanager 设计说明",
  "安全监控设计",
  "Kubernetes 研究",
  "测试计划",
  "测试报告",
  "答辩稿",
];

export default function DocsPage() {
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    api.docs().then((data) => setLinks(data.links || [])).catch(() => undefined);
  }, []);

  const docs = links.length ? links.map((link) => link.name) : fallbackDocs;

  return (
    <div className="stack">
      <div className="panel">
        <h3>项目文档中心</h3>
        <p>文档按课程报告和答辩用途组织。页面只展示文档用途、对应章节和状态，不直接把 Markdown 路径作为主要内容。</p>
      </div>
      <div className="doc-grid">
        {docs.map((name) => {
          const meta = docMeta[name] || { purpose: "项目配套说明文档。", chapter: "课程设计材料", status: "待补充" };
          return (
            <div className="doc-card" key={name}>
              <div className="panel-title-row">
                <h3>{name}</h3>
                <StatusBadge status={meta.status === "已完成" ? "ok" : "warning"} label={meta.status} />
              </div>
              <p>{meta.purpose}</p>
              <div className="detail-grid compact-detail">
                <div><span>适合章节</span><strong>{meta.chapter}</strong></div>
              </div>
              <button className="ghost-button">查看说明</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
