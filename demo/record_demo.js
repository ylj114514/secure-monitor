const fs = require("fs/promises");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const outputDir = __dirname;
const tempVideoDir = path.join(outputDir, "raw-video");
const appUrl = "http://127.0.0.1:7001";
const viewport = { width: 1366, height: 768 };

const scenes = [
  {
    nav: "总览",
    seconds: 10,
    title: "SecureMonitor OS 总览",
    text: "本项目围绕 Docker / Kubernetes 环境下的 Prometheus + Grafana 监控集群展开，统一展示采集、告警、可视化和安全模拟。",
  },
  {
    nav: "主机监控",
    seconds: 10,
    title: "物理节点监控",
    text: "主机监控页面展示 CPU、内存、磁盘等本机指标，并将宿主机运行状态汇总到 Prometheus。",
  },
  {
    nav: "容器监控",
    seconds: 9,
    title: "Docker 容器监控",
    text: "容器监控页面体现 cAdvisor 对 Docker 容器 CPU、内存、网络和运行状态的采集能力。",
  },
  {
    nav: "服务探测",
    seconds: 9,
    title: "Service 可用性探测",
    text: "服务探测页面通过 blackbox_exporter 和 demo-app 验证 HTTP 服务是否可访问，并展示响应情况。",
  },
  {
    nav: "Targets",
    seconds: 13,
    title: "Prometheus 服务发现与详情展开",
    text: "Targets 页面会展开单个采集目标详情，说明任务名称、实例地址、健康状态、功能作用和报告展示结论。",
  },
  {
    nav: "安全中心",
    seconds: 10,
    title: "自定义安全指标",
    text: "安全中心展示失败登录、可疑请求、开放端口、容器重启和安全风险分数等课程模拟指标。",
  },
  {
    nav: "告警中心",
    seconds: 10,
    title: "告警闭环展示",
    text: "告警中心整合 Prometheus 与 Alertmanager 的告警数据，能够看到告警名称、级别、来源、状态和处理建议。",
  },
  {
    nav: "告警规则",
    seconds: 9,
    title: "告警规则说明",
    text: "告警规则页面把配置规则转换成人类可读的判断依据、触发条件、可能原因和处理建议，不直接展示底层配置细节。",
  },
  {
    nav: "验收清单",
    seconds: 9,
    title: "课程验收清单",
    text: "验收清单把老师要求、项目实现、证据文件和截图位置对应起来，形成可检查的提交材料链路。",
  },
  {
    nav: "Grafana",
    seconds: 28,
    title: "Grafana Dashboard",
    text: "本段会先展示 SecureMonitor 中的 Grafana 入口，再进入真实 Grafana Dashboard，切换本机盘符、容器监控对象和安全进程指标。",
  },
  {
    nav: "Kubernetes",
    seconds: 10,
    title: "Kubernetes 扩展研究",
    text: "Kubernetes 研究页展示 Deployment、Service、ServiceMonitor 到 Prometheus、Grafana 和 Alertmanager 的流程关系。",
  },
  {
    nav: "异常模拟",
    seconds: 130,
    title: "异常模拟实操与变化验证",
    text: "全部基础页面展示完成后，逐个点击异常模拟按钮，再切换到安全中心、告警中心、总览和 Grafana 查看指标与告警变化。",
  },
  {
    nav: "总览",
    seconds: 7,
    title: "演示总结",
    text: "至此，项目完成了从指标采集、服务发现、告警管理、Grafana 可视化到 SecureMonitor OS 统一展示的完整演示闭环。",
  },
];

const initialLoadSeconds = 5.2;
const navigationTransitionSeconds = 0.45;

