# 05 Alertmanager 与告警设计

## Prometheus 告警规则的作用

Prometheus 告警规则用于把监控指标转换为告警事件。Prometheus 按 `evaluation_interval` 周期计算规则，如果表达式持续满足条件，就生成告警并发送给 Alertmanager。

## 规则字段说明

- `alert`：告警名称，例如 `HighCPUUsage`。
- `expr`：PromQL 表达式，决定告警触发条件。
- `for`：持续时间，避免瞬时波动导致误报。
- `labels`：告警标签，常用于 `severity` 分级和路由。
- `annotations`：告警说明，包含 `summary` 和 `description`，便于页面展示和通知。

## 本项目告警分类

- 主机告警：CPU、内存、磁盘、node-exporter 不可用。
- 容器告警：容器 CPU、容器内存、cAdvisor 不可用、模拟容器重启。
- 服务告警：blackbox 探测失败、demo-app 不可用、HTTP 5xx 增加。
- 安全告警：失败登录、可疑请求、开放端口数量、风险分数。

## Alertmanager 的作用

Alertmanager 接收 Prometheus 告警后，负责：

- grouping：按 `alertname`、`severity`、`job` 分组，减少重复展示。
- deduplication：对重复告警去重。
- routing：按 `severity` 路由到不同 receiver。
- silence：在维护窗口或已知问题期间静默告警。
- inhibition：当 critical 告警存在时，抑制同实例的 warning 告警。

## 本项目路由设计

`alertmanager/alertmanager.yml` 中配置了三个 receiver：

- `default-receiver`
- `critical-receiver`
- `warning-receiver`

当前项目不配置真实邮件账号或外部通知密钥，主要通过 Alertmanager Web 页面展示告警。后续可扩展邮件、Webhook、企业微信或钉钉。

## 告警发送流程

1. Prometheus 加载 `prometheus/rules/*.yml`。
2. Prometheus 周期性计算告警表达式。
3. 告警满足 `for` 持续时间后进入 firing 状态。
4. Prometheus 将告警发送到 `alertmanager:9093`。
5. Alertmanager 按路由规则分组、去重并在页面展示。

实际告警触发结果待本地运行后填写。
