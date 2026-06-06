# SecureMonitor OS 录制与合成指南

## 1. 前置条件

确保项目服务已启动：

```powershell
cd C:\Users\52697\secure-monitor
docker compose up -d
docker compose ps
```

确认主界面可访问：

```text
http://127.0.0.1:7001
```

## 2. 录制命令

本项目使用 Playwright 自动录制浏览器页面，并用 ffmpeg 转换为 MP4：

```powershell
cd C:\Users\52697\secure-monitor
$env:NODE_PATH="C:\Users\52697\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\playwright@1.60.0\node_modules;C:\Users\52697\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\playwright-core@1.60.0\node_modules"
C:\Users\52697\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\demo\record_demo.js
```

## 3. 输出文件

| 文件 | 说明 |
| --- | --- |
| `demo/project_demo.webm` | Playwright 原始录制视频 |
| `demo/project_demo.mp4` | 最终 MP4 演示视频 |
| `demo/subtitles.srt` | 时间轴字幕 |
| `demo/demo_plan.md` | 演示规划 |
| `demo/demo_script.md` | 分镜与讲解脚本 |
| `demo/README.md` | 复现说明 |

## 4. 字幕说明

录制时会在页面底部叠加字幕，因此 `project_demo.mp4` 的画面中已经包含字幕。`subtitles.srt` 同时保留，便于后续修改字幕或重新合成。

## 5. 启动命令开场

最终版视频开头会先录入项目启动命令画面，展示：

```powershell
cd C:\Users\52697\secure-monitor
docker compose up -d
docker compose ps
```

最终版提交视频使用真实 Windows 命令行窗口作为开场，不使用网页模拟终端。先运行 `record_demo.js` 生成完整前端演示，再运行：

```powershell
.\demo\replace_intro_with_real_cmd.ps1
```

该脚本会打开本机 `cmd.exe` / Windows Terminal 窗口，录制 `docker compose up -d` 和 `docker compose ps` 的真实执行画面，然后替换 `demo/project_demo.mp4` 的前 18 秒。

## 6. 鼠标说明

Playwright 的视频录制默认不会捕获系统真实鼠标指针。脚本使用一个自定义鼠标指针叠加层，并通过三次贝塞尔曲线同步移动，以保证最终视频中能看到自然移动的鼠标引导。

## 7. Grafana 录制内容

录制脚本会进入真实 Grafana 页面。主机大屏默认显示“Windows 本机 C 盘”，内部映射到 Docker Desktop 可查询的宿主机挂载点；容器大屏会从 Prometheus 动态读取两个 Docker 容器 ID 并切换“监控对象”，再进入安全大屏展示高 CPU 进程数量等模拟安全指标。

## 8. 异常模拟录制内容

基础页面全部展示完成后，录制脚本会进入“异常模拟”页面并逐个点击模拟按钮：失败登录、可疑请求、风险分数、开放端口、高 CPU 进程、容器重启、服务宕机命令和恢复命令。随后脚本先展示安全中心的指标变化，再等待 Prometheus 抓取与告警规则评估，最后展示告警中心、总览和 Grafana 安全大屏中的变化结果。

## 9. 如果无法录制

如果浏览器录制失败：

1. 检查 Docker 服务是否启动。
2. 检查 `http://127.0.0.1:7001` 是否可访问。
3. 检查 Node 运行时和 Playwright 模块路径。
4. 检查 ffmpeg 是否可用。脚本会优先使用 `FFMPEG_PATH`，然后查找临时 npm 安装路径和系统 `ffmpeg`。

如果 ffmpeg 不可用，可以先保留 `demo/project_demo.webm` 和 `demo/subtitles.srt`，之后用以下命令转码：

```powershell
ffmpeg -y -i demo/project_demo.webm -c:v libx264 -pix_fmt yuv420p -preset medium -crf 20 -movflags +faststart -an demo/project_demo.mp4
```