function timestamp(seconds, comma = false) {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milli = ms % 1000;
  const sep = comma ? "," : ".";
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}${sep}${String(milli).padStart(3, "0")}`;
}

function makeVtt() {
  let cursor = 0;
  let out = "WEBVTT\n\n";
  out += `1\n${timestamp(0)} --> ${timestamp(initialLoadSeconds)}\n演示准备：系统正在加载监控数据和 SecureMonitor OS 主界面。\n\n`;
  cursor = initialLoadSeconds;
  scenes.forEach((scene, index) => {
    const start = cursor;
    const end = cursor + navigationTransitionSeconds + scene.seconds;
    out += `${index + 2}\n${timestamp(start)} --> ${timestamp(end)}\n${scene.title}：${scene.text}\n\n`;
    cursor = end;
  });
  return out;
}

function makeSrt() {
  let cursor = 0;
  let out = "";
  out += `1\n${timestamp(0, true)} --> ${timestamp(initialLoadSeconds, true)}\n演示准备：系统正在加载监控数据和 SecureMonitor OS 主界面。\n\n`;
  cursor = initialLoadSeconds;
  scenes.forEach((scene, index) => {
    const start = cursor;
    const end = cursor + navigationTransitionSeconds + scene.seconds;
    out += `${index + 2}\n${timestamp(start, true)} --> ${timestamp(end, true)}\n${scene.title}：${scene.text}\n\n`;
    cursor = end;
  });
  return out;
}

async function ensureSubtitleOverlay(page) {
  await page.addStyleTag({
    content: `
      #demo-subtitle-overlay {
        position: fixed;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%);
        width: min(1260px, calc(100vw - 28px));
        z-index: 2147483647;
        background: rgba(7, 12, 24, 0.86);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.22);
        box-shadow: 0 16px 46px rgba(0,0,0,0.38);
        border-radius: 8px;
        padding: 10px 16px 12px;
        font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
        pointer-events: none;
        backdrop-filter: blur(10px);
        word-break: keep-all;
        overflow-wrap: normal;
      }
      #demo-subtitle-overlay .demo-subtitle-title {
        font-size: 16px;
        font-weight: 700;
        line-height: 1.25;
        margin-bottom: 4px;
        color: #9bd3ff;
        white-space: nowrap;
      }
      #demo-subtitle-overlay .demo-subtitle-text {
        font-size: 19px;
        line-height: 1.38;
        font-weight: 600;
        letter-spacing: 0;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        word-break: keep-all;
        overflow-wrap: normal;
      }
      #demo-cursor-overlay {
        position: fixed;
        left: 0;
        top: 0;
        width: 28px;
        height: 28px;
        z-index: 2147483647;
        pointer-events: none;
        transform: translate(680px, 380px);
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.75));
      }
      #demo-cursor-overlay::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        border-left: 0 solid transparent;
        border-right: 18px solid transparent;
        border-top: 26px solid #ffffff;
      }
      #demo-cursor-overlay::after {
        content: "";
        position: absolute;
        left: 2px;
        top: 2px;
        width: 0;
        height: 0;
        border-left: 0 solid transparent;
        border-right: 13px solid transparent;
        border-top: 19px solid #1f2937;
        opacity: 0.55;
      }
      #demo-cursor-overlay.demo-clicking {
        transform: var(--cursor-transform) scale(0.88);
      }
    `,
  });
  await page.evaluate(() => {
    let overlay = document.getElementById("demo-subtitle-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "demo-subtitle-overlay";
      overlay.innerHTML =
        '<div class="demo-subtitle-title"></div><div class="demo-subtitle-text"></div>';
      document.body.appendChild(overlay);
    }
    window.__setDemoSubtitle = (title, text) => {
      const root = document.getElementById("demo-subtitle-overlay");
      root.querySelector(".demo-subtitle-title").textContent = title;
      root.querySelector(".demo-subtitle-text").textContent = text;
    };
    let cursor = document.getElementById("demo-cursor-overlay");
    if (!cursor) {
      cursor = document.createElement("div");
      cursor.id = "demo-cursor-overlay";
      document.body.appendChild(cursor);
    }
    window.__moveDemoCursor = (x, y) => {
      const el = document.getElementById("demo-cursor-overlay");
      const transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
      el.style.setProperty("--cursor-transform", transform);
      el.style.transform = transform;
    };
    window.__clickDemoCursor = () => {
      const el = document.getElementById("demo-cursor-overlay");
      el.classList.add("demo-clicking");
      setTimeout(() => el.classList.remove("demo-clicking"), 180);
    };
  });
}

async function setSubtitle(page, scene) {
  await ensureSubtitleOverlay(page);
  await page.evaluate(
    ({ title, text }) => window.__setDemoSubtitle(title, text),
    scene,
  );
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function cubicBezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x:
      u * u * u * p0.x +
      3 * u * u * t * p1.x +
      3 * u * t * t * p2.x +
      t * t * t * p3.x,
    y:
      u * u * u * p0.y +
      3 * u * u * t * p1.y +
      3 * u * t * t * p2.y +
      t * t * t * p3.y,
  };
}

function jitter(amount) {
  return (Math.random() - 0.5) * amount;
}

async function setCursorOverlay(page, point) {
  await page.evaluate(
    ({ x, y }) => window.__moveDemoCursor(x, y),
    { x: point.x, y: point.y },
  );
}

async function moveMouseHumanLike(page, fromPoint, toPoint, options = {}) {
  const steps = options.steps || 34;
  const delay = options.delay || 12;
  const bend = options.bend || 90;
  const p0 = fromPoint;
  const p3 = toPoint;
  const p1 = {
    x: p0.x + (p3.x - p0.x) * 0.28 + jitter(bend),
    y: p0.y + (p3.y - p0.y) * 0.18 + jitter(bend),
  };
  const p2 = {
    x: p0.x + (p3.x - p0.x) * 0.72 + jitter(bend),
    y: p0.y + (p3.y - p0.y) * 0.82 + jitter(bend),
  };

  for (let i = 1; i <= steps; i += 1) {
    const t = easeInOutCubic(i / steps);
    const point = cubicBezier(p0, p1, p2, p3, t);
    const moved = {
      x: Math.max(2, Math.min(viewport.width - 24, point.x + jitter(2.2))),
      y: Math.max(2, Math.min(viewport.height - 24, point.y + jitter(2.2))),
    };
    await page.mouse.move(moved.x, moved.y);
    await setCursorOverlay(page, moved);
    await page.waitForTimeout(delay + Math.round(Math.random() * 8));
  }
}

async function hoverElementWithNarration(page, locator, subtitle, durationMs, cursorState) {
  const box = await locator.boundingBox();
  if (!box) {
    await setSubtitle(page, subtitle);
    await page.waitForTimeout(durationMs);
    return cursorState;
  }
  const target = {
    x: box.x + box.width / 2 + jitter(Math.min(12, box.width / 6)),
    y: box.y + box.height / 2 + jitter(Math.min(10, box.height / 5)),
  };
  await moveMouseHumanLike(page, cursorState.point, target);
  cursorState.point = target;
  await setSubtitle(page, subtitle);
  await page.waitForTimeout(durationMs);
  return cursorState;
}

async function clickNavigation(page, name) {
  const button = page.getByRole("button", { name, exact: true });
  const box = await button.boundingBox();
  if (box) {
    const from = clickNavigation.cursorPoint || { x: 680, y: 380 };
    const to = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    await moveMouseHumanLike(page, from, to);
    clickNavigation.cursorPoint = to;
    await page.waitForTimeout(260);
  }
  await page.evaluate(() => window.__clickDemoCursor());
  await button.click({ timeout: 8000 });
  await page.waitForTimeout(360);
}

async function clickFirstButton(page, name) {
  const locator = page.getByRole("button", { name, exact: true }).first();
  await locator.waitFor({ state: "visible", timeout: 8000 });
  const box = await locator.boundingBox();
  if (box) {
    const from = clickNavigation.cursorPoint || { x: 680, y: 380 };
    const to = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    await moveMouseHumanLike(page, from, to, { steps: 28, delay: 10, bend: 70 });
    clickNavigation.cursorPoint = to;
    await page.waitForTimeout(240);
  }
  await page.evaluate(() => window.__clickDemoCursor());
  await locator.click({ timeout: 8000 });
  await page.waitForTimeout(700);
}

async function clickCommandButton(page, label, subtitle, waitMs = 1200) {
  const locator = page.locator("button.command-button").filter({ hasText: label }).first();
  await locator.waitFor({ state: "visible", timeout: 10000 });
  await locator.scrollIntoViewIfNeeded({ timeout: 8000 }).catch(() => undefined);
  const box = await locator.boundingBox();
  if (box) {
    const from = clickNavigation.cursorPoint || { x: 680, y: 380 };
    const to = { x: box.x + box.width / 2, y: box.y + Math.min(box.height / 2, 44) };
    await moveMouseHumanLike(page, from, to, { steps: 24, delay: 9, bend: 64 });
    clickNavigation.cursorPoint = to;
  }
  await setSubtitle(page, subtitle);
  await page.evaluate(() => window.__clickDemoCursor());
  await locator.click({ timeout: 8000 });
  await page.waitForTimeout(waitMs);
}

async function smoothScrollPage(page, durationMs = 3200) {
  const maxScroll = await page.evaluate(() => {
    const root = document.scrollingElement || document.documentElement;
    return Math.max(0, root.scrollHeight - window.innerHeight);
  });
  if (maxScroll < 80) {
    await page.waitForTimeout(durationMs);
    return;
  }
  const steps = 34;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const eased = easeInOutCubic(t);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "auto" }), maxScroll * eased);
    await page.waitForTimeout(Math.max(28, Math.floor(durationMs / steps)));
  }
  await page.waitForTimeout(450);
  for (let i = 0; i <= Math.floor(steps / 2); i += 1) {
    const t = i / Math.floor(steps / 2);
    const eased = easeInOutCubic(t);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "auto" }), maxScroll * (1 - eased));
    await page.waitForTimeout(35);
  }
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json().catch(() => ({}));
}

async function resetSimulationState() {
  await postJson("http://127.0.0.1:7000/api/simulation/reset-security");
}

async function ensureGrafanaLoggedIn(page) {
  if (!/127\.0\.0\.1:3000/.test(page.url())) return;
  const userInput = page.locator('input[name="user"]');
  await userInput.waitFor({ state: "visible", timeout: 9000 }).catch(() => undefined);
  if ((await userInput.count()) > 0 && (await userInput.isVisible().catch(() => false))) {
    await userInput.fill("admin");
    await page.locator('input[name="password"]').fill("admin");
    const submit = page.locator('button[type="submit"]').first();
    await submit.click({ timeout: 8000 });
    await page.waitForLoadState("load", { timeout: 16000 }).catch(() => undefined);
    await page.waitForTimeout(1800);
  }
  const skipCandidates = [
    page.getByRole("button", { name: "Skip", exact: true }),
    page.getByRole("button", { name: "跳过", exact: true }),
    page.getByRole("button", { name: "Skip change password", exact: true }),
  ];
  for (const skip of skipCandidates) {
    if ((await skip.count()) > 0) {
      await skip.click({ timeout: 5000 }).catch(() => undefined);
      await page.waitForTimeout(900);
      break;
    }
  }
}

async function getGrafanaDemoContainerIds() {
  const query = encodeURIComponent('topk(2, container_memory_usage_bytes{id=~"/docker/.+"})');
  try {
    const response = await fetch(`http://127.0.0.1:9090/api/v1/query?query=${query}`);
    const body = await response.json();
    const ids = (body?.data?.result || [])
      .map((item) => item?.metric?.id)
      .filter((id) => typeof id === "string" && id.startsWith("/docker/"));
    return [...new Set(ids)].slice(0, 2);
  } catch {
    return [];
  }
}

