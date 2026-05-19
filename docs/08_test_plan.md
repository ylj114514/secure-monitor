# 08 测试计划

## 测试目标

验证 SecureMonitor OS 是否能启动监控基础设施和统一控制台，并在 Web 界面展示总览、Targets、安全指标、告警、Grafana 入口和异常模拟功能。

## 测试环境

| 项目 | 内容 |
| --- | --- |
| 操作系统 | 待本地运行后填写 |
| Docker Desktop / Docker Engine | 待本地运行后填写 |
| Docker Compose | 待本地运行后填写 |
| 浏览器 | 待本地运行后填写 |

## 测试用例

| 编号 | 名称 | 操作步骤 | 预期结果 | 实际结果 | 截图位置 | 是否通过 |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Docker Compose 启动测试 | `docker compose up -d` | 所有核心服务启动 | 待本地运行后填写 | `./images/t01-compose.png` | 待本地运行后填写 |
| T02 | Prometheus Targets 测试 | 访问 `/targets` | targets 可见 | 待本地运行后填写 | `./images/t02-targets.png` | 待本地运行后填写 |
| T03 | 静态服务发现测试 | 查看 static jobs | 静态 target 存在 | 待本地运行后填写 | `./images/t03-static.png` | 待本地运行后填写 |
| T04 | 动态服务发现测试 | 查看 file_sd job | security-exporter 和 demo-app 存在 | 待本地运行后填写 | `./images/t04-file-sd.png` | 待本地运行后填写 |
| T05 | node_exporter 主机指标测试 | 查询 node 指标 | 返回主机指标 | 待本地运行后填写 | `./images/t05-node.png` | 待本地运行后填写 |
| T06 | cAdvisor 容器指标测试 | 查询 container 指标 | 返回容器指标 | 待本地运行后填写 | `./images/t06-cadvisor.png` | 待本地运行后填写 |
| T07 | blackbox 服务探测测试 | 查询 `probe_success` | 返回探测指标 | 待本地运行后填写 | `./images/t07-blackbox.png` | 待本地运行后填写 |
| T08 | security_exporter 指标测试 | 访问 `/metrics` | 返回安全指标 | 待本地运行后填写 | `./images/t08-security.png` | 待本地运行后填写 |
| T09 | Grafana 数据源测试 | 打开 Grafana 数据源 | Prometheus 数据源存在 | 待本地运行后填写 | `./images/t09-datasource.png` | 待本地运行后填写 |
| T10 | Grafana Dashboard 测试 | 打开 Dashboards | 四类 Dashboard 存在 | 待本地运行后填写 | `./images/t10-dashboard.png` | 待本地运行后填写 |
| T11 | CPU 高负载告警测试 | 执行 CPU 模拟脚本 | 指标升高，告警视持续时间而定 | 待本地运行后填写 | `./images/t11-cpu.png` | 待本地运行后填写 |
| T12 | 服务宕机告警测试 | 停止 demo-app | blackbox 探测失败 | 待本地运行后填写 | `./images/t12-down.png` | 待本地运行后填写 |
| T13 | 失败登录安全告警测试 | 运行失败登录脚本 | 安全指标增长 | 待本地运行后填写 | `./images/t13-login.png` | 待本地运行后填写 |
| T14 | Alertmanager 告警展示测试 | 打开 Alertmanager | 告警可展示 | 待本地运行后填写 | `./images/t14-alertmanager.png` | 待本地运行后填写 |
| T15 | 容器重启模拟测试 | 运行重启脚本 | 重启指标增加 | 待本地运行后填写 | `./images/t15-restart.png` | 待本地运行后填写 |
| T16 | console-backend 健康检查 | 访问 `http://localhost:7000/api/health` | 返回 `status=ok` | 待本地运行后填写 | `./images/t16-backend.png` | 待本地运行后填写 |
| T17 | console-frontend 页面访问 | 访问 `http://localhost:7001` | SecureMonitor OS 打开 | 待本地运行后填写 | `./images/t17-frontend.png` | 待本地运行后填写 |
| T18 | 总览页数据展示 | 打开总览页 | 显示状态、Targets、告警、安全风险 | 待本地运行后填写 | `./images/t18-overview.png` | 待本地运行后填写 |
| T19 | Targets 页面展示 | 打开 Targets 页 | 显示 job、instance、health | 待本地运行后填写 | `./images/t19-console-targets.png` | 待本地运行后填写 |
| T20 | 安全中心指标展示 | 打开安全中心 | 显示 security_exporter 指标 | 待本地运行后填写 | `./images/t20-security-center.png` | 待本地运行后填写 |
| T21 | 告警中心展示 | 打开告警中心 | 显示 Prometheus/Alertmanager 告警 | 待本地运行后填写 | `./images/t21-alert-center.png` | 待本地运行后填写 |
| T22 | 异常模拟按钮测试 | 点击模拟失败登录/风险分数 | 返回结果，指标变化 | 待本地运行后填写 | `./images/t22-simulation.png` | 待本地运行后填写 |
| T23 | Grafana 入口测试 | 打开 Grafana 页面 | 链接或 iframe 可用 | 待本地运行后填写 | `./images/t23-grafana-entry.png` | 待本地运行后填写 |

## 注意事项

未实际运行的测试结果不得编造，统一填写“待本地运行后填写”。
