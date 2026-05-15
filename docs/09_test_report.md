# 09 测试报告

## 测试时间

待本地运行后填写。

## 测试环境

| 项目 | 内容 |
| --- | --- |
| 操作系统 | 待本地运行后填写 |
| Docker Desktop / Docker Engine | 待本地运行后填写 |
| Docker Compose | 待本地运行后填写 |
| 浏览器 | 待本地运行后填写 |
| 项目路径 | 待本地运行后填写 |

## 测试人员

待本地运行后填写。

## 测试结果汇总表

| 测试编号 | 测试名称 | 结果 | 备注 |
| --- | --- | --- | --- |
| T01 | Docker Compose 启动测试 | 待本地运行后填写 |  |
| T02 | Prometheus Targets 测试 | 待本地运行后填写 |  |
| T03 | 静态服务发现测试 | 待本地运行后填写 |  |
| T04 | 动态服务发现测试 | 待本地运行后填写 |  |
| T05 | node_exporter 主机指标测试 | 待本地运行后填写 |  |
| T06 | cAdvisor 容器指标测试 | 待本地运行后填写 |  |
| T07 | blackbox 服务探测测试 | 待本地运行后填写 |  |
| T08 | security_exporter 指标测试 | 待本地运行后填写 |  |
| T09 | Grafana 数据源测试 | 待本地运行后填写 |  |
| T10 | Grafana Dashboard 测试 | 待本地运行后填写 |  |
| T11 | CPU 高负载告警测试 | 待本地运行后填写 |  |
| T12 | 服务宕机告警测试 | 待本地运行后填写 |  |
| T13 | 失败登录安全告警测试 | 待本地运行后填写 |  |
| T14 | Alertmanager 告警展示测试 | 待本地运行后填写 |  |
| T15 | Docker 容器重启模拟测试 | 待本地运行后填写 |  |

## 详细测试结果

### T01 Docker Compose 启动测试

- 操作步骤：执行 `docker compose up -d`，再执行 `docker compose ps`。
- 实际结果：待本地运行后填写。
- 截图：

![Docker Compose PS](./images/t01-compose-ps.png)

### T02 Prometheus Targets 测试

- 操作步骤：访问 `http://localhost:9090/targets`。
- 实际结果：待本地运行后填写。
- 截图：

![Prometheus Targets](./images/prometheus-targets.png)

### T10 Grafana Dashboard 测试

- 操作步骤：访问 `http://localhost:3000`，进入 SecureMonitor Dashboard。
- 实际结果：待本地运行后填写。
- 截图：

![Grafana Dashboard](./images/grafana-dashboard.png)

### T14 Alertmanager 告警展示测试

- 操作步骤：访问 `http://localhost:9093`。
- 实际结果：待本地运行后填写。
- 截图：

![Alertmanager](./images/alertmanager.png)

## 问题记录

| 编号 | 问题描述 | 影响 | 处理方式 | 状态 |
| --- | --- | --- | --- | --- |
| P01 | 待本地运行后填写 | 待本地运行后填写 | 待本地运行后填写 | 待本地运行后填写 |

## 截图占位

![Prometheus Targets](./images/prometheus-targets.png)
![Grafana Host Dashboard](./images/grafana-host-dashboard.png)
![Grafana Container Dashboard](./images/grafana-container-dashboard.png)
![Grafana Service Dashboard](./images/grafana-service-dashboard.png)
![Grafana Security Dashboard](./images/grafana-security-dashboard.png)
![Prometheus Alerts](./images/prometheus-alerts.png)
![Alertmanager Alerts](./images/alertmanager-alerts.png)

## 测试总结

当前报告模板不包含任何编造结果。所有实际结果、截图和通过状态均需在本地运行 Docker Compose 后填写。