async function openGrafanaDashboard(page, url, headingText) {
  await page.goto(url, {
    waitUntil: "load",
    timeout: 25000,
  });
  await ensureGrafanaLoggedIn(page);
  await page.goto(url, {
    waitUntil: "load",
    timeout: 25000,
  });
  await ensureGrafanaLoggedIn(page);
  await page
    .getByText(headingText, { exact: false })
    .waitFor({ state: "visible", timeout: 18000 })
    .catch(() => undefined);
  await ensureSubtitleOverlay(page);
}

async function showGrafanaDashboard(page, subtitle) {
  await page.waitForTimeout(1600);

  const hostDashboardUrl =
    "http://127.0.0.1:3000/d/securemonitor-host?orgId=1&from=now-15m&to=now&var-instance=node-exporter%3A9100&var-mountpoint=%2Frun%2Fdesktop%2Fmnt%2Fhost%2Fc&var-device=eth0";
  await openGrafanaDashboard(page, hostDashboardUrl, "SecureMonitor 主机监控大屏");
  await page
    .getByText("node_exporter 采集状态", { exact: false })
    .waitFor({ state: "visible", timeout: 18000 })
    .catch(() => undefined);
  await setSubtitle(page, {
    title: "Grafana 主机监控大屏",
    text: "这里默认显示 Windows 本机 C 盘，内部映射到可查询的宿主机挂载点，避免画面直接弹出 Docker 节点路径。",
  });
  await page.waitForTimeout(3600);
  await smoothScrollPage(page, 4200);

  const containerIds = await getGrafanaDemoContainerIds();
  const firstContainerId = containerIds[0] || "/docker/unknown";
  const secondContainerId = containerIds[1] || firstContainerId;
  const containerFirstUrl =
    `http://127.0.0.1:3000/d/securemonitor-container?orgId=1&from=now-15m&to=now&var-container_id=${encodeURIComponent(firstContainerId)}`;
  await openGrafanaDashboard(page, containerFirstUrl, "SecureMonitor 容器监控大屏");
  await setSubtitle(page, {
    title: "Grafana 容器监控对象切换",
    text: "容器大屏先观察一个真实 Docker 容器的 CPU、内存和网络指标，证明 cAdvisor 可以按监控对象筛选。",
  });
  await page.waitForTimeout(4200);

  const containerSecondUrl =
    `http://127.0.0.1:3000/d/securemonitor-container?orgId=1&from=now-15m&to=now&var-container_id=${encodeURIComponent(secondContainerId)}`;
  await page.goto(containerSecondUrl, { waitUntil: "load", timeout: 25000 });
  await ensureSubtitleOverlay(page);
  await setSubtitle(page, {
    title: "切换被监控进程/服务容器",
    text: "这里切换到另一个被监控容器，同一组面板会立即展示另一类服务进程的资源曲线。",
  });
  await page.waitForTimeout(4600);
  await smoothScrollPage(page, 3600);

  const securityDashboardUrl =
    "http://127.0.0.1:3000/d/securemonitor-security?orgId=1&from=now-15m&to=now";
  await openGrafanaDashboard(page, securityDashboardUrl, "SecureMonitor 安全监控大屏");
  await setSubtitle(page, {
    title: "Grafana 安全进程指标",
    text: "安全大屏展示失败登录、可疑请求、开放端口和高 CPU 进程数量，补充监控与安全指标的可视化证据。",
  });
  await page.waitForTimeout(4200);
  await smoothScrollPage(page, 3600);

  await page.goto(`${appUrl}/#simulation`, { waitUntil: "load", timeout: 20000 });
  await ensureSubtitleOverlay(page);
  await setSubtitle(page, subtitle);
  clickNavigation.cursorPoint = { x: 680, y: 380 };
  await setCursorOverlay(page, clickNavigation.cursorPoint);
}

