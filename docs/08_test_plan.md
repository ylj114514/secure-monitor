# 08 测试计划

## 测试目标

验证 SecureMonitor Docker Compose 主实现是否能够启动核心服务，Prometheus 是否能够采集静态和动态目标，Grafana 是否能够展示 Dashboard，Alertmanager 是否能够展示告警，异常模拟脚本是否能够辅助课程答辩演示。

## 测试环境

| 项目 | 内容 |
| --- | --- |
| 操作系统 | 待本地运行后填写 |
| Docker Desktop / Docker Engine | 待本地运行后填写 |
| Docker Compose | 待本地运行后填写 |
| 浏览器 | 待本地运行后填写 |
| 项目路径 | 待本地运行后填写 |

## 测试范围

- Docker Compose 启动与停止。
- Prometheus 静态服务发现和文件型动态服务发现。
- node-exporter 主机指标。
- cAdvisor 容器指标。
- blackbox_exporter 服务探测。
- security_exporter 自定义安全指标。
- demo-app HTTP 指标。
- Grafana 数据源和 Dashboard。
- Prometheus 告警规则和 Alertmanager 页面。
- 异常模拟脚本。

## 测试方法

1. 在项目根目录运行 `docker compose up -d`。
2. 使用 `docker compose ps` 检查容器状态。
3. 打开 Prometheus Targets 页面检查 target 是否为 UP。
4. 使用 PromQL 查询关键指标。
5. 打开 Grafana 检查数据源和 Dashboard。
6. 运行模拟脚本触发指标变化。
7. 打开 Prometheus Alerts 和 Alertmanager 页面观察告警状态。

## 测试用例表

| 测试编号 | 测试名称 | 测试目标 | 操作步骤 | 预期结果 | 实际结果 | 截图位置 | 是否通过 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T01 | Docker Compose 启动测试 | 验证 8 个核心服务可启动 | 执行 `docker compose up -d` 和 `docker compose ps` | 服务处于 running 或 healthy 状态 | 待本地运行后填写 | `./images/t01-compose-ps.png` | 待本地运行后填写 |
| T02 | Prometheus Targets 测试 | 验证 Prometheus 能看到采集目标 | 打开 `http://localhost:9090/targets` | 主要 target 显示 UP | 待本地运行后填写 | `./images/t02-prometheus-targets.png` | 待本地运行后填写 |
| T03 | 静态服务发现测试 | 验证 static_configs 生效 | 查看 prometheus、node-exporter、cadvisor、alertmanager、blackbox-exporter target | 静态 target 存在并可采集 | 待本地运行后填写 | `./images/t03-static-targets.png` | 待本地运行后填写 |
| T04 | 动态服务发现测试 | 验证 file_sd_configs 生效 | 查看 dynamic-file-sd job | security-exporter 和 demo-app 被发现 | 待本地运行后填写 | `./images/t04-file-sd.png` | 待本地运行后填写 |
| T05 | node_exporter 主机指标测试 | 验证主机指标采集 | 查询 `node_cpu_seconds_total` | 能返回主机 CPU 指标 | 待本地运行后填写 | `./images/t05-node-exporter.png` | 待本地运行后填写 |
| T06 | cAdvisor 容器指标测试 | 验证容器指标采集 | 查询 `container_memory_usage_bytes` | 能返回容器内存指标 | 待本地运行后填写 | `./images/t06-cadvisor.png` | 待本地运行后填写 |
| T07 | blackbox 服务探测测试 | 验证服务可用性探测 | 查询 `probe_success` | demo-app health 探测成功为 1 | 待本地运行后填写 | `./images/t07-blackbox.png` | 待本地运行后填写 |
| T08 | security_exporter 指标测试 | 验证安全指标采集 | 访问 `/metrics` 或查询 `security_risk_score` | 能看到模拟安全指标 | 待本地运行后填写 | `./images/t08-security-exporter.png` | 待本地运行后填写 |
| T09 | Grafana 数据源测试 | 验证 Prometheus 数据源 | 打开 Grafana Data sources | Prometheus 数据源存在 | 待本地运行后填写 | `./images/t09-grafana-datasource.png` | 待本地运行后填写 |
| T10 | Grafana Dashboard 测试 | 验证 Dashboard 自动加载 | 打开 SecureMonitor 文件夹 | 四类 Dashboard 存在 | 待本地运行后填写 | `./images/t10-grafana-dashboard.png` | 待本地运行后填写 |
| T11 | CPU 高负载告警测试 | 验证 CPU 指标和告警链路 | 运行 `sh scripts/simulate_cpu_load.sh 60` | CPU 指标升高，是否触发取决于持续时间和环境 | 待本地运行后填写 | `./images/t11-cpu-alert.png` | 待本地运行后填写 |
| T12 | 服务宕机告警测试 | 验证 demo-app down 告警 | 运行 `sh scripts/simulate_service_down.sh` | blackbox 探测失败，相关告警进入 pending/firing | 待本地运行后填写 | `./images/t12-service-down.png` | 待本地运行后填写 |
| T13 | 失败登录安全告警测试 | 验证安全告警 | 运行 `python scripts/simulate_failed_login.py 20` | 失败登录指标增长，满足规则后触发告警 | 待本地运行后填写 | `./images/t13-failed-login-alert.png` | 待本地运行后填写 |
| T14 | Alertmanager 告警展示测试 | 验证 Alertmanager 页面 | 打开 `http://localhost:9093` | 可查看 Prometheus 发送的告警 | 待本地运行后填写 | `./images/t14-alertmanager.png` | 待本地运行后填写 |
| T15 | Docker 容器重启模拟测试 | 验证容器重启模拟指标 | 运行 `sh scripts/simulate_container_restart.sh` | demo-app 重启，security_container_restart_total 增加 | 待本地运行后填写 | `./images/t15-container-restart.png` | 待本地运行后填写 |

## 异常模拟场景

| 场景 | 脚本 | 预期结果 | 实际结果 |
| --- | --- | --- | --- |
| CPU 高负载 | `sh scripts/simulate_cpu_load.sh 60` | 主机 CPU 指标短时升高 | 待本地运行后填写 |
| 失败登录 | `python scripts/simulate_failed_login.py 20` | `security_failed_login_total` 增加 | 待本地运行后填写 |
| 高风险分数 | `python scripts/simulate_security_risk.py 90` | `security_risk_score` 设置为 90 | 待本地运行后填写 |
| 服务下线 | `sh scripts/simulate_service_down.sh` | demo-app 停止，blackbox 探测失败 | 待本地运行后填写 |
| 容器重启 | `sh scripts/simulate_container_restart.sh` | demo-app 重启，模拟重启计数增加 | 待本地运行后填写 |

## 验收标准

- Docker Compose 配置可解析。
- Prometheus 能加载静态服务发现和文件型动态服务发现。
- Prometheus 能加载告警规则。
- Grafana 能自动加载 Prometheus 数据源和 Dashboard。
- security_exporter 和 demo-app 能暴露 `/health` 和 `/metrics`。
- Alertmanager 配置存在且可用于页面展示告警。
- 测试结果不编造，实际结果待本地运行后填写。

## 风险与注意事项

- Windows Docker Desktop 下 cAdvisor 和 node-exporter 的主机路径挂载可能与 Linux 不完全一致。
- 告警触发依赖指标持续时间，短时间演示可能只进入 pending 状态。
- 未接入真实通知渠道，Alertmanager 以页面展示为主。
- Kubernetes 部分为扩展研究，不作为 Docker Compose 主实现的运行前提。
