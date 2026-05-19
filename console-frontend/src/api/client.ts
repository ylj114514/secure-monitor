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
  simulateFailedLogin: () =>
    request<any>("/api/simulation/failed-login", { method: "POST" }),
  simulateRisk: (score = 90) =>
    request<any>("/api/simulation/security-risk", {
      method: "POST",
      body: JSON.stringify({ score })
    }),
  simulateRestart: () =>
    request<any>("/api/simulation/container-restart", { method: "POST" }),
  serviceDown: () => request<any>("/api/simulation/service-down", { method: "POST" }),
  serviceRecover: () =>
    request<any>("/api/simulation/service-recover", { method: "POST" })
};