async function showSimulationChanges(page, scene) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await setSubtitle(page, {
    title: "异常模拟实操",
    text: "现在不只是展示页面，而是逐个点击模拟按钮，让安全指标真正发生变化。",
  });
  await page.waitForTimeout(900);

  const actions = [
    {
      label: "模拟 20 次失败登录",
      title: "触发失败登录异常",
      text: "点击失败登录模拟，失败登录次数会增加，可用于演示暴力破解类风险。",
    },
    {
      label: "模拟 25 次可疑请求",
      title: "触发可疑请求异常",
      text: "点击可疑请求模拟，安全中心会出现可疑访问次数变化。",
    },
    {
      label: "设置风险分数为 90",
      title: "触发高风险分数",
      text: "把安全风险分数设置为 90，用于展示高风险状态和告警规则。",
    },
    {
      label: "设置开放端口为 12",
      title: "触发开放端口过多",
      text: "开放端口数量升高后，可以体现攻击面扩大的监控场景。",
    },
    {
      label: "模拟 3 个高 CPU 进程",
      title: "触发高 CPU 进程指标",
      text: "高 CPU 进程数量会从 0 变为 3，后续在安全中心和 Grafana 安全大屏查看。",
    },
    {
      label: "模拟容器重启",
      title: "触发容器重启事件",
      text: "容器重启次数会增加，用于体现容器异常事件监控。",
    },
    {
      label: "生成服务宕机演示命令",
      title: "展示服务宕机演示命令",
      text: "出于安全边界，页面只生成停止服务命令，不直接破坏运行环境。",
    },
    {
      label: "生成 demo-app 恢复命令",
      title: "展示服务恢复命令",
      text: "恢复命令用于说明服务宕机后的处置流程，形成异常与恢复闭环。",
    },
  ];

  for (const action of actions) {
    await clickCommandButton(page, action.label, { title: action.title, text: action.text }, 1200);
  }

  await clickNavigation(page, "安全中心");
  await setSubtitle(page, {
    title: "安全中心变化结果",
    text: "这里可以看到失败登录、可疑请求、开放端口、高 CPU 进程、容器重启和风险分数已经发生变化。",
  });
  await page.waitForTimeout(4200);
  await smoothScrollPage(page, 5600);

  await setSubtitle(page, {
    title: "等待告警规则评估",
    text: "安全指标已经变化；Prometheus 规则需要持续满足一段时间，等待约 70 秒后再查看告警中心。",
  });
  await page.waitForTimeout(70000);

  await clickNavigation(page, "告警中心");
  await setSubtitle(page, {
    title: "告警中心变化结果",
    text: "告警中心汇总 Prometheus 与 Alertmanager 数据，用于查看异常触发后的告警状态和处理建议。",
  });
  await page.waitForTimeout(6200);

  await clickNavigation(page, "总览");
  await setSubtitle(page, {
    title: "总览综合风险变化",
    text: "总览页会把安全风险分数、活跃告警和综合风险评分汇总，展示异常对整体状态的影响。",
  });
  await page.waitForTimeout(5200);
  await smoothScrollPage(page, 4200);

  const securityDashboardUrl =
    "http://127.0.0.1:3000/d/securemonitor-security?orgId=1&from=now-15m&to=now";
  await openGrafanaDashboard(page, securityDashboardUrl, "SecureMonitor 安全监控大屏");
  await setSubtitle(page, {
    title: "Grafana 安全大屏变化",
    text: "Grafana 安全大屏展示模拟后的安全指标，包括失败登录、可疑请求、开放端口、高 CPU 进程和风险分数。",
  });
  await page.waitForTimeout(5200);
  await smoothScrollPage(page, 5200);

  await page.goto(`${appUrl}/#overview`, { waitUntil: "load", timeout: 20000 });
  await ensureSubtitleOverlay(page);
  clickNavigation.cursorPoint = { x: 680, y: 380 };
  await setCursorOverlay(page, clickNavigation.cursorPoint);
  await setSubtitle(page, scene);
}

