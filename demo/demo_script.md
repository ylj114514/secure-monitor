# SecureMonitor OS 演示视频分镜与讲解脚本

## 片头：项目启动命令

画面：终端启动画面展示项目目录、Docker Compose 启动命令和容器状态检查命令。

字幕：项目启动命令：进入项目目录，执行 docker compose up -d 启动全部监控服务，再用 docker compose ps 核对容器状态。

讲解要点：
- 进入项目目录：`cd C:\Users\52697\secure-monitor`。
- 启动服务：`docker compose up -d`。
- 查看状态：`docker compose ps`。
- 主界面地址：`http://127.0.0.1:7001`。

## 过渡：演示准备

画面：浏览器打开 SecureMonitor OS，等待实时数据加载。

字幕：演示准备：启动命令展示完成，正在进入 SecureMonitor OS 主界面并加载实时监控数据。

## 1. 系统总览

画面：总览页，鼠标停留在左侧“总览”菜单和中间状态卡片附近。

字幕：SecureMonitor OS 总览：本项目围绕 Docker / Kubernetes 环境下的 Prometheus + Grafana 监控集群展开，统一展示采集、告警、可视化和安全模拟。

讲解要点：
- 顶部状态栏展示 Prometheus、Grafana、Alertmanager、Targets、Alerts、CPU、内存、磁盘。
- 总览卡片展示 Targets 在线数量、活跃告警、综合风险和服务可用性。
- 服务拓扑说明 Exporters、Prometheus、Alertmanager、Grafana、SecureMonitor OS 的数据流。

## 2. 主机监控

字幕：物理节点监控：主机监控页面展示 CPU、内存、磁盘等本机指标，并将宿主机运行状态汇总到 Prometheus。

讲解要点：
- node_exporter 采集物理节点指标。
- Windows host metrics exporter 补充 Windows 宿主机显示。
- 对应课程要求中的本机服务器性能监控。

## 3. 容器监控

字幕：Docker 容器监控：容器监控页面体现 cAdvisor 对 Docker 容器 CPU、内存、网络和运行状态的采集能力。

讲解要点：
- node_exporter 面向主机，cAdvisor 面向容器。
- 容器资源指标进入 Prometheus 后可被 Grafana 和 SecureMonitor OS 展示。

## 4. 服务探测

字幕：Service 可用性探测：服务探测页面通过 blackbox_exporter 和 demo-app 验证 HTTP 服务是否可访问，并展示响应情况。

讲解要点：
- demo-app 暴露 `/health` 和 `/metrics`。
- blackbox_exporter 从外部视角探测服务是否可用。
- 对应课程要求中的 service 资源监控。

## 5. Prometheus Targets

字幕：Prometheus 服务发现：Targets 页面把静态服务发现和 file_sd 动态服务发现转成中文表格，便于说明采集目标状态。

讲解要点：
- 静态 target 包括 prometheus、node-exporter、cadvisor、alertmanager、blackbox-exporter。
- file_sd 动态 target 包括 security-exporter 和 demo-app。
- 表格展示 job、instance、health、labels 和抓取状态。

## 6. 安全中心

字幕：自定义安全指标：安全中心展示失败登录、可疑请求、开放端口、容器重启和安全风险分数等课程模拟指标。

讲解要点：
- security_exporter 将安全事件转换为 Prometheus 指标。
- 指标只用于课程演示，不读取真实隐私数据。

## 7. 告警中心

字幕：告警闭环展示：告警中心整合 Prometheus 与 Alertmanager 的告警数据，能够看到告警名称、级别、来源、状态和处理建议。

讲解要点：
- Prometheus rules 负责判断异常。
- Alertmanager 负责告警分组、去重、路由和展示。
- 页面把原始告警 JSON 转换成中文表格。

## 8. 告警规则

字幕：告警规则页面解释主机、容器、服务和安全四类规则，说明 PromQL 条件和排查建议。

讲解要点：
- 说明每条规则的 PromQL、触发条件、严重等级和排查方式。
- 体现不是只展示数据，而是把告警解释成课程项目报告展示可理解的材料。

## 9. 验收清单

字幕：课程验收清单：本页把老师要求、项目实现、证据文件和截图位置对应起来，形成可检查的提交材料链路。

讲解要点：
- 映射 Prometheus + Grafana、服务发现、容器监控、主机监控、Kubernetes 研究等课程要求。
- 便于提交前逐项核查。

## 10. Grafana

字幕：Grafana Dashboard：Grafana 页面保留专业 Dashboard 入口，用于展示主机、容器、服务和安全监控大屏，数据源为 Prometheus。

讲解要点：
- Grafana 是专业图表工具。
- 本项目通过 provisioning 自动加载 Prometheus 数据源和 Dashboard。
- 主机大屏默认显示“Windows 本机 C 盘”，内部映射到 Docker Desktop 可查询的宿主机挂载点，避免展示节点内部路径。
- 容器大屏会切换两个真实 Docker 容器 ID，展示不同监控对象的 CPU、内存和网络曲线。

## 11. 异常模拟

字幕：异常模拟页面逐个点击失败登录、可疑请求、风险分数、开放端口、高 CPU 进程、容器重启等模拟按钮，验证指标变化和告警链路。

讲解要点：
- 模拟按钮调用后端和 security_exporter。
- 服务宕机类操作只给出命令提示，不直接执行危险操作。
- 先展示安全中心的指标即时变化。
- 等待 Prometheus 抓取和告警规则评估后，再展示告警中心、总览和 Grafana 安全大屏变化。

## 12. Kubernetes 研究

字幕：Kubernetes 扩展研究：Kubernetes 研究页说明在真实集群中如何通过 kube-prometheus-stack、ServiceMonitor、PodMonitor 监控 Pod、Service 和 Deployment。

讲解要点：
- Docker Compose 是主实现。
- Kubernetes 是扩展研究与可选实验。
- 说明 Node、Pod、Service、Deployment 的监控对象差异。

## 13. 总结

字幕：演示总结：项目完成了从指标采集、服务发现、告警管理、Grafana 可视化到 SecureMonitor OS 统一展示的完整演示闭环。

讲解要点：
- 系统覆盖采集、告警、可视化、安全模拟和 Kubernetes 研究。
- 最终可以作为课程项目报告展示和报告截图的统一展示入口。
