import { useEffect, useState } from "react";
import { api } from "../api/client";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";

type AlertRule = {
  name: string;
  promql: string;
  condition: string;
  severity: "warning" | "critical";
  possible_causes: string;
  suggestion: string;
};

type AlertRuleGroup = {
  group: string;
  rules: AlertRule[];
};

export default function AlertRulesPage() {
  const [groups, setGroups] = useState<AlertRuleGroup[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .alertRules()
      .then((data) => {
        setGroups(data.groups || []);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <ErrorState
        title="告警规则加载失败"
        description="无法读取 /api/alert-rules，请确认 console-backend 已启动。"
      />
    );
  }

  return (
    <div className="stack">
      <section className="panel">
        <h3>告警规则说明中心</h3>
        <p className="muted-text">
          本页面把 Prometheus 告警规则转换为中文说明，便于项目报告展示和截图。页面不直接展示配置文件正文，
          而是按主机、容器、服务、安全四类展示触发条件、严重等级、可能原因和处理建议。
        </p>
      </section>

      {groups.length ? (
        groups.map((group) => (
          <section className="panel" key={group.group}>
            <div className="section-heading">
              <h3>{group.group}</h3>
              <span>{group.rules.length} 条规则</span>
            </div>
            <div className="alert-rule-list">
              {group.rules.map((rule) => (
                <article className="alert-rule-card" key={rule.name}>
                  <div className="alert-rule-head">
                    <div>
                      <h3>{rule.name}</h3>
                      <p>{rule.condition}</p>
                    </div>
                    <StatusBadge
                      status={rule.severity === "critical" ? "critical" : "warning"}
                      label={rule.severity === "critical" ? "严重" : "警告"}
                    />
                  </div>
                  <div className="rule-human-summary">
                    <span>判断依据</span>
                    <p>{humanRuleSummary(rule)}</p>
                  </div>
                  <div className="rule-detail-grid">
                    <div>
                      <span>可能原因</span>
                      <p>{rule.possible_causes}</p>
                    </div>
                    <div>
                      <span>处理建议</span>
                      <p>{rule.suggestion}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      ) : (
        <EmptyState title="暂无告警规则" description="后端暂未返回告警规则元数据。" />
      )}
    </div>
  );
}

function humanRuleSummary(rule: AlertRule): string {
  const text = `${rule.name} ${rule.condition}`.toLowerCase();
  if (text.includes("cpu")) return "持续观察 CPU 使用率或高 CPU 进程数量，超过项目阈值后触发告警。";
  if (text.includes("memory") || text.includes("内存")) return "持续观察内存使用率，资源压力过高并持续一段时间后触发告警。";
  if (text.includes("disk") || text.includes("磁盘")) return "持续观察磁盘空间占用，磁盘使用率过高时触发告警。";
  if (text.includes("probe") || text.includes("service") || text.includes("服务")) return "持续观察服务探测结果，服务不可访问或响应异常时触发告警。";
  if (text.includes("login") || text.includes("suspicious") || text.includes("port") || text.includes("security")) {
    return "持续观察安全模拟指标，失败登录、可疑请求、开放端口或风险分数过高时触发告警。";
  }
  return "Prometheus 按固定周期评估该规则，条件持续满足后发送到 Alertmanager。";
}
