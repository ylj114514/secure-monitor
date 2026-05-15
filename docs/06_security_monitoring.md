# 06 安全监控设计

## 为什么需要 security_exporter

Prometheus 通常通过 Exporter 采集系统或应用指标。node-exporter 和 cAdvisor 更关注资源使用情况，blackbox-exporter 更关注服务可用性。课程设计还要求体现安全监控，因此本项目实现自定义 `security_exporter`，用于暴露模拟安全指标，展示如何把安全事件转化为 Prometheus 可采集的时间序列。

## 安全边界

security_exporter 只用于课程设计模拟，不读取真实登录日志、不扫描真实端口、不读取用户隐私、不执行危险系统操作。所有指标都由模拟 API 或默认值产生。

## 指标说明

| 指标 | 类型 | 含义 | 用途 |
| --- | --- | --- | --- |
| `security_failed_login_total` | counter | 失败登录次数 | 模拟暴力破解或异常登录 |
| `security_suspicious_request_total` | counter | 可疑请求次数 | 模拟异常 URL、扫描请求或攻击探测 |
| `security_open_port_count` | gauge | 模拟开放端口数量 | 模拟暴露面变化 |
| `security_container_restart_total` | counter | 模拟容器重启次数 | 关联容器异常和安全风险 |
| `security_high_cpu_process_count` | gauge | 模拟高 CPU 进程数量 | 模拟异常进程行为 |
| `security_risk_score` | gauge | 安全风险分数，0-100 | 用于综合风险告警 |

## 接口设计

- `GET /health`：健康检查，返回 `{"status": "ok"}`。
- `GET /metrics`：Prometheus 文本格式指标。
- `POST /simulate/failed-login`：增加失败登录计数。
- `POST /simulate/suspicious-request`：增加可疑请求计数。
- `POST /simulate/risk-score`：设置风险分数。
- `POST /simulate/container-restart`：增加容器重启模拟计数。

## 与 Prometheus 的关系

Prometheus 通过 `file_sd_configs` 从 `targets.json` 动态发现 `security-exporter:8000`，定时抓取 `/metrics`。抓取到的数据可以用于 PromQL 查询、Grafana Dashboard 展示和告警规则判断。

## 告警使用方式

安全告警规则位于 `prometheus/rules/security_alerts.yml`：

- 5 分钟内失败登录次数增长超过 10，触发 `TooManyFailedLogins`。
- 5 分钟内可疑请求次数增长超过 20，触发 `TooManySuspiciousRequests`。
- 开放端口数量超过 10，触发 `HighOpenPortCount`。
- 风险分数超过 80，触发 `HighSecurityRiskScore`。

实际告警触发结果待本地运行后填写。
