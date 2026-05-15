from flask import Flask, Response, jsonify, request
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Gauge, generate_latest

app = Flask(__name__)

security_failed_login_total = Counter(
    "security_failed_login_total",
    "失败登录次数，课程设计模拟指标，不读取真实登录日志。",
)
security_suspicious_request_total = Counter(
    "security_suspicious_request_total",
    "可疑请求次数，课程设计模拟指标。",
)
security_container_restart_total = Counter(
    "security_container_restart_total",
    "模拟容器重启次数。",
)
security_open_port_count = Gauge(
    "security_open_port_count",
    "模拟开放端口数量。",
)
security_high_cpu_process_count = Gauge(
    "security_high_cpu_process_count",
    "模拟高 CPU 进程数量。",
)
security_risk_score = Gauge(
    "security_risk_score",
    "安全风险分数，范围 0-100。",
)

security_open_port_count.set(5)
security_high_cpu_process_count.set(0)
security_risk_score.set(20)


def clamp_score(value):
    return max(0, min(100, float(value)))


@app.get("/")
def index():
    return jsonify(
        {
            "service": "security-exporter",
            "health": "/health",
            "metrics": "/metrics",
            "simulate": [
                "POST /simulate/failed-login",
                "POST /simulate/suspicious-request",
                "POST /simulate/risk-score",
                "POST /simulate/container-restart",
            ],
        }
    )


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/metrics")
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)


@app.post("/simulate/failed-login")
def simulate_failed_login():
    security_failed_login_total.inc()
    return jsonify({"status": "ok", "metric": "security_failed_login_total"})


@app.post("/simulate/suspicious-request")
def simulate_suspicious_request():
    security_suspicious_request_total.inc()
    return jsonify({"status": "ok", "metric": "security_suspicious_request_total"})


@app.post("/simulate/risk-score")
def simulate_risk_score():
    payload = request.get_json(silent=True) or {}
    score = clamp_score(payload.get("score", request.args.get("score", 90)))
    security_risk_score.set(score)
    return jsonify({"status": "ok", "metric": "security_risk_score", "score": score})


@app.post("/simulate/container-restart")
def simulate_container_restart():
    security_container_restart_total.inc()
    return jsonify({"status": "ok", "metric": "security_container_restart_total"})


@app.post("/simulate/open-port-count")
def simulate_open_port_count():
    payload = request.get_json(silent=True) or {}
    count = max(0, int(payload.get("count", request.args.get("count", 12))))
    security_open_port_count.set(count)
    return jsonify({"status": "ok", "metric": "security_open_port_count", "count": count})


@app.post("/simulate/high-cpu-process-count")
def simulate_high_cpu_process_count():
    payload = request.get_json(silent=True) or {}
    count = max(0, int(payload.get("count", request.args.get("count", 3))))
    security_high_cpu_process_count.set(count)
    return jsonify(
        {"status": "ok", "metric": "security_high_cpu_process_count", "count": count}
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
