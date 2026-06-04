import StatusBadge from "../components/StatusBadge";

type RuleItem = {
  group: string;
  name: string;
  condition: string;
  severity: "warning" | "critical";
  cause: string;
  suggestion: string;
};

const rules: RuleItem[] = [
  {
    group: "主机告警",
    name: "HighCPUUsage",
    condition: "主机 CPU 使用率超过 80%，持续 2 分钟。",
    severity: "warning",
    cause: "业务负载过高、异常进程占用、压力测试或容器资源竞争。",
    suggestion: "查看主机监控页和 Grafana 主机大屏，定位高 CPU 进程或容器。",
  },
  {
    group: "主机告警",
    name: "HighMemoryUsage",
    condition: "主机内存使用率超过 80%，持续 2 分钟。",
    severity: "warning",
    cause: "应用内存占用过高、缓存增长或容器内存泄漏。",
    suggestion: "检查内存趋势和容器占用，必要时限制容器内存或重启异常服务。",
  },
  {
    group: "主机告警",
    name: "HighDiskUsage",
    condition: "磁盘使用率超过 85%，持续 2 分钟。",
    severity: "warning",
    cause: "日志积累、镜像和容器层占用、数据文件增长。",
    suggestion: "清理无用日志、镜像和临时文件，检查 Docker Desktop / WSL2 磁盘占用。",
  },
  {
    group: "主机告警",
    name: "HostTargetDown",
    condition: "node_exporter 采集目标不可用，持续 1 分钟。",
    severity: "critical",
    cause: "node_exporter 容器异常、网络不可达或 Prometheus 配置错误。",
    suggestion: "检查 docker compose ps、node_exporter 日志和 Prometheus Targets 页面。",
  },
  {
    group: "容器告警",
    name: "ContainerHighMemoryUsage",
    condition: "单个容器内存使用超过阈值，持续 2 分钟。",
    severity: "warning",
    cause: "容器内业务负载过高、内存泄漏或缓存膨胀。",
    suggestion: "查看 cAdvisor 和 Grafana 容器大屏，确认具体容器并限制资源。",
  },
  {
    group: "容器告警",
    name: "ContainerHighCPUUsage",
    condition: "容器 CPU 使用率较高，持续 2 分钟。",
    severity: "warning",
    cause: "高并发请求、异常计算任务或资源消耗型攻击模拟。",
    suggestion: "查看容器 CPU 排名和主机 CPU 状态，必要时停止异常请求。",
  },
  {
    group: "容器告警",
    name: "ContainerTargetDown",
    condition: "cAdvisor 采集目标不可用，持续 1 分钟。",
    severity: "critical",
    cause: "cAdvisor 容器异常、Docker 挂载路径异常或 Prometheus 抓取失败。",
    suggestion: "检查 cAdvisor 容器状态和挂载路径，重新启动服务。",
  },
  {
    group: "容器告警",
    name: "ContainerRestartDetected",
    condition: "5 分钟内出现模拟容器重启事件。",
    severity: "warning",
    cause: "课程模拟容器异常、服务崩溃或资源不足。",
    suggestion: "在异常模拟页面恢复安全指标，真实环境下应查看容器日志。",
  },
  {
    group: "服务告警",
    name: "ServiceProbeFailed",
    condition: "blackbox HTTP 探测失败，持续 1 分钟。",
    severity: "critical",
    cause: "demo-app 不可用、网络异常或健康检查接口异常。",
    suggestion: "打开服务探测页面，检查 demo-app 容器状态和 /health 接口。",
  },
  {
    group: "服务告警",
    name: "DemoAppDown",
    condition: "Prometheus 无法采集 demo-app 指标，持续 1 分钟。",
    severity: "critical",
    cause: "demo-app 容器停止、动态发现目标不可达或应用启动失败。",
    suggestion: "执行 docker compose up -d demo-app，并查看 Prometheus Targets。",
  },
  {
    group: "服务告警",
    name: "HighHttpErrorRate",
    condition: "demo-app 在 5 分钟内 5xx 错误请求超过 3 次。",
    severity: "warning",
    cause: "应用接口异常、访问 /api/error 或服务内部错误。",
    suggestion: "查看 demo-app 日志，确认错误接口和错误请求来源。",
  },
  {
    group: "安全告警",
    name: "TooManyFailedLogins",
    condition: "5 分钟内失败登录次数增长超过 10 次。",
    severity: "warning",
    cause: "暴力破解模拟、异常登录尝试或课程演示脚本触发。",
    suggestion: "查看安全中心失败登录次数，必要时恢复安全指标。",
  },
  {
    group: "安全告警",
    name: "TooManySuspiciousRequests",
    condition: "5 分钟内可疑请求次数增长超过 20 次。",
    severity: "warning",
    cause: "扫描模拟、异常访问或攻击尝试。",
    suggestion: "查看安全中心和请求日志，真实环境可结合 Web 日志进一步分析。",
  },
  {
    group: "安全告警",
    name: "HighOpenPortCount",
    condition: "模拟开放端口数量超过 10。",
    severity: "warning",
    cause: "攻击面扩大模拟或资产暴露增加。",
    suggestion: "检查端口清单和防火墙策略；本项目仅为模拟指标。",
  },
  {
    group: "安全告警",
    name: "HighSecurityRiskScore",
    condition: "安全风险分数超过 80，持续 1 分钟。",
    severity: "critical",
    cause: "多个模拟风险叠加或课程演示中手动设置高风险分数。",
    suggestion: "在安全中心查看风险分数，使用异常模拟页面恢复。",
  },
];

const groups = ["主机告警", "容器告警", "服务告警", "安全告警"];

export default function AlertRulesPage() {
  return (
    <div className="stack">
      <section className="panel">
        <h3>告警规则说明中心</h3>
        <p className="muted-text">
          本页面把 Prometheus 告警规则转换为中文说明，便于项目报告展示和截图。页面不直接展示原始 YAML，
          详细 PromQL 可在 `docs/alert_rule_explanation.md` 和 `prometheus/rules/` 中查看。
        </p>
      </section>

      {groups.map((group) => (
        <section className="panel" key={group}>
          <div className="section-heading">
            <h3>{group}</h3>
            <span>规则说明</span>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>规则名称</th>
                  <th>触发条件</th>
                  <th>严重等级</th>
                  <th>可能原因</th>
                  <th>处理建议</th>
                </tr>
              </thead>
              <tbody>
                {rules
                  .filter((rule) => rule.group === group)
                  .map((rule) => (
                    <tr key={rule.name}>
                      <td><strong>{rule.name}</strong></td>
                      <td>{rule.condition}</td>
                      <td>
                        <StatusBadge
                          status={rule.severity === "critical" ? "critical" : "warning"}
                          label={rule.severity === "critical" ? "严重" : "警告"}
                        />
                      </td>
                      <td>{rule.cause}</td>
                      <td>{rule.suggestion}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
