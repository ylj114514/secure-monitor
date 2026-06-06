# SecureMonitor OS 项目演示规划

## 1. 项目名称

SecureMonitor OS：基于 Docker / Kubernetes 的 Prometheus + Grafana 安全监控可视化操作台。

## 2. 项目简介

SecureMonitor OS 是《网络安全编程技术与实例开发》课程设计第 4 题的项目实现。项目使用 Docker Compose 启动 Prometheus、Grafana、Alertmanager、node_exporter、cAdvisor、blackbox_exporter、自定义 security_exporter、demo-app、console-backend 和 console-frontend，并通过一个中文化 Web 控制台统一展示监控采集、服务发现、告警处理、Grafana 大屏、安全模拟和 Kubernetes 扩展研究。

## 3. 主要技术栈

| 类型 | 技术 |
| --- | --- |
| 容器编排 | Docker Compose |
| 指标采集与存储 | Prometheus |
| 可视化 | Grafana |
| 告警管理 | Alertmanager |
| 主机指标 | node_exporter / Windows host metrics exporter |
| 容器指标 | cAdvisor |
| 服务探测 | blackbox_exporter |
| 安全指标 | 自定义 security_exporter |
| 后端 | Python FastAPI |
| 前端 | React + Vite + TypeScript |
| 自动化录制 | Playwright + ffmpeg |

## 4. 需要启动的服务

项目主运行目录为 `C:\Users\52697\secure-monitor`。

```powershell
cd C:\Users\52697\secure-monitor
docker compose up -d
docker compose ps
```

录制前需要确认以下地址可访问：

| 服务 | 地址 | 验证重点 |
| --- | --- | --- |
| SecureMonitor OS | `http://127.0.0.1:7001` | 主演示界面 |
| console-backend | `http://127.0.0.1:7000/api/health` | 后端 API 正常 |
| Prometheus | `http://127.0.0.1:9090/-/ready` | 指标服务就绪 |
| Grafana | `http://127.0.0.1:3000/api/health` | Dashboard 服务就绪 |
| Alertmanager | `http://127.0.0.1:9093/-/ready` | 告警管理就绪 |

## 5. 演示视频总时长

最终完整演示视频约 6 分半。该版本不再只做快速浏览，而是先展示项目启动命令，再完整覆盖 SecureMonitor OS 主界面、Grafana 真实 Dashboard、Kubernetes 扩展研究、异常模拟按钮实操，以及异常触发后的安全中心、告警中心、总览页和 Grafana 安全大屏变化。

## 6. 演示章节与路线

