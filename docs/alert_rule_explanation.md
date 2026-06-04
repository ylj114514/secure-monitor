# Prometheus 告警规则说明

本文档解释项目中的 Prometheus 告警规则，按主机、容器、服务、安全四类分组。告警规则用于课程设计演示和项目报告展示，部分阈值为教学场景设置，实际生产环境需要结合业务负载、历史基线和安全策略重新调整。

## 主机告警规则

| 规则名称 | PromQL | 触发条件 | 严重等级 | 可能原因 | 处理建议 |
|---|---|---|---|---|---|
| HighCPUUsage | `100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 80` | 主机 CPU 使用率超过 80%，持续 2 分钟 | warning | 业务负载过高、异常进程占用、压力测试、容器资源竞争 | 查看主机监控页面和 Grafana 主机 Dashboard，定位高 CPU 进程或容器，必要时停止异常任务 |
| HighMemoryUsage | `(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 80` | 主机内存使用率超过 80%，持续 2 分钟 | warning | 应用内存占用过高、缓存增长、容器内存泄漏 | 查看内存趋势，检查 Docker 容器内存占用，必要时限制容器内存或重启异常服务 |
| HighDiskUsage | `(1 - (node_filesystem_avail_bytes{fstype!~"tmpfs|overlay|squashfs"} / node_filesystem_size_bytes{fstype!~"tmpfs|overlay|squashfs"})) * 100 > 85` | 磁盘使用率超过 85%，持续 2 分钟 | warning | 日志积累、镜像和容器层占用、数据文件增长 | 清理无用日志、镜像和临时文件，检查 Docker Desktop / WSL2 磁盘占用 |
| HostTargetDown | `up{job="node-exporter"} == 0` | node_exporter 采集目标不可用，持续 1 分钟 | critical | node_exporter 容器异常、网络不可达、Prometheus 配置错误 | 检查 `docker compose ps`、node-exporter 容器日志和 Prometheus Targets 页面 |

## 容器告警规则

| 规则名称 | PromQL | 触发条件 | 严重等级 | 可能原因 | 处理建议 |
|---|---|---|---|---|---|
| ContainerHighMemoryUsage | `container_memory_usage_bytes{name!=""} > 500 * 1024 * 1024` | 单个容器内存使用超过 500MB，持续 2 分钟 | warning | 容器内业务负载过高、内存泄漏、缓存膨胀 | 查看 cAdvisor 和 Grafana 容器 Dashboard，确认具体容器并限制资源 |
| ContainerHighCPUUsage | `rate(container_cpu_usage_seconds_total{name!=""}[2m]) * 100 > 80` | 容器 CPU 使用率较高，持续 2 分钟 | warning | 高并发请求、异常计算任务、资源消耗型攻击模拟 | 查看容器 CPU 排名和主机 CPU 状态，必要时限制容器 CPU 或停止异常请求 |
| ContainerTargetDown | `up{job="cadvisor"} == 0` | cAdvisor 采集目标不可用，持续 1 分钟 | critical | cAdvisor 容器异常、Docker 挂载路径异常、Prometheus 抓取失败 | 检查 cAdvisor 容器状态和挂载路径，重新启动服务 |
| ContainerRestartDetected | `increase(security_container_restart_total[5m]) > 0` | 5 分钟内出现模拟容器重启事件 | warning | 课程模拟容器异常、服务崩溃、资源不足 | 在异常模拟页面恢复安全指标，真实环境下应查看容器日志和重启原因 |

## 服务告警规则

| 规则名称 | PromQL | 触发条件 | 严重等级 | 可能原因 | 处理建议 |
|---|---|---|---|---|---|
| ServiceProbeFailed | `probe_success{job="blackbox-http"} == 0` | blackbox HTTP 探测失败，持续 1 分钟 | critical | demo-app 不可用、网络异常、健康检查接口异常 | 打开服务探测页面，检查 demo-app 容器状态和 `/health` 接口 |
| DemoAppDown | `up{job="dynamic-file-sd", instance="demo-app:5000"} == 0` | Prometheus 无法采集 demo-app 指标，持续 1 分钟 | critical | demo-app 容器停止、动态发现目标不可达、应用启动失败 | 执行 `docker compose up -d demo-app`，查看 Prometheus Targets 状态 |
| HighHttpErrorRate | `increase(demo_http_requests_total{status=~"5.."}[5m]) > 3` | demo-app 在 5 分钟内 5xx 错误请求超过 3 次 | warning | 应用接口异常、故意访问 `/api/error`、服务内部错误 | 查看 demo-app 日志，确认错误接口和错误请求来源 |

## 安全告警规则

| 规则名称 | PromQL | 触发条件 | 严重等级 | 可能原因 | 处理建议 |
|---|---|---|---|---|---|
| TooManyFailedLogins | `increase(security_failed_login_total[5m]) > 10` | 5 分钟内失败登录次数增长超过 10 次 | warning | 暴力破解模拟、异常登录尝试、课程演示脚本触发 | 查看安全中心失败登录次数，必要时恢复安全指标；真实环境需接入登录日志和 IP 分析 |
| TooManySuspiciousRequests | `increase(security_suspicious_request_total[5m]) > 20` | 5 分钟内可疑请求次数增长超过 20 次 | warning | 扫描模拟、异常访问、攻击尝试 | 查看安全中心和请求日志，真实环境可结合 WAF、Nginx 日志和访问频率分析 |
| HighOpenPortCount | `security_open_port_count > 10` | 模拟开放端口数量超过 10 | warning | 攻击面扩大模拟、资产暴露增加 | 检查端口清单、防火墙策略和服务暴露范围；本项目仅为模拟指标 |
| HighSecurityRiskScore | `security_risk_score > 80` | 安全风险分数超过 80，持续 1 分钟 | critical | 多个模拟风险叠加、课程演示风险分数设置为高 | 在安全中心查看风险分数，使用异常模拟页面恢复；真实环境需结合多源安全日志判断 |

## 注意事项

- `security_exporter` 暴露的是课程设计模拟安全指标，不是生产级入侵检测系统。
- PromQL 中的阈值用于演示和项目报告展示，真实环境应根据业务基线调整。
- 告警是否触发受 Prometheus 抓取周期、规则评估周期和 `for` 持续时间影响，截图时应等待下一轮抓取和评估。
