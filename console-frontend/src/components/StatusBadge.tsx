import { CheckCircle2, CircleHelp, TriangleAlert, XCircle } from "lucide-react";
import { statusText } from "../utils/formatters";

type StatusTone = "ok" | "warn" | "bad" | "unknown";

function toneOf(status?: string | boolean, ok?: boolean): StatusTone {
  if (typeof ok === "boolean") return ok ? "ok" : "bad";
  const value = String(status || "unknown").toLowerCase();
  if (["up", "healthy", "ok", "success", "active", "normal"].includes(value)) return "ok";
  if (["warning", "pending", "warn", "firing", "degraded"].includes(value)) return "warn";
  if (["down", "error", "critical", "failed", "failure"].includes(value)) return "bad";
  return "unknown";
}

export default function StatusBadge({
  label,
  status,
  ok,
}: {
  label?: string;
  status?: string | boolean;
  ok?: boolean;
}) {
  const tone = toneOf(status, ok);
  const text = label || statusText(typeof ok === "boolean" ? ok : status);
  const Icon = tone === "ok" ? CheckCircle2 : tone === "warn" ? TriangleAlert : tone === "bad" ? XCircle : CircleHelp;
  return (
    <span className={`status-badge ${tone}`}>
      <Icon size={13} />
      {text}
    </span>
  );
}