async function writePlayerHtml() {
  const htmlPath = path.join(outputDir, "player.html");
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SecureMonitor OS 项目演示视频</title>
<style>
  body { margin: 0; background: #10131a; color: #eef3ff; font-family: "Microsoft YaHei", Arial, sans-serif; }
  main { max-width: 1120px; margin: 0 auto; padding: 28px 20px 36px; }
  h1 { font-size: 24px; margin: 0 0 14px; }
  p { color: #b9c2d6; line-height: 1.7; }
  video { width: 100%; background: #000; border: 1px solid #2d3648; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,.35); }
  .files { margin-top: 18px; padding: 14px 16px; background: #171c27; border-radius: 8px; border: 1px solid #2d3648; }
  code { color: #9bd3ff; }
</style>
</head>
<body>
<main>
  <h1>SecureMonitor OS 项目演示视频</h1>
  <video controls preload="metadata" poster="poster.png">
    <source src="project_demo.mp4" type="video/mp4" />
    <source src="project_demo.webm" type="video/webm" />
    <track kind="subtitles" src="subtitles.vtt" srclang="zh-CN" label="中文解说字幕" />
  </video>
  <div class="files">
    <p>视频画面已内嵌解说字幕；外挂 VTT/SRT 字幕文件也已保留。为避免字幕重复叠加，播放页默认不自动开启外挂字幕。</p>
    <p>文件：<code>project_demo.mp4</code>、<code>project_demo.webm</code>、<code>subtitles.srt</code>、<code>subtitles.vtt</code></p>
  </div>
</main>
</body>
</html>`;
  await fs.writeFile(htmlPath, html, "utf8");
  return htmlPath;
}

function findFfmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,
    path.join(
      process.env.TEMP || "",
      "codex-ffmpeg-tools",
      "node_modules",
      "@ffmpeg-installer",
      "win32-x64",
      "ffmpeg.exe",
    ),
    "ffmpeg",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      execFileSync(candidate, ["-version"], { stdio: "ignore" });
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }
  throw new Error(
    "ffmpeg 不可用。请安装 ffmpeg，或设置 FFMPEG_PATH 指向 ffmpeg.exe。",
  );
}

async function convertWebmToMp4(inputPath, outputPath) {
  const ffmpeg = findFfmpeg();
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-i",
      inputPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "medium",
      "-crf",
      "20",
      "-movflags",
      "+faststart",
      "-an",
      outputPath,
    ],
    { stdio: "inherit" },
  );
}

async function main() {
  await fs.mkdir(tempVideoDir, { recursive: true });
  await resetSimulationState().catch(() => undefined);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    recordVideo: { dir: tempVideoDir, size: viewport },
  });
  const page = await context.newPage();
  await page.goto(appUrl, { waitUntil: "load", timeout: 20000 });
  await page.waitForTimeout(4200);
  await ensureSubtitleOverlay(page);
  clickNavigation.cursorPoint = { x: 680, y: 380 };
  await setCursorOverlay(page, clickNavigation.cursorPoint);

  for (const scene of scenes) {
    await setSubtitle(page, scene);
    await clickNavigation(page, scene.nav);
    if (scene.nav === "Targets") {
      await page.evaluate(() => window.scrollTo({ top: 120, behavior: "smooth" }));
      await page.waitForTimeout(800);
      await clickFirstButton(page, "展开说明");
      await page.waitForTimeout(scene.seconds * 1000);
      await clickFirstButton(page, "关闭");
      continue;
    }
    if (scene.nav === "Grafana") {
      await smoothScrollPage(page, 3600);
      await showGrafanaDashboard(page, scene);
      await page.waitForTimeout(900);
      continue;
    }
    if (scene.nav === "异常模拟") {
      await showSimulationChanges(page, scene);
      continue;
    }
    if (scene.nav === "总览" && scene.title === "演示总结") {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await page.waitForTimeout(scene.seconds * 1000);
      continue;
    }
    if (["主机监控", "容器监控", "服务探测", "安全中心", "告警中心", "告警规则", "验收清单", "异常模拟", "Kubernetes"].includes(scene.nav)) {
      await smoothScrollPage(page, Math.max(3600, scene.seconds * 720));
    } else {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await page.waitForTimeout(scene.seconds * 1000);
    }
  }

  const posterPath = path.join(outputDir, "poster.png");
  await page.screenshot({ path: posterPath, fullPage: false });
  const video = page.video();
  await context.close();
  await browser.close();

  const rawVideoPath = await video.path();
  const webmPath = path.join(outputDir, "project_demo.webm");
  const mp4Path = path.join(outputDir, "project_demo.mp4");
  const vttPath = path.join(outputDir, "subtitles.vtt");
  const srtPath = path.join(outputDir, "subtitles.srt");
  await fs.copyFile(rawVideoPath, webmPath);
  await fs.writeFile(vttPath, makeVtt(), "utf8");
  await fs.writeFile(srtPath, makeSrt(), "utf8");
  await convertWebmToMp4(webmPath, mp4Path);
  const htmlPath = await writePlayerHtml();

  console.log(
    JSON.stringify(
      { outputDir, webmPath, mp4Path, vttPath, srtPath, htmlPath, posterPath },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
