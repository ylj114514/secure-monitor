import StatusBadge from "../components/StatusBadge";

const materials = [
  {
    name: "课程要求覆盖清单",
    purpose: "逐条说明课程要求、项目实现、相关文件、截图位置和测试结果。",
    chapter: "需求分析 / 课程要求覆盖",
    status: "已完成",
    file: "docs/course_requirement_checklist.md",
  },
  {
    name: "测试计划",
    purpose: "列出 Docker Compose、Prometheus、Grafana、告警、安全模拟等测试用例。",
    chapter: "系统测试计划",
    status: "已完成",
    file: "docs/08_test_plan.md",
  },
  {
    name: "测试报告模板",
    purpose: "记录本地运行结果、问题记录和截图占位，未运行内容保持待填写。",
    chapter: "系统测试结果",
    status: "待补充截图",
    file: "docs/09_test_report.md",
  },
  {
    name: "截图材料清单",
    purpose: "按流程列出需要补充的 Docker、Prometheus、Grafana、SecureMonitor OS 截图。",
    chapter: "项目材料整理",
    status: "已完成",
    file: "docs/screenshot_checklist.md",
  },
  {
    name: "告警规则说明",
    purpose: "解释主机、容器、服务、安全四类告警规则的触发条件和处理建议。",
    chapter: "告警设计说明",
    status: "已完成",
    file: "docs/alert_rule_explanation.md",
  },
  {
    name: "Kubernetes 监控映射",
    purpose: "说明 Node、Pod、Service、Deployment 如何通过 Kubernetes 生态监控。",
    chapter: "Kubernetes 扩展研究",
    status: "扩展研究",
    file: "docs/k8s_pod_service_monitoring_mapping.md",
  },
  {
    name: "项目报告大纲",
    purpose: "提供课程报告章节结构和写作素材，便于整理最终提交材料。",
    chapter: "项目报告",
    status: "已完成",
    file: "docs/course_report_outline.md",
  },
  {
    name: "项目说明稿",
    purpose: "提供项目介绍、流程说明、技术讲解和可能问题回答。",
    chapter: "项目流程说明",
    status: "已完成",
    file: "docs/10_project_script.md",
  },
];

export default function DocsPage() {
  return (
    <div className="stack">
      <section className="panel">
        <h3>项目材料中心</h3>
        <p className="muted-text">
          本页面整理课程提交需要的项目材料入口，重点形成“课程要求、配置文件、页面截图、测试结果、报告章节”的证据链。
          页面只展示材料用途和完成状态，不把 Markdown 原文当作主要内容展示。
        </p>
      </section>

      <section className="doc-grid">
        {materials.map((item) => (
          <article className="doc-card" key={item.name}>
            <div className="panel-title-row">
              <h3>{item.name}</h3>
              <StatusBadge
                status={item.status === "已完成" ? "ok" : item.status === "扩展研究" ? "warning" : "warning"}
                label={item.status}
              />
            </div>
            <p>{item.purpose}</p>
            <div className="detail-grid compact-detail">
              <div>
                <span>报告章节</span>
                <strong>{item.chapter}</strong>
              </div>
              <div>
                <span>材料文件</span>
                <strong>{item.file}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
