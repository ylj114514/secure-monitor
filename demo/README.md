# SecureMonitor OS Demo

本目录用于生成 SecureMonitor OS 课程项目报告展示视频，不修改项目核心业务代码。

当前最终版视频为 `demo/project_demo.mp4`，时长约 6 分半，已经完成 WebM 到 MP4 转换，并内嵌中文字幕。视频开头使用 Windows 本机真实 `cmd.exe` / Windows Terminal 录屏展示启动命令，不使用网页模拟终端。

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `demo_plan.md` | 项目演示路线和页面覆盖计划 |
| `demo_script.md` | 视频分镜和底部字幕讲解稿 |
| `record_demo.js` | Playwright 自动录制脚本 |
| `subtitles.srt` | 录制生成的字幕文件 |
| `project_demo.webm` | Playwright 原始录制视频 |
| `project_demo.mp4` | 最终 MP4 视频 |
| `recording_guide.md` | 录制与排障说明 |

## 最终版展示内容

最终版演示视频覆盖以下内容：

1. 开场展示项目启动命令：`cd C:\Users\52697\secure-monitor`、`docker compose up -d`、`docker compose ps` 和主界面地址。
2. SecureMonitor OS 总览、主机监控、容器监控、服务探测、Targets、安全中心、告警中心、告警规则、验收清单、Grafana、Kubernetes。
3. Grafana 真实 Dashboard 展示，包括主机大屏、容器大屏和安全大屏；主机大屏显示 Windows 本机指标，容器大屏会切换真实 Docker 容器监控对象。
4. 异常模拟实操，逐个点击失败登录、可疑请求、风险分数、开放端口、高 CPU 进程、容器重启、服务宕机命令和恢复命令按钮。
5. 异常触发后的界面变化，包括安全中心指标变化、告警中心活跃告警、总览页风险变化和 Grafana 安全大屏变化。

## 重新生成视频

```powershell
cd C:\Users\52697\secure-monitor
docker compose up -d
$env:NODE_PATH="C:\Users\52697\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\playwright@1.60.0\node_modules;C:\Users\52697\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\playwright-core@1.60.0\node_modules"
C:\Users\52697\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\demo\record_demo.js
.\demo\replace_intro_with_real_cmd.ps1
```

`record_demo.js` 负责录制前端、Grafana 和异常模拟主流程；`replace_intro_with_real_cmd.ps1` 会打开真实 Windows 命令行窗口，录制 `docker compose up -d` 和 `docker compose ps`，并替换视频前 18 秒。

## 修改字幕

字幕内容在 `record_demo.js` 的 `scenes` 数组中维护。修改后重新运行脚本即可更新：

- 画面内嵌字幕
- `demo/subtitles.srt`
- `demo/project_demo.webm`
- `demo/project_demo.mp4`

## 注意事项

- 视频中的字幕已经烧录到画面中。
- `subtitles.srt` 是额外保留的字幕文件。
- 脚本使用叠加鼠标指针，因为 Playwright 默认视频不捕获系统鼠标。
- 录制过程会触发模拟安全指标变化，但不会停止服务、删除文件或删除容器。
- 服务宕机和恢复按钮只生成演示命令，录制脚本不会直接执行停服命令。