| 顺序 | 页面 | 展示元素 | 字幕重点 | 鼠标停留目标 | 定位方式 |
| --- | --- | --- | --- | --- | --- |
| 1 | 启动命令行 | `cd C:\Users\52697\secure-monitor`、`docker compose up -d`、`docker compose ps`、主界面地址 | 说明项目从命令行启动完整 Docker Compose 监控系统 | 终端启动画面 | 自动生成终端开场 |
| 2 | 总览 | 顶部状态栏、Targets、告警、综合风险、服务拓扑 | 说明统一控制台和系统整体状态 | 左侧“总览”按钮、总览卡片 | `button[name="总览"]` |
| 3 | 主机监控 | CPU、内存、磁盘、node_exporter 状态 | 说明物理节点指标采集 | 左侧“主机监控”按钮和资源卡片 | `button[name="主机监控"]` |
| 4 | 容器监控 | cAdvisor 状态、容器资源指标 | 说明 Docker 容器监控能力 | 左侧“容器监控”按钮和容器卡片 | `button[name="容器监控"]` |
| 5 | 服务探测 | demo-app、blackbox、probe_success、响应耗时 | 说明 service 可用性探测 | 左侧“服务探测”按钮 | `button[name="服务探测"]` |
| 6 | Targets | Job、Instance、Health、Labels、搜索过滤 | 说明静态服务发现和 file_sd 动态发现 | 左侧“Targets”按钮和表格 | `button[name="Targets"]` |
| 7 | 安全中心 | 失败登录、可疑请求、开放端口、容器重启、风险分数 | 说明 security_exporter 安全模拟指标 | 左侧“安全中心”按钮 | `button[name="安全中心"]` |
| 8 | 告警中心 | 告警统计、严重级别、状态、来源、描述 | 说明 Prometheus + Alertmanager 告警闭环 | 左侧“告警中心”按钮 | `button[name="告警中心"]` |
| 9 | 告警规则 | 主机、容器、服务、安全四类规则 | 说明 PromQL 条件和排查建议 | 左侧“告警规则”按钮 | `button[name="告警规则"]` |
| 10 | 验收清单 | 课程要求、项目实现、证据文件、截图建议 | 说明课程提交证据链 | 左侧“验收清单”按钮 | `button[name="验收清单"]` |
| 11 | Grafana | Dashboard 入口和四类大屏说明 | 说明 Grafana 数据源与 Dashboard | 左侧“Grafana”按钮 | `button[name="Grafana"]` |
| 12 | Grafana 真实大屏 | 主机、容器、安全 Dashboard，并切换主机磁盘和容器监控对象 | 说明 Grafana provisioning、Prometheus 数据源和不同监控对象切换 | Grafana Dashboard 变量和面板 | Grafana URL |
| 13 | Kubernetes | kube-prometheus-stack、ServiceMonitor、PodMonitor、k8s 示例 | 说明 Kubernetes 扩展研究 | 左侧“Kubernetes”按钮 | `button[name="Kubernetes"]` |
| 14 | 异常模拟实操 | 逐个点击失败登录、可疑请求、风险分数、开放端口、高 CPU 进程、容器重启、服务宕机命令和恢复命令 | 先触发异常，再展示安全中心、告警中心、总览和 Grafana 安全大屏变化 | 左侧“异常模拟”按钮和各模拟按钮 | `button[name="异常模拟"]`、`.command-button` |
| 15 | 总览总结 | 返回系统总览 | 总结采集、告警、可视化、安全指标和课程要求映射闭环 | 左侧“总览”按钮 | `button[name="总览"]` |

## 7. 字幕规划

字幕统一显示在画面底部。每段字幕与当前页面同步，内容不使用过长句，避免遮挡界面。视频画面中会内嵌字幕，同时输出 `demo/subtitles.srt` 供后续调整。

## 8. 鼠标引导规划

录制脚本实现 `moveMouseHumanLike(page, target)` 和 `hoverElementWithNarration(page, selector, subtitle, duration)`：

- 根据元素 `boundingBox()` 计算目标点。
- 使用三次贝塞尔曲线生成鼠标轨迹。
- 使用 `easeInOutCubic` 控制缓入缓出。
- 每一步加入轻微扰动。
- 点击前后保留短暂停顿。
- 由于 Playwright 浏览器录制默认不捕获真实鼠标指针，脚本额外绘制一个可见鼠标指针叠加层，并与 `page.mouse.move()` 同步移动。

## 9. 异常模拟数据策略

录制脚本会在开始录制前调用重置接口清理 security_exporter 的模拟状态，保证视频前半段展示的是稳定基线。完成基础页面和 Grafana 展示后，脚本会逐个点击异常模拟按钮：

- 模拟 20 次失败登录。
- 模拟 25 次可疑请求。
- 设置风险分数为 90。
- 设置开放端口为 12。
- 模拟 3 个高 CPU 进程。
- 模拟容器重启。
- 生成服务宕机演示命令。
- 生成 demo-app 恢复命令。

点击完成后，视频会展示安全中心的即时指标变化，并等待 Prometheus 抓取和告警规则评估，再展示告警中心、总览页和 Grafana 安全大屏的变化。服务宕机相关按钮只生成演示命令，不直接停止容器。

## 10. 安全边界

- 不停止容器、不删除镜像、不修改业务代码。
- Kubernetes 页面只作为扩展研究展示，不声称已完成生产级 Kubernetes 部署。
- security_exporter 指标是课程演示模拟指标，不读取真实账号、密码、日志或隐私数据。
