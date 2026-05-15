import random
import time

from flask import Flask, Response, jsonify
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Gauge, Histogram, generate_latest

app = Flask(__name__)

demo_http_requests_total = Counter(
    "demo_http_requests_total",
    "demo-app HTTP 请求总数。",
    ["path", "method", "status"],
)
demo_http_request_duration_seconds = Histogram(
    "demo_http_request_duration_seconds",
    "demo-app HTTP 请求耗时。",
    ["path", "method"],
)
demo_app_up = Gauge(
    "demo_app_up",
    "demo-app 健康状态，1 表示健康，0 表示异常。",
)

demo_app_up.set(1)


def record_request(path, method, status, started_at):
    demo_http_requests_total.labels(path=path, method=method, status=str(status)).inc()
    demo_http_request_duration_seconds.labels(path=path, method=method).observe(
        time.time() - started_at
    )


@app.get("/")
def index():
    started_at = time.time()
    status = 200
    record_request("/", "GET", status, started_at)
    return jsonify({"service": "demo-app", "status": "ok", "metrics": "/metrics"}), status


@app.get("/health")
def health():
    started_at = time.time()
    status = 200
    demo_app_up.set(1)
    record_request("/health", "GET", status, started_at)
    return jsonify({"status": "ok"}), status


@app.get("/api/hello")
def hello():
    started_at = time.time()
    status = 200
    record_request("/api/hello", "GET", status, started_at)
    return jsonify({"message": "hello from SecureMonitor demo-app"}), status


@app.get("/api/error")
def error():
    started_at = time.time()
    status = 500
    record_request("/api/error", "GET", status, started_at)
    return jsonify({"error": "simulated server error"}), status


@app.get("/api/slow")
def slow():
    started_at = time.time()
    delay = random.uniform(1, 3)
    time.sleep(delay)
    status = 200
    record_request("/api/slow", "GET", status, started_at)
    return jsonify({"message": "slow response", "delay_seconds": round(delay, 2)}), status


@app.get("/metrics")
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
