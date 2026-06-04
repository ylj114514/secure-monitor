const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:7000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  health: () => request<{ status: string }>("/api/health"),
  overview: () => request<any>("/api/overview"),
  targets: () => request<{ targets: any[] }>("/api/targets"),
  alerts: () => request<any>("/api/alerts"),
  security: () => request<any>("/api/security/metrics"),
  grafana: () => request<any>("/api/grafana/info"),
  docs: () => request<any>("/api/docs/links"),
  query: (query: string) =>
    request<any>(`/api/prometheus/query?query=${encodeURIComponent(query)}`),
  simulateFailedLogin: (count = 20) =>
    request<any>("/api/simulation/failed-login", {
      method: "POST",
      body: JSON.stringify({ count })
    }),
  simulateSuspiciousRequest: (count = 25) =>
    request<any>("/api/simulation/suspicious-request", {
      method: "POST",
      body: JSON.stringify({ count })
    }),
  simulateRisk: (score = 90) =>
    request<any>("/api/simulation/security-risk", {
      method: "POST",
      body: JSON.stringify({ score })
    }),
  simulateOpenPorts: (count = 12) =>
    request<any>("/api/simulation/open-port-count", {
      method: "POST",
      body: JSON.stringify({ count })
    }),
  simulateHighCpuProcesses: (count = 3) =>
    request<any>("/api/simulation/high-cpu-process-count", {
      method: "POST",
      body: JSON.stringify({ count })
    }),
  simulateRestart: (count = 1) =>
    request<any>("/api/simulation/container-restart", {
      method: "POST",
      body: JSON.stringify({ count })
    }),
  resetSecurity: () =>
    request<any>("/api/simulation/reset-security", { method: "POST" }),
  serviceDown: () => request<any>("/api/simulation/service-down", { method: "POST" }),
  serviceRecover: () =>
    request<any>("/api/simulation/service-recover", { method: "POST" })
};
